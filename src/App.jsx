import React, { useState, useMemo, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { DEFAULT_CATEGORIES, STATUS_LIST } from './constants';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import TaskListView from './components/TaskListView';
import TaskModal from './components/TaskModal';

// Sample initial tasks to showcase rich features if storage is completely empty
const INITIAL_DEMO_TASKS = [
  {
    id: 1,
    name: "Complete Q4 Product Roadmap & Architecture",
    description: "### Objectives\n- Finalize microservice boundaries\n- Review cloud infrastructure security\n- Confirm deadline with stakeholders",
    category: "Work",
    status: "current",
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    attachments: [],
    comments: [
      { id: "c1", text: "Architecture diagram approved by security lead.", author: "You", createdAt: Date.now() - 3600000 }
    ],
    createdAt: Date.now() - 86400000,
    checked: false
  },
  {
    id: 2,
    name: "Design Modern Glassmorphism UI Components",
    description: "Prepare Figma assets and tokens for dark & light mode styling.",
    category: "Design",
    status: "pending",
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16),
    attachments: [],
    comments: [],
    createdAt: Date.now() - 172800000,
    checked: false
  },
  {
    id: 3,
    name: "Conduct Security Audit & Dependency Check",
    description: "Scan all npm packages for vulnerabilities and patch esbuild.",
    category: "Development",
    status: "completed",
    deadline: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString().slice(0, 16),
    attachments: [],
    comments: [
      { id: "c2", text: "npm audit reported 0 vulnerabilities after Vite 6 upgrade!", author: "You", createdAt: Date.now() - 1800000 }
    ],
    createdAt: Date.now() - 250000000,
    checked: true
  },
  {
    id: 4,
    name: "Research AI Code Generation Workflows",
    description: "Explore multimodal interaction and agentic tool calls.",
    category: "Personal",
    status: "backlog",
    deadline: "",
    attachments: [],
    comments: [],
    createdAt: Date.now() - 300000000,
    checked: false
  }
];

const sanitizeTasks = (raw) => {
  if (!Array.isArray(raw)) return INITIAL_DEMO_TASKS;
  return raw.map((item) => ({
    id: item.id || Date.now() + Math.random(),
    name: typeof item.name === 'string' ? item.name : 'Untitled Task',
    description: typeof item.description === 'string' ? item.description : '',
    attachments: Array.isArray(item.attachments) ? item.attachments : [],
    deadline: typeof item.deadline === 'string' ? item.deadline : '',
    status: typeof item.status === 'string' && STATUS_LIST.includes(item.status) ? item.status : (item.checked ? 'completed' : 'pending'),
    category: typeof item.category === 'string' ? item.category : (item.category?.name || 'General'),
    comments: Array.isArray(item.comments) ? item.comments : [],
    createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
    checked: item.status === 'completed' || Boolean(item.checked),
  }));
};

const sanitizeCategories = (raw) => {
  if (!Array.isArray(raw)) return DEFAULT_CATEGORIES;
  const cleaned = raw
    .map((c) => (typeof c === 'string' ? c : (c?.name || 'General')))
    .filter(Boolean);
  return cleaned.length > 0 ? Array.from(new Set(cleaned)) : DEFAULT_CATEGORIES;
};

function App() {
  const [storedTasks, setStoredTasks] = useLocalStorage('taskflow_tasks', () => INITIAL_DEMO_TASKS);
  const [storedCategories, setStoredCategories] = useLocalStorage('taskflow_categories', () => DEFAULT_CATEGORIES);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('taskflow_dark_mode', () => true);

  // Sanitized versions to protect against any corrupted local storage entries
  const tasks = useMemo(() => sanitizeTasks(storedTasks), [storedTasks]);
  const categories = useMemo(() => sanitizeCategories(storedCategories), [storedCategories]);

  // Filter & View States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('manual'); // 'manual' allows drag & drop sorting up/down
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTask, setModalInitialTask] = useState(null);

  // Sync dark mode to document HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('color-scheme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('color-scheme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Task Actions
  const handleSaveTask = (taskData) => {
    setStoredTasks((prevTasks) => {
      const sanitized = sanitizeTasks(prevTasks);
      const exists = sanitized.some((t) => t.id === taskData.id);
      if (exists) {
        return sanitized.map((t) => (t.id === taskData.id ? { ...t, ...taskData } : t));
      } else {
        return [taskData, ...sanitized];
      }
    });
  };

  const handleDeleteTask = (id) => {
    setStoredTasks((prevTasks) => sanitizeTasks(prevTasks).filter((t) => t.id !== id));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setStoredTasks((prevTasks) =>
      sanitizeTasks(prevTasks).map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            checked: newStatus === 'completed',
          };
        }
        return t;
      })
    );
  };

  const handleReorderTask = (draggedTaskId, targetTaskId, targetStatus, position) => {
    setStoredTasks((prevTasks) => {
      const currentTasks = sanitizeTasks(prevTasks);
      const draggedIndex = currentTasks.findIndex((t) => t.id === draggedTaskId);
      if (draggedIndex === -1) return currentTasks;

      const draggedTask = currentTasks[draggedIndex];
      const updatedTask = {
        ...draggedTask,
        status: targetStatus,
        checked: targetStatus === 'completed',
      };

      // Remove the dragged task from array
      const remainingTasks = currentTasks.filter((t) => t.id !== draggedTaskId);

      if (targetTaskId) {
        const targetIndex = remainingTasks.findIndex((t) => t.id === targetTaskId);
        if (targetIndex !== -1) {
          const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
          const newTasks = [...remainingTasks];
          newTasks.splice(insertIndex, 0, updatedTask);
          return newTasks;
        }
      }

      // If dropped onto column background/empty area, place it after last task of that status
      let lastMatchingIndex = -1;
      for (let i = remainingTasks.length - 1; i >= 0; i--) {
        if (remainingTasks[i].status === targetStatus) {
          lastMatchingIndex = i;
          break;
        }
      }

      if (lastMatchingIndex !== -1) {
        const newTasks = [...remainingTasks];
        newTasks.splice(lastMatchingIndex + 1, 0, updatedTask);
        return newTasks;
      }

      return [...remainingTasks, updatedTask];
    });

    // Automatically switch to manual sort order so the user's custom position is immediately visible
    setSortBy('manual');
  };

  const handleToggleComplete = (taskId) => {
    setStoredTasks((prevTasks) =>
      sanitizeTasks(prevTasks).map((t) => {
        if (t.id === taskId) {
          const nextCompleted = t.status !== 'completed';
          return {
            ...t,
            status: nextCompleted ? 'completed' : 'pending',
            checked: nextCompleted,
          };
        }
        return t;
      })
    );
  };

  const handleAddCategory = (newCat) => {
    if (typeof newCat === 'string' && newCat.trim()) {
      const trimmed = newCat.trim();
      setStoredCategories((prev) => {
        const existing = sanitizeCategories(prev);
        if (!existing.includes(trimmed)) {
          return [...existing, trimmed];
        }
        return existing;
      });
    }
  };

  const handleOpenCreateModal = (defaultStatus = 'pending') => {
    setModalInitialTask({
      id: null,
      name: '',
      description: '',
      status: defaultStatus,
      category: categories[0] || 'General',
      deadline: '',
      attachments: [],
      comments: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setModalInitialTask(task);
    setIsModalOpen(true);
  };

  // Filter & Sort Logic
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Search Query (name, description, comments)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const inName = t.name?.toLowerCase().includes(query);
        const inDesc = t.description?.toLowerCase().includes(query);
        const inCat = typeof t.category === 'string' && t.category.toLowerCase().includes(query);
        const inComments = t.comments?.some((c) => c.text?.toLowerCase().includes(query));
        return inName || inDesc || inCat || inComments;
      });
    }

    // Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Status Filter (primarily impacts list view; also board view if chosen)
    if (selectedStatus !== 'ALL') {
      result = result.filter((t) => t.status === selectedStatus);
    }

    // Sorting (only when not manual custom drag order)
    if (sortBy !== 'manual') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return (a.name || '').localeCompare(b.name || '');
          case 'name_desc':
            return (b.name || '').localeCompare(a.name || '');
          case 'dateCreated_asc':
            return (a.createdAt || 0) - (b.createdAt || 0);
          case 'dateCreated_desc':
            return (b.createdAt || 0) - (a.createdAt || 0);
          case 'deadline_asc': {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          }
          case 'deadline_desc': {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [tasks, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Metrics for header
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      current: tasks.filter((t) => t.status === 'current').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      pending: tasks.filter((t) => t.status === 'pending').length,
    };
  }, [tasks]);

  return (
    <div className="app-layout">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenCreateModal={() => handleOpenCreateModal('pending')}
        categories={categories}
        taskStats={taskStats}
      />

      <main className="main-content">
        {viewMode === 'board' ? (
          <KanbanBoard
            tasks={processedTasks}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onToggleComplete={handleToggleComplete}
            onQuickAdd={(status) => handleOpenCreateModal(status)}
            onReorderTask={handleReorderTask}
          />
        ) : (
          <TaskListView
            tasks={processedTasks}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
            onToggleComplete={handleToggleComplete}
            onOpenCreateModal={() => handleOpenCreateModal('pending')}
            onReorderTask={handleReorderTask}
          />
        )}
      </main>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={modalInitialTask}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}

export default App;
