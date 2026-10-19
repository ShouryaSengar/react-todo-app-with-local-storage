import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  CalendarDaysIcon, 
  TagIcon, 
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { STATUS_CONFIG, STATUS_LIST } from '../constants';
import RichTextEditor from './RichTextEditor';
import CommentsSection from './CommentsSection';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTask = null, 
  categories = [], 
  onAddCategory 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [category, setCategory] = useState('General');
  const [deadline, setDeadline] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name || '');
      setDescription(initialTask.description || '');
      setStatus(initialTask.status || 'pending');
      setCategory(initialTask.category || 'General');
      setDeadline(initialTask.deadline || '');
      setAttachments(Array.isArray(initialTask.attachments) ? initialTask.attachments : []);
      setComments(Array.isArray(initialTask.comments) ? initialTask.comments : []);
    } else {
      setName('');
      setDescription('');
      setStatus('pending');
      setCategory(categories[0] || 'General');
      setDeadline('');
      setAttachments([]);
      setComments([]);
    }
    setIsAddingCategory(false);
    setNewCategoryInput('');
  }, [initialTask, isOpen, categories]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialTask?.id || Date.now(),
      name: name.trim(),
      description,
      status,
      category,
      deadline,
      attachments,
      comments,
      createdAt: initialTask?.createdAt || Date.now(),
      checked: status === 'completed',
    });

    onClose();
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    const cat = newCategoryInput.trim();
    if (onAddCategory) {
      onAddCategory(cat);
    }
    setCategory(cat);
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  const handleAddComment = (comment) => {
    setComments(prev => [...prev, comment]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const setPresetDeadline = (hoursFromNow, targetHour) => {
    const target = new Date();
    if (targetHour !== undefined) {
      target.setDate(target.getDate() + (hoursFromNow / 24));
      target.setHours(targetHour, 0, 0, 0);
    } else {
      target.setTime(target.getTime() + hoursFromNow * 60 * 60 * 1000);
    }

    // Format to YYYY-MM-DDTHH:mm for datetime-local
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    const hours = String(target.getHours()).padStart(2, '0');
    const minutes = String(target.getMinutes()).padStart(2, '0');
    setDeadline(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <XMarkIcon width={22} height={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body-scrollable">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="task-name" className="form-label required">Task Title</label>
              <input
                id="task-name"
                type="text"
                className="modal-input title-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What needs to be done?"
                required
                autoFocus
                maxLength={120}
              />
            </div>

            {/* Status & Category Row */}
            <div className="form-grid-2">
              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  <TagIcon width={16} height={16} />
                  <span>Category</span>
                </label>
                {!isAddingCategory ? (
                  <div className="category-select-wrapper">
                    <select
                      className="modal-select"
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsAddingCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                    >
                      {categories.map((cat) => {
                        const label = typeof cat === 'string' ? cat : (cat?.name || 'General');
                        return <option key={label} value={label}>{label}</option>;
                      })}
                      <option value="__NEW__">+ Add Custom Category...</option>
                    </select>
                  </div>
                ) : (
                  <div className="new-category-input-group">
                    <input
                      type="text"
                      className="modal-input"
                      placeholder="Category name"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      autoFocus
                    />
                    <button 
                      type="button" 
                      className="btn-small btn-primary"
                      onClick={handleCreateCategory}
                    >
                      Add
                    </button>
                    <button 
                      type="button" 
                      className="btn-small btn-secondary"
                      onClick={() => setIsAddingCategory(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div className="form-group">
                <label htmlFor="task-deadline" className="form-label">
                  <CalendarDaysIcon width={16} height={16} />
                  <span>Deadline (Date & Time)</span>
                </label>
                <div className="deadline-input-group">
                  <input
                    id="task-deadline"
                    type="datetime-local"
                    className="modal-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  {deadline && (
                    <button
                      type="button"
                      className="btn-small btn-secondary"
                      onClick={() => setDeadline('')}
                      title="Clear deadline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="deadline-presets">
                  <button type="button" onClick={() => setPresetDeadline(0, 17)}>Today 5 PM</button>
                  <button type="button" onClick={() => setPresetDeadline(24, 9)}>Tomorrow 9 AM</button>
                  <button type="button" onClick={() => setPresetDeadline(72, 17)}>In 3 Days</button>
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="status-selector-pills">
                {STATUS_LIST.map((statusKey) => {
                  const cfg = STATUS_CONFIG[statusKey];
                  const isSelected = status === statusKey;
                  return (
                    <button
                      key={statusKey}
                      type="button"
                      className={`status-pill-btn ${isSelected ? 'selected' : ''}`}
                      style={{
                        '--status-color': cfg.color,
                        '--status-bg': cfg.bg,
                        '--status-border': cfg.border,
                      }}
                      onClick={() => setStatus(statusKey)}
                    >
                      <span className="status-dot"></span>
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description (Rich Text & Files) */}
            <div className="form-group">
              <label className="form-label">Description & Notes</label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            </div>

            {/* Comments Section (Especially useful for ongoing tasks) */}
            <div className="form-group">
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
                onDeleteComment={handleDeleteComment}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="modal-btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="modal-btn btn-primary"
            >
              <CheckCircleIcon width={18} height={18} />
              <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
