import { Request, Response } from 'express';
import { sendSuccess, sendCreated, sendNoContent } from '../api';
import { asyncHandler } from '../errors';

/**
 * カテゴリコントローラー
 */
export class CategoryController {
  /**
   * GET /api/categories
   * カテゴリ一覧取得
   */
  list = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    // TODO: サービス層でカテゴリ一覧取得
    // デフォルトカテゴリ + ユーザー作成カテゴリ
    const categories: any[] = [];

    sendSuccess(res, { categories });
  });

  /**
   * POST /api/categories
   * カテゴリ作成
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { name, color } = req.body;

    // TODO: サービス層でカテゴリ作成
    const category = {
      id: 'generated-id',
      userId,
      name,
      color,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    sendCreated(res, { category });
  });

  /**
   * DELETE /api/categories/:id
   * カテゴリ削除
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でカテゴリ削除
    // - デフォルトカテゴリは削除不可
    // - 使用中のカテゴリは削除不可（または確認）

    sendNoContent(res);
  });
}

export const categoryController = new CategoryController();
