'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { PointStatus } from '@/types/point';

interface PointSummaryProps {
  status: PointStatus;
}

export default function PointSummary({ status }: PointSummaryProps) {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'warning.50' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StarIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              現在のポイント
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="warning.dark">
              {status.currentPoints} pt
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            累計獲得: {status.totalEarned} pt
          </Typography>
          <Typography variant="body2" color="text.secondary">
            累計使用: {status.totalSpent} pt
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
