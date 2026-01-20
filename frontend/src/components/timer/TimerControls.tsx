'use client';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';

interface TimerControlsProps {
  isRunning: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSkip?: () => void;
}

export default function TimerControls({ isRunning, onStart, onPause, onStop, onSkip }: TimerControlsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
      {isRunning ? (
        <IconButton
          onClick={onPause}
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'warning.main',
            color: 'white',
            '&:hover': { bgcolor: 'warning.dark' },
          }}
        >
          <PauseIcon sx={{ fontSize: 32 }} />
        </IconButton>
      ) : (
        <IconButton
          onClick={onStart}
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 32 }} />
        </IconButton>
      )}
      <IconButton
        onClick={onStop}
        sx={{
          width: 64,
          height: 64,
          bgcolor: 'error.main',
          color: 'white',
          '&:hover': { bgcolor: 'error.dark' },
        }}
      >
        <StopIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <IconButton
        onClick={onSkip}
        sx={{
          width: 64,
          height: 64,
          bgcolor: 'grey.300',
          '&:hover': { bgcolor: 'grey.400' },
        }}
      >
        <SkipNextIcon sx={{ fontSize: 32 }} />
      </IconButton>
    </Box>
  );
}
