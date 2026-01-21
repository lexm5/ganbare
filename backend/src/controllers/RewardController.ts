import { Request, Response } from 'express';
import { sendSuccess, sendCreated, sendNoContent } from '../api';
import { asyncHandler } from '../errors';

/**
 * ご褒美コントローラー
 */
export class RewardController {
  /**
   * GET /api/rewards
   * ご褒美一覧取得
   */
  list = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { redeemed } = req.query; // 'true' | 'false' | undefined

    // TODO: サービス層でご褒美一覧取得
    const rewards: any[] = [];

    sendSuccess(res, { rewards });
  });

  /**
   * POST /api/rewards
   * ご褒美作成
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { name, description, cost, icon } = req.body;

    // TODO: サービス層でご褒美作成
    const reward = {
      id: 'generated-id',
      userId,
      name,
      description,
      cost,
      icon,
      redeemed: false,
      createdAt: new Date().toISOString(),
    };

    sendCreated(res, { reward });
  });

  /**
   * DELETE /api/rewards/:id
   * ご褒美削除
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でご褒美削除

    sendNoContent(res);
  });

  /**
   * POST /api/rewards/:id/redeem
   * ご褒美交換（ポイント消費）
   */
  redeem = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層で交換処理
    // - ポイント残高チェック
    // - ポイント減算
    // - redeemed = true, redeemedAt = now
    const result = {
      reward: {
        id,
        redeemed: true,
        redeemedAt: new Date().toISOString(),
      },
      pointsSpent: 30,
      newTotalPoints: 70,
    };

    sendSuccess(res, result);
  });
}

export const rewardController = new RewardController();
