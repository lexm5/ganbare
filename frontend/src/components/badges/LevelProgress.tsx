'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import StarIcon from '@mui/icons-material/Star';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  requiredXP: number;
}

export default function LevelProgress({ level, currentXP, requiredXP }: LevelProgressProps) {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          width: 56,
          height: 56,
          bgcolor: 'primary.main',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        {level}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            レベル {level}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentXP} / {requiredXP} XP
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="caption" color="text.secondary">
          次のレベルまであと {requiredXP - currentXP} XP
        </Typography>
      </Box>
    </Box>
  );
}
