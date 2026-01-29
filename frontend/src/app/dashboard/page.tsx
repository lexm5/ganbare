'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import QuoteCard from '@/components/common/QuoteCard';
import LoginBonusDialog from '@/components/common/LoginBonusDialog';
import TodayProgress from '@/components/dashboard/TodayProgress';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import { useLoginBonus } from '@/lib/useLoginBonus';

// サンプルデータ
const activities = [
  { id: '1', type: 'task' as const, text: 'タスク「資料作成」を完了', time: '10分前' },
  { id: '2', type: 'streak' as const, text: '7日連続達成！', time: '1時間前' },
  { id: '3', type: 'badge' as const, text: '「早起きマスター」を獲得', time: '昨日' },
];

export default function DashboardPage() {
  const { showBonus, bonusPoints, streakDays, isWeeklyBonus, claimBonus } = useLoginBonus();
  const [totalPoints, setTotalPoints] = useState(10);

  const handleClaimBonus = () => {
    setTotalPoints(prev => prev + bonusPoints);
    claimBonus();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ログインボーナスダイアログ */}
      <LoginBonusDialog
        open={showBonus}
        bonusPoints={bonusPoints}
        streakDays={streakDays}
        isWeeklyBonus={isWeeklyBonus}
        onClaim={handleClaimBonus}
      />
      <PageHeader
        title="ダッシュボード"
        description="今日も頑張りましょう！"
      />

      <Grid container spacing={3}>
        {/* 統計カード */}
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="完了タスク"
            value="12"
            icon={<CheckCircleIcon />}
            color="success.main"
            subtitle="今週"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="連続記録"
            value="7日"
            icon={<LocalFireDepartmentIcon />}
            color="error.main"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="獲得バッジ"
            value="5"
            icon={<EmojiEventsIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="集中時間"
            value="2.5h"
            icon={<TimerIcon />}
            color="primary.main"
            subtitle="今日"
          />
        </Grid>

        {/* 名言 */}
        <Grid size={{ xs: 12 }}>
          <QuoteCard
            quote="千里の道も一歩から。小さな一歩を積み重ねよう。"
            author="老子"
          />
        </Grid>

        {/* メインコンテンツ */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TodayProgress completed={3} total={5} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickActions />
        </Grid>

        {/* 最近のアクティビティ */}
        <Grid size={{ xs: 12 }}>
          <RecentActivity activities={activities} />
        </Grid>
      </Grid>
    </Container>
  );
}
