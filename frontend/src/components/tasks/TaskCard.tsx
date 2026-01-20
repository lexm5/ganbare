'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Task, Category } from '@/types/task';
import { POINT_RANGES } from '@/types/point';
import CategoryChip from './CategoryChip';

interface TaskCardProps {
  task: Task;
  category: Category;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

export default function TaskCard({ task, category, onToggle, onEdit, onDelete }: TaskCardProps) {
  const difficultyLabel = POINT_RANGES[task.difficulty].label;

  const handleCardClick = () => {
    onEdit?.(task.id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(task.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(task.id);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        opacity: task.completed ? 0.7 : 1,
        borderLeft: '4px solid',
        borderLeftColor: category.color,
        transition: 'all 0.2s',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
          bgcolor: 'action.hover',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ pb: '12px !important' }}>
        {/* ヘッダー */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <Checkbox
            checked={task.completed}
            onClick={handleCheckboxClick}
            sx={{ p: 0, mr: 1 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={handleDeleteClick}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* タグエリア */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <CategoryChip category={category} />
          <Chip
            label={difficultyLabel}
            size="small"
            color={difficultyColors[task.difficulty]}
            variant="outlined"
          />
          <Chip
            icon={<StarIcon />}
            label={`${task.points} pt`}
            size="small"
            color="warning"
          />
          {task.dueDate && (
            <Chip
              icon={<AccessTimeIcon />}
              label={task.dueDate}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
