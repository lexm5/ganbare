'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '@/types/task';

const PRESET_COLORS = ['#1976d2', '#9c27b0', '#4caf50', '#ff9800', '#f44336', '#00bcd4', '#795548', '#607d8b'];

interface CategoryManagerProps {
  categories: Category[];
  onAdd: (category: Omit<Category, 'id'>) => void;
  onDelete: (id: string) => void;
}

export default function CategoryManager({ categories, onAdd, onDelete }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd({ name: name.trim(), color });
      setName('');
      setColor(PRESET_COLORS[0]);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        カテゴリ管理
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>カテゴリ管理</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              label="カテゴリ名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {PRESET_COLORS.map((c) => (
                <Box
                  key={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: c,
                    cursor: 'pointer',
                    border: color === c ? '3px solid' : '2px solid transparent',
                    borderColor: color === c ? 'text.primary' : 'transparent',
                  }}
                />
              ))}
            </Box>
            <Button variant="contained" size="small" onClick={handleAdd} disabled={!name.trim()}>
              追加
            </Button>
          </Box>

          <List dense>
            {categories.map((cat) => (
              <ListItem
                key={cat.id}
                secondaryAction={
                  !cat.isDefault && (
                    <IconButton size="small" onClick={() => onDelete(cat.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )
                }
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: cat.color,
                    mr: 2,
                  }}
                />
                <ListItemText
                  primary={cat.name}
                  secondary={cat.isDefault ? 'デフォルト' : ''}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
