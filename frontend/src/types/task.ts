import { Difficulty } from './point';

// カテゴリの色
export const CATEGORY_COLORS = {
  work: { bg: '#e3f2fd', color: '#1976d2', label: '仕事' },
  study: { bg: '#f3e5f5', color: '#9c27b0', label: '勉強' },
  housework: { bg: '#e8f5e9', color: '#4caf50', label: '家事' },
  hobby: { bg: '#fff3e0', color: '#ff9800', label: '趣味' },
  health: { bg: '#ffebee', color: '#f44336', label: '健康' },
  other: { bg: '#eceff1', color: '#607d8b', label: 'その他' },
} as const;

// デフォルトカテゴリ
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '仕事', color: '#1976d2', isDefault: true },
  { id: 'study', name: '勉強', color: '#9c27b0', isDefault: true },
  { id: 'housework', name: '家事', color: '#4caf50', isDefault: true },
  { id: 'hobby', name: '趣味', color: '#ff9800', isDefault: true },
];

// カテゴリ
export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

// タスク
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  difficulty: Difficulty;
  points: number;
  categoryId: string;
  dueDate?: string;
  createdAt: string;
}

// タスクフィルター
export interface TaskFilters {
  status: 'all' | 'pending' | 'completed';
  categoryId: string | null;
  difficulty: Difficulty | null;
}
