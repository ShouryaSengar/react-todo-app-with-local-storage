import React from 'react';
import { STATUS_LIST } from '../constants';
import KanbanColumn from './KanbanColumn';

const KanbanBoard = ({
  tasks = [],
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onToggleComplete,
  onQuickAdd,
  onReorderTask,
}) => {
  return (
    <div className="kanban-board">
      {STATUS_LIST.map((statusKey) => {
        const columnTasks = tasks.filter((t) => t.status === statusKey);
        return (
          <KanbanColumn
            key={statusKey}
            statusKey={statusKey}
            tasks={columnTasks}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onStatusChange={onStatusChange}
            onToggleComplete={onToggleComplete}
            onQuickAdd={onQuickAdd}
            onReorderTask={onReorderTask}
          />
        );
      })}
    </div>
  );
};

export default KanbanBoard;
