'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import RewardCard from './RewardCard';
import { Reward } from '@/types/point';

interface RewardListProps {
  rewards: Reward[];
  currentPoints: number;
  onRedeem?: (id: string) => void;
}

export default function RewardList({ rewards, currentPoints, onRedeem }: RewardListProps) {
  if (rewards.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">ご褒美が登録されていません</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {rewards.map((reward) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reward.id}>
          <RewardCard
            reward={reward}
            currentPoints={currentPoints}
            onRedeem={onRedeem}
          />
        </Grid>
      ))}
    </Grid>
  );
}
