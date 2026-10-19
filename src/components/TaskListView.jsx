import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const TaskListView = ({
  tasks = [],
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onToggleComplete,
  onOpenCreateModal,
  onReorderTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="list-view-empty">
        <ClipboardDocumentListIcon width={48} height={48} className="empty-icon" />
        <h3>No tasks found</h3>
        <p>Try adjusting your search or filters, or create a new task.</p>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={() => onOpenCreateModal()}
        >
          + Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="task-list-view">
      <div className="task-list-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
            onToggleComplete={onToggleComplete}
            onReorderTask={onReorderTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskListView;
