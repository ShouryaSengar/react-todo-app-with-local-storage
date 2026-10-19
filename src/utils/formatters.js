export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDeadline = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getDeadlineStatus = (dateString, status) => {
  if (!dateString) return null;
  if (status === 'completed' || status === 'cancel') return null;

  const deadline = new Date(dateString).getTime();
  if (isNaN(deadline)) return null;

  const now = Date.now();
  const diffHours = (deadline - now) / (1000 * 60 * 60);

  if (diffHours < 0) {
    const overdueDays = Math.ceil(Math.abs(diffHours) / 24);
    return {
      type: 'overdue',
      label: overdueDays > 1 ? `${overdueDays}d overdue` : 'Overdue',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.15)',
    };
  }

  if (diffHours <= 24) {
    return {
      type: 'due-today',
      label: 'Due soon (<24h)',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.15)',
    };
  }

  if (diffHours <= 72) {
    return {
      type: 'due-soon',
      label: `Due in ${Math.ceil(diffHours / 24)}d`,
      color: '#eab308',
      bg: 'rgba(234, 179, 8, 0.15)',
    };
  }

  return {
    type: 'normal',
    label: formatDeadline(dateString),
    color: 'inherit',
    bg: 'transparent',
  };
};

export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = Date.now();
  const time = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  if (isNaN(time)) return '';

  const elapsedSec = Math.floor((now - time) / 1000);
  if (elapsedSec < 60) return 'Just now';
  const elapsedMin = Math.floor(elapsedSec / 60);
  if (elapsedMin < 60) return `${elapsedMin}m ago`;
  const elapsedHours = Math.floor(elapsedMin / 60);
  if (elapsedHours < 24) return `${elapsedHours}h ago`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) return `${elapsedDays}d ago`;

  return new Date(time).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Lightweight safe markdown-like formatter for previewing rich text
 */
export const renderSimpleMarkdown = (text) => {
  if (!text) return '';
  
  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="rich-pre"><code>$1</code></pre>');
  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code class="rich-code">$1</code>');
  // Headings
  html = html.replace(/^### (.*$)/gim, '<h4 class="rich-h4">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="rich-h3">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="rich-h2">$1</h2>');
  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Blockquote
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="rich-quote">$1</blockquote>');
  // Bullet lists (- or *)
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="rich-li">$1</li>');
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="rich-link">$1</a>');
  // Line breaks
  html = html.replace(/\n/g, '<br/>');

  return html;
};
