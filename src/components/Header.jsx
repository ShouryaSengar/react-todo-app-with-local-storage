import React from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  Squares2X2Icon, 
  ListBulletIcon, 
  SunIcon, 
  MoonIcon,
  PlusIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { SORT_OPTIONS, STATUS_CONFIG, STATUS_LIST } from '../constants';

const Header = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenCreateModal,
  categories = [],
  taskStats = { total: 0, pending: 0, current: 0, completed: 0 }
}) => {
  return (
    <header className="app-header">
      {/* Top Navbar */}
      <div className="navbar-top">
        <div className="brand-logo">
          <div className="brand-icon-wrap">
            <CheckCircleIcon width={28} height={28} className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <p className="brand-subtitle">Organize, track & deliver seamlessly</p>
          </div>
        </div>

        {/* Top Right Controls: Theme Toggle & + New Task */}
        <div className="navbar-top-actions">
          {/* Quick Metrics */}
          <div className="quick-stats-bar">
            <span className="stat-pill">
              <strong>{taskStats.total}</strong> Total
            </span>
            <span className="stat-pill stat-current">
              <strong>{taskStats.current}</strong> In Progress
            </span>
            <span className="stat-pill stat-completed">
              <strong>{taskStats.completed}</strong> Completed
            </span>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <SunIcon width={20} height={20} />
            ) : (
              <MoonIcon width={20} height={20} />
            )}
          </button>

          <button
            type="button"
            className="btn-primary create-task-cta"
            onClick={() => onOpenCreateModal()}
          >
            <PlusIcon width={20} height={20} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="controls-toolbar">
        {/* Search Input */}
        <div className="search-box">
          <MagnifyingGlassIcon width={18} height={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks, descriptions, or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <XMarkIcon width={16} height={16} />
            </button>
          )}
        </div>

        {/* Filter & Sort Row */}
        <div className="toolbar-filters">
          {/* Category Filter */}
          <div className="filter-item">
            <label htmlFor="category-filter" className="filter-label">Category:</label>
            <select
              id="category-filter"
              className="toolbar-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => {
                const label = typeof cat === 'string' ? cat : (cat?.name || 'General');
                return <option key={label} value={label}>{label}</option>;
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-item">
            <label htmlFor="status-filter" className="filter-label">Status:</label>
            <select
              id="status-filter"
              className="toolbar-select"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {STATUS_LIST.map((key) => (
                <option key={key} value={key}>{STATUS_CONFIG[key].label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <label htmlFor="sort-by" className="filter-label">
              <ArrowsUpDownIcon width={14} height={14} />
              <span>Sort:</span>
            </label>
            <select
              id="sort-by"
              className="toolbar-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle: Kanban Board vs List */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => onViewModeChange('board')}
              title="Kanban Board View (Drag & Drop)"
            >
              <Squares2X2Icon width={18} height={18} />
              <span>Board</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              title="List View"
            >
              <ListBulletIcon width={18} height={18} />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
