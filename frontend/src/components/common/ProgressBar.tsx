'use client';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export default function ProgressBar({ value, label, showPercent = true, color = 'primary' }: ProgressBarProps) {
  return (
    <Box sx={{ width: '100%' }}>
      {(label || showPercent) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          {label && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          {showPercent && (
            <Typography variant="body2" fontWeight="medium">
              {Math.round(value)}%
            </Typography>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}
