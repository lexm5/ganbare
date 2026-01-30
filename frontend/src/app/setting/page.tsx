'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CampaignIcon from '@mui/icons-material/Campaign';
import KeyIcon from '@mui/icons-material/Key';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StorageIcon from '@mui/icons-material/Storage';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useThemeMode } from '@/context/ThemeContext';

type SettingSection = 'profile' | 'theme' | 'notification' | 'account' | 'data';

export default function SettingPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notifications, setNotifications] = useLocalStorage('app_notification_settings', {
    email: true,
    push: true,
    marketing: false,
  });
  const [profile, setProfile] = useLocalStorage('app_profile', {
    name: 'ユーザー名',
    email: 'user@example.com',
    bio: '',
  });

  const handleNotificationChange = (name: string) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = () => {
    setSnackbarOpen(true);
  };

  const menuItems = [
    { id: 'profile' as const, label: 'プロフィール', icon: <PersonIcon />, description: '名前やアバターの設定' },
    { id: 'theme' as const, label: 'テーマ', icon: <PaletteIcon />, description: '表示モードの切り替え' },
    { id: 'notification' as const, label: '通知', icon: <NotificationsIcon />, description: '通知の受信設定' },
    { id: 'account' as const, label: 'アカウント', icon: <SecurityIcon />, description: 'セキュリティと認証' },
    { id: 'data' as const, label: 'データ管理', icon: <StorageIcon />, description: 'エクスポート・インポート' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              プロフィール設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              あなたの公開プロフィール情報を管理します
            </Typography>

            {/* アバターセクション */}
            <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                    {profile.name.charAt(0)}
                  </Avatar>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                      border: '2px solid',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    <CameraAltIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    プロフィール画像
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    JPG, PNG, GIF (最大 5MB)
                  </Typography>
                  <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                    画像を変更
                  </Button>
                </Box>
              </Box>
            </Card>

            {/* 基本情報 */}
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 3 }}>
                基本情報
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="表示名"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  fullWidth
                  helperText="他のユーザーに表示される名前です"
                />
                <TextField
                  label="メールアドレス"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip
                          size="small"
                          icon={<CheckCircleIcon />}
                          label="認証済み"
                          color="success"
                          variant="outlined"
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="自己紹介"
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="あなたについて教えてください..."
                  helperText="最大200文字"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined">キャンセル</Button>
                  <Button variant="contained" onClick={handleSave}>
                    変更を保存
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        );

      case 'theme':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              テーマ設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              アプリの外観をカスタマイズします
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <ListItemButton
                onClick={toggleDarkMode}
                sx={{ py: 3, px: 3 }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: darkMode ? 'grey.800' : 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {darkMode ? <DarkModeIcon /> : <LightModeIcon color="warning" />}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      ダークモード
                    </Typography>
                  }
                  secondary="目に優しい暗い色調のテーマに切り替えます"
                  sx={{ ml: 1 }}
                />
                <Switch checked={darkMode} />
              </ListItemButton>
            </Card>

            {/* プレビュー */}
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                プレビュー
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: darkMode ? 'grey.900' : 'grey.50',
                  color: darkMode ? 'grey.100' : 'grey.900',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {darkMode ? 'ダークモードが有効です' : 'ライトモードが有効です'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  この設定はすぐに適用されます
                </Typography>
              </Paper>
            </Card>
          </Box>
        );

      case 'notification':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              通知設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              受け取る通知の種類を選択します
            </Typography>

            <Card variant="outlined">
              {/* メール通知 */}
              <ListItemButton
                onClick={() => handleNotificationChange('email')}
                sx={{ py: 2.5, px: 3 }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: 'primary.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EmailIcon color="primary" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      メール通知
                    </Typography>
                  }
                  secondary="重要な更新やお知らせをメールで受け取ります"
                  sx={{ ml: 1 }}
                />
                <Switch checked={notifications.email} />
              </ListItemButton>

              <Divider />

              {/* プッシュ通知 */}
              <ListItemButton
                onClick={() => handleNotificationChange('push')}
                sx={{ py: 2.5, px: 3 }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: 'success.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PhoneAndroidIcon color="success" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      プッシュ通知
                    </Typography>
                  }
                  secondary="ブラウザのプッシュ通知でリアルタイムに受け取ります"
                  sx={{ ml: 1 }}
                />
                <Switch checked={notifications.push} />
              </ListItemButton>

              <Divider />

              {/* マーケティング通知 */}
              <ListItemButton
                onClick={() => handleNotificationChange('marketing')}
                sx={{ py: 2.5, px: 3 }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: 'warning.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CampaignIcon color="warning" />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      マーケティング通知
                    </Typography>
                  }
                  secondary="キャンペーンや新機能のお知らせを受け取ります"
                  sx={{ ml: 1 }}
                />
                <Switch checked={notifications.marketing} />
              </ListItemButton>
            </Card>
          </Box>
        );

      case 'account':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              アカウント設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              セキュリティとアカウント管理
            </Typography>

            {/* パスワード変更 */}
            <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <KeyIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    パスワード変更
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    定期的なパスワード変更をお勧めします
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="現在のパスワード"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="新しいパスワード"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  helperText="8文字以上、大文字・小文字・数字を含む"
                />
                <TextField
                  label="新しいパスワード（確認）"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                />
                <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                  パスワードを更新
                </Button>
              </Box>
            </Card>

            {/* 危険な操作 */}
            <Card variant="outlined" sx={{ borderColor: 'error.200' }}>
              <Box sx={{ p: 2, bgcolor: 'error.50' }}>
                <Typography variant="subtitle2" color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon fontSize="small" />
                  危険な操作
                </Typography>
              </Box>

              <ListItemButton sx={{ py: 2.5, px: 3 }}>
                <ListItemIcon>
                  <LogoutIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="ログアウト"
                  secondary="すべてのデバイスからログアウトします"
                />
                <ChevronRightIcon color="action" />
              </ListItemButton>

              <Divider />

              <ListItemButton onClick={() => setDeleteDialogOpen(true)} sx={{ py: 2.5, px: 3 }}>
                <ListItemIcon>
                  <DeleteIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography color="error">アカウント削除</Typography>}
                  secondary="アカウントと全てのデータを完全に削除します"
                />
                <ChevronRightIcon color="action" />
              </ListItemButton>
            </Card>
          </Box>
        );

      case 'data':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              データ管理
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              アプリのデータをエクスポート・インポートできます
            </Typography>

            {/* エクスポート */}
            <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 44, height: 44, borderRadius: 2,
                    bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <DownloadIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">データエクスポート</Typography>
                  <Typography variant="body2" color="text.secondary">
                    すべてのデータをJSONファイルとしてダウンロードします
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    const keys = [
                      'app_tasks', 'app_habits', 'app_rewards', 'app_point_status',
                      'app_notifications', 'app_profile', 'app_notification_settings',
                      'app_goals', 'app_dark_mode', 'LAST_LOGIN_KEY', 'STREAK_KEY',
                    ];
                    const data: Record<string, unknown> = {};
                    keys.forEach(key => {
                      const val = localStorage.getItem(key);
                      if (val !== null) {
                        try { data[key] = JSON.parse(val); } catch { data[key] = val; }
                      }
                    });
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `yaruki-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setSnackbarOpen(true);
                  }}
                >
                  JSONエクスポート
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    const keys = ['app_tasks', 'app_habits', 'app_rewards', 'app_goals'];
                    let csv = '';

                    // タスク
                    const tasksRaw = localStorage.getItem('app_tasks');
                    if (tasksRaw) {
                      const tasks = JSON.parse(tasksRaw);
                      csv += 'タスク\nタイトル,ステータス,難易度,ポイント,カテゴリ\n';
                      tasks.forEach((t: { title: string; status: string; difficulty: string; points: number; categoryId: string }) => {
                        csv += `"${t.title}",${t.status},${t.difficulty},${t.points},${t.categoryId}\n`;
                      });
                      csv += '\n';
                    }

                    // 習慣
                    const habitsRaw = localStorage.getItem('app_habits');
                    if (habitsRaw) {
                      const habits = JSON.parse(habitsRaw);
                      csv += '習慣\n名前,ストリーク,今日完了\n';
                      habits.forEach((h: { name: string; streak: number; completedToday: boolean }) => {
                        csv += `"${h.name}",${h.streak},${h.completedToday ? 'はい' : 'いいえ'}\n`;
                      });
                      csv += '\n';
                    }

                    // 目標
                    const goalsRaw = localStorage.getItem('app_goals');
                    if (goalsRaw) {
                      const goals = JSON.parse(goalsRaw);
                      csv += '目標\nタイトル,進捗,目標値,単位,期間\n';
                      goals.forEach((g: { title: string; current: number; target: number; unit: string; period: string }) => {
                        csv += `"${g.title}",${g.current},${g.target},${g.unit},${g.period === 'weekly' ? '週間' : '月間'}\n`;
                      });
                    }

                    const bom = '\uFEFF';
                    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `yaruki-backup-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setSnackbarOpen(true);
                  }}
                >
                  CSVエクスポート
                </Button>
              </Box>
            </Card>

            {/* インポート */}
            <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 44, height: 44, borderRadius: 2,
                    bgcolor: 'success.50', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <UploadIcon color="success" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">データインポート</Typography>
                  <Typography variant="body2" color="text.secondary">
                    JSONバックアップファイルからデータを復元します（既存データは上書きされます）
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="success"
                startIcon={<UploadIcon />}
                component="label"
              >
                JSONファイルを選択
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const data = JSON.parse(ev.target?.result as string);
                        Object.entries(data).forEach(([key, value]) => {
                          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                        });
                        setSnackbarOpen(true);
                        // ページをリロードして反映
                        setTimeout(() => window.location.reload(), 1000);
                      } catch {
                        alert('ファイルの読み込みに失敗しました。正しいJSONファイルを選択してください。');
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = '';
                  }}
                />
              </Button>
            </Card>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
        設定
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        アカウントやアプリの設定を管理します
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* サイドナビゲーション */}
        <Paper
          variant="outlined"
          sx={{
            width: { xs: '100%', md: 280 },
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <List disablePadding>
            {menuItems.map((item, index) => (
              <Box key={item.id}>
                {index > 0 && <Divider />}
                <ListItemButton
                  selected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                  sx={{
                    py: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.100' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: activeSection === item.id ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        fontWeight={activeSection === item.id ? 'bold' : 'medium'}
                        color={activeSection === item.id ? 'primary.main' : 'inherit'}
                      >
                        {item.label}
                      </Typography>
                    }
                    secondary={item.description}
                  />
                </ListItemButton>
              </Box>
            ))}
          </List>
        </Paper>

        {/* メインコンテンツ */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {renderContent()}
        </Box>
      </Box>

      {/* 保存通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)}>
          設定を保存しました
        </Alert>
      </Snackbar>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          アカウント削除の確認
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            この操作は取り消せません。アカウントと全てのデータが完全に削除されます。
            本当に削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="error">
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
