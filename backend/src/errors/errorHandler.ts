import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from './AppError';

/**
 * エラーレスポンスの型
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * 開発環境用のエラーレスポンス
 */
interface DevErrorResponse extends ErrorResponse {
  stack?: string;
}

/**
 * エラーをErrorResponseに変換
 */
const formatError = (err: AppError, isDev: boolean): ErrorResponse | DevErrorResponse => {
  const response: ErrorResponse = {
    error: {
      code: err.code,
      message: err.message,
    },
  };

  // ValidationErrorの場合はエラー詳細を追加
  if (err instanceof ValidationError) {
    response.error.errors = err.errors;
  }

  // 開発環境ではスタックトレースを追加
  if (isDev) {
    return {
      ...response,
      stack: err.stack,
    };
  }

  return response;
};

/**
 * グローバルエラーハンドラーミドルウェア
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === 'development';

  // AppErrorの場合
  if (err instanceof AppError) {
    const response = formatError(err, isDev);
    res.status(err.statusCode).json(response);
    return;
  }

  // 予期しないエラーの場合
  console.error('Unexpected error:', err);

  const response: ErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev ? err.message : 'サーバーエラーが発生しました',
    },
  };

  if (isDev) {
    (response as DevErrorResponse).stack = err.stack;
  }

  res.status(500).json(response);
};

/**
 * 404ハンドラー
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `エンドポイントが見つかりません: ${req.method} ${req.path}`,
    },
  });
};

/**
 * 非同期ハンドラーラッパー
 * try-catchを省略できる
 */
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
