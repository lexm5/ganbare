'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Difficulty, POINT_RANGES } from '@/types/point';

interface PointInputProps {
  difficulty: Difficulty;
  value: number;
  onChange: (value: number) => void;
}

export default function PointInput({ difficulty, value, onChange }: PointInputProps) {
  const range = POINT_RANGES[difficulty];

  // 難易度が変わったら範囲内に収める
  useEffect(() => {
    if (value < range.min) onChange(range.min);
    if (value > range.max) onChange(range.max);
  }, [difficulty, value, range, onChange]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          ポイント設定
        </Typography>
        <Chip label={`${value} pt`} size="small" color="warning" />
      </Box>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={range.min}
        max={range.max}
        marks={[
          { value: range.min, label: `${range.min}` },
          { value: range.max, label: `${range.max}` },
        ]}
        valueLabelDisplay="auto"
      />
      <Typography variant="caption" color="text.secondary">
        {range.label}の難易度: {range.min}〜{range.max} pt
      </Typography>
    </Box>
  );
}
