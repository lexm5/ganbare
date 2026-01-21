/**
 * アプリケーションエラーの基底クラス
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // プロトタイプチェーンを正しく設定
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'リクエストが不正です', code: string = 'BAD_REQUEST') {
    super(message, code, 400);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '認証が必要です', code: string = 'UNAUTHORIZED') {
    super(message, code, 401);
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'アクセス権限がありません', code: string = 'FORBIDDEN') {
    super(message, code, 403);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'リソースが見つかりません', code: string = 'NOT_FOUND') {
    super(message, code, 404);
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = '競合が発生しました', code: string = 'CONFLICT') {
    super(message, code, 409);
  }
}

/**
 * 422 Unprocessable Entity（バリデーションエラー）
 */
export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(
    message: string = '入力内容に誤りがあります',
    errors: Record<string, string[]> = {},
    code: string = 'VALIDATION_ERROR'
  ) {
    super(message, code, 422);
    this.errors = errors;
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalError extends AppError {
  constructor(message: string = 'サーバーエラーが発生しました', code: string = 'INTERNAL_ERROR') {
    super(message, code, 500, false);
  }
}
