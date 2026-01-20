export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { label: 'ダッシュボード', href: '/dashboard', icon: 'Dashboard' },
  { label: 'タスク管理', href: '/tasks', icon: 'CheckCircle' },
  { label: '習慣トラッカー', href: '/habits', icon: 'Repeat' },
  { label: 'ご褒美', href: '/rewards', icon: 'CardGiftcard' },
  { label: '統計', href: '/stats', icon: 'BarChart' },
  { label: 'タイマー', href: '/timer', icon: 'Timer' },
  { label: 'バッジ', href: '/badges', icon: 'EmojiEvents' },
  { label: '設定', href: '/setting', icon: 'Settings' },
];
