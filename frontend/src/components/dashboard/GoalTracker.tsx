'use client';

import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  period: 'weekly' | 'monthly';
  createdAt: string;
}

interface GoalTrackerProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id' | 'current' | 'createdAt'>) => void;
  onUpdate: (id: string, current: number) => void;
  onDelete: (id: string) => void;
}

export default function GoalTracker({ goals, onAdd, onUpdate, onDelete }: GoalTrackerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('回');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const handleSubmit = () => {
    if (!title.trim() || !target) return;
    onAdd({
      title: title.trim(),
      target: Number(target),
      unit,
      period,
    });
    setTitle('');
    setTarget('');
    setUnit('回');
    setPeriod('weekly');
    setDialogOpen(false);
  };

  const handleIncrement = (goal: Goal) => {
    if (goal.current < goal.target) {
      onUpdate(goal.id, goal.current + 1);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlagIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              目標
            </Typography>
          </Box>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            追加
          </Button>
        </Box>

        {goals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              目標を設定して進捗を追跡しましょう
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {goals.map(goal => {
              const percent = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
              const isComplete = goal.current >= goal.target;

              return (
                <Box
                  key={goal.id}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: isComplete ? 'success.main' : 'divider',
                    bgcolor: isComplete ? 'success.50' : 'transparent',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isComplete && <CheckCircleIcon color="success" fontSize="small" />}
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ textDecoration: isComplete ? 'line-through' : 'none' }}
                      >
                        {goal.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Chip
                        label={goal.period === 'weekly' ? '週間' : '月間'}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22 }}
                      />
                      <IconButton size="small" onClick={() => onDelete(goal.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        color={isComplete ? 'success' : 'primary'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 80, textAlign: 'right' }}>
                      {goal.current} / {goal.target} {goal.unit}
                    </Typography>
                  </Box>

                  {!isComplete && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleIncrement(goal)}
                      >
                        +1 {goal.unit}
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </CardContent>

      {/* 目標追加ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新しい目標を追加</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="目標名"
              placeholder="例: タスクを10個完了する"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="目標値"
                type="number"
                value={target}
                onChange={e => setTarget(e.target.value)}
                sx={{ flex: 1 }}
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <TextField
                label="単位"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                sx={{ width: 100 }}
              />
            </Box>
            <TextField
              label="期間"
              select
              value={period}
              onChange={e => setPeriod(e.target.value as 'weekly' | 'monthly')}
            >
              <MenuItem value="weekly">週間</MenuItem>
              <MenuItem value="monthly">月間</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title.trim() || !target || Number(target) <= 0}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
