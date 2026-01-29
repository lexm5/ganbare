'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CelebrationIcon from '@mui/icons-material/Celebration';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface LoginBonusDialogProps {
  open: boolean;
  bonusPoints: number;
  streakDays: number;
  isWeeklyBonus: boolean;
  onClaim: () => void;
}

export default function LoginBonusDialog({
  open,
  bonusPoints,
  streakDays,
  isWeeklyBonus,
  onClaim,
}: LoginBonusDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'visible',
        },
      }}
    >
      <DialogContent sx={{ textAlign: 'center', py: 5, px: 4 }}>
        {/* アイコン */}
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: isWeeklyBonus ? 'secondary.main' : 'warning.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: isWeeklyBonus
              ? '0 8px 32px rgba(156, 39, 176, 0.4)'
              : '0 8px 32px rgba(255, 167, 38, 0.4)',
            animation: 'bounce 1s ease infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        >
          {isWeeklyBonus ? (
            <CelebrationIcon sx={{ fontSize: 50, color: 'white' }} />
          ) : (
            <CardGiftcardIcon sx={{ fontSize: 50, color: 'white' }} />
          )}
        </Box>

        {/* タイトル */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 1,
            background: isWeeklyBonus
              ? 'linear-gradient(45deg, #9C27B0, #E040FB)'
              : 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {isWeeklyBonus ? '1週間達成!' : 'ログインボーナス!'}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {isWeeklyBonus
            ? '7日連続ログインおめでとう!'
            : '今日も来てくれてありがとう!'}
        </Typography>

        {/* 連続ログイン日数 */}
        <Chip
          icon={<LocalFireDepartmentIcon />}
          label={`${streakDays}日連続ログイン`}
          color={isWeeklyBonus ? 'secondary' : 'error'}
          sx={{ mb: 3, fontWeight: 'bold', fontSize: '0.9rem' }}
        />

        {/* ポイント表示 */}
        <Box sx={{ mb: 4 }}>
          {isWeeklyBonus ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'warning.light',
                  color: 'warning.dark',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                <StarIcon sx={{ fontSize: 24 }} />
                <Typography variant="h5" fontWeight="bold">
                  +1 pt
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  (デイリー)
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'secondary.light',
                  color: 'secondary.dark',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                <CelebrationIcon sx={{ fontSize: 28 }} />
                <Typography variant="h4" fontWeight="bold">
                  +5 pt
                </Typography>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  (週間ボーナス)
                </Typography>
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                合計: <strong>+{bonusPoints} pt</strong>
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'warning.light',
                color: 'warning.dark',
                px: 4,
                py: 2,
                borderRadius: 3,
              }}
            >
              <StarIcon sx={{ fontSize: 32 }} />
              <Typography variant="h3" fontWeight="bold">
                +{bonusPoints}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                pt
              </Typography>
            </Box>
          )}
        </Box>

        {/* 受け取るボタン */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onClaim}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            background: isWeeklyBonus
              ? 'linear-gradient(45deg, #9C27B0, #E040FB)'
              : 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
            boxShadow: isWeeklyBonus
              ? '0 4px 20px rgba(156, 39, 176, 0.4)'
              : '0 4px 20px rgba(255, 107, 107, 0.4)',
            '&:hover': {
              background: isWeeklyBonus
                ? 'linear-gradient(45deg, #7B1FA2, #CE93D8)'
                : 'linear-gradient(45deg, #FF5252, #FF7043)',
            },
          }}
        >
          受け取る
        </Button>
      </DialogContent>
    </Dialog>
  );
}
