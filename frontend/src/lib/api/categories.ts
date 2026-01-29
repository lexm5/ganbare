/**
 * カテゴリAPI
 */
import { get, post, del } from './client';
import { Category, CreateCategoryRequest } from './types';

/**
 * カテゴリ一覧取得
 */
export async function getCategories(): Promise<{ categories: Category[] }> {
  const response = await get<{ categories: Category[] }>('/categories');
  return response.data;
}

/**
 * カテゴリ作成
 */
export async function createCategory(data: CreateCategoryRequest): Promise<{ category: Category }> {
  const response = await post<{ category: Category }>('/categories', data);
  return response.data;
}

/**
 * カテゴリ削除
 */
export async function deleteCategory(id: string): Promise<void> {
  await del(`/categories/${id}`);
}
