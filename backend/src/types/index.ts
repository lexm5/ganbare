/**
 * 難易度
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 難易度ごとのポイント範囲
 */
export const POINT_RANGES: Record<Difficulty, { min: number; max: number; label: string }> = {
  easy: { min: 1, max: 5, label: '簡単' },
  medium: { min: 5, max: 15, label: '普通' },
  hard: { min: 15, max: 30, label: '難しい' },
};

/**
 * ユーザー
 */
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  level: number;
  currentXP: number;
  totalEarnedPoints: number;
  totalSpentPoints: number;
  currentPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ユーザー（パスワードなし）
 */
//Omit<user,keys> keysの内容を除外した情報を変数に構築する
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

/**
 * カテゴリ
 */
export interface Category {
  id: string;
  userId: string | null;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
}

/**
 * タスク
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: Date | null;
  difficulty: Difficulty;
  points: number;
  categoryId: string;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 習慣
 */
export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  streak: number;
  bestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 習慣ログ
 */
export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string; // YYYY-MM-DD
}

/**
 * ご褒美
 */
export interface Reward {
  id: string;
  userId: string;
  name: string;
  description: string;
  cost: number;
  icon: string | null;
  redeemed: boolean;
  redeemedAt: Date | null;
  createdAt: Date;
}

/**
 * バッジ定義
 */
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditionType: string;
  conditionValue: number | null;
}

/**
 * ユーザーバッジ
 */
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: Date;
}

/**
 * ポモドーロセッション
 */
export interface PomodoroSession {
  id: string;
  userId: string;
  duration: number;
  type: 'work' | 'break';
  completedAt: Date;
}

/**
 * レベル計算用定数
 */
export const LEVEL_CONFIG = {
  baseXP: 100, // レベルアップに必要な基本XP
  multiplier: 1, // レベル × この値 × baseXP
};

/**
 * XP獲得量
 */
export const XP_REWARDS = {
  taskComplete: 1, // ポイントと同じXPを獲得
  habitCheck: 5,
  pomodoroWork: 10,
};

/**
 * デフォルトカテゴリ
 */
export const DEFAULT_CATEGORIES: Omit<Category, 'createdAt'>[] = [
  { id: 'work', userId: null, name: '仕事', color: '#1976d2', isDefault: true },
  { id: 'study', userId: null, name: '勉強', color: '#9c27b0', isDefault: true },
  { id: 'housework', userId: null, name: '家事', color: '#4caf50', isDefault: true },
  { id: 'hobby', userId: null, name: '趣味', color: '#ff9800', isDefault: true },
];

/**
 * バッジ定義
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { id: 'first_task', name: '初めの一歩', description: '最初のタスクを完了', icon: 'rocket', conditionType: 'tasks_completed', conditionValue: 1 },
  { id: 'streak_7', name: '7日連続', description: '7日間連続でタスクを完了', icon: 'fire', conditionType: 'habit_streak', conditionValue: 7 },
  { id: 'early_bird', name: '早起きマスター', description: '朝6時前に5回ログイン', icon: 'sun', conditionType: 'early_logins', conditionValue: 5 },
  { id: 'pomodoro_10', name: '集中の達人', description: 'ポモドーロを10回完了', icon: 'star', conditionType: 'pomodoro_count', conditionValue: 10 },
  { id: 'habit_30', name: '習慣の力', description: '30日間連続で習慣を達成', icon: 'sparkle', conditionType: 'habit_streak', conditionValue: 30 },
  { id: 'points_100', name: 'ポイントハンター', description: '累計100ポイント獲得', icon: 'trophy', conditionType: 'total_points', conditionValue: 100 },
  { id: 'points_500', name: 'ポイントマスター', description: '累計500ポイント獲得', icon: 'trophy', conditionType: 'total_points', conditionValue: 500 },
];
