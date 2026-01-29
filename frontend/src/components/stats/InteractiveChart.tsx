'use client';

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { ChartType } from './ChartTypeSelector';

interface DataPoint {
  label: string;
  value: number;
  date?: string;
}

interface InteractiveChartProps {
  data: DataPoint[];
  chartType: ChartType;
  unit?: string;
  maxValue?: number;
}

export default function InteractiveChart({
  data,
  chartType,
  unit = '',
  maxValue,
}: InteractiveChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 70;
  const paddingLeft = 3;
  const paddingRight = 3;
  const paddingTop = 8;
  const paddingBottom = 10;

  // Y軸の目盛りを計算
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(max * (1 - ratio)),
    y: paddingTop + chartHeight * ratio,
  }));

  // ポイント座標を計算
  const points = data.map((item, index) => {
    const chartWidth = 100 - paddingLeft - paddingRight;
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (item.value / max) * chartHeight;
    return { ...item, x, y, index };
  });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;

    // 最も近いポイントを見つける
    let closestIndex = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    if (closestDist < 10) {
      setHoveredIndex(closestIndex);
      setTooltipPos({
        x: (points[closestIndex].x / 100) * rect.width,
        y: (points[closestIndex].y / (chartHeight + paddingTop + paddingBottom)) * rect.height,
      });
    } else {
      setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // パスを生成
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const areaPath = [
    `M ${paddingLeft} ${paddingTop + chartHeight}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${100 - paddingRight} ${paddingTop + chartHeight}`,
    'Z',
  ].join(' ');

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        const barWidth = (100 - paddingLeft - paddingRight) / data.length - 4;
        return (
          <>
            {points.map((p, i) => (
              <rect
                key={i}
                x={p.x - barWidth / 2}
                y={p.y}
                width={barWidth}
                height={paddingTop + chartHeight - p.y}
                fill={hoveredIndex === i ? '#1565c0' : '#1976d2'}
                rx="2"
                style={{ transition: 'fill 0.15s' }}
              />
            ))}
          </>
        );

      case 'area':
        return (
          <>
            <defs>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1976d2" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1976d2" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke="#1976d2" strokeWidth="2" />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                fill={hoveredIndex === i ? '#1565c0' : '#1976d2'}
                stroke="#fff"
                strokeWidth="2"
                style={{ transition: 'r 0.15s' }}
              />
            ))}
          </>
        );

      case 'line':
      default:
        return (
          <>
            <path d={linePath} fill="none" stroke="#1976d2" strokeWidth="2" />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? 6 : 4}
                fill={hoveredIndex === i ? '#1565c0' : '#1976d2'}
                stroke="#fff"
                strokeWidth="2"
                style={{ transition: 'r 0.15s' }}
              />
            ))}
          </>
        );
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox={`0 0 100 ${chartHeight + paddingTop + paddingBottom}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* 背景グリッド（横線のみ） */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={paddingLeft}
            y1={tick.y}
            x2={100 - paddingRight}
            y2={tick.y}
            stroke="#e8e8e8"
            strokeWidth="0.3"
          />
        ))}

        {/* グラフ本体 */}
        {renderChart()}

        {/* ホバー時の縦線 */}
        {hoveredIndex !== null && (
          <line
            x1={points[hoveredIndex].x}
            y1={paddingTop}
            x2={points[hoveredIndex].x}
            y2={paddingTop + chartHeight}
            stroke="#1976d2"
            strokeWidth="0.5"
            strokeDasharray="2,1"
          />
        )}

        {/* X軸ラベル（データが多い場合は間引く） */}
        {points.map((p, i) => {
          const showLabel = data.length <= 14 || i % Math.ceil(data.length / 10) === 0;
          if (!showLabel) return null;
          return (
            <text
              key={i}
              x={p.x}
              y={paddingTop + chartHeight + 10}
              textAnchor="middle"
              fontSize="3.5"
              fill={hoveredIndex === i ? '#1976d2' : '#888'}
              fontWeight={hoveredIndex === i ? 'bold' : 'normal'}
            >
              {p.label}
            </text>
          );
        })}
      </svg>

      {/* ツールチップ */}
      {hoveredIndex !== null && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            left: tooltipPos.x,
            top: Math.max(tooltipPos.y - 60, 10),
            transform: 'translateX(-50%)',
            px: 1.5,
            py: 1,
            pointerEvents: 'none',
            zIndex: 10,
            bgcolor: 'rgba(30, 30, 30, 0.95)',
            color: '#fff',
            minWidth: 100,
          }}
        >
          <Typography variant="caption" display="block" sx={{ color: '#aaa', mb: 0.5 }}>
            {data[hoveredIndex].date || data[hoveredIndex].label}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {data[hoveredIndex].value.toLocaleString()}
            {unit && <span style={{ marginLeft: 4, fontWeight: 'normal' }}>{unit}</span>}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
