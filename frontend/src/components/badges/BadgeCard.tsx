'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: string;
}

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        opacity: badge.unlocked ? 1 : 0.5,
        filter: badge.unlocked ? 'none' : 'grayscale(100%)',
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: badge.unlocked ? 'warning.100' : 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          {badge.icon}
        </Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {badge.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {badge.description}
        </Typography>
        {badge.unlocked && badge.unlockedAt && (
          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
            獲得済み: {badge.unlockedAt}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
