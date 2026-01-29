'use client';

import { useState } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';

export type Period = '1w' | '2w' | '1m' | '3m' | 'custom';

export interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
}

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
}

const periods: { value: Period; label: string }[] = [
  { value: '1w', label: '1週間' },
  { value: '2w', label: '2週間' },
  { value: '1m', label: '1ヶ月' },
  { value: '3m', label: '3ヶ月' },
  { value: 'custom', label: 'カスタム' },
];

export default function PeriodSelector({
  value,
  onChange,
  dateRange,
  onDateRangeChange,
}: PeriodSelectorProps) {
  const [localStartDate, setLocalStartDate] = useState<Dayjs>(
    dateRange?.startDate || dayjs().subtract(7, 'day')
  );
  const [localEndDate, setLocalEndDate] = useState<Dayjs>(
    dateRange?.endDate || dayjs()
  );

  const handleChange = (_: React.MouseEvent<HTMLElement>, newPeriod: Period | null) => {
    if (newPeriod !== null) {
      onChange(newPeriod);
    }
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setLocalStartDate(newValue);
      onDateRangeChange?.({ startDate: newValue, endDate: localEndDate });
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setLocalEndDate(newValue);
      onDateRangeChange?.({ startDate: localStartDate, endDate: newValue });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={handleChange}
          size="small"
          aria-label="期間選択"
          sx={{
            '& .MuiToggleButton-root': {
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              textTransform: 'none',
            },
          }}
        >
          {periods.map((p) => (
            <ToggleButton key={p.value} value={p.value}>
              {p.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {value === 'custom' && (
          <Stack direction="row" spacing={1} alignItems="center">
            <DatePicker
              label="開始日"
              value={localStartDate}
              onChange={handleStartDateChange}
              maxDate={localEndDate}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: 150 },
                },
              }}
            />
            <Box sx={{ color: 'text.secondary' }}>〜</Box>
            <DatePicker
              label="終了日"
              value={localEndDate}
              onChange={handleEndDateChange}
              minDate={localStartDate}
              maxDate={dayjs()}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { width: 150 },
                },
              }}
            />
          </Stack>
        )}
      </Stack>
    </LocalizationProvider>
  );
}
