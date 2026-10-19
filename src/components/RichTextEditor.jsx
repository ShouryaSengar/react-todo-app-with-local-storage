import React, { useState, useRef } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  CodeBracketIcon, 
  ListBulletIcon, 
  ChatBubbleBottomCenterTextIcon 
} from '@heroicons/react/24/outline';
import { renderSimpleMarkdown } from '../utils/formatters';
import FileAttachmentZone from './FileAttachmentZone';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  attachments = [], 
  onAttachmentsChange,
  placeholder = 'Add a detailed description, checklist, or notes...' 
}) => {
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const textareaRef = useRef(null);

  const applyFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 4)
      );
    }, 0);
  };

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-header">
        <div className="rich-editor-tabs">
          <button
            type="button"
            className={`rich-tab-btn ${activeTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            <PencilIcon width={16} height={16} />
            <span>Write</span>
          </button>
          <button
            type="button"
            className={`rich-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <EyeIcon width={16} height={16} />
            <span>Preview</span>
          </button>
        </div>

        {activeTab === 'write' && (
          <div className="rich-editor-toolbar">
            <button
              type="button"
              className="toolbar-btn"
              title="Bold (**text**)"
              onClick={() => applyFormatting('**', '**')}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Italic (*text*)"
              onClick={() => applyFormatting('*', '*')}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Heading (### Heading)"
              onClick={() => applyFormatting('### ')}
            >
              H3
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Bullet List (- item)"
              onClick={() => applyFormatting('- ')}
            >
              <ListBulletIcon width={16} height={16} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Inline Code (`code`)"
              onClick={() => applyFormatting('`', '`')}
            >
              <CodeBracketIcon width={16} height={16} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Quote (> quote)"
              onClick={() => applyFormatting('> ')}
            >
              <ChatBubbleBottomCenterTextIcon width={16} height={16} />
            </button>
          </div>
        )}
      </div>

      <div className="rich-editor-body">
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            className="rich-editor-textarea"
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <div 
            className="rich-editor-preview"
            dangerouslySetInnerHTML={{
              __html: value ? renderSimpleMarkdown(value) : '<p class="preview-empty">Nothing to preview. Switch to "Write" to add content.</p>'
            }}
          />
        )}
      </div>

      <div className="rich-editor-attachments-section">
        <label className="section-sublabel">Attachments & Files</label>
        <FileAttachmentZone 
          attachments={attachments} 
          onChange={onAttachmentsChange} 
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
