'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';

interface TaskFormProps {
  onSubmit?: (task: { title: string; priority: string }) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit?.({ title: title.trim(), priority });
      setTitle('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField
        placeholder="新しいタスクを入力..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
        sx={{ flex: 1 }}
      />
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>優先度</InputLabel>
        <Select
          value={priority}
          label="優先度"
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="low">低</MenuItem>
          <MenuItem value="medium">中</MenuItem>
          <MenuItem value="high">高</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" startIcon={<AddIcon />}>
        追加
      </Button>
    </Box>
  );
}
