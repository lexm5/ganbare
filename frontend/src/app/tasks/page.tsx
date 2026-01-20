'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PageHeader from '@/components/common/PageHeader';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import { Task } from '@/components/tasks/TaskItem';
import AddIcon from '@mui/icons-material/Add';

// サンプルデータ
const initialTasks: Task[] = [
  { id: '1', title: '企画書を作成する', completed: false, priority: 'high' },
  { id: '2', title: 'メールを返信する', completed: true, priority: 'medium' },
  { id: '3', title: '資料を読む', completed: false, priority: 'low' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tab, setTab] = useState(0);

  const handleToggle = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAdd = (task: { title: string; priority: string }) => {
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: task.title,
      completed: false,
      priority: task.priority as Task['priority'],
    }]);
  };

  const filteredTasks = tab === 0
    ? tasks
    : tab === 1
      ? tasks.filter(t => !t.completed)
      : tasks.filter(t => t.completed);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <PageHeader
        title="タスク管理"
        description="やることを整理して、一つずつ達成しよう"
      />

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
    </Container>
  );
}
