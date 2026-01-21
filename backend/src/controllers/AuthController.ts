import { Request, Response } from 'express';
import { sendSuccess, sendCreated } from '../api';
import { asyncHandler } from '../errors';

/**
 * 認証コントローラー
 */
export class AuthController {
  /**
   * POST /api/auth/register
   * ユーザー登録
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    // TODO: サービス層でユーザー登録処理
    const user = {
      id: 'generated-id',
      email,
      name,
      level: 1,
      currentXP: 0,
      currentPoints: 0,
    };

    sendCreated(res, { user });
  });

  /**
   * POST /api/auth/login
   * ログイン
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // TODO: サービス層で認証処理
    const user = {
      id: 'user-id',
      email,
      name: 'ユーザー名',
    };
    const token = 'jwt-token';

    sendSuccess(res, { user, token });
  });

  /**
   * POST /api/auth/logout
   * ログアウト
   */
  logout = asyncHandler(async (_req: Request, res: Response) => {
    // TODO: セッション/トークン無効化処理

    sendSuccess(res, { message: 'ログアウトしました' });
  });

  /**
   * GET /api/auth/me
   * 現在のユーザー情報取得
   */
  me = asyncHandler(async (req: Request, res: Response) => {
    // TODO: 認証ミドルウェアでセットされたユーザーIDを使用
    const userId = (req as any).userId;

    // TODO: サービス層でユーザー情報取得
    const user = {
      id: userId,
      email: 'user@example.com',
      name: 'ユーザー名',
      level: 5,
      currentXP: 350,
      totalEarnedPoints: 150,
      totalSpentPoints: 50,
      currentPoints: 100,
    };

    sendSuccess(res, { user });
  });
}

export const authController = new AuthController();
