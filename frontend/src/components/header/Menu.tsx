'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import NavListItem from './NavListItem';
import { navItems } from './navItems';

export default function Menu() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (isOpen: boolean) => () => {
        setOpen(isOpen);
    };

    return (
        <>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
            >
                <Box sx={{ width: 280 }}>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            やる気支援アプリ
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        {navItems.map((item) => (
                            <NavListItem
                                key={item.href}
                                item={item}
                                onClick={toggleDrawer(false)}
                            />
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}