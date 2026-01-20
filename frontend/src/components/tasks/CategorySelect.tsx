'use client';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Category } from '@/types/task';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  size?: 'small' | 'medium';
}

export default function CategorySelect({ categories, value, onChange, size = 'small' }: CategorySelectProps) {
  return (
    <FormControl size={size} sx={{ minWidth: 120 }}>
      <InputLabel>カテゴリ</InputLabel>
      <Select
        value={value}
        label="カテゴリ"
        onChange={(e) => onChange(e.target.value)}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: cat.color,
                }}
              />
              {cat.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
