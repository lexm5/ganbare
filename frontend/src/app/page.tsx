'use client';

import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RepeatIcon from '@mui/icons-material/Repeat';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FEATURES = [
  {
    icon: <TaskAltIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    title: 'タスク管理',
    description: '優先度付きのタスクをカンバンボードで管理。完了でポイント獲得。',
  },
  {
    icon: <RepeatIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
    title: '習慣トラッカー',
    description: '毎日の習慣をチェック。連続記録でモチベーションを維持。',
  },
  {
    icon: <TimerIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    title: 'ポモドーロタイマー',
    description: '25分集中+5分休憩のサイクルで効率的に作業。',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#ffd700' }} />,
    title: 'バッジ・実績',
    description: '目標達成でバッジを獲得。レベルアップシステム。',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
    title: '統計・分析',
    description: '週間・月間のグラフで自分の成長を可視化。',
  },
  {
    icon: <CardGiftcardIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
    title: 'ご褒美交換',
    description: '貯めたポイントで自分へのご褒美と交換。',
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Hero */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}
        >
          やる気支援アプリ
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          タスク管理、習慣トラッキング、ポモドーロタイマーを組み合わせて
          <br />
          あなたのやる気を支援します
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          ダッシュボードへ
        </Button>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Grid container spacing={3}>
          {FEATURES.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
