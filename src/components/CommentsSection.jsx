import React, { useState } from 'react';
import { 
  ChatBubbleLeftEllipsisIcon, 
  TrashIcon, 
  PaperAirplaneIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { formatRelativeTime } from '../utils/formatters';

const CommentsSection = ({ comments = [], onAddComment, onDeleteComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!commentText.trim()) return;

    onAddComment({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      text: commentText.trim(),
      author: 'You',
      createdAt: Date.now()
    });

    setCommentText('');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <div className="comments-title">
          <ChatBubbleLeftEllipsisIcon width={20} height={20} />
          <span>Comments ({comments.length})</span>
        </div>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty">
            <p>No comments yet. Start a discussion or add notes.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                <UserCircleIcon width={28} height={28} />
              </div>
              <div className="comment-bubble">
                <div className="comment-meta">
                  <span className="comment-author">{comment.author || 'User'}</span>
                  <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
                  {onDeleteComment && (
                    <button
                      type="button"
                      className="comment-delete-btn"
                      title="Delete comment"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      <TrashIcon width={14} height={14} />
                    </button>
                  )}
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-input-wrapper">
          <textarea
            className="comment-textarea"
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment... (Ctrl+Enter to post)"
          />
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!commentText.trim()}
            title="Post Comment (Ctrl+Enter)"
          >
            <PaperAirplaneIcon width={18} height={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentsSection;
