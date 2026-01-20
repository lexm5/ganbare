'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PageHeader from '@/components/common/PageHeader';
import BadgeCard from '@/components/badges/BadgeCard';
import LevelProgress from '@/components/badges/LevelProgress';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// サンプルデータ
const badges = [
  {
    id: '1',
    name: '初めの一歩',
    description: '最初のタスクを完了',
    icon: <RocketLaunchIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
    unlocked: true,
    unlockedAt: '2024/01/15',
  },
  {
    id: '2',
    name: '7日連続',
    description: '7日間連続でタスクを完了',
    icon: <LocalFireDepartmentIcon sx={{ fontSize: 32, color: 'error.main' }} />,
    unlocked: true,
    unlockedAt: '2024/01/20',
  },
  {
    id: '3',
    name: '早起きマスター',
    description: '朝6時前に5回ログイン',
    icon: <WbSunnyIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
    unlocked: true,
    unlockedAt: '2024/01/22',
  },
  {
    id: '4',
    name: '集中の達人',
    description: 'ポモドーロを10回完了',
    icon: <StarIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    unlocked: false,
  },
  {
    id: '5',
    name: '習慣の力',
    description: '30日間連続で習慣を達成',
    icon: <AutoAwesomeIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
    unlocked: false,
  },
  {
    id: '6',
    name: 'チャンピオン',
    description: '全てのバッジを獲得',
    icon: <EmojiEventsIcon sx={{ fontSize: 32, color: 'warning.main' }} />,
    unlocked: false,
  },
];

export default function BadgesPage() {
  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="バッジ・実績"
        description="あなたの成果を称えよう"
      />

      <Grid container spacing={3}>
        {/* レベル */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <LevelProgress level={5} currentXP={350} requiredXP={500} />
            </CardContent>
          </Card>
        </Grid>

        {/* 獲得状況 */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            獲得バッジ ({unlockedCount} / {badges.length})
          </Typography>
        </Grid>

        {/* バッジ一覧 */}
        {badges.map((badge) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={badge.id}>
            <BadgeCard badge={badge} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
