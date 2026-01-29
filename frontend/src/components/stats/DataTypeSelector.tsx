'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';

export type DataType = 'tasks' | 'time';

interface DataTypeSelectorProps {
  value: DataType;
  onChange: (type: DataType) => void;
}

export default function DataTypeSelector({ value, onChange }: DataTypeSelectorProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newType: DataType | null) => {
    if (newType !== null) {
      onChange(newType);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      aria-label="データ種別"
      sx={{
        '& .MuiToggleButton-root': {
          px: 2,
          py: 0.75,
          gap: 0.5,
        },
      }}
    >
      <ToggleButton value="tasks">
        <CheckCircleOutlineIcon fontSize="small" />
        タスク完了数
      </ToggleButton>
      <ToggleButton value="time">
        <TimerOutlinedIcon fontSize="small" />
        集中時間
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
