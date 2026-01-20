'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface StreakBadgeProps {
  streak: number;
  label?: string;
}

export default function StreakBadge({ streak, label = '連続記録' }: StreakBadgeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        borderRadius: 2,
        bgcolor: 'error.50',
      }}
    >
      <LocalFireDepartmentIcon sx={{ color: 'error.main', fontSize: 32 }} />
      <Box>
        <Typography variant="h5" fontWeight="bold" color="error.main">
          {streak}日
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
