import { Habit, HabitLog, XP_REWARDS } from '../types';
import { HabitNotFoundError, HabitAlreadyCheckedError, BadRequestError } from '../errors';
import { userService } from './UserService';
import { badgeService } from './BadgeService';

/**
 * 習慣（今日のチェック状況付き）
 */
export interface HabitWithStatus extends Habit {
  completedToday: boolean;
}

/**
 * 習慣サービス
 */
export class HabitService {
  // TODO: 実際のDBリポジトリに置き換え
  private habits: Map<string, Habit> = new Map();
  private habitLogs: Map<string, HabitLog> = new Map();

  /**
   * 習慣一覧取得（今日のチェック状況付き）
   */
  async list(userId: string): Promise<HabitWithStatus[]> {
    const habits = Array.from(this.habits.values()).filter(h => h.userId === userId);
    const today = this.getToday();

    return habits.map(habit => ({
      ...habit,
      completedToday: this.isCompletedOnDate(habit.id, today),
    }));
  }

  /**
   * 習慣作成
   */
  async create(userId: string, name: string, icon?: string): Promise<HabitWithStatus> {
    const habit: Habit = {
      id: this.generateId(),
      userId,
      name,
      icon: icon || null,
      streak: 0,
      bestStreak: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.habits.set(habit.id, habit);

    return {
      ...habit,
      completedToday: false,
    };
  }

  /**
   * 習慣取得
   */
  async getById(userId: string, habitId: string): Promise<Habit> {
    const habit = this.habits.get(habitId);
    if (!habit || habit.userId !== userId) {
      throw new HabitNotFoundError(habitId);
    }
    return habit;
  }

  /**
   * 習慣削除
   */
  async delete(userId: string, habitId: string): Promise<void> {
    const habit = await this.getById(userId, habitId);

    // 関連するログも削除
    Array.from(this.habitLogs.entries())
      .filter(([_, log]) => log.habitId === habitId)
      .forEach(([id, _]) => this.habitLogs.delete(id));

    this.habits.delete(habit.id);
  }

  /**
   * 今日の習慣をチェック
   */
  async check(userId: string, habitId: string): Promise<{
    habit: HabitWithStatus;
    xpEarned: number;
    leveledUp: boolean;
    newBadges: string[];
  }> {
    const habit = await this.getById(userId, habitId);
    const today = this.getToday();

    // 既にチェック済みかチェック
    if (this.isCompletedOnDate(habitId, today)) {
      throw new HabitAlreadyCheckedError();
    }

    // ログを追加
    const log: HabitLog = {
      id: this.generateLogId(),
      habitId,
      completedAt: today,
    };
    this.habitLogs.set(log.id, log);

    // Streak計算
    const yesterday = this.getYesterday();
    const wasCompletedYesterday = this.isCompletedOnDate(habitId, yesterday);

    if (wasCompletedYesterday) {
      habit.streak += 1;
    } else {
      habit.streak = 1; // リセット
    }

    // 最高記録更新
    if (habit.streak > habit.bestStreak) {
      habit.bestStreak = habit.streak;
    }

    habit.updatedAt = new Date();

    // 経験値付与
    const { leveledUp } = await userService.addXP(userId, XP_REWARDS.habitCheck);

    // バッジ判定
    const newBadges = await badgeService.checkAndAwardBadges(userId);

    return {
      habit: {
        ...habit,
        completedToday: true,
      },
      xpEarned: XP_REWARDS.habitCheck,
      leveledUp,
      newBadges,
    };
  }

  /**
   * 今日のチェックを解除
   */
  async uncheck(userId: string, habitId: string): Promise<HabitWithStatus> {
    const habit = await this.getById(userId, habitId);
    const today = this.getToday();

    // チェックされていないか確認
    if (!this.isCompletedOnDate(habitId, today)) {
      throw new BadRequestError('今日はまだチェックされていません', 'NOT_CHECKED_TODAY');
    }

    // 今日のログを削除
    const logEntry = Array.from(this.habitLogs.entries())
      .find(([_, log]) => log.habitId === habitId && log.completedAt === today);

    if (logEntry) {
      this.habitLogs.delete(logEntry[0]);
    }

    // Streak再計算
    habit.streak = this.calculateStreak(habitId);
    habit.updatedAt = new Date();

    return {
      ...habit,
      completedToday: false,
    };
  }

  /**
   * ユーザーの最長Streak取得
   */
  async getMaxStreak(userId: string): Promise<number> {
    const habits = Array.from(this.habits.values()).filter(h => h.userId === userId);
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.streak));
  }

  /**
   * ユーザーの最高Streak記録取得
   */
  async getBestStreak(userId: string): Promise<number> {
    const habits = Array.from(this.habits.values()).filter(h => h.userId === userId);
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.bestStreak));
  }

  /**
   * 特定日にチェック済みか
   */
  private isCompletedOnDate(habitId: string, date: string): boolean {
    return Array.from(this.habitLogs.values())
      .some(log => log.habitId === habitId && log.completedAt === date);
  }

  /**
   * Streak計算（過去に遡って連続日数をカウント）
   */
  private calculateStreak(habitId: string): number {
    let streak = 0;
    let date = this.getYesterday(); // 今日は含めない（uncheckなので）

    while (this.isCompletedOnDate(habitId, date)) {
      streak++;
      date = this.getPreviousDay(date);
    }

    return streak;
  }

  /**
   * 今日の日付（YYYY-MM-DD）
   */
  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * 昨日の日付（YYYY-MM-DD）
   */
  private getYesterday(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  /**
   * 前日の日付を取得
   */
  private getPreviousDay(dateStr: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLogId(): string {
    return `hlog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const habitService = new HabitService();
