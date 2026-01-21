import { Task, Difficulty, POINT_RANGES, XP_REWARDS } from '../types';
import { TaskNotFoundError, TaskAlreadyCompletedError, TaskNotCompletedError, ValidationError } from '../errors';
import { userService } from './UserService';
import { badgeService } from './BadgeService';

/**
 * タスクフィルター
 */
export interface TaskFilter {
  status?: 'all' | 'pending' | 'completed';
  categoryId?: string;
  difficulty?: Difficulty;
  search?: string;
}

/**
 * タスク作成データ
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  difficulty: Difficulty;
  points: number;
  categoryId: string;
  dueDate?: string;
}

/**
 * タスク更新データ（名前・説明・カテゴリのみ）
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
  categoryId?: string;
}

/**
 * タスクサービス
 */
export class TaskService {
  // TODO: 実際のDBリポジトリに置き換え
  private tasks: Map<string, Task> = new Map();

  /**
   * タスク一覧取得
   */
  async list(userId: string, filter: TaskFilter = {}): Promise<{ tasks: Task[]; total: number }> {
    let tasks = Array.from(this.tasks.values()).filter(t => t.userId === userId);

    // フィルタリング
    if (filter.status === 'pending') {
      tasks = tasks.filter(t => !t.completed);
    } else if (filter.status === 'completed') {
      tasks = tasks.filter(t => t.completed);
    }

    if (filter.categoryId) {
      tasks = tasks.filter(t => t.categoryId === filter.categoryId);
    }

    if (filter.difficulty) {
      tasks = tasks.filter(t => t.difficulty === filter.difficulty);
    }

    if (filter.search) {
      const query = filter.search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // 作成日時の新しい順にソート
    tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return { tasks, total: tasks.length };
  }

  /**
   * タスク作成
   */
  async create(userId: string, data: CreateTaskData): Promise<Task> {
    // ポイント範囲バリデーション
    const range = POINT_RANGES[data.difficulty];
    if (data.points < range.min || data.points > range.max) {
      throw new ValidationError(
        `${range.label}の難易度では${range.min}〜${range.max}ポイントの範囲で設定してください`,
        { points: [`${range.min}〜${range.max}の範囲で入力してください`] }
      );
    }

    const task: Task = {
      id: this.generateId(),
      userId,
      title: data.title,
      description: data.description || null,
      completed: false,
      completedAt: null,
      difficulty: data.difficulty,
      points: data.points,
      categoryId: data.categoryId,
      dueDate: data.dueDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * タスク取得
   */
  async getById(userId: string, taskId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task || task.userId !== userId) {
      throw new TaskNotFoundError(taskId);
    }
    return task;
  }

  /**
   * タスク更新（名前・説明・カテゴリのみ）
   */
  async update(userId: string, taskId: string, data: UpdateTaskData): Promise<Task> {
    const task = await this.getById(userId, taskId);

    if (data.title !== undefined) {
      task.title = data.title;
    }
    if (data.description !== undefined) {
      task.description = data.description || null;
    }
    if (data.categoryId !== undefined) {
      task.categoryId = data.categoryId;
    }

    task.updatedAt = new Date();
    return task;
  }

  /**
   * タスク削除
   */
  async delete(userId: string, taskId: string): Promise<void> {
    const task = await this.getById(userId, taskId);
    this.tasks.delete(task.id);
  }

  /**
   * タスク完了
   */
  async complete(userId: string, taskId: string): Promise<{
    task: Task;
    pointsEarned: number;
    xpEarned: number;
    leveledUp: boolean;
    newLevel: number;
    newBadges: string[];
  }> {
    const task = await this.getById(userId, taskId);

    if (task.completed) {
      throw new TaskAlreadyCompletedError();
    }

    // タスクを完了に
    task.completed = true;
    task.completedAt = new Date();
    task.updatedAt = new Date();

    // ポイント付与
    await userService.addPoints(userId, task.points);

    // 経験値付与
    const xpEarned = task.points * XP_REWARDS.taskComplete;
    const { leveledUp, newLevel } = await userService.addXP(userId, xpEarned);

    // バッジ判定
    const newBadges = await badgeService.checkAndAwardBadges(userId);

    return {
      task,
      pointsEarned: task.points,
      xpEarned,
      leveledUp,
      newLevel,
      newBadges,
    };
  }

  /**
   * タスク未完了に戻す
   */
  async uncomplete(userId: string, taskId: string): Promise<{
    task: Task;
    pointsDeducted: number;
  }> {
    const task = await this.getById(userId, taskId);

    if (!task.completed) {
      throw new TaskNotCompletedError();
    }

    // タスクを未完了に
    task.completed = false;
    task.completedAt = null;
    task.updatedAt = new Date();

    // ポイント減算
    await userService.deductPoints(userId, task.points);

    return {
      task,
      pointsDeducted: task.points,
    };
  }

  /**
   * ユーザーの完了タスク数取得
   */
  async getCompletedCount(userId: string): Promise<number> {
    return Array.from(this.tasks.values()).filter(t => t.userId === userId && t.completed).length;
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const taskService = new TaskService();
