'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TaskCard from './TaskCard';
import { Task, Category } from '@/types/task';

interface TaskCardListProps {
  tasks: Task[];
  categories: Category[];
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export default function TaskCardList({
  tasks,
  categories,
  onToggle,
  onEdit,
  onDelete,
  emptyMessage = 'タスクがありません',
}: TaskCardListProps) {
  const getCategory = (categoryId: string) =>
    categories.find((c) => c.id === categoryId) || categories[0];

  if (tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={task.id}>
          <TaskCard
            task={task}
            category={getCategory(task.categoryId)}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
}
