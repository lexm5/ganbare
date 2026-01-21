import { Response } from 'express';

/**
 * 成功レスポンスの型
 */
export interface SuccessResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

/**
 * ページネーション付きレスポンスの型
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 成功レスポンスを返す
 */
export const sendSuccess = <T>(res: Response, data: T, statusCode: number = 200): void => {
  res.status(statusCode).json({ data });
};

/**
 * 作成成功レスポンスを返す（201）
 */
export const sendCreated = <T>(res: Response, data: T): void => {
  sendSuccess(res, data, 201);
};

/**
 * 削除成功レスポンスを返す（204 No Content）
 */
export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};

/**
 * ページネーション付きレスポンスを返す
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): void => {
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
};

/**
 * ページネーションパラメータをパース
 */
export const parsePagination = (
  query: { page?: string; limit?: string },
  defaults: { page: number; limit: number } = { page: 1, limit: 20 }
): { page: number; limit: number; offset: number } => {
  const page = Math.max(1, parseInt(query.page || String(defaults.page), 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || String(defaults.limit), 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
