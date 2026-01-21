// サービスをエクスポート
export { userService, UserService } from './UserService';
export { taskService, TaskService, TaskFilter, CreateTaskData, UpdateTaskData } from './TaskService';
export { categoryService, CategoryService } from './CategoryService';
export { habitService, HabitService, HabitWithStatus } from './HabitService';
export { rewardService, RewardService } from './RewardService';
export { badgeService, BadgeService, BadgeWithStatus, BadgeContext } from './BadgeService';
export { pomodoroService, PomodoroService, PomodoroStats } from './PomodoroService';
export { statsService, StatsService, OverviewStats, WeeklyStats } from './StatsService';

// サービス間の依存関係を初期化
import { badgeService } from './BadgeService';
import { taskService } from './TaskService';
import { habitService } from './HabitService';
import { pomodoroService } from './PomodoroService';
import { userService } from './UserService';

/**
 * サービスの初期化（バッジ判定用のコンテキストプロバイダー登録）
 */
export function initializeServices(): void {
  // タスク完了数
  badgeService.registerContextProvider('tasks_completed', async (userId) => {
    return taskService.getCompletedCount(userId);
  });

  // 習慣のStreak
  badgeService.registerContextProvider('habit_streak', async (userId) => {
    return habitService.getMaxStreak(userId);
  });

  // ポモドーロ完了数
  badgeService.registerContextProvider('pomodoro_count', async (userId) => {
    return pomodoroService.getWorkSessionCount(userId);
  });

  // 累計ポイント
  badgeService.registerContextProvider('total_points', async (userId) => {
    const user = await userService.getById(userId);
    return user.totalEarnedPoints;
  });

  // 早朝ログイン回数（TODO: 実装が必要）
  badgeService.registerContextProvider('early_logins', async (_userId) => {
    return 0; // 未実装
  });

  console.log('Services initialized');
}
