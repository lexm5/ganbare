/**
 * APIクライアント
 * バックエンドとの通信を担当
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * APIエラー
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * APIレスポンスの型
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

/**
 * APIエラーレスポンスの型
 */
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

/**
 * リクエストオプション
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * 認証トークンを取得
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * 認証トークンを保存
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/**
 * 認証トークンを削除
 */
export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

/**
 * APIリクエストを送信
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  // 認証トークンがあればヘッダーに追加
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Content-Typeを設定
  if (body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // レスポンスがない場合（204 No Content）
    if (response.status === 204) {
      return { data: {} as T };
    }

    const json = await response.json();

    // エラーレスポンスの場合
    if (!response.ok) {
      const errorResponse = json as ApiErrorResponse;
      throw new ApiError(
        errorResponse.error.code,
        errorResponse.error.message,
        response.status,
        errorResponse.error.errors
      );
    }

    return json as ApiResponse<T>;
  } catch (error) {
    // ApiErrorはそのまま再throw
    if (error instanceof ApiError) {
      throw error;
    }

    // ネットワークエラー等
    throw new ApiError(
      'NETWORK_ERROR',
      'サーバーに接続できませんでした',
      0
    );
  }
}

/**
 * GETリクエスト
 */
export function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POSTリクエスト
 */
export function post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'POST', body });
}

/**
 * PATCHリクエスト
 */
export function patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'PATCH', body });
}

/**
 * DELETEリクエスト
 */
export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
