'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface WeeklyChartProps {
  data: { day: string; value: number }[];
  maxValue?: number;
}

export default function WeeklyChart({ data, maxValue }: WeeklyChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: '100%', width: '100%' }}>
      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            {item.value}
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: `${(item.value / max) * 120}px`,
              minHeight: 4,
              bgcolor: 'primary.main',
              borderRadius: 1,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {item.day}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
