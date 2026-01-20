'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface QuoteCardProps {
  quote: string;
  author?: string;
}

export default function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormatQuoteIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
              {quote}
            </Typography>
            {author && (
              <Typography variant="body2" color="text.secondary">
                — {author}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
