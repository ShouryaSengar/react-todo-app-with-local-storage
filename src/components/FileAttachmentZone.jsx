import React, { useRef, useState } from 'react';
import { 
  PaperClipIcon, 
  TrashIcon, 
  ArrowDownTrayIcon, 
  DocumentIcon, 
  PhotoIcon 
} from '@heroicons/react/24/outline';
import { formatFileSize } from '../utils/formatters';

const MAX_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB warning threshold for LocalStorage

const FileAttachmentZone = ({ attachments = [], onChange }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const processFiles = (files) => {
    setErrorMessage('');
    const newAttachments = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`"${file.name}" is over 1.5MB. For browser storage performance, smaller files are recommended.`);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newAttachments.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result,
          uploadedAt: new Date().toISOString()
        });

        // Once all files processed, update parent
        if (newAttachments.length === files.length) {
          onChange([...attachments, ...newAttachments]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  const removeAttachment = (id) => {
    onChange(attachments.filter(att => att.id !== id));
  };

  return (
    <div className="file-attachment-zone">
      <div 
        className={`file-dropzone ${isDragging ? 'dropzone-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileInputChange} 
          multiple 
          style={{ display: 'none' }} 
        />
        <div className="dropzone-content">
          <PaperClipIcon className="dropzone-icon" width={24} height={24} />
          <p className="dropzone-text">
            <span>Click to upload</span> or drag and drop files here
          </p>
          <span className="dropzone-hint">Images, PDFs, docs (up to 1.5MB per file)</span>
        </div>
      </div>

      {errorMessage && (
        <div className="file-error-banner">
          ⚠️ {errorMessage}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="attachments-list">
          <div className="attachments-title">
            Attached Files ({attachments.length})
          </div>
          <div className="attachments-grid">
            {attachments.map((att) => {
              const isImage = att.type?.startsWith('image/');
              return (
                <div key={att.id} className="attachment-chip">
                  <div className="attachment-preview">
                    {isImage ? (
                      <img src={att.dataUrl} alt={att.name} className="attachment-img-thumb" />
                    ) : (
                      <DocumentIcon className="attachment-doc-icon" width={20} height={20} />
                    )}
                  </div>
                  <div className="attachment-info" title={att.name}>
                    <span className="attachment-name">{att.name}</span>
                    <span className="attachment-size">{formatFileSize(att.size)}</span>
                  </div>
                  <div className="attachment-actions">
                    <a 
                      href={att.dataUrl} 
                      download={att.name} 
                      className="attachment-btn" 
                      title="Download/Open"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowDownTrayIcon width={16} height={16} />
                    </a>
                    <button 
                      type="button" 
                      className="attachment-btn delete-btn" 
                      title="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAttachment(att.id);
                      }}
                    >
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAttachmentZone;
