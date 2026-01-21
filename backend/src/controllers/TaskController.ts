import { Request, Response } from 'express';
import { sendSuccess, sendCreated, sendNoContent, sendPaginated, parsePagination } from '../api';
import { asyncHandler } from '../errors';

/**
 * タスクコントローラー
 */
export class TaskController {
  /**
   * GET /api/tasks
   * タスク一覧取得
   */
  list = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { page, limit, offset } = parsePagination(req.query as any);
    const { status, categoryId, difficulty, search } = req.query;

    // TODO: サービス層でタスク一覧取得
    const tasks: any[] = [];
    const total = 0;

    sendPaginated(res, tasks, total, page, limit);
  });

  /**
   * POST /api/tasks
   * タスク作成
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { title, description, difficulty, points, categoryId, dueDate } = req.body;

    // TODO: サービス層でタスク作成
    const task = {
      id: 'generated-id',
      userId,
      title,
      description,
      completed: false,
      difficulty,
      points,
      categoryId,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    sendCreated(res, { task });
  });

  /**
   * GET /api/tasks/:id
   * タスク詳細取得
   */
  get = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でタスク取得
    const task = {
      id,
      title: 'タスク名',
    };

    sendSuccess(res, { task });
  });

  /**
   * PATCH /api/tasks/:id
   * タスク更新（名前・説明・カテゴリのみ）
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { title, description, categoryId } = req.body;

    // TODO: サービス層でタスク更新
    const task = {
      id,
      title,
      description,
      categoryId,
    };

    sendSuccess(res, { task });
  });

  /**
   * DELETE /api/tasks/:id
   * タスク削除
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でタスク削除

    sendNoContent(res);
  });

  /**
   * POST /api/tasks/:id/complete
   * タスク完了（ポイント付与）
   */
  complete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でタスク完了処理
    // - タスクのcompleted = true
    // - ユーザーにポイント付与
    // - 経験値付与
    // - バッジ判定
    const result = {
      task: { id, completed: true },
      pointsEarned: 10,
      newTotalPoints: 110,
    };

    sendSuccess(res, result);
  });

  /**
   * POST /api/tasks/:id/uncomplete
   * タスク未完了に戻す（ポイント減算）
   */
  uncomplete = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    // TODO: サービス層でタスク未完了処理
    // - タスクのcompleted = false
    // - ユーザーからポイント減算
    const result = {
      task: { id, completed: false },
      pointsDeducted: 10,
      newTotalPoints: 100,
    };

    sendSuccess(res, result);
  });
}

export const taskController = new TaskController();
