import { PomodoroSession, XP_REWARDS } from '../types';
import { userService } from './UserService';
import { badgeService } from './BadgeService';

/**
 * ポモドーロ統計
 */
export interface PomodoroStats {
  totalSessions: number;
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  averagePerDay: number;
}

/**
 * ポモドーロサービス
 */
export class PomodoroService {
  // TODO: 実際のDBリポジトリに置き換え
  private sessions: Map<string, PomodoroSession> = new Map();

  /**
   * セッション完了を記録
   */
  async complete(
    userId: string,
    duration: number,
    type: 'work' | 'break'
  ): Promise<{
    session: PomodoroSession;
    xpEarned: number;
    leveledUp: boolean;
    newBadges: string[];
  }> {
    const session: PomodoroSession = {
      id: this.generateId(),
      userId,
      duration,
      type,
      completedAt: new Date(),
    };

    this.sessions.set(session.id, session);

    // 作業セッションの場合のみXP付与
    let xpEarned = 0;
    let leveledUp = false;

    if (type === 'work') {
      xpEarned = XP_REWARDS.pomodoroWork;
      const result = await userService.addXP(userId, xpEarned);
      leveledUp = result.leveledUp;
    }

    // バッジ判定
    const newBadges = await badgeService.checkAndAwardBadges(userId);

    return {
      session,
      xpEarned,
      leveledUp,
      newBadges,
    };
  }

  /**
   * ポモドーロ統計取得
   */
  async getStats(userId: string, period: 'today' | 'week' | 'month' = 'week'): Promise<PomodoroStats> {
    const sessions = this.getUserSessions(userId, period);

    const workSessions = sessions.filter(s => s.type === 'work');
    const breakSessions = sessions.filter(s => s.type === 'break');

    const totalWorkMinutes = workSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalBreakMinutes = breakSessions.reduce((sum, s) => sum + s.duration, 0);

    // 期間内の日数で平均を計算
    const days = period === 'today' ? 1 : period === 'week' ? 7 : 30;
    const averagePerDay = workSessions.length / days;

    return {
      totalSessions: workSessions.length,
      totalWorkMinutes,
      totalBreakMinutes,
      averagePerDay: Math.round(averagePerDay * 10) / 10,
    };
  }

  /**
   * ユーザーのポモドーロ完了数（作業のみ）
   */
  async getWorkSessionCount(userId: string): Promise<number> {
    return Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.type === 'work')
      .length;
  }

  /**
   * 期間内のセッション取得
   */
  private getUserSessions(userId: string, period: 'today' | 'week' | 'month'): PomodoroSession[] {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    return Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.completedAt >= startDate);
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `pomo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const pomodoroService = new PomodoroService();
