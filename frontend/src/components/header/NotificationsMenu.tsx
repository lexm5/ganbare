'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CelebrationIcon from '@mui/icons-material/Celebration';
import InfoIcon from '@mui/icons-material/Info';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CloseIcon from '@mui/icons-material/Close';
import { useNotifications, NotificationType } from '@/context/NotificationContext';

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'task_complete':
      return <TaskAltIcon fontSize="small" color="success" />;
    case 'streak_achieved':
      return <WhatshotIcon fontSize="small" sx={{ color: '#ff9800' }} />;
    case 'badge_earned':
      return <EmojiEventsIcon fontSize="small" sx={{ color: '#ffd700' }} />;
    case 'reward_redeemed':
      return <CardGiftcardIcon fontSize="small" color="secondary" />;
    case 'login_bonus':
      return <CelebrationIcon fontSize="small" color="primary" />;
    case 'info':
    default:
      return <InfoIcon fontSize="small" color="info" />;
  }
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  return `${days}日前`;
}

export default function NotificationsMenu() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, removeNotification } =
    useNotifications();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'notifications-menu';

  return (
    <>
      <IconButton
        size="large"
        aria-label={`${unreadCount}件の未読通知`}
        color="inherit"
        onClick={handleMenuOpen}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
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
            sx: { width: 360, maxHeight: 480 },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            通知
          </Typography>
          <Box>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={() => markAllAsRead()}
                sx={{ mr: 0.5 }}
              >
                既読
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                size="small"
                startIcon={<DeleteSweepIcon />}
                onClick={() => {
                  clearAll();
                  handleMenuClose();
                }}
                color="error"
              >
                全削除
              </Button>
            )}
          </Box>
        </Box>
        <Divider />

        {/* Notification List */}
        {notifications.length === 0 ? (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              通知はありません
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 20).map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                if (!notification.read) markAsRead(notification.id);
              }}
              sx={{
                whiteSpace: 'normal',
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                py: 1.5,
                alignItems: 'flex-start',
              }}
            >
              <ListItemIcon sx={{ mt: 0.5 }}>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={notification.read ? 'normal' : 'bold'}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary" component="span" sx={{ display: 'block' }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" component="span">
                      {formatTime(notification.timestamp)}
                    </Typography>
                  </Box>
                }
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                sx={{ ml: 1 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
