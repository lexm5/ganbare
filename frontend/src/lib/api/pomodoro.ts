/**
 * ポモドーロAPI
 */
import { get, post } from './client';
import { PomodoroCompleteRequest, PomodoroCompleteResponse, PomodoroStats } from './types';

/**
 * セッション完了を記録
 */
export async function completePomodoro(data: PomodoroCompleteRequest): Promise<PomodoroCompleteResponse> {
  const response = await post<PomodoroCompleteResponse>('/pomodoro/complete', data);
  return response.data;
}

/**
 * ポモドーロ統計取得
 */
export async function getPomodoroStats(period?: 'today' | 'week' | 'month'): Promise<{ stats: PomodoroStats }> {
  const query = period ? `?period=${period}` : '';
  const response = await get<{ stats: PomodoroStats }>(`/pomodoro/stats${query}`);
  return response.data;
}
