/**
 * 習慣API
 */
import { get, post, del } from './client';
import { Habit, CreateHabitRequest, HabitCheckResponse } from './types';

/**
 * 習慣一覧取得
 */
export async function getHabits(): Promise<{ habits: Habit[] }> {
  const response = await get<{ habits: Habit[] }>('/habits');
  return response.data;
}

/**
 * 習慣作成
 */
export async function createHabit(data: CreateHabitRequest): Promise<{ habit: Habit }> {
  const response = await post<{ habit: Habit }>('/habits', data);
  return response.data;
}

/**
 * 習慣削除
 */
export async function deleteHabit(id: string): Promise<void> {
  await del(`/habits/${id}`);
}

/**
 * 習慣チェック
 */
export async function checkHabit(id: string): Promise<HabitCheckResponse> {
  const response = await post<HabitCheckResponse>(`/habits/${id}/check`);
  return response.data;
}

/**
 * 習慣チェック解除
 */
export async function uncheckHabit(id: string): Promise<{ habit: Habit }> {
  const response = await del<{ habit: Habit }>(`/habits/${id}/check`);
  return response.data;
}
