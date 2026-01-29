/**
 * API モジュール
 * バックエンドとの通信に使用
 */

// クライアント
export { ApiError, setAuthToken, clearAuthToken } from './client';
export type { ApiResponse } from './client';

// 型定義
export * from './types';

// 認証API
export * as authApi from './auth';

// タスクAPI
export * as tasksApi from './tasks';

// カテゴリAPI
export * as categoriesApi from './categories';

// 習慣API
export * as habitsApi from './habits';

// ご褒美API
export * as rewardsApi from './rewards';

// バッジAPI
export * as badgesApi from './badges';

// ポモドーロAPI
export * as pomodoroApi from './pomodoro';

// 統計API
export * as statsApi from './stats';
