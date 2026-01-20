'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PageHeader from '@/components/common/PageHeader';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import PointSummary from '@/components/points/PointSummary';
import { Task } from '@/components/tasks/TaskItem';
import { Difficulty, PointStatus } from '@/types/point';

// サンプルデータ
const initialTasks: Task[] = [
  { id: '1', title: '企画書を作成する', completed: false, difficulty: 'hard', points: 20 },
  { id: '2', title: 'メールを返信する', completed: true, difficulty: 'easy', points: 3 },
  { id: '3', title: '資料を読む', completed: false, difficulty: 'medium', points: 10 },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tab, setTab] = useState(0);
  const [pointStatus, setPointStatus] = useState<PointStatus>({
    totalEarned: 3,
    totalSpent: 0,
    currentPoints: 3,
  });

  const handleToggle = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
        // ポイント計算
        if (newCompleted) {
          setPointStatus(prev => ({
            ...prev,
            totalEarned: prev.totalEarned + t.points,
            currentPoints: prev.currentPoints + t.points,
          }));
        } else {
          setPointStatus(prev => ({
            ...prev,
            totalEarned: prev.totalEarned - t.points,
            currentPoints: prev.currentPoints - t.points,
          }));
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    }));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAdd = (task: { title: string; difficulty: Difficulty; points: number }) => {
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: task.title,
      completed: false,
      difficulty: task.difficulty,
      points: task.points,
    }]);
  };

  const filteredTasks = tab === 0
    ? tasks
    : tab === 1
      ? tasks.filter(t => !t.completed)
      : tasks.filter(t => t.completed);

  const totalPendingPoints = tasks.filter(t => !t.completed).reduce((sum, t) => sum + t.points, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="タスク管理"
        description="タスクを完了してポイントを貯めよう"
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <PointSummary status={pointStatus} />
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  未完了タスクの合計
                </Box>
                <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'primary.main' }}>
                  {totalPendingPoints} pt
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined">
            <CardContent>
              <TaskForm onSubmit={handleAdd} />

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                  <Tab label={`すべて (${tasks.length})`} />
                  <Tab label={`未完了 (${tasks.filter(t => !t.completed).length})`} />
                  <Tab label={`完了 (${tasks.filter(t => t.completed).length})`} />
                </Tabs>
              </Box>

              <TaskList
                tasks={filteredTasks}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
