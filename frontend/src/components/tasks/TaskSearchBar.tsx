'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

interface TaskSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onCreateClick: () => void;
  resultCount: number;
}

export default function TaskSearchBar({ value, onChange, onCreateClick, resultCount }: TaskSearchBarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        mb: 3,
      }}
    >
      {/* 検索フィールド */}
      <TextField
        placeholder="タスクを検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'grey.50',
            '&:hover': {
              bgcolor: 'grey.100',
            },
            '&.Mui-focused': {
              bgcolor: 'background.paper',
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* 件数表示 */}
      <Box
        sx={{
          color: 'text.secondary',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        {resultCount} 件
      </Box>

      {/* 作成ボタン */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateClick}
        sx={{
          whiteSpace: 'nowrap',
          px: 3,
        }}
      >
        作成
      </Button>
    </Box>
  );
}
