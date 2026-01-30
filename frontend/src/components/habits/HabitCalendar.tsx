'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatshotIcon from '@mui/icons-material/Whatshot';

interface HabitCalendarProps {
  completionDates: string[];
  totalHabits: number;
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function HabitCalendar({ completionDates, totalHabits }: HabitCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const dateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    completionDates.forEach(date => {
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [completionDates]);

  const { firstDay, daysInMonth } = getMonthDays(viewYear, viewMonth);

  const handlePrev = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNext = () => {
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    if (isCurrentMonth) return;
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  // 統計
  const monthDates = Array.from({ length: daysInMonth }, (_, i) => formatDate(viewYear, viewMonth, i + 1));
  const activeDays = monthDates.filter(d => (dateCounts[d] || 0) > 0).length;
  const perfectDays = monthDates.filter(d => (dateCounts[d] || 0) >= totalHabits && totalHabits > 0).length;
  const pastDays = monthDates.filter(d => d <= todayStr).length;
  const rate = pastDays > 0 ? Math.round((activeDays / pastDays) * 100) : 0;

  return (
    <Box>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          達成カレンダー
        </Typography>
      </Box>

      {/* 月ナビゲーション */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 1 }}>
        <IconButton onClick={handlePrev} size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 120, textAlign: 'center' }}>
          {viewYear}年 {viewMonth + 1}月
        </Typography>
        <IconButton onClick={handleNext} size="small" disabled={isCurrentMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* 曜日ヘッダー */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5 }}>
        {DAY_LABELS.map((label, i) => (
          <Typography
            key={label}
            variant="caption"
            fontWeight="bold"
            color={i === 0 ? 'error.main' : i === 6 ? 'primary.main' : 'text.secondary'}
            sx={{ textAlign: 'center', py: 0.5 }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* カレンダーグリッド */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {/* 空セル（月初の曜日オフセット） */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <Box key={`empty-${i}`} sx={{ aspectRatio: '1', minHeight: 36 }} />
        ))}

        {/* 日付セル */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(viewYear, viewMonth, day);
          const count = dateCounts[dateStr] || 0;
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;
          const isPerfect = count >= totalHabits && totalHabits > 0;
          const isPartial = count > 0 && !isPerfect;
          const dow = (firstDay + i) % 7;

          const tooltipText = isFuture
            ? ''
            : count > 0
              ? `${viewMonth + 1}/${day}: ${count}/${totalHabits} 達成${isPerfect ? ' (全達成!)' : ''}`
              : `${viewMonth + 1}/${day}: 未達成`;

          return (
            <Tooltip key={day} title={tooltipText} arrow disableHoverListener={isFuture}>
              <Box
                sx={{
                  aspectRatio: '1',
                  minHeight: 36,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  position: 'relative',
                  cursor: isFuture ? 'default' : 'pointer',
                  opacity: isFuture ? 0.3 : 1,
                  bgcolor: isToday
                    ? 'primary.50'
                    : isPerfect
                      ? 'success.50'
                      : 'transparent',
                  border: isToday ? '2px solid' : '1px solid',
                  borderColor: isToday
                    ? 'primary.main'
                    : isPerfect
                      ? 'success.main'
                      : 'divider',
                  transition: 'all 0.15s',
                  '&:hover': isFuture ? {} : {
                    bgcolor: 'action.hover',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={isToday ? 'bold' : 'normal'}
                  color={
                    dow === 0 ? 'error.main' : dow === 6 ? 'primary.main' : 'text.primary'
                  }
                  sx={{ fontSize: '0.85rem', lineHeight: 1 }}
                >
                  {day}
                </Typography>

                {/* 達成マーク */}
                {isPerfect && (
                  <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main', mt: 0.25 }} />
                )}
                {isPartial && (
                  <Box sx={{ display: 'flex', gap: '2px', mt: 0.25 }}>
                    {Array.from({ length: Math.min(count, 4) }).map((_, j) => (
                      <Box
                        key={j}
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* 統計 */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`達成率 ${rate}%`}
          size="small"
          color={rate >= 80 ? 'success' : rate >= 50 ? 'warning' : 'default'}
          variant="outlined"
        />
        <Chip
          label={`${activeDays}日 / ${pastDays}日`}
          size="small"
          variant="outlined"
        />
        {totalHabits > 0 && (
          <Chip
            icon={<WhatshotIcon />}
            label={`全達成 ${perfectDays}日`}
            size="small"
            color="error"
            variant="outlined"
          />
        )}
      </Box>

      {/* 凡例 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">全達成</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="caption" color="text.secondary">一部達成</Typography>
        </Box>
      </Box>
    </Box>
  );
}
