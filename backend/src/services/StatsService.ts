import { userService } from './UserService';
import { taskService } from './TaskService';
import { habitService } from './HabitService';
import { pomodoroService } from './PomodoroService';

/**
 * 全体統計
 */
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

/**
 * 週間統計
 */
export interface WeeklyStats {
  tasksCompleted: number[];
  pointsEarned: number[];
  habitsCompleted: number[];
  pomodoroSessions: number[];
  labels: string[];
}

/**
 * 統計サービス
 */
export class StatsService {
  /**
   * 全体統計取得
   */
  async getOverview(userId: string): Promise<OverviewStats> {
    // ユーザー情報
    const user = await userService.getById(userId);

    // タスク統計
    const { tasks, total: taskTotal } = await taskService.list(userId);
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = taskTotal - completedTasks;
    const completionRate = taskTotal > 0 ? Math.round((completedTasks / taskTotal) * 100) : 0;

    // 習慣統計
    const habits = await habitService.list(userId);
    const completedToday = habits.filter(h => h.completedToday).length;
    const currentMaxStreak = await habitService.getMaxStreak(userId);
    const bestStreak = await habitService.getBestStreak(userId);

    // レベル情報
    const requiredXP = userService.getRequiredXP(user.level);

    return {
      tasks: {
        total: taskTotal,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate,
      },
      habits: {
        total: habits.length,
        completedToday,
        currentMaxStreak,
        bestStreak,
      },
      points: {
        totalEarned: user.totalEarnedPoints,
        totalSpent: user.totalSpentPoints,
        current: user.currentPoints,
      },
      level: {
        current: user.level,
        currentXP: user.currentXP,
        requiredXP,
      },
    };
  }

  /**
   * 週間統計取得
   */
  async getWeekly(userId: string): Promise<WeeklyStats> {
    // 過去7日間のラベルを生成
    const labels: string[] = [];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(dayNames[date.getDay()]);
    }

    // TODO: 実際の日別データを取得
    // 現在は仮のデータを返す
    return {
      tasksCompleted: [0, 0, 0, 0, 0, 0, 0],
      pointsEarned: [0, 0, 0, 0, 0, 0, 0],
      habitsCompleted: [0, 0, 0, 0, 0, 0, 0],
      pomodoroSessions: [0, 0, 0, 0, 0, 0, 0],
      labels,
    };
  }
}

export const statsService = new StatsService();
