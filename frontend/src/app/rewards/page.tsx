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
import Chip from '@mui/material/Chip';
import StarIcon from '@mui/icons-material/Star';
import PageHeader from '@/components/common/PageHeader';
import PointSummary from '@/components/points/PointSummary';
import ConfirmDialog from '@/components/common/ConfirmDialog';
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
  const [redeemTarget, setRedeemTarget] = useState<Reward | null>(null);
  const [pointStatus, setPointStatus] = useState<PointStatus>({
    totalEarned: 150,
    totalSpent: 50,
    currentPoints: 100,
  });

  const handleRedeem = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (!reward || reward.redeemed || pointStatus.currentPoints < reward.cost) return;
    setRedeemTarget(reward);
  };

  const handleConfirmRedeem = () => {
    if (!redeemTarget) return;

    setRewards(rewards.map(r =>
      r.id === redeemTarget.id
        ? { ...r, redeemed: true, redeemedAt: new Date().toLocaleDateString('ja-JP') }
        : r
    ));
    setPointStatus(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + redeemTarget.cost,
      currentPoints: prev.currentPoints - redeemTarget.cost,
    }));
    setRedeemTarget(null);
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

      {/* 交換確認ダイアログ */}
      <ConfirmDialog
        open={!!redeemTarget}
        title="ご褒美を交換しますか？"
        message="ポイントを使用してこのご褒美と交換します。この操作は取り消せません。"
        details={
          redeemTarget && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">ご褒美</Typography>
                <Typography variant="body2" fontWeight="bold">{redeemTarget.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">必要ポイント</Typography>
                <Chip icon={<StarIcon />} label={`${redeemTarget.cost} pt`} size="small" color="warning" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">交換後の残高</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {pointStatus.currentPoints - redeemTarget.cost} pt
                </Typography>
              </Box>
            </Box>
          )
        }
        confirmText="交換する"
        confirmColor="warning"
        onConfirm={handleConfirmRedeem}
        onCancel={() => setRedeemTarget(null)}
      />
    </Container>
  );
}
