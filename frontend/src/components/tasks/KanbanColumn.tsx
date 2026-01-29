'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { Task, Category, TaskStatus } from '@/types/task';
import DraggableTaskCard from './DraggableTaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  categories: Category[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function KanbanColumn({
  status,
  title,
  color,
  tasks,
  categories,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const getCategory = (categoryId: string) =>
    categories.find((c) => c.id === categoryId) || categories[0];

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isOver ? 'action.hover' : 'grey.50',
        transition: 'background-color 0.2s',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: color,
            }}
          />
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Box
            sx={{
              minWidth: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color,
              color: 'white',
              borderRadius: 1,
              fontWeight: 'bold',
              fontSize: '0.95rem',
              px: 1,
            }}
          >
            {tasks.length}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          flex: 1,
          overflowY: 'auto',
          minHeight: 300,
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              category={getCategory(task.categoryId)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <Box
            sx={{
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              fontSize: '1rem',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            タスクをドラッグ
          </Box>
        )}
      </Box>
    </Paper>
  );
}
