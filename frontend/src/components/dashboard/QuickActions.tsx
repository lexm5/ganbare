'use client';

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function QuickActions() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          クイックアクション
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            component={Link}
            href="/tasks"
            variant="outlined"
            startIcon={<AddIcon />}
            fullWidth
          >
            タスクを追加
          </Button>
          <Button
            component={Link}
            href="/timer"
            variant="outlined"
            startIcon={<TimerIcon />}
            fullWidth
          >
            タイマーを開始
          </Button>
          <Button
            component={Link}
            href="/habits"
            variant="outlined"
            startIcon={<CheckCircleIcon />}
            fullWidth
          >
            習慣をチェック
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
