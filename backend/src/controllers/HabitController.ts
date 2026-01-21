import { Request, Response } from 'express';
import { sendSuccess, sendCreated, sendNoContent } from '../api';
import { asyncHandler } from '../errors';

/**
 * 習慣コントローラー
 */
export class HabitController {
  /**
   * GET /api/habits
   * 習慣一覧取得
   */
  list = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    // TODO: サービス層で習慣一覧取得
    // 今日のチェック状況も含める
    const habits: any[] = [];

    sendSuccess(res, { habits });
  });

  /**
   * POST /api/habits
   * 習慣作成
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { name, icon } = req.body;

    // TODO: サービス層で習慣作成
    const habit = {
      id: 'generated-id',
      userId,
      name,
      icon,
      streak: 0,
      bestStreak: 0,
      completedToday: false,
      createdAt: new Date().toISOString(),
    };

    sendCreated(res, { habit });
  });

  /**
   * DELETE /api/habits/:id
   * 習慣削除
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層で習慣削除

    sendNoContent(res);
  });

  /**
   * POST /api/habits/:id/check
   * 今日の習慣をチェック
   */
  check = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でチェック処理
    // - habit_logsに今日の日付で記録
    // - streakを更新
    // - 経験値付与
    // - バッジ判定
    const result = {
      habit: {
        id,
        streak: 8,
        bestStreak: 14,
        completedToday: true,
      },
      xpEarned: 5,
    };

    sendSuccess(res, result);
  });

  /**
   * DELETE /api/habits/:id/check
   * 今日のチェックを解除
   */
  uncheck = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でチェック解除処理
    // - habit_logsから今日の記録を削除
    // - streakを再計算
    const result = {
      habit: {
        id,
        streak: 7,
        completedToday: false,
      },
    };

    sendSuccess(res, result);
  });
}

export const habitController = new HabitController();
