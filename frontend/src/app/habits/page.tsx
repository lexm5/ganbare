'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PageHeader from '@/components/common/PageHeader';
import HabitList from '@/components/habits/HabitList';
import StreakBadge from '@/components/habits/StreakBadge';
import { Habit } from '@/components/habits/HabitItem';
import AddIcon from '@mui/icons-material/Add';

// サンプルデータ
const initialHabits: Habit[] = [
  { id: '1', name: '朝のストレッチ', streak: 7, completedToday: true },
  { id: '2', name: '読書30分', streak: 3, completedToday: false },
  { id: '3', name: '水を2L飲む', streak: 14, completedToday: true },
  { id: '4', name: '早寝早起き', streak: 0, completedToday: false },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const handleToggle = (id: string) => {
    setHabits(habits.map(h =>
      h.id === id ? { ...h, completedToday: !h.completedToday } : h
    ));
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const maxStreak = Math.max(...habits.map(h => h.streak));

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PageHeader
        title="習慣トラッカー"
        description="毎日の習慣を記録して、継続の力を実感しよう"
        action={
          <Button variant="contained" startIcon={<AddIcon />}>
            習慣を追加
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* サマリー */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                今日の達成
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {completedCount} / {habits.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StreakBadge streak={maxStreak} label="最長連続記録" />
        </Grid>

        {/* 習慣リスト */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                今日の習慣
              </Typography>
              <HabitList habits={habits} onToggle={handleToggle} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
