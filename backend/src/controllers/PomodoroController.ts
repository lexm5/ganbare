import { Request, Response } from 'express';
import { sendSuccess, sendCreated } from '../api';
import { asyncHandler } from '../errors';

/**
 * ポモドーロコントローラー
 */
export class PomodoroController {
  /**
   * POST /api/pomodoro/complete
   * セッション完了を記録
   */
  complete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { duration, type } = req.body; // type: 'work' | 'break'

    // TODO: サービス層でセッション記録
    // - pomodoro_sessionsに記録
    // - 経験値付与（workの場合）
    // - バッジ判定
    const result = {
      session: {
        id: 'generated-id',
        duration,
        type,
        completedAt: new Date().toISOString(),
      },
      xpEarned: type === 'work' ? 10 : 0,
    };

    sendCreated(res, result);
  });

  /**
   * GET /api/pomodoro/stats
   * ポモドーロ統計
   */
  stats = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { period } = req.query; // 'today' | 'week' | 'month'

    // TODO: サービス層で統計取得
    const stats = {
      totalSessions: 0,
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      averagePerDay: 0,
    };

    sendSuccess(res, { stats });
  });
}

export const pomodoroController = new PomodoroController();
