'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import PageHeader from '@/components/common/PageHeader';
import HabitList from '@/components/habits/HabitList';
import StreakBadge from '@/components/habits/StreakBadge';
import HabitCalendar from '@/components/habits/HabitCalendar';
import { Habit } from '@/components/habits/HabitItem';
import AddIcon from '@mui/icons-material/Add';
import { useNotifications } from '@/context/NotificationContext';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// 日付が変わった時にストリークと completedToday をリセット/更新
function processHabitsForNewDay(habits: Habit[]): Habit[] {
  const today = getToday();
  const yesterday = getYesterday();

  return habits.map(habit => {
    if (habit.lastCompletedDate === today) {
      return habit;
    }

    if (habit.lastCompletedDate === yesterday) {
      return { ...habit, completedToday: false };
    }

    if (habit.completedToday && habit.lastCompletedDate !== today) {
      return { ...habit, completedToday: false, streak: 0 };
    }

    if (habit.lastCompletedDate && habit.lastCompletedDate < yesterday) {
      return { ...habit, completedToday: false, streak: 0 };
    }

    return { ...habit, completedToday: false };
  });
}

// サンプルデータ
const initialHabits: Habit[] = [
  { id: '1', name: '朝のストレッチ', streak: 7, completedToday: false, completionHistory: [] },
  { id: '2', name: '読書30分', streak: 3, completedToday: false, completionHistory: [] },
  { id: '3', name: '水を2L飲む', streak: 14, completedToday: false, completionHistory: [] },
  { id: '4', name: '早寝早起き', streak: 0, completedToday: false, completionHistory: [] },
];

export default function HabitsPage() {
  const { addNotification } = useNotifications();
  const [habits, setHabits] = useLocalStorage<Habit[]>('app_habits', initialHabits);
  const [openDialog, setOpenDialog] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [dayProcessed, setDayProcessed] = useState(false);

  // 日付変更時にストリークを処理
  useEffect(() => {
    if (!dayProcessed && habits.length > 0) {
      const processed = processHabitsForNewDay(habits);
      const changed = JSON.stringify(processed) !== JSON.stringify(habits);
      if (changed) {
        setHabits(processed);
      }
      setDayProcessed(true);
    }
  }, [habits, dayProcessed, setHabits]);

  const handleToggle = (id: string) => {
    const today = getToday();
    setHabits(habits.map(h => {
      if (h.id !== id) return h;

      const history = h.completionHistory || [];

      if (h.completedToday) {
        // チェック解除 → ストリークを戻す、履歴から今日を削除
        return {
          ...h,
          completedToday: false,
          streak: Math.max(0, h.streak - 1),
          lastCompletedDate: undefined,
          completionHistory: history.filter(d => d !== today),
        };
      } else {
        // チェック → ストリーク+1、履歴に今日を追加
        const newStreak = h.streak + 1;
        addNotification({
          type: 'streak_achieved',
          title: `「${h.name}」を達成！`,
          message: `${newStreak}日連続達成${newStreak >= 7 ? '！すごい！' : ''}`,
        });
        return {
          ...h,
          completedToday: true,
          streak: newStreak,
          lastCompletedDate: today,
          completionHistory: history.includes(today) ? history : [...history, today],
        };
      }
    }));
  };

  const handleAddHabit = () => {
    if (newHabitName.trim() === '') return;
    const newHabit: Habit = {
      id: String(Date.now()),
      name: newHabitName.trim(),
      streak: 0,
      completedToday: false,
      completionHistory: [],
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setNewHabitName('');
    setOpenDialog(false);
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  // 全習慣の完了日を統合
  const allCompletionDates = useMemo(() => {
    return habits.flatMap(h => h.completionHistory || []);
  }, [habits]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PageHeader
        title="習慣トラッカー"
        description="毎日の習慣を記録して、継続の力を実感しよう"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
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

        {/* カレンダー */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <HabitCalendar
                completionDates={allCompletionDates}
                totalHabits={habits.length}
              />
            </CardContent>
          </Card>
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

      {/* 習慣追加ダイアログ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>新しい習慣を追加</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="習慣名"
            placeholder="例: 朝のジョギング"
            fullWidth
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddHabit();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button
            onClick={handleAddHabit}
            variant="contained"
            disabled={newHabitName.trim() === ''}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
