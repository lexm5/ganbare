import { Request, Response } from 'express';
import { sendSuccess } from '../api';
import { asyncHandler } from '../errors';

/**
 * バッジコントローラー
 */
export class BadgeController {
  /**
   * GET /api/badges
   * バッジ一覧取得（獲得状況含む）
   */
  list = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    // TODO: サービス層でバッジ一覧取得
    // 全バッジ定義 + ユーザーの獲得状況
    const badges: any[] = [];

    sendSuccess(res, { badges });
  });
}

export const badgeController = new BadgeController();
