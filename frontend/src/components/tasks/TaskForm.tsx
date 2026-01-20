'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import { Difficulty, POINT_RANGES } from '@/types/point';

interface TaskFormProps {
  onSubmit?: (task: { title: string; difficulty: Difficulty; points: number }) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [points, setPoints] = useState(POINT_RANGES.medium.min);

  const range = POINT_RANGES[difficulty];

  // 難易度が変わったら最小値にリセット
  useEffect(() => {
    setPoints(POINT_RANGES[difficulty].min);
  }, [difficulty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit?.({ title: title.trim(), difficulty, points });
      setTitle('');
      setDifficulty('medium');
      setPoints(POINT_RANGES.medium.min);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder="新しいタスクを入力..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 100 }}>
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
        <Button type="submit" variant="contained" startIcon={<AddIcon />}>
          追加
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
          ポイント:
        </Typography>
        <Slider
          value={points}
          onChange={(_, value) => setPoints(value as number)}
          min={range.min}
          max={range.max}
          valueLabelDisplay="auto"
          sx={{ flex: 1 }}
        />
        <Chip label={`${points} pt`} color="warning" size="small" />
        <Typography variant="caption" color="text.secondary">
          ({range.min}〜{range.max})
        </Typography>
      </Box>
    </Box>
  );
}
