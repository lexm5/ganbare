'use client';

import { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import PageHeader from '@/components/common/PageHeader';
import TimerDisplay from '@/components/timer/TimerDisplay';
import TimerControls from '@/components/timer/TimerControls';

const WORK_TIME = 25 * 60; // 25分
const BREAK_TIME = 5 * 60; // 5分

export default function TimerPage() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const totalSeconds = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const elapsedSeconds = totalSeconds - timeLeft;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const handleSkip = useCallback(() => {
    if (mode === 'work') {
      setSessions(s => s + 1);
      setMode('break');
      setTimeLeft(BREAK_TIME);
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
    }
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSkip();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleSkip]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <PageHeader
        title="ポモドーロタイマー"
        description="25分集中して、5分休憩しよう"
      />

      <Card variant="outlined">
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={mode === 'work' ? '集中時間' : '休憩時間'}
              color={mode === 'work' ? 'primary' : 'success'}
              sx={{ mb: 2 }}
            />
          </Box>

          <TimerDisplay
            minutes={minutes}
            seconds={seconds}
            totalSeconds={totalSeconds}
            elapsedSeconds={elapsedSeconds}
            mode={mode}
          />

          <TimerControls
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onSkip={handleSkip}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            今日のセッション: {sessions} 回完了
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
