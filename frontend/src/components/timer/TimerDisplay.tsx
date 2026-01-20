'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  elapsedSeconds: number;
  mode: 'work' | 'break';
}

export default function TimerDisplay({ minutes, seconds, totalSeconds, elapsedSeconds, mode }: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? ((totalSeconds - elapsedSeconds) / totalSeconds) * 100 : 100;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={240}
        thickness={3}
        color={mode === 'work' ? 'primary' : 'success'}
        sx={{ transform: 'rotate(-90deg)' }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          {timeString}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {mode === 'work' ? '集中時間' : '休憩時間'}
        </Typography>
      </Box>
    </Box>
  );
}
