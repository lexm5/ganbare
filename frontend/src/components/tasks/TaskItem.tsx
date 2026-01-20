'use client';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import { Difficulty, POINT_RANGES } from '@/types/point';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  difficulty: Difficulty;
  points: number;
}

interface TaskItemProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const difficultyLabel = POINT_RANGES[task.difficulty].label;

  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 1,
        border: '1px solid',
        borderColor: task.completed ? 'success.main' : 'divider',
      }}
      secondaryAction={
        <Box>
          <IconButton size="small" onClick={() => onEdit?.(task.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete?.(task.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle?.(task.id)}
        />
      </ListItemIcon>
      <ListItemText
        primary={task.title}
        sx={{
          textDecoration: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.6 : 1,
        }}
      />
      <Chip
        label={difficultyLabel}
        size="small"
        color={difficultyColors[task.difficulty]}
        sx={{ mr: 1 }}
      />
      <Chip
        icon={<StarIcon />}
        label={`${task.points} pt`}
        size="small"
        color="warning"
        variant="outlined"
        sx={{ mr: 1 }}
      />
    </ListItem>
  );
}
