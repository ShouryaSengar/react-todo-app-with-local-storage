import React, { useState } from 'react';
import { 
  CalendarDaysIcon, 
  PaperClipIcon, 
  ChatBubbleLeftIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CheckIcon,
  Bars2Icon
} from '@heroicons/react/24/outline';
import { STATUS_CONFIG, STATUS_LIST } from '../constants';
import { getDeadlineStatus } from '../utils/formatters';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onToggleComplete,
  onReorderTask,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState(null); // 'before' | 'after' | null
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const deadlineStatus = getDeadlineStatus(task.deadline, task.status);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', String(task.id));
    e.dataTransfer.setData('application/json', JSON.stringify({
      taskId: task.id,
      fromStatus: task.status
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropPosition(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const isTopHalf = offsetY < rect.height / 2;
    const newPos = isTopHalf ? 'before' : 'after';

    if (dropPosition !== newPos) {
      setDropPosition(newPos);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropPosition(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedIdStr = e.dataTransfer.getData('text/plain');
    const position = dropPosition || 'before';
    setDropPosition(null);

    if (draggedIdStr) {
      const draggedId = Number(draggedIdStr) || draggedIdStr;
      if (draggedId !== task.id && onReorderTask) {
        onReorderTask(draggedId, task.id, task.status, position);
      }
    }
  };

  const isCompleted = task.status === 'completed';
  const isCancelled = task.status === 'cancel';

  return (
    <div 
      className={`task-card ${isDragging ? 'task-card-dragging' : ''} ${dropPosition ? `drop-target-${dropPosition}` : ''} ${isCompleted ? 'task-card-completed' : ''} ${isCancelled ? 'task-card-cancelled' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => onEdit(task)}
    >
      {/* Top Header Row */}
      <div className="task-card-header">
        <div className="task-card-category-wrap">
          <Bars2Icon width={14} height={14} className="drag-handle-hint" title="Drag to move or sort up/down" />
          <span className="task-category-badge">{task.category || 'General'}</span>
        </div>

        <div className="task-card-status-dropdown" onClick={(e) => e.stopPropagation()}>
          <select 
            value={task.status} 
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="status-dropdown-select"
            style={{
              '--badge-color': statusCfg.color,
              '--badge-bg': statusCfg.bg,
              '--badge-border': statusCfg.border,
            }}
          >
            {STATUS_LIST.map((key) => (
              <option key={key} value={key}>
                {STATUS_CONFIG[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title & Checkbox */}
      <div className="task-card-main">
        <button
          type="button"
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          title={isCompleted ? "Mark incomplete" : "Mark completed"}
          aria-label={isCompleted ? "Mark incomplete" : "Mark completed"}
        >
          {isCompleted && <CheckIcon width={14} height={14} strokeWidth={3} />}
        </button>

        <h3 className={`task-card-title ${isCompleted || isCancelled ? 'strikethrough' : ''}`}>
          {task.name}
        </h3>
      </div>

      {/* Description Snippet */}
      {task.description && (
        <p className="task-card-desc-snippet">
          {task.description.replace(/[#*`_~[\]()>-]/g, '').slice(0, 90)}
          {task.description.length > 90 ? '...' : ''}
        </p>
      )}

      {/* Meta Footer Row */}
      <div className="task-card-footer">
        <div className="task-card-meta-badges">
          {/* Deadline */}
          {deadlineStatus && (
            <span 
              className={`meta-badge deadline-badge ${deadlineStatus.type}`}
              style={{
                color: deadlineStatus.color,
                backgroundColor: deadlineStatus.bg,
              }}
              title={`Deadline: ${task.deadline}`}
            >
              <CalendarDaysIcon width={14} height={14} />
              <span>{deadlineStatus.label}</span>
            </span>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <span className="meta-badge" title={`${task.attachments.length} attachment(s)`}>
              <PaperClipIcon width={14} height={14} />
              <span>{task.attachments.length}</span>
            </span>
          )}

          {/* Comments */}
          {task.comments && task.comments.length > 0 && (
            <span className="meta-badge" title={`${task.comments.length} comment(s)`}>
              <ChatBubbleLeftIcon width={14} height={14} />
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="card-action-btn edit-btn"
            title="Edit Task"
            onClick={() => onEdit(task)}
          >
            <PencilSquareIcon width={16} height={16} />
          </button>
          <button
            type="button"
            className="card-action-btn delete-btn"
            title="Delete Task"
            onClick={() => onDelete(task.id)}
          >
            <TrashIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
