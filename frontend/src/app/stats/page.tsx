'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import ChartCard from '@/components/stats/ChartCard';
import WeeklyChart from '@/components/stats/WeeklyChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// サンプルデータ
const weeklyTasks = [
  { day: '月', value: 5 },
  { day: '火', value: 8 },
  { day: '水', value: 3 },
  { day: '木', value: 7 },
  { day: '金', value: 6 },
  { day: '土', value: 4 },
  { day: '日', value: 2 },
];

const weeklyTime = [
  { day: '月', value: 120 },
  { day: '火', value: 90 },
  { day: '水', value: 150 },
  { day: '木', value: 80 },
  { day: '金', value: 100 },
  { day: '土', value: 60 },
  { day: '日', value: 30 },
];

export default function StatsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="統計・分析"
        description="あなたの成長を数字で確認しよう"
      />

      <Grid container spacing={3}>
        {/* 概要カード */}
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="今週のタスク"
            value="35"
            icon={<CheckCircleIcon />}
            color="success.main"
            subtitle="先週比 +12%"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="達成率"
            value="78%"
            icon={<TrendingUpIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="集中時間"
            value="10.5h"
            icon={<TimerIcon />}
            color="info.main"
            subtitle="今週"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="最長連続"
            value="14日"
            icon={<LocalFireDepartmentIcon />}
            color="error.main"
          />
        </Grid>

        {/* グラフ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="週間タスク完了数">
            <WeeklyChart data={weeklyTasks} />
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="週間集中時間（分）">
            <WeeklyChart data={weeklyTime} />
          </ChartCard>
        </Grid>
      </Grid>
    </Container>
  );
}
