import { Request, Response } from 'express';
import { sendSuccess } from '../api';
import { asyncHandler } from '../errors';

/**
 * 統計コントローラー
 */
export class StatsController {
  /**
   * GET /api/stats/overview
   * 全体統計
   */
  overview = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    // TODO: サービス層で全体統計取得
    const stats = {
      tasks: {
        total: 0,
        completed: 0,
        pending: 0,
        completionRate: 0,
      },
      habits: {
        total: 0,
        completedToday: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      points: {
        totalEarned: 0,
        totalSpent: 0,
        current: 0,
      },
      level: {
        current: 1,
        currentXP: 0,
        requiredXP: 100,
      },
    };

    sendSuccess(res, { stats });
  });

  /**
   * GET /api/stats/weekly
   * 週間統計
   */
  weekly = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    // TODO: サービス層で週間統計取得
    // 過去7日間の日別データ
    const weekly = {
      tasksCompleted: [0, 0, 0, 0, 0, 0, 0], // 日〜土
      pointsEarned: [0, 0, 0, 0, 0, 0, 0],
      habitsCompleted: [0, 0, 0, 0, 0, 0, 0],
      pomodoroSessions: [0, 0, 0, 0, 0, 0, 0],
      labels: ['日', '月', '火', '水', '木', '金', '土'],
    };

    sendSuccess(res, { weekly });
  });
}

export const statsController = new StatsController();
