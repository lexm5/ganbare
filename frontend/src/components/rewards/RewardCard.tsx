'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Reward } from '@/types/point';

interface RewardCardProps {
  reward: Reward;
  currentPoints: number;
  onRedeem?: (id: string) => void;
}

export default function RewardCard({ reward, currentPoints, onRedeem }: RewardCardProps) {
  const canAfford = currentPoints >= reward.cost;
  const isRedeemed = reward.redeemed;

  return (
    <Card
      variant="outlined"
      sx={{
        opacity: isRedeemed ? 0.6 : 1,
        position: 'relative',
      }}
    >
      {isRedeemed && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CheckCircleIcon color="success" />
        </Box>
      )}
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {reward.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {reward.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            icon={<StarIcon />}
            label={`${reward.cost} pt`}
            color="warning"
            variant={canAfford ? 'filled' : 'outlined'}
          />
          {isRedeemed ? (
            <Typography variant="caption" color="success.main">
              使用済み: {reward.redeemedAt}
            </Typography>
          ) : (
            <Button
              variant="contained"
              size="small"
              disabled={!canAfford}
              onClick={() => onRedeem?.(reward.id)}
            >
              交換する
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
