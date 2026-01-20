'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import FilterListIcon from '@mui/icons-material/FilterList';
import PageHeader from '@/components/common/PageHeader';
import PointSummary from '@/components/points/PointSummary';
import TaskCardList from '@/components/tasks/TaskCardList';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';
import TaskEditDialog from '@/components/tasks/TaskEditDialog';
import TaskSearchBar from '@/components/tasks/TaskSearchBar';
import CategoryManager from '@/components/tasks/CategoryManager';
import { Task, Category, TaskFilters as Filters, DEFAULT_CATEGORIES } from '@/types/task';
import { Difficulty, PointStatus } from '@/types/point';

// サンプルデータ
const initialTasks: Task[] = [
  { id: '1', title: '企画書を作成する', description: '来週の会議用', completed: false, difficulty: 'hard', points: 20, categoryId: 'work', createdAt: '2024-01-20' },
  { id: '2', title: 'メールを返信する', completed: true, difficulty: 'easy', points: 3, categoryId: 'work', createdAt: '2024-01-20' },
  { id: '3', title: '英語の単語を覚える', description: '50単語', completed: false, difficulty: 'medium', points: 10, categoryId: 'study', createdAt: '2024-01-20' },
  { id: '4', title: '部屋の掃除', completed: false, difficulty: 'medium', points: 8, categoryId: 'housework', createdAt: '2024-01-20' },
  { id: '5', title: '本を読む', description: '30分以上', completed: false, difficulty: 'easy', points: 5, categoryId: 'hobby', createdAt: '2024-01-20' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [filters, setFilters] = useState<Filters>({ status: 'all', categoryId: null, difficulty: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [pointStatus, setPointStatus] = useState<PointStatus>({
    totalEarned: 3,
    totalSpent: 0,
    currentPoints: 3,
  });

  const handleToggle = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newCompleted = !t.completed;
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

  const handleEdit = (id: string) => {
    setEditTaskId(id);
  };

  const handleSaveEdit = (id: string, updates: { title: string; description?: string; categoryId: string }) => {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, title: updates.title, description: updates.description, categoryId: updates.categoryId }
        : t
    ));
  };

  const handleAdd = (task: { title: string; description: string; difficulty: Difficulty; points: number; categoryId: string }) => {
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: task.title,
      description: task.description || undefined,
      completed: false,
      difficulty: task.difficulty,
      points: task.points,
      categoryId: task.categoryId,
      createdAt: new Date().toISOString().split('T')[0],
    }]);
  };

  const handleAddCategory = (cat: Omit<Category, 'id'>) => {
    setCategories([...categories, { id: Date.now().toString(), ...cat }]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  // フィルタリング
  const filteredTasks = tasks.filter(t => {
    // 検索クエリでフィルタ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchDesc = t.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    if (filters.status === 'pending' && t.completed) return false;
    if (filters.status === 'completed' && !t.completed) return false;
    if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
    if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
    return true;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  const totalPendingPoints = tasks.filter(t => !t.completed).reduce((sum, t) => sum + t.points, 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="タスク管理"
        description="タスクを完了してポイントを貯めよう"
      />

      {/* 検索バー */}
      <TaskSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onCreateClick={() => setFormOpen(true)}
        resultCount={filteredTasks.length}
      />

      <Grid container spacing={3}>
        {/* サイドバー */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <PointSummary status={pointStatus} />
            <Card variant="outlined">
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
            <CategoryManager
              categories={categories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
            />
          </Box>
        </Grid>

        {/* メインコンテンツ */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Card variant="outlined">
            <CardContent>
              {/* フィルタートグル */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Button
                  size="small"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? 'primary' : 'inherit'}
                  sx={{ borderRadius: 2 }}
                >
                  フィルター
                </Button>
                {(filters.status !== 'all' || filters.categoryId || filters.difficulty) && (
                  <Button
                    size="small"
                    onClick={() => setFilters({ status: 'all', categoryId: null, difficulty: null })}
                    color="inherit"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    クリア
                  </Button>
                )}
              </Box>

              {/* フィルター */}
              <Collapse in={showFilters}>
                <TaskFilters
                  filters={filters}
                  categories={categories}
                  onChange={setFilters}
                  taskCounts={taskCounts}
                />
              </Collapse>

              {/* タスク一覧 */}
              <TaskCardList
                tasks={filteredTasks}
                categories={categories}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* タスク追加ダイアログ */}
      <TaskFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
        categories={categories}
      />

      {/* タスク編集ダイアログ */}
      <TaskEditDialog
        open={!!editTaskId}
        task={tasks.find(t => t.id === editTaskId) || null}
        categories={categories}
        onClose={() => setEditTaskId(null)}
        onSave={handleSaveEdit}
      />
    </Container>
  );
}
