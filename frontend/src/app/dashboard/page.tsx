'use client';

import { useState, useEffect, useMemo } from 'react';
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
import StarIcon from '@mui/icons-material/Star';
import { useLoginBonus } from '@/lib/useLoginBonus';
import { useNotifications } from '@/context/NotificationContext';
import { Task } from '@/types/task';

interface HabitData {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  return `${days}日前`;
}

export default function DashboardPage() {
  const { showBonus, bonusPoints, streakDays, isWeeklyBonus, claimBonus } = useLoginBonus();
  const { notifications, addNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [pointStatus, setPointStatus] = useState({ totalEarned: 0, totalSpent: 0, currentPoints: 0 });

  // Load data from localStorage
  useEffect(() => {
    try {
      const tasksRaw = localStorage.getItem('app_tasks');
      if (tasksRaw) setTasks(JSON.parse(tasksRaw));
    } catch { /* ignore */ }

    try {
      const habitsRaw = localStorage.getItem('app_habits');
      if (habitsRaw) setHabits(JSON.parse(habitsRaw));
    } catch { /* ignore */ }

    try {
      const pointsRaw = localStorage.getItem('app_point_status');
      if (pointsRaw) setPointStatus(JSON.parse(pointsRaw));
    } catch { /* ignore */ }
  }, []);

  const handleClaimBonus = () => {
    claimBonus();
    addNotification({
      type: 'login_bonus',
      title: 'ログインボーナス獲得！',
      message: `${bonusPoints}ポイントを獲得しました${isWeeklyBonus ? '（週間ボーナス付き）' : ''}`,
    });
  };

  // Computed stats
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const todayCompleted = habits.filter(h => h.completedToday).length;
  const todayTotal = habits.length;

  // Recent activities from notifications
  const recentActivities = useMemo(() => {
    return notifications.slice(0, 5).map((n) => {
      let type: 'task' | 'badge' | 'streak' = 'task';
      if (n.type === 'badge_earned') type = 'badge';
      else if (n.type === 'streak_achieved' || n.type === 'login_bonus') type = 'streak';
      return {
        id: n.id,
        type,
        text: n.title,
        time: formatTime(n.timestamp),
      };
    });
  }, [notifications]);

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
            value={completedTasks}
            icon={<CheckCircleIcon />}
            color="success.main"
            subtitle={`全${totalTasks}件中`}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="最長連続記録"
            value={`${maxStreak}日`}
            icon={<LocalFireDepartmentIcon />}
            color="error.main"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="現在のポイント"
            value={`${pointStatus.currentPoints} pt`}
            icon={<StarIcon />}
            color="warning.main"
            subtitle={`累計 ${pointStatus.totalEarned} pt`}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="今日の習慣"
            value={`${todayCompleted}/${todayTotal}`}
            icon={<EmojiEventsIcon />}
            color="primary.main"
            subtitle="達成済み"
          />
        </Grid>

        {/* 名言 */}
        <Grid size={{ xs: 12 }}>
          <QuoteCard />
        </Grid>

        {/* メインコンテンツ */}
        <Grid size={{ xs: 12, md: 8 }}>
          <TodayProgress completed={completedTasks} total={totalTasks || 1} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickActions />
        </Grid>

        {/* 最近のアクティビティ */}
        <Grid size={{ xs: 12 }}>
          <RecentActivity activities={recentActivities} />
        </Grid>
      </Grid>
    </Container>
  );
}
