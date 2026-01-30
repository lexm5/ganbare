'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNotifications } from '@/context/NotificationContext';

export default function MobileMenu() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
    handleMenuClose();
  };

  const handleNavigate = (path: string) => {
    handleProfileMenuClose();
    router.push(path);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const profileMenuId = 'primary-search-account-menu';

  return (
    <>
      <IconButton
        size="large"
        aria-label="メニューを開く"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <IconButton size="large" aria-label="ヒント・Tips" color="inherit">
            <LightbulbIcon />
          </IconButton>
          <p>Tips</p>
        </MenuItem>
        <MenuItem>
          <IconButton
            size="large"
            aria-label={`${unreadCount}件の未読通知`}
            color="inherit"
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>通知</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label="アカウントメニュー"
            aria-controls={profileMenuId}
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>プロフィール</p>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={profileAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={profileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => handleNavigate('/setting')}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          <ListItemText>プロフィール</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/setting')}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>設定</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
