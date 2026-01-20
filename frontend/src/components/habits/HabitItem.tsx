'use client';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  icon?: string;
}

interface HabitItemProps {
  habit: Habit;
  onToggle?: (id: string) => void;
}

export default function HabitItem({ habit, onToggle }: HabitItemProps) {
  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 1,
        border: '1px solid',
        borderColor: habit.completedToday ? 'success.main' : 'divider',
      }}
    >
      <IconButton onClick={() => onToggle?.(habit.id)} sx={{ mr: 1 }}>
        {habit.completedToday ? (
          <CheckCircleIcon color="success" />
        ) : (
          <RadioButtonUncheckedIcon />
        )}
      </IconButton>
      <ListItemText primary={habit.name} />
      {habit.streak > 0 && (
        <Chip
          icon={<LocalFireDepartmentIcon />}
          label={`${habit.streak}日連続`}
          size="small"
          color="error"
          variant="outlined"
        />
      )}
    </ListItem>
  );
}
