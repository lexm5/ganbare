'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Category, TaskFilters as Filters } from '@/types/task';
import { Difficulty, POINT_RANGES } from '@/types/point';

interface TaskFiltersProps {
  filters: Filters;
  categories: Category[];
  onChange: (filters: Filters) => void;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export default function TaskFilters({ filters, categories, onChange, taskCounts }: TaskFiltersProps) {
  const statusOptions = [
    { value: 'all' as const, label: `すべて (${taskCounts.all})` },
    { value: 'pending' as const, label: `未完了 (${taskCounts.pending})` },
    { value: 'completed' as const, label: `完了 (${taskCounts.completed})` },
  ];

  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: POINT_RANGES.easy.label },
    { value: 'medium', label: POINT_RANGES.medium.label },
    { value: 'hard', label: POINT_RANGES.hard.label },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* ステータス */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ステータス
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {statusOptions.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => onChange({ ...filters, status: opt.value })}
              color={filters.status === opt.value ? 'primary' : 'default'}
              variant={filters.status === opt.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      {/* カテゴリ */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          カテゴリ
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="すべて"
            onClick={() => onChange({ ...filters, categoryId: null })}
            color={filters.categoryId === null ? 'primary' : 'default'}
            variant={filters.categoryId === null ? 'filled' : 'outlined'}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              onClick={() => onChange({ ...filters, categoryId: cat.id })}
              sx={{
                bgcolor: filters.categoryId === cat.id ? cat.color : `${cat.color}20`,
                color: filters.categoryId === cat.id ? 'white' : cat.color,
                '&:hover': { bgcolor: `${cat.color}40` },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 難易度 */}
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          難易度
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="すべて"
            onClick={() => onChange({ ...filters, difficulty: null })}
            color={filters.difficulty === null ? 'primary' : 'default'}
            variant={filters.difficulty === null ? 'filled' : 'outlined'}
          />
          {difficultyOptions.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              onClick={() => onChange({ ...filters, difficulty: opt.value })}
              color={filters.difficulty === opt.value ? 'primary' : 'default'}
              variant={filters.difficulty === opt.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
