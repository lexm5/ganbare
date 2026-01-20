'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PageHeader from '@/components/common/PageHeader';
import PointSummary from '@/components/points/PointSummary';
import RewardList from '@/components/rewards/RewardList';
import RewardForm from '@/components/rewards/RewardForm';
import { Reward, PointStatus } from '@/types/point';

// サンプルデータ
const initialRewards: Reward[] = [
  { id: '1', name: '好きなスイーツ', description: 'コンビニで500円まで', cost: 30, redeemed: false },
  { id: '2', name: '30分ゲーム', description: '好きなゲームを30分', cost: 20, redeemed: false },
  { id: '3', name: 'カフェでコーヒー', description: 'お気に入りのカフェで一杯', cost: 50, redeemed: true, redeemedAt: '2024/01/20' },
  { id: '4', name: '映画を観る', description: '好きな映画を1本', cost: 100, redeemed: false },
  { id: '5', name: '1時間昼寝', description: '罪悪感なしの昼寝タイム', cost: 40, redeemed: false },
];

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [tab, setTab] = useState(0);
  const [pointStatus, setPointStatus] = useState<PointStatus>({
    totalEarned: 150,
    totalSpent: 50,
    currentPoints: 100,
  });

  const handleRedeem = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || reward.redeemed || pointStatus.currentPoints < reward.cost) return;

    setRewards(rewards.map(r =>
      r.id === id
        ? { ...r, redeemed: true, redeemedAt: new Date().toLocaleDateString('ja-JP') }
        : r
    ));
    setPointStatus(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + reward.cost,
      currentPoints: prev.currentPoints - reward.cost,
    }));
  };

  const handleAddReward = (reward: { name: string; description: string; cost: number }) => {
    setRewards([...rewards, {
      id: Date.now().toString(),
      ...reward,
      redeemed: false,
    }]);
  };

  const filteredRewards = tab === 0
    ? rewards.filter(r => !r.redeemed)
    : rewards.filter(r => r.redeemed);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="ご褒美"
        description="貯めたポイントでご褒美を手に入れよう"
      />

      <Grid container spacing={3}>
        {/* ポイント表示 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <PointSummary status={pointStatus} />
        </Grid>

        {/* ご褒美追加フォーム */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                新しいご褒美を追加
              </Typography>
              <RewardForm onSubmit={handleAddReward} />
            </CardContent>
          </Card>
        </Grid>

        {/* ご褒美一覧 */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                  <Tab label={`交換可能 (${rewards.filter(r => !r.redeemed).length})`} />
                  <Tab label={`使用済み (${rewards.filter(r => r.redeemed).length})`} />
                </Tabs>
              </Box>

              <RewardList
                rewards={filteredRewards}
                currentPoints={pointStatus.currentPoints}
                onRedeem={handleRedeem}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
