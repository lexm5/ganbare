'use client';

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Category } from '@/types/task';
import { Difficulty, POINT_RANGES } from '@/types/point';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    difficulty: Difficulty;
    points: number;
    categoryId: string;
    dueDate?: string;
  }) => void;
  categories: Category[];
}

export default function TaskFormDialog({ open, onClose, onSubmit, categories }: TaskFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [points, setPoints] = useState(POINT_RANGES.medium.min);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [dueDate, setDueDate] = useState('');

  const range = POINT_RANGES[difficulty];

  useEffect(() => {
    setPoints(POINT_RANGES[difficulty].min);
  }, [difficulty]);

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setDifficulty('medium');
      setPoints(POINT_RANGES.medium.min);
      setCategoryId(categories[0]?.id || '');
      setDueDate('');
    }
  }, [open, categories]);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        difficulty,
        points,
        categoryId,
        dueDate: dueDate || undefined,
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>新しいタスクを追加</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            label="タスク名"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="説明（任意）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>カテゴリ</InputLabel>
              <Select
                value={categoryId}
                label="カテゴリ"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cat.color }} />
                      {cat.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>難易度</InputLabel>
              <Select
                value={difficulty}
                label="難易度"
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <MenuItem value="easy">簡単</MenuItem>
                <MenuItem value="medium">普通</MenuItem>
                <MenuItem value="hard">難しい</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="期限日（任意）"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ポイント設定
              </Typography>
              <Chip label={`${points} pt`} color="warning" size="small" />
            </Box>
            <Slider
              value={points}
              onChange={(_, value) => setPoints(value as number)}
              min={range.min}
              max={range.max}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="text.secondary">
              {range.label}の難易度: {range.min}〜{range.max} pt
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!title.trim()}>
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
}
