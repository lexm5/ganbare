'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
