'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RefreshIcon from '@mui/icons-material/Refresh';

const TIPS = [
  { title: 'ポモドーロ活用', text: '25分集中+5分休憩のサイクルで作業効率がアップします。タイマーページを活用しましょう。' },
  { title: 'タスクの分割', text: '大きなタスクは小さく分割すると取り組みやすくなります。難易度「簡単」から始めてみましょう。' },
  { title: '習慣の力', text: '毎日の小さな習慣が大きな成果につながります。まずは1つの習慣から始めてみましょう。' },
  { title: 'ストリークを意識', text: '連続記録を途切れさせないことがモチベーション維持のコツです。' },
  { title: 'ご褒美を設定', text: 'タスク完了でポイントを貯めて、自分へのご褒美と交換しましょう。やる気が続きます。' },
  { title: '朝の習慣', text: '朝に1つ習慣をこなすと、その日全体の生産性が上がると言われています。' },
  { title: '統計を振り返る', text: '週に1度、統計ページで自分の進捗を確認すると達成感が得られます。' },
  { title: '難易度を上げる', text: '簡単なタスクに慣れたら、中級・上級にチャレンジ。獲得ポイントも増えます。' },
  { title: '休憩も大切', text: '集中し続けるよりも、適度な休憩を挟む方が長期的にパフォーマンスが向上します。' },
  { title: 'バッジを目指す', text: 'バッジページで次に獲得できるバッジを確認して、目標にしてみましょう。' },
  { title: '2分ルール', text: '2分以内にできるタスクは、後回しにせずすぐやると効果的です。' },
  { title: '環境を整える', text: '作業環境を整えるだけで集中力が大幅にアップします。' },
];

function getRandomTips(count: number): typeof TIPS {
  const shuffled = [...TIPS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function TipsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tips, setTips] = React.useState(() => getRandomTips(3));
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    setTips(getRandomTips(3));
  };

  const menuId = 'tips-menu';

  return (
    <>
      <IconButton
        size="large"
        aria-label="ヒント・Tips"
        color="inherit"
        onClick={handleMenuOpen}
      >
        <LightbulbIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: { width: 320, maxHeight: 420 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Tips
          </Typography>
          <Button size="small" startIcon={<RefreshIcon />} onClick={handleRefresh}>
            更新
          </Button>
        </Box>
        <Divider />
        {tips.map((tip, index) => (
          <Box key={index} sx={{ px: 2, py: 1.5, '&:hover': { bgcolor: 'action.hover' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <LightbulbIcon fontSize="small" sx={{ color: '#ffc107' }} />
              <Typography variant="body2" fontWeight="bold">
                {tip.title}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ pl: 3.5, display: 'block' }}>
              {tip.text}
            </Typography>
          </Box>
        ))}
      </Menu>
    </>
  );
}
