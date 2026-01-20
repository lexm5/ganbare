'use client';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TaskItem, { Task } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete, emptyMessage = 'タスクがありません' }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
