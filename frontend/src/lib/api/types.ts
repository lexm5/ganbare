/**
 * API用型定義
 * バックエンドと共通の型
 */

// ========== 共通 ==========

export type Difficulty = 'easy' | 'medium' | 'hard';

// ========== ユーザー ==========

export interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  currentXP: number;
  totalEarnedPoints: number;
  totalSpentPoints: number;
  currentPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface PointStatus {
  totalEarned: number;
  totalSpent: number;
  currentPoints: number;
}

// ========== タスク ==========

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  difficulty: Difficulty;
  points: number;
  categoryId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  difficulty: Difficulty;
  points: number;
  categoryId: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  categoryId?: string;
}

export interface TaskCompleteResponse {
  task: Task;
  pointsEarned: number;
  xpEarned: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: string[];
}

// ========== カテゴリ ==========

export interface Category {
  id: string;
  userId: string | null;
  name: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}

// ========== 習慣 ==========

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitRequest {
  name: string;
  icon?: string;
}

export interface HabitCheckResponse {
  habit: Habit;
  xpEarned: number;
  leveledUp: boolean;
  newBadges: string[];
}

// ========== ご褒美 ==========

export interface Reward {
  id: string;
  userId: string;
  name: string;
  description: string;
  cost: number;
  icon: string | null;
  redeemed: boolean;
  redeemedAt: string | null;
  createdAt: string;
}

export interface CreateRewardRequest {
  name: string;
  description: string;
  cost: number;
  icon?: string;
}

export interface RewardRedeemResponse {
  reward: Reward;
  pointsSpent: number;
  newTotalPoints: number;
}

// ========== バッジ ==========

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditionType: string;
  conditionValue: number | null;
  unlocked: boolean;
  unlockedAt: string | null;
}

// ========== ポモドーロ ==========

export interface PomodoroSession {
  id: string;
  duration: number;
  type: 'work' | 'break';
  completedAt: string;
}

export interface PomodoroCompleteRequest {
  duration: number;
  type: 'work' | 'break';
}

export interface PomodoroCompleteResponse {
  session: PomodoroSession;
  xpEarned: number;
  leveledUp: boolean;
  newBadges: string[];
}

export interface PomodoroStats {
  totalSessions: number;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  averagePerDay: number;
}

// ========== 統計 ==========

export interface OverviewStats {
  tasks: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
  habits: {
    total: number;
    completedToday: number;
    currentMaxStreak: number;
    bestStreak: number;
  };
  points: {
    totalEarned: number;
    totalSpent: number;
    current: number;
  };
  level: {
    current: number;
    currentXP: number;
    requiredXP: number;
  };
}

export interface WeeklyStats {
  tasksCompleted: number[];
  pointsEarned: number[];
  habitsCompleted: number[];
  pomodoroSessions: number[];
  labels: string[];
}

// ========== 認証 ==========

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
