export const STATUS_CONFIG = {
  backlog: {
    id: 'backlog',
    label: 'Backlog',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.3)',
    iconColor: '#94a3b8',
    description: 'Ideas and tasks slated for later'
  },
  pending: {
    id: 'pending',
    label: 'Pending',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    iconColor: '#fbbf24',
    description: 'Awaiting action or dependencies'
  },
  current: {
    id: 'current',
    label: 'Current',
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.12)',
    border: 'rgba(2, 132, 199, 0.3)',
    iconColor: '#38bdf8',
    description: 'Actively in progress right now'
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    iconColor: '#34d399',
    description: 'Finished and verified tasks'
  },
  cancel: {
    id: 'cancel',
    label: 'Cancel',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    iconColor: '#f87171',
    description: 'Archived, cancelled or obsolete'
  }
};

export const STATUS_LIST = ['backlog', 'pending', 'current', 'completed', 'cancel'];

export const DEFAULT_CATEGORIES = [
  'Work',
  'Personal',
  'Development',
  'Design',
  'Urgent',
  'General'
];

export const SORT_OPTIONS = [
  { id: 'manual', label: 'Custom Order (Drag to Reorder)' },
  { id: 'dateCreated_desc', label: 'Date Created (Newest)' },
  { id: 'dateCreated_asc', label: 'Date Created (Oldest)' },
  { id: 'name_asc', label: 'Name (A to Z)' },
  { id: 'name_desc', label: 'Name (Z to A)' },
  { id: 'deadline_asc', label: 'Deadline (Earliest)' },
  { id: 'deadline_desc', label: 'Deadline (Latest)' }
];
