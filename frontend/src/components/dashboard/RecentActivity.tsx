'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface Activity {
  id: string;
  type: 'task' | 'badge' | 'streak';
  text: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const iconMap = {
  task: <CheckCircleIcon color="success" />,
  badge: <EmojiEventsIcon color="warning" />,
  streak: <LocalFireDepartmentIcon color="error" />,
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          最近のアクティビティ
        </Typography>
        <List disablePadding>
          {activities.map((activity) => (
            <ListItem key={activity.id} disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {iconMap[activity.type]}
              </ListItemIcon>
              <ListItemText
                primary={activity.text}
                secondary={activity.time}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
