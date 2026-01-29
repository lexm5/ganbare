/**
 * 統計API
 */
import { get } from './client';
import { OverviewStats, WeeklyStats } from './types';

/**
 * 全体統計取得
 */
export async function getOverviewStats(): Promise<{ stats: OverviewStats }> {
  const response = await get<{ stats: OverviewStats }>('/stats/overview');
  return response.data;
}

/**
 * 週間統計取得
 */
export async function getWeeklyStats(): Promise<{ weekly: WeeklyStats }> {
  const response = await get<{ weekly: WeeklyStats }>('/stats/weekly');
  return response.data;
}
