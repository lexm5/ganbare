'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface AreaChartProps {
  data: { day: string; value: number }[];
  maxValue?: number;
  color?: string;
}

export default function AreaChart({ data, maxValue, color = 'primary.main' }: AreaChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  const chartHeight = 120;

  // SVGポイントを計算
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = chartHeight - (item.value / max) * chartHeight;
    return { x, y, value: item.value, day: item.day };
  });

  // エリアのパス（閉じた形）
  const areaPath = [
    `M 0 ${chartHeight}`,
    ...points.map((p, i) => `L ${p.x} ${p.y}`),
    `L 100 ${chartHeight}`,
    'Z'
  ].join(' ');

  // ラインのパス
  const linePath = points
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
          {/* グラデーション定義 */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1976d2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1976d2" stopOpacity="0.05" />
            </linearGradient>
          </defs>

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

          {/* エリア */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* ライン */}
          <path
            d={linePath}
            fill="none"
            stroke="#1976d2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ドット */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#1976d2"
            />
          ))}
        </svg>
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
