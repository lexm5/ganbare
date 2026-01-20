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

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskItemProps {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
} as const;

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
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
        sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
      />
      {task.priority && (
        <Chip
          label={task.priority}
          size="small"
          color={priorityColors[task.priority]}
          sx={{ mr: 1 }}
        />
      )}
    </ListItem>
  );
}
