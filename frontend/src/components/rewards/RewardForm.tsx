'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

interface RewardFormProps {
  onSubmit?: (reward: { name: string; description: string; cost: number }) => void;
}

export default function RewardForm({ onSubmit }: RewardFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit?.({ name: name.trim(), description: description.trim(), cost });
      setName('');
      setDescription('');
      setCost(10);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="ご褒美の名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
        fullWidth
        placeholder="例: 好きなスイーツを買う"
      />
      <TextField
        label="説明（任意）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        size="small"
        fullWidth
        placeholder="例: コンビニで500円まで"
      />
      <TextField
        label="必要ポイント"
        type="number"
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
        size="small"
        inputProps={{ min: 1 }}
        sx={{ width: 150 }}
      />
      <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ alignSelf: 'flex-start' }}>
        追加
      </Button>
    </Box>
  );
}
