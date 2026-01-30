'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CategoryIcon from '@mui/icons-material/Category';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CloseIcon from '@mui/icons-material/Close';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';
import TaskEditDialog from '@/components/tasks/TaskEditDialog';
import { Task, Category, TaskFilters as Filters, TaskStatus, DEFAULT_CATEGORIES } from '@/types/task';
import { Difficulty, PointStatus, POINT_RANGES } from '@/types/point';

// サンプルデータ
const initialTasks: Task[] = [
  { id: '1', title: '企画書を作成する', description: '来週の会議用', completed: false, status: 'inProgress', difficulty: 'hard', points: 20, categoryId: 'work', createdAt: '2024-01-20' },
  { id: '2', title: 'メールを返信する', completed: true, status: 'done', difficulty: 'easy', points: 3, categoryId: 'work', createdAt: '2024-01-20' },
  { id: '3', title: '英語の単語を覚える', description: '50単語', completed: false, status: 'todo', difficulty: 'medium', points: 10, categoryId: 'study', createdAt: '2024-01-20' },
  { id: '4', title: '部屋の掃除', completed: false, status: 'todo', difficulty: 'medium', points: 8, categoryId: 'housework', createdAt: '2024-01-20' },
  { id: '5', title: '本を読む', description: '30分以上', completed: false, status: 'todo', difficulty: 'easy', points: 5, categoryId: 'hobby', createdAt: '2024-01-20' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('app_tasks', initialTasks);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [filters, setFilters] = useState<Filters>({ status: 'all', categoryId: null, difficulty: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [pointStatus, setPointStatus] = useLocalStorage<PointStatus>('app_point_status', {
    totalEarned: 3,
    totalSpent: 0,
    currentPoints: 3,
  });

  // メニューアンカー
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [difficultyAnchor, setDifficultyAnchor] = useState<null | HTMLElement>(null);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const wasCompleted = t.status === 'done';
        const isNowCompleted = newStatus === 'done';

        if (!wasCompleted && isNowCompleted) {
          setPointStatus(prev => ({
            ...prev,
            totalEarned: prev.totalEarned + t.points,
            currentPoints: prev.currentPoints + t.points,
          }));
        } else if (wasCompleted && !isNowCompleted) {
          setPointStatus(prev => ({
            ...prev,
            totalEarned: prev.totalEarned - t.points,
            currentPoints: prev.currentPoints - t.points,
          }));
        }

        return { ...t, status: newStatus, completed: newStatus === 'done' };
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
      status: 'todo',
      difficulty: task.difficulty,
      points: task.points,
      categoryId: task.categoryId,
      createdAt: new Date().toISOString().split('T')[0],
    }]);
  };

  // フィルタリング
  const filteredTasks = tasks.filter(t => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchDesc = t.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    if (filters.status === 'pending' && t.status === 'done') return false;
    if (filters.status === 'completed' && t.status !== 'done') return false;
    if (filters.categoryId && t.categoryId !== filters.categoryId) return false;
    if (filters.difficulty && t.difficulty !== filters.difficulty) return false;
    return true;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status !== 'done').length,
    completed: tasks.filter(t => t.status === 'done').length,
  };

  const totalPendingPoints = tasks.filter(t => t.status !== 'done').reduce((sum, t) => sum + t.points, 0);

  const hasActiveFilters = filters.status !== 'all' || filters.categoryId || filters.difficulty;

  const getSelectedCategory = () => categories.find(c => c.id === filters.categoryId);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      {/* 上部ツールバー */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 4,
          py: 2,
        }}
      >
        {/* 1行目: タイトルとポイント情報 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            タスクボード
          </Typography>

          {/* ポイント情報タブ */}
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            <Tooltip title="現在のポイント">
              <Chip
                icon={<StarIcon />}
                label={`${pointStatus.currentPoints} pt`}
                color="warning"
                variant="filled"
                sx={{ fontWeight: 'bold', fontSize: '0.95rem', height: 36, '& .MuiChip-label': { px: 2 } }}
              />
            </Tooltip>
            <Tooltip title="未完了タスクのポイント">
              <Chip
                icon={<PendingIcon />}
                label={`未完了: ${totalPendingPoints} pt`}
                variant="outlined"
                sx={{ fontSize: '0.95rem', height: 36, '& .MuiChip-label': { px: 2 } }}
              />
            </Tooltip>
            <Tooltip title="完了タスク">
              <Chip
                icon={<CheckCircleIcon />}
                label={`完了: ${taskCounts.completed}件`}
                color="success"
                variant="outlined"
                sx={{ fontSize: '0.95rem', height: 36, '& .MuiChip-label': { px: 2 } }}
              />
            </Tooltip>
          </Box>
        </Box>

        {/* 2行目: 検索とフィルター */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* 検索欄 */}
          <TextField
            size="medium"
            placeholder="タスクを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'grey.100',
                '&:hover': { bgcolor: 'grey.200' },
                '&.Mui-focused': { bgcolor: 'background.paper' },
              },
            }}
          />

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* ステータスフィルター */}
          <Button
            size="medium"
            startIcon={<FilterListIcon />}
            onClick={(e) => setStatusAnchor(e.currentTarget)}
            variant={filters.status !== 'all' ? 'contained' : 'text'}
            color={filters.status !== 'all' ? 'primary' : 'inherit'}
            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.95rem', py: 1 }}
          >
            {filters.status === 'all' ? 'ステータス' : filters.status === 'pending' ? '未完了' : '完了'}
          </Button>
          <Menu
            anchorEl={statusAnchor}
            open={Boolean(statusAnchor)}
            onClose={() => setStatusAnchor(null)}
          >
            <MenuItem
              selected={filters.status === 'all'}
              onClick={() => { setFilters({ ...filters, status: 'all' }); setStatusAnchor(null); }}
            >
              すべて ({taskCounts.all})
            </MenuItem>
            <MenuItem
              selected={filters.status === 'pending'}
              onClick={() => { setFilters({ ...filters, status: 'pending' }); setStatusAnchor(null); }}
            >
              未完了 ({taskCounts.pending})
            </MenuItem>
            <MenuItem
              selected={filters.status === 'completed'}
              onClick={() => { setFilters({ ...filters, status: 'completed' }); setStatusAnchor(null); }}
            >
              完了 ({taskCounts.completed})
            </MenuItem>
          </Menu>

          {/* カテゴリフィルター */}
          <Button
            size="medium"
            startIcon={<CategoryIcon />}
            onClick={(e) => setCategoryAnchor(e.currentTarget)}
            variant={filters.categoryId ? 'contained' : 'text'}
            color={filters.categoryId ? 'primary' : 'inherit'}
            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.95rem', py: 1 }}
          >
            {getSelectedCategory()?.name || 'カテゴリ'}
          </Button>
          <Menu
            anchorEl={categoryAnchor}
            open={Boolean(categoryAnchor)}
            onClose={() => setCategoryAnchor(null)}
          >
            <MenuItem
              selected={!filters.categoryId}
              onClick={() => { setFilters({ ...filters, categoryId: null }); setCategoryAnchor(null); }}
            >
              すべて
            </MenuItem>
            <Divider />
            {categories.map(cat => (
              <MenuItem
                key={cat.id}
                selected={filters.categoryId === cat.id}
                onClick={() => { setFilters({ ...filters, categoryId: cat.id }); setCategoryAnchor(null); }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: cat.color,
                    mr: 1.5,
                  }}
                />
                {cat.name}
              </MenuItem>
            ))}
          </Menu>

          {/* 難易度フィルター */}
          <Button
            size="medium"
            startIcon={<SpeedIcon />}
            onClick={(e) => setDifficultyAnchor(e.currentTarget)}
            variant={filters.difficulty ? 'contained' : 'text'}
            color={filters.difficulty ? 'primary' : 'inherit'}
            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.95rem', py: 1 }}
          >
            {filters.difficulty ? POINT_RANGES[filters.difficulty].label : '難易度'}
          </Button>
          <Menu
            anchorEl={difficultyAnchor}
            open={Boolean(difficultyAnchor)}
            onClose={() => setDifficultyAnchor(null)}
          >
            <MenuItem
              selected={!filters.difficulty}
              onClick={() => { setFilters({ ...filters, difficulty: null }); setDifficultyAnchor(null); }}
            >
              すべて
            </MenuItem>
            <Divider />
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
              <MenuItem
                key={diff}
                selected={filters.difficulty === diff}
                onClick={() => { setFilters({ ...filters, difficulty: diff }); setDifficultyAnchor(null); }}
              >
                {POINT_RANGES[diff].label}
              </MenuItem>
            ))}
          </Menu>

          {/* フィルタークリア */}
          {hasActiveFilters && (
            <IconButton
              size="small"
              onClick={() => setFilters({ status: 'all', categoryId: null, difficulty: null })}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}

          <Box sx={{ flex: 1 }} />

          {/* タスク作成ボタン */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '1rem', px: 3 }}
          >
            タスクを作成
          </Button>
        </Box>
      </Box>

      {/* カンバンボード */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        <KanbanBoard
          tasks={filteredTasks}
          categories={categories}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>

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
    </Box>
  );
}
