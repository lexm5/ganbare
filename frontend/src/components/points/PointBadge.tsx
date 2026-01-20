'use client';

import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';

interface PointBadgeProps {
  points: number;
  size?: 'small' | 'medium';
}

export default function PointBadge({ points, size = 'small' }: PointBadgeProps) {
  return (
    <Chip
      icon={<StarIcon />}
      label={`${points} pt`}
      size={size}
      color="warning"
      variant="outlined"
    />
  );
}
