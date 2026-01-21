import { Category, DEFAULT_CATEGORIES } from '../types';
import { CategoryNotFoundError, CategoryInUseError, DefaultCategoryError } from '../errors';

/**
 * カテゴリサービス
 */
export class CategoryService {
  // TODO: 実際のDBリポジトリに置き換え
  private categories: Map<string, Category> = new Map();
  // タスクのカテゴリ使用状況チェック用（実際はTaskServiceから取得）
  private taskCategoryUsage: Map<string, Set<string>> = new Map(); // categoryId -> taskIds

  constructor() {
    // デフォルトカテゴリを初期化
    DEFAULT_CATEGORIES.forEach(cat => {
      this.categories.set(cat.id, { ...cat, createdAt: new Date() });
    });
  }

  /**
   * カテゴリ一覧取得（デフォルト + ユーザー作成）
   */
  async list(userId: string): Promise<Category[]> {
    const categories = Array.from(this.categories.values()).filter(
      c => c.isDefault || c.userId === userId
    );

    // デフォルトカテゴリを先に、その後ユーザーカテゴリを作成日順
    return categories.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  /**
   * カテゴリ作成
   */
  async create(userId: string, name: string, color: string): Promise<Category> {
    const category: Category = {
      id: this.generateId(),
      userId,
      name,
      color,
      isDefault: false,
      createdAt: new Date(),
    };

    this.categories.set(category.id, category);
    return category;
  }

  /**
   * カテゴリ取得
   */
  async getById(categoryId: string): Promise<Category> {
    const category = this.categories.get(categoryId);
    if (!category) {
      throw new CategoryNotFoundError(categoryId);
    }
    return category;
  }

  /**
   * カテゴリ削除
   */
  async delete(userId: string, categoryId: string): Promise<void> {
    const category = await this.getById(categoryId);

    // デフォルトカテゴリは削除不可
    if (category.isDefault) {
      throw new DefaultCategoryError();
    }

    // 自分のカテゴリかチェック
    if (category.userId !== userId) {
      throw new CategoryNotFoundError(categoryId);
    }

    // 使用中かチェック
    const usage = this.taskCategoryUsage.get(categoryId);
    if (usage && usage.size > 0) {
      throw new CategoryInUseError();
    }

    this.categories.delete(categoryId);
  }

  /**
   * カテゴリが存在するか確認（デフォルトまたはユーザー所有）
   */
  async exists(userId: string, categoryId: string): Promise<boolean> {
    const category = this.categories.get(categoryId);
    if (!category) return false;
    return category.isDefault || category.userId === userId;
  }

  /**
   * カテゴリ使用を記録（タスク作成時に呼ぶ）
   */
  markCategoryUsed(categoryId: string, taskId: string): void {
    if (!this.taskCategoryUsage.has(categoryId)) {
      this.taskCategoryUsage.set(categoryId, new Set());
    }
    this.taskCategoryUsage.get(categoryId)!.add(taskId);
  }

  /**
   * カテゴリ使用を解除（タスク削除時に呼ぶ）
   */
  markCategoryUnused(categoryId: string, taskId: string): void {
    const usage = this.taskCategoryUsage.get(categoryId);
    if (usage) {
      usage.delete(taskId);
    }
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const categoryService = new CategoryService();
