'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import PanToolIcon from '@mui/icons-material/PanTool';
import BackHandIcon from '@mui/icons-material/BackHand';
import { Task, Category } from '@/types/task';
import { POINT_RANGES } from '@/types/point';
import CategoryChip from './CategoryChip';

interface DraggableTaskCardProps {
  task: Task;
  category: Category;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'error',
} as const;

export default function DraggableTaskCard({
  task,
  category,
  onEdit,
  onDelete,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const difficultyLabel = POINT_RANGES[task.difficulty].label;

  const handleCardClick = () => {
    onEdit?.(task.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(task.id);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      variant="outlined"
      sx={{
        mb: 2,
        opacity: isDragging ? 0.5 : task.status === 'done' ? 0.7 : 1,
        borderLeft: '5px solid',
        borderLeftColor: category.color,
        transition: 'box-shadow 0.2s, background-color 0.2s',
        cursor: 'pointer',
        bgcolor: isDragging ? 'action.selected' : 'background.paper',
        '&:hover': {
          boxShadow: 3,
          bgcolor: 'action.hover',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 2, pb: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            sx={{
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.75,
              borderRadius: 1.5,
              bgcolor: 'grey.100',
              color: 'grey.500',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)',
                '& .open-hand': { display: 'none' },
                '& .grab-hand': { display: 'block' },
              },
              '&:active': {
                cursor: 'grabbing',
                transform: 'scale(0.95)',
              },
            }}
          >
            <PanToolIcon className="open-hand" sx={{ fontSize: 22 }} />
            <BackHandIcon className="grab-hand" sx={{ fontSize: 22, display: 'none' }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                textDecoration: task.status === 'done' ? 'line-through' : 'none',
                color: task.status === 'done' ? 'text.secondary' : 'text.primary',
                fontSize: '1rem',
                lineHeight: 1.4,
              }}
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.description}
              </Typography>
            )}
          </Box>
          <IconButton size="medium" onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <CategoryChip category={category} />
          <Chip
            label={difficultyLabel}
            size="small"
            color={difficultyColors[task.difficulty]}
            variant="outlined"
            sx={{ height: 26, '& .MuiChip-label': { px: 1.5, fontSize: '0.8rem' } }}
          />
          <Chip
            icon={<StarIcon sx={{ fontSize: '1rem !important' }} />}
            label={`${task.points}pt`}
            size="small"
            color="warning"
            sx={{ height: 26, '& .MuiChip-label': { px: 1, fontSize: '0.8rem' } }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
