'use client';

import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RepeatIcon from '@mui/icons-material/Repeat';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { NavItem } from './navItems';

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <DashboardIcon />,
  CheckCircle: <CheckCircleIcon />,
  Repeat: <RepeatIcon />,
  BarChart: <BarChartIcon />,
  Timer: <TimerIcon />,
  EmojiEvents: <EmojiEventsIcon />,
  Settings: <SettingsIcon />,
  CardGiftcard: <CardGiftcardIcon />,
};

interface NavListItemProps {
  item: NavItem;
  onClick?: () => void;
}

export default function NavListItem({ item, onClick }: NavListItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={item.href} onClick={onClick}>
        <ListItemIcon>{iconMap[item.icon]}</ListItemIcon>
        <ListItemText primary={item.label} />
      </ListItemButton>
    </ListItem>
  );
}
