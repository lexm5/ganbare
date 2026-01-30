'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface HabitCalendarProps {
  completionDates: string[];
  totalHabits: number;
}

type Period = '1w' | '1m' | '3m' | '6m';

const PERIOD_CONFIG: Record<Period, { label: string; weeks: number; description: string }> = {
  '1w': { label: '1週間', weeks: 1, description: '過去1週間' },
  '1m': { label: '1ヶ月', weeks: 5, description: '過去1ヶ月' },
  '3m': { label: '3ヶ月', weeks: 13, description: '過去3ヶ月' },
  '6m': { label: '6ヶ月', weeks: 26, description: '過去6ヶ月' },
};

function getDaysArray(weeks: number): { date: string; dayOfWeek: number }[] {
  const days: { date: string; dayOfWeek: number }[] = [];
  const today = new Date();
  const totalDays = weeks * 7;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    if (d <= today) {
      days.push({ date: dateStr, dayOfWeek: d.getDay() });
    }
  }

  return days;
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default function HabitCalendar({ completionDates, totalHabits }: HabitCalendarProps) {
  const [period, setPeriod] = useState<Period>('1m');
  const config = PERIOD_CONFIG[period];

  const days = useMemo(() => getDaysArray(config.weeks), [config.weeks]);

  const dateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    completionDates.forEach(date => {
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [completionDates]);

  const getColor = (date: string): string => {
    const count = dateCounts[date] || 0;
    if (count === 0) return '#ebedf0';
    const ratio = totalHabits > 0 ? count / totalHabits : 0;
    if (ratio >= 1) return '#216e39';
    if (ratio >= 0.75) return '#30a14e';
    if (ratio >= 0.5) return '#40c463';
    return '#9be9a8';
  };

  const weekColumns = useMemo(() => {
    const columns: { date: string; dayOfWeek: number }[][] = [];
    let currentWeek: { date: string; dayOfWeek: number }[] = [];

    days.forEach((day, i) => {
      currentWeek.push(day);
      if (day.dayOfWeek === 6 || i === days.length - 1) {
        columns.push(currentWeek);
        currentWeek = [];
      }
    });

    return columns;
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weekColumns.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ label: MONTH_LABELS[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weekColumns]);

  // 統計
  const totalDaysTracked = days.length;
  const activeDays = days.filter(d => (dateCounts[d.date] || 0) > 0).length;
  const perfectDays = days.filter(d => (dateCounts[d.date] || 0) >= totalHabits && totalHabits > 0).length;
  const achievementRate = totalDaysTracked > 0 ? Math.round((activeDays / totalDaysTracked) * 100) : 0;

  // セルサイズ（期間が短い場合は大きく）
  const cellSize = period === '1w' ? 28 : period === '1m' ? 18 : 13;
  const cellGap = period === '1w' ? '3px' : period === '1m' ? '2px' : '1px';
  const cellRadius = period === '1w' ? '4px' : '2px';

  return (
    <Box>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            達成カレンダー
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, v) => { if (v) setPeriod(v); }}
          size="small"
        >
          {(Object.keys(PERIOD_CONFIG) as Period[]).map(p => (
            <ToggleButton key={p} value={p} sx={{ px: 1.5, py: 0.5, textTransform: 'none', fontSize: '0.8rem' }}>
              {PERIOD_CONFIG[p].label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* 統計チップ */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`達成率 ${achievementRate}%`}
          size="small"
          color={achievementRate >= 80 ? 'success' : achievementRate >= 50 ? 'warning' : 'default'}
          variant="outlined"
        />
        <Chip
          label={`${activeDays}日 / ${totalDaysTracked}日 達成`}
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

      <Box sx={{ overflowX: 'auto' }}>
        {/* 月ラベル（1週間の場合は非表示） */}
        {period !== '1w' && (
          <Box sx={{ display: 'flex', ml: '32px', mb: 0.5 }}>
            {monthLabels.map((ml, i) => (
              <Typography
                key={i}
                variant="caption"
                color="text.secondary"
                sx={{
                  position: 'relative',
                  left: ml.weekIndex * (cellSize + parseInt(cellGap)),
                  fontSize: '0.7rem',
                }}
              >
                {ml.label}
              </Typography>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: cellGap }}>
          {/* 曜日ラベル */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: cellGap, mr: '4px' }}>
            {[0, 1, 2, 3, 4, 5, 6].map(dow => (
              <Typography
                key={dow}
                variant="caption"
                color="text.secondary"
                sx={{
                  width: 24,
                  height: cellSize,
                  lineHeight: `${cellSize}px`,
                  fontSize: period === '1w' ? '0.75rem' : '0.6rem',
                  textAlign: 'right',
                  pr: 0.5,
                  visibility: period === '1w' ? 'visible' : (dow % 2 === 1 ? 'visible' : 'hidden'),
                }}
              >
                {DAY_LABELS[dow]}
              </Typography>
            ))}
          </Box>

          {/* カレンダーグリッド */}
          {weekColumns.map((week, weekIndex) => (
            <Box key={weekIndex} sx={{ display: 'flex', flexDirection: 'column', gap: cellGap }}>
              {weekIndex === 0 && week[0] && week[0].dayOfWeek > 0 && (
                Array.from({ length: week[0].dayOfWeek }).map((_, i) => (
                  <Box key={`pad-${i}`} sx={{ width: cellSize, height: cellSize }} />
                ))
              )}
              {week.map(day => {
                const count = dateCounts[day.date] || 0;
                const dateObj = new Date(day.date);
                const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}（${DAY_LABELS[day.dayOfWeek]}）: ${count}/${totalHabits} 達成`;
                return (
                  <Tooltip key={day.date} title={label} arrow>
                    <Box
                      sx={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: cellRadius,
                        bgcolor: getColor(day.date),
                        cursor: 'default',
                        transition: 'transform 0.1s',
                        '&:hover': {
                          outline: '1px solid',
                          outlineColor: 'text.primary',
                          transform: 'scale(1.2)',
                        },
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* 凡例 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1.5, gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            少ない
          </Typography>
          {['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'].map(color => (
            <Box
              key={color}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '2px',
                bgcolor: color,
              }}
            />
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            多い
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
