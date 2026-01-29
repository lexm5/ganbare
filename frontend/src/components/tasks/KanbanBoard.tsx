'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Task, Category, TaskStatus, KANBAN_COLUMNS } from '@/types/task';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  categories: Category[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function KanbanBoard({
  tasks,
  categories,
  onStatusChange,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    // ドロップ先がカラム自体の場合
    const isOverColumn = KANBAN_COLUMNS.some((col) => col.status === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        onStatusChange(activeTask.id, newStatus);
      }
      return;
    }

    // ドロップ先が別のタスクの場合
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      onStatusChange(activeTask.id, overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;

    // 最終的なステータス更新
    const isOverColumn = KANBAN_COLUMNS.some((col) => col.status === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        onStatusChange(activeTask.id, newStatus);
      }
    }
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;
  const activeCategory = activeTask
    ? categories.find((c) => c.id === activeTask.categoryId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 2,
          minHeight: 500,
        }}
      >
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            title={column.title}
            color={column.color}
            tasks={getTasksByStatus(column.status)}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>

      <DragOverlay dropAnimation={null}>
        {activeTask && activeCategory && (
          <Card
            variant="outlined"
            sx={{
              width: 300,
              opacity: 0.95,
              borderLeft: '5px solid',
              borderLeftColor: activeCategory.color,
              boxShadow: 8,
              transform: 'rotate(2deg)',
              cursor: 'grabbing',
            }}
          >
            <CardContent sx={{ py: 2, px: 2.5 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {activeTask.title}
              </Typography>
              {activeTask.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {activeTask.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}
