'use client';

import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HabitItem, { Habit } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  onToggle?: (id: string) => void;
}

export default function HabitList({ habits, onToggle }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">習慣が登録されていません</Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onToggle={onToggle} />
      ))}
    </List>
  );
}
