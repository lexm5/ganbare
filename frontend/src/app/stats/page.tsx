'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import ChartCard from '@/components/stats/ChartCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Period } from '@/components/stats/PeriodSelector';
import { DataType } from '@/components/stats/DataTypeSelector';
import dayjs, { Dayjs } from 'dayjs';

// サンプルデータ生成関数
const generateTaskData = (period: Period) => {
  const configs: Record<Exclude<Period, 'custom'>, { labels: string[] }> = {
    '1w': { labels: ['月', '火', '水', '木', '金', '土', '日'] },
    '2w': { labels: ['1/13', '1/14', '1/15', '1/16', '1/17', '1/18', '1/19', '1/20', '1/21', '1/22', '1/23', '1/24', '1/25', '1/26'] },
    '1m': { labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`) },
    '3m': { labels: ['11/1週', '11/2週', '11/3週', '11/4週', '12/1週', '12/2週', '12/3週', '12/4週', '1/1週', '1/2週', '1/3週', '1/4週'] },
  };
  if (period === 'custom') return [];
  return configs[period].labels.map((label, i) => ({
    label,
    value: Math.floor(Math.random() * 10) + 1,
    date: `2025年1月${i + 1}日`,
  }));
};

const generateTimeData = (period: Period) => {
  const configs: Record<Exclude<Period, 'custom'>, { labels: string[] }> = {
    '1w': { labels: ['月', '火', '水', '木', '金', '土', '日'] },
    '2w': { labels: ['1/13', '1/14', '1/15', '1/16', '1/17', '1/18', '1/19', '1/20', '1/21', '1/22', '1/23', '1/24', '1/25', '1/26'] },
    '1m': { labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`) },
    '3m': { labels: ['11/1週', '11/2週', '11/3週', '11/4週', '12/1週', '12/2週', '12/3週', '12/4週', '1/1週', '1/2週', '1/3週', '1/4週'] },
  };
  if (period === 'custom') return [];
  return configs[period].labels.map((label, i) => ({
    label,
    value: Math.floor(Math.random() * 120) + 30,
    date: `2025年1月${i + 1}日`,
  }));
};

// カスタム期間のデータ生成関数
const generateCustomTaskData = (startDate: Dayjs, endDate: Dayjs) => {
  const days = endDate.diff(startDate, 'day') + 1;
  const result = [];
  for (let i = 0; i < days; i++) {
    const date = startDate.add(i, 'day');
    result.push({
      label: date.format('M/D'),
      value: Math.floor(Math.random() * 10) + 1,
      date: date.format('YYYY年M月D日'),
    });
  }
  return result;
};

const generateCustomTimeData = (startDate: Dayjs, endDate: Dayjs) => {
  const days = endDate.diff(startDate, 'day') + 1;
  const result = [];
  for (let i = 0; i < days; i++) {
    const date = startDate.add(i, 'day');
    result.push({
      label: date.format('M/D'),
      value: Math.floor(Math.random() * 120) + 30,
      date: date.format('YYYY年M月D日'),
    });
  }
  return result;
};

const taskData: Record<Exclude<Period, 'custom'>, { label: string; value: number; date: string }[]> = {
  '1w': generateTaskData('1w'),
  '2w': generateTaskData('2w'),
  '1m': generateTaskData('1m'),
  '3m': generateTaskData('3m'),
};

const timeData: Record<Exclude<Period, 'custom'>, { label: string; value: number; date: string }[]> = {
  '1w': generateTimeData('1w'),
  '2w': generateTimeData('2w'),
  '1m': generateTimeData('1m'),
  '3m': generateTimeData('3m'),
};

const dataSets: Record<DataType, {
  title: string;
  unit: string;
  data: Record<Period, { label: string; value: number; date: string }[]>;
  generateCustomData: (startDate: Dayjs, endDate: Dayjs) => { label: string; value: number; date: string }[];
}> = {
  tasks: {
    title: 'タスク完了数',
    unit: '件',
    data: { ...taskData, custom: [] },
    generateCustomData: generateCustomTaskData,
  },
  time: {
    title: '集中時間',
    unit: '分',
    data: { ...timeData, custom: [] },
    generateCustomData: generateCustomTimeData,
  },
};

export default function StatsPage() {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        px: 3,
        py: 2,
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <Box sx={{ flexShrink: 0 }}>
        <PageHeader
          title="統計・分析"
          description="あなたの成長を数字で確認しよう"
        />
      </Box>

      {/* 概要カード */}
      <Grid container spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="今週のタスク"
            value="35"
            icon={<CheckCircleIcon />}
            color="success.main"
            subtitle="先週比 +12%"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="達成率"
            value="78%"
            icon={<TrendingUpIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="集中時間"
            value="10.5h"
            icon={<TimerIcon />}
            color="info.main"
            subtitle="今週"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            title="最長連続"
            value="14日"
            icon={<LocalFireDepartmentIcon />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* メイングラフ */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ChartCard
          dataSets={dataSets}
          defaultChartType="area"
          defaultPeriod="1w"
          defaultDataType="tasks"
        />
      </Box>
    </Box>
  );
}
