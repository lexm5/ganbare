/**
 * タスクAPI
 */
import { get, post, patch, del, ApiResponse } from './client';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskCompleteResponse, Difficulty } from './types';

/**
 * タスクフィルター
 */
export interface TaskFilter {
  status?: 'all' | 'pending' | 'completed';
  categoryId?: string;
  difficulty?: Difficulty;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * タスク一覧取得
 */
export async function getTasks(filter: TaskFilter = {}): Promise<ApiResponse<Task[]>> {
  const params = new URLSearchParams();

  if (filter.status) params.append('status', filter.status);
  if (filter.categoryId) params.append('categoryId', filter.categoryId);
  if (filter.difficulty) params.append('difficulty', filter.difficulty);
  if (filter.search) params.append('search', filter.search);
  if (filter.page) params.append('page', String(filter.page));
  if (filter.limit) params.append('limit', String(filter.limit));

  const query = params.toString();
  const endpoint = query ? `/tasks?${query}` : '/tasks';

  return get<Task[]>(endpoint);
}

/**
 * タスク取得
 */
export async function getTask(id: string): Promise<{ task: Task }> {
  const response = await get<{ task: Task }>(`/tasks/${id}`);
  return response.data;
}

/**
 * タスク作成
 */
export async function createTask(data: CreateTaskRequest): Promise<{ task: Task }> {
  const response = await post<{ task: Task }>('/tasks', data);
  return response.data;
}

/**
 * タスク更新
 */
export async function updateTask(id: string, data: UpdateTaskRequest): Promise<{ task: Task }> {
  const response = await patch<{ task: Task }>(`/tasks/${id}`, data);
  return response.data;
}

/**
 * タスク削除
 */
export async function deleteTask(id: string): Promise<void> {
  await del(`/tasks/${id}`);
}

/**
 * タスク完了
 */
export async function completeTask(id: string): Promise<TaskCompleteResponse> {
  const response = await post<TaskCompleteResponse>(`/tasks/${id}/complete`);
  return response.data;
}

/**
 * タスク未完了に戻す
 */
export async function uncompleteTask(id: string): Promise<{ task: Task; pointsDeducted: number }> {
  const response = await post<{ task: Task; pointsDeducted: number }>(`/tasks/${id}/uncomplete`);
  return response.data;
}
