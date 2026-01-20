'use client';

import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import { Task, Category } from '@/types/task';
import { POINT_RANGES } from '@/types/point';

interface TaskEditDialogProps {
  open: boolean;
  task: Task | null;
  categories: Category[];
  onClose: () => void;
  onSave: (id: string, updates: { title: string; description?: string; categoryId: string }) => void;
}

export default function TaskEditDialog({ open, task, categories, onClose, onSave }: TaskEditDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategoryId(task.categoryId);
    }
  }, [task]);

  const handleSave = () => {
    if (task && title.trim()) {
      onSave(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId,
      });
      onClose();
    }
  };

  if (!task) return null;

  const category = categories.find(c => c.id === categoryId) || categories[0];
  const difficultyLabel = POINT_RANGES[task.difficulty].label;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>タスクを編集</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {/* 編集可能フィールド */}
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

          <Divider />

          {/* 変更不可フィールド */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LockIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                以下の項目は変更できません（最初に決めたことをやり通そう！）
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={difficultyLabel}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<StarIcon />}
                label={`${task.points} pt`}
                size="small"
                color="warning"
              />
              {task.dueDate && (
                <Chip
                  label={`期限: ${task.dueDate}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
