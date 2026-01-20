'use client';

import Chip from '@mui/material/Chip';
import { Category } from '@/types/task';

interface CategoryChipProps {
  category: Category;
  size?: 'small' | 'medium';
  onClick?: () => void;
  selected?: boolean;
}

export default function CategoryChip({ category, size = 'small', onClick, selected }: CategoryChipProps) {
  return (
    <Chip
      label={category.name}
      size={size}
      onClick={onClick}
      sx={{
        bgcolor: selected ? category.color : `${category.color}20`,
        color: selected ? 'white' : category.color,
        fontWeight: selected ? 'bold' : 'medium',
        '&:hover': onClick ? {
          bgcolor: `${category.color}40`,
        } : {},
      }}
    />
  );
}
