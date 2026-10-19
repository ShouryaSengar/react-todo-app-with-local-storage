import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { STATUS_CONFIG } from '../constants';
import TaskCard from './TaskCard';

const KanbanColumn = ({
  statusKey,
  tasks = [],
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onToggleComplete,
  onQuickAdd,
  onReorderTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (taskIdStr && onReorderTask) {
      const taskId = Number(taskIdStr) || taskIdStr;
      // Dropped into column container (not on a specific card), so append to this column
      onReorderTask(taskId, null, statusKey, 'append');
    }
  };

  return (
    <div 
      className={`kanban-column ${isDragOver ? 'column-drag-over' : ''}`}
      style={{
        '--column-accent': cfg.color,
        '--column-bg': cfg.bg,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="kanban-column-header">
        <div className="kanban-column-title-wrap">
          <span className="kanban-status-indicator" style={{ backgroundColor: cfg.color }} />
          <h3 className="kanban-column-title">{cfg.label}</h3>
          <span className="kanban-count-pill">{tasks.length}</span>
        </div>
        <button
          type="button"
          className="kanban-add-quick-btn"
          title={`Add task directly to ${cfg.label}`}
          onClick={() => onQuickAdd(statusKey)}
        >
          <PlusIcon width={16} height={16} />
        </button>
      </div>

      {/* Cards Container */}
      <div className="kanban-cards-list">
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

        {tasks.length === 0 && (
          <div className="kanban-empty-placeholder">
            <p>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
