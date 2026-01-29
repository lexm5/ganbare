'use client';

import { useState, useMemo, useCallback } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import ChartTypeSelector, { ChartType } from './ChartTypeSelector';
import PeriodSelector, { Period, DateRange } from './PeriodSelector';
import DataTypeSelector, { DataType } from './DataTypeSelector';
import dayjs, { Dayjs } from 'dayjs';

interface DataPoint {
  label: string;
  value: number;
  date?: string;
}

interface ChartDataSet {
  title: string;
  unit: string;
  data: Record<Period, DataPoint[]>;
  generateCustomData?: (startDate: Dayjs, endDate: Dayjs) => DataPoint[];
}

interface ChartCardProps {
  dataSets: Record<DataType, ChartDataSet>;
  defaultChartType?: ChartType;
  defaultPeriod?: Period;
  defaultDataType?: DataType;
}

export default function ChartCard({
  dataSets,
  defaultChartType = 'line',
  defaultPeriod = '1w',
  defaultDataType = 'tasks',
}: ChartCardProps) {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [dataType, setDataType] = useState<DataType>(defaultDataType);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().subtract(7, 'day'),
    endDate: dayjs(),
  });

  const currentDataSet = dataSets[dataType];

  // カスタム期間のデータ生成
  const currentData = useMemo(() => {
    if (period === 'custom' && currentDataSet.generateCustomData) {
      return currentDataSet.generateCustomData(dateRange.startDate, dateRange.endDate);
    }
    return currentDataSet.data[period] || [];
  }, [period, currentDataSet, dateRange]);

  // 統計情報を計算
  const stats = useMemo(() => {
    if (currentData.length === 0) return { avg: 0, max: 0, min: 0, total: 0 };
    const values = currentData.map((d) => d.value);
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values),
      min: Math.min(...values),
      total: values.reduce((a, b) => a + b, 0),
    };
  }, [currentData]);

  // Y軸の最大値を計算（最大値に応じて余裕を持たせる）
  const yAxisMax = useMemo(() => {
    if (stats.max <= 20) {
      return stats.max + 2;
    } else if (stats.max <= 100) {
      return stats.max + 10;
    } else {
      return Math.ceil(stats.max * 1.1);
    }
  }, [stats.max]);

  // MUI Charts用のデータ変換
  const xLabels = currentData.map((d) => d.label);
  const seriesData = currentData.map((d) => d.value);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  const renderChart = () => {
    const lineChartProps = {
      xAxis: [{
        scaleType: 'point' as const,
        data: xLabels,
        tickLabelStyle: { fontSize: 11 },
      }],
      yAxis: [{
        tickLabelStyle: { fontSize: 11 },
        min: 0,
        max: yAxisMax,
      }],
      margin: { top: 20, bottom: 30, left: 40, right: 20 },
    };

    const barChartProps = {
      xAxis: [{
        scaleType: 'band' as const,
        data: xLabels,
        tickLabelStyle: { fontSize: 11 },
      }],
      yAxis: [{
        tickLabelStyle: { fontSize: 11 },
        min: 0,
        max: yAxisMax,
      }],
      margin: { top: 20, bottom: 30, left: 40, right: 20 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart
            {...barChartProps}
            series={[{
              data: seriesData,
              color: '#1976d2',
            }]}
            hideLegend
          />
        );

      case 'area':
        return (
          <LineChart
            {...lineChartProps}
            series={[{
              data: seriesData,
              area: true,
              color: '#1976d2',
              showMark: false,
              curve: 'catmullRom',
            }]}
            hideLegend
          />
        );

      case 'line':
      default:
        return (
          <LineChart
            {...lineChartProps}
            series={[{
              data: seriesData,
              color: '#1976d2',
              showMark: false,
              curve: 'catmullRom',
            }]}
            hideLegend
          />
        );
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: '#fafafa',
        border: '1px solid #e0e0e0',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* ヘッダー */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
            mb: 1,
          }}
        >
          {/* 左：データ種別セレクター */}
          <DataTypeSelector value={dataType} onChange={setDataType} />

          {/* 右：期間とグラフタイプ */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <PeriodSelector
              value={period}
              onChange={setPeriod}
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            <ChartTypeSelector value={chartType} onChange={setChartType} />
          </Stack>
        </Box>

        {/* 統計サマリー */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {stats.total.toLocaleString()}
            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              {currentDataSet.unit}
            </Typography>
          </Typography>
          <Stack direction="row" spacing={3} sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              平均: <strong>{stats.avg.toLocaleString()}{currentDataSet.unit}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              最大: <strong>{stats.max.toLocaleString()}{currentDataSet.unit}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              最小: <strong>{stats.min.toLocaleString()}{currentDataSet.unit}</strong>
            </Typography>
          </Stack>
        </Box>

        {/* グラフ */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            bgcolor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: 1,
          }}
        >
          {renderChart()}
        </Box>
      </CardContent>
    </Card>
  );
}
