'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

interface HabitCalendarProps {
  /** 全習慣の completionHistory を統合した日付配列 */
  completionDates: string[];
  /** 習慣の総数（達成率の計算に使用） */
  totalHabits: number;
}

function getDaysArray(weeks: number): { date: string; dayOfWeek: number }[] {
  const days: { date: string; dayOfWeek: number }[] = [];
  const today = new Date();
  const totalDays = weeks * 7;

  // 今日の曜日を取得し、今週の日曜日を起点にする
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isFuture = d > today;
    if (!isFuture) {
      days.push({ date: dateStr, dayOfWeek: d.getDay() });
    }
  }

  return days;
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export default function HabitCalendar({ completionDates, totalHabits }: HabitCalendarProps) {
  const weeks = 12; // 12週間 = 約3ヶ月

  const days = useMemo(() => getDaysArray(weeks), [weeks]);

  // 日付ごとの達成数をカウント
  const dateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    completionDates.forEach(date => {
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  }, [completionDates]);

  // 色の強度を計算
  const getColor = (date: string): string => {
    const count = dateCounts[date] || 0;
    if (count === 0) return '#ebedf0';
    const ratio = totalHabits > 0 ? count / totalHabits : 0;
    if (ratio >= 1) return '#216e39';
    if (ratio >= 0.75) return '#30a14e';
    if (ratio >= 0.5) return '#40c463';
    if (ratio >= 0.25) return '#9be9a8';
    return '#9be9a8';
  };

  // 週ごとにグループ化
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

  // 月ラベルの表示位置
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

  const totalDaysTracked = days.length;
  const activeDays = Object.keys(dateCounts).filter(d => days.some(day => day.date === d)).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          達成カレンダー
        </Typography>
        <Typography variant="body2" color="text.secondary">
          過去{weeks}週間: {activeDays}日 / {totalDaysTracked}日 達成
        </Typography>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        {/* 月ラベル */}
        <Box sx={{ display: 'flex', ml: '32px', mb: 0.5 }}>
          {monthLabels.map((ml, i) => (
            <Typography
              key={i}
              variant="caption"
              color="text.secondary"
              sx={{
                position: 'relative',
                left: ml.weekIndex * 15,
                fontSize: '0.7rem',
              }}
            >
              {ml.label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: '1px' }}>
          {/* 曜日ラベル */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mr: '4px', justifyContent: 'flex-start' }}>
            {[0, 1, 2, 3, 4, 5, 6].map(dow => (
              <Typography
                key={dow}
                variant="caption"
                color="text.secondary"
                sx={{
                  width: 24,
                  height: 13,
                  lineHeight: '13px',
                  fontSize: '0.6rem',
                  textAlign: 'right',
                  pr: 0.5,
                  visibility: dow % 2 === 1 ? 'visible' : 'hidden',
                }}
              >
                {DAY_LABELS[dow]}
              </Typography>
            ))}
          </Box>

          {/* カレンダーグリッド */}
          {weekColumns.map((week, weekIndex) => (
            <Box key={weekIndex} sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {/* 先頭の週で曜日が途中から始まる場合のパディング */}
              {weekIndex === 0 && week[0] && week[0].dayOfWeek > 0 && (
                Array.from({ length: week[0].dayOfWeek }).map((_, i) => (
                  <Box key={`pad-${i}`} sx={{ width: 13, height: 13 }} />
                ))
              )}
              {week.map(day => {
                const count = dateCounts[day.date] || 0;
                const dateObj = new Date(day.date);
                const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}: ${count}/${totalHabits} 達成`;
                return (
                  <Tooltip key={day.date} title={label} arrow>
                    <Box
                      sx={{
                        width: 13,
                        height: 13,
                        borderRadius: '2px',
                        bgcolor: getColor(day.date),
                        cursor: 'default',
                        '&:hover': {
                          outline: '1px solid',
                          outlineColor: 'text.primary',
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
