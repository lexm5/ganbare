/**
 * バッジAPI
 */
import { get } from './client';
import { Badge } from './types';

/**
 * バッジ一覧取得（獲得状況付き）
 */
export async function getBadges(): Promise<{ badges: Badge[] }> {
  const response = await get<{ badges: Badge[] }>('/badges');
  return response.data;
}
