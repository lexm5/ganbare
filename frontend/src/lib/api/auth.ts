/**
 * 認証API
 */
import { post, get, setAuthToken, clearAuthToken } from './client';
import { User, LoginRequest, RegisterRequest, AuthResponse } from './types';

/**
 * ユーザー登録
 */
export async function register(data: RegisterRequest): Promise<{ user: User }> {
  const response = await post<{ user: User }>('/auth/register', data);
  return response.data;
}

/**
 * ログイン
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/login', data);
  // トークンを保存
  setAuthToken(response.data.token);
  return response.data;
}

/**
 * ログアウト
 */
export async function logout(): Promise<void> {
  await post('/auth/logout');
  clearAuthToken();
}

/**
 * 現在のユーザー情報取得
 */
export async function getMe(): Promise<{ user: User }> {
  const response = await get<{ user: User }>('/auth/me');
  return response.data;
}
