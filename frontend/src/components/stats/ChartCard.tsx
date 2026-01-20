'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
