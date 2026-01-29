'use client';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AreaChartIcon from '@mui/icons-material/StackedLineChart';

export type ChartType = 'bar' | 'line' | 'area';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export default function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newType: ChartType | null) => {
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
      aria-label="グラフタイプ"
    >
      <ToggleButton value="bar" aria-label="棒グラフ">
        <Tooltip title="棒グラフ">
          <BarChartIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="line" aria-label="折れ線グラフ">
        <Tooltip title="折れ線グラフ">
          <ShowChartIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="area" aria-label="エリアグラフ">
        <Tooltip title="エリアグラフ">
          <AreaChartIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
