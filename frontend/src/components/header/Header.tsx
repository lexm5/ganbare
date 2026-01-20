'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';

import Menu from './Menu';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import MessagesMenu from './MessagesMenu';
import NotificationsMenu from './NotificationsMenu';
import MobileMenu from './MobileMenu';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <Menu/>
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <SearchBar />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MessagesMenu />
            <NotificationsMenu />
            <ProfileMenu />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <MobileMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
