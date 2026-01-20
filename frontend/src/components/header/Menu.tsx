"use client";

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from "@mui/icons-material/Menu";

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
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
            >
                <List sx={{ width: 250 }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleDrawer(false)}>
                            <ListItemText primary="ホーム" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleDrawer(false)}>
                            <ListItemText primary="設定" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={toggleDrawer(false)}>
                            <ListItemText primary="ヘルプ" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}