'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RepeatIcon from '@mui/icons-material/Repeat';
import Box from '@mui/material/Box';

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'habit';
  detail: string;
  route: string;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function searchLocalStorage(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  try {
    const tasksRaw = localStorage.getItem('app_tasks');
    if (tasksRaw) {
      const tasks = JSON.parse(tasksRaw);
      if (Array.isArray(tasks)) {
        tasks.forEach((task: { id: string; title: string; status?: string; description?: string }) => {
          if (
            task.title?.toLowerCase().includes(lowerQuery) ||
            task.description?.toLowerCase().includes(lowerQuery)
          ) {
            const statusLabel = task.status === 'done' ? '完了' : task.status === 'inProgress' ? '進行中' : '未着手';
            results.push({
              id: task.id,
              title: task.title,
              type: 'task',
              detail: `タスク・${statusLabel}`,
              route: '/tasks',
            });
          }
        });
      }
    }
  } catch {
    // ignore
  }

  try {
    const habitsRaw = localStorage.getItem('app_habits');
    if (habitsRaw) {
      const habits = JSON.parse(habitsRaw);
      if (Array.isArray(habits)) {
        habits.forEach((habit: { id: string; name: string; streak?: number }) => {
          if (habit.name?.toLowerCase().includes(lowerQuery)) {
            results.push({
              id: habit.id,
              title: habit.name,
              type: 'habit',
              detail: `習慣・${habit.streak ?? 0}日連続`,
              route: '/habits',
            });
          }
        });
      }
    }
  } catch {
    // ignore
  }

  return results.slice(0, 10);
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value.trim()) {
      const found = searchLocalStorage(value);
      setResults(found);
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    router.push(result.route);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Search ref={anchorRef}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="タスク・習慣を検索…"
          inputProps={{ 'aria-label': 'search' }}
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (query.trim() && results.length > 0) setOpen(true);
          }}
        />
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          sx={{ zIndex: 1300, width: anchorRef.current?.offsetWidth || 300, minWidth: 300 }}
        >
          <Paper elevation={8} sx={{ mt: 0.5, maxHeight: 400, overflow: 'auto' }}>
            {results.length > 0 ? (
              <List dense>
                {results.map((result) => (
                  <ListItemButton key={`${result.type}-${result.id}`} onClick={() => handleSelect(result)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {result.type === 'task' ? (
                        <TaskAltIcon fontSize="small" color="primary" />
                      ) : (
                        <RepeatIcon fontSize="small" color="success" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={result.title}
                      secondary={result.detail}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  「{query}」の検索結果はありません
                </Typography>
              </Box>
            )}
          </Paper>
        </Popper>
      </Search>
    </ClickAwayListener>
  );
}
