'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProgressBar from '@/components/common/ProgressBar';

interface TodayProgressProps {
  completed: number;
  total: number;
}

export default function TodayProgress({ completed, total }: TodayProgressProps) {
  const percent = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          今日の進捗
        </Typography>
        <Box sx={{ mb: 2 }}>
          <ProgressBar value={percent} label={`${completed} / ${total} タスク完了`} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {percent >= 100 ? '素晴らしい！全て完了しました！' : 'あと少しで達成です！'}
        </Typography>
      </CardContent>
    </Card>
  );
}
