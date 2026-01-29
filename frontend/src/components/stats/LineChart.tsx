'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface LineChartProps {
  data: { day: string; value: number }[];
  maxValue?: number;
  color?: string;
}

export default function LineChart({ data, maxValue, color = 'primary.main' }: LineChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  const chartHeight = 120;
  const chartWidth = 100; // percentage

  // SVGポイントを計算
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = chartHeight - (item.value / max) * chartHeight;
    return { x, y, value: item.value, day: item.day };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box sx={{ position: 'relative', height: chartHeight, mb: 1 }}>
        <svg
          viewBox={`0 0 100 ${chartHeight}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {/* グリッド線 */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={chartHeight * ratio}
              x2="100"
              y2={chartHeight * ratio}
              stroke="#e0e0e0"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* ライン */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--line-color)' }}
          />

          {/* ドット */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="currentColor"
              style={{ color: 'var(--line-color)' }}
            />
          ))}
        </svg>
        <style jsx>{`
          svg {
            --line-color: #1976d2;
          }
        `}</style>
      </Box>

      {/* X軸ラベルと値 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 0 }}>
        {data.map((item, index) => (
          <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="caption" fontWeight="bold" display="block">
              {item.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.day}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
