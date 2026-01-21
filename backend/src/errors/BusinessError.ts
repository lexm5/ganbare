import { BadRequestError, ConflictError, NotFoundError } from './AppError';

/**
 * ポイント不足エラー
 */
export class InsufficientPointsError extends BadRequestError {
  constructor(required: number, current: number) {
    super(
      `ポイントが不足しています（必要: ${required} pt、現在: ${current} pt）`,
      'INSUFFICIENT_POINTS'
    );
  }
}

/**
 * 既に交換済みエラー
 */
export class AlreadyRedeemedError extends ConflictError {
  constructor() {
    super('このご褒美は既に交換済みです', 'ALREADY_REDEEMED');
  }
}

/**
 * タスク既に完了エラー
 */
export class TaskAlreadyCompletedError extends ConflictError {
  constructor() {
    super('このタスクは既に完了しています', 'TASK_ALREADY_COMPLETED');
  }
}

/**
 * タスク未完了エラー
 */
export class TaskNotCompletedError extends BadRequestError {
  constructor() {
    super('このタスクはまだ完了していません', 'TASK_NOT_COMPLETED');
  }
}

/**
 * カテゴリ使用中エラー
 */
export class CategoryInUseError extends ConflictError {
  constructor() {
    super('このカテゴリは使用中のため削除できません', 'CATEGORY_IN_USE');
  }
}

/**
 * デフォルトカテゴリ削除エラー
 */
export class DefaultCategoryError extends BadRequestError {
  constructor() {
    super('デフォルトカテゴリは削除できません', 'DEFAULT_CATEGORY');
  }
}

/**
 * 習慣既にチェック済みエラー
 */
export class HabitAlreadyCheckedError extends ConflictError {
  constructor() {
    super('今日は既にチェック済みです', 'HABIT_ALREADY_CHECKED');
  }
}

/**
 * タスクが見つからないエラー
 */
export class TaskNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`タスクが見つかりません（ID: ${id}）`, 'TASK_NOT_FOUND');
  }
}

/**
 * カテゴリが見つからないエラー
 */
export class CategoryNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`カテゴリが見つかりません（ID: ${id}）`, 'CATEGORY_NOT_FOUND');
  }
}

/**
 * ご褒美が見つからないエラー
 */
export class RewardNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`ご褒美が見つかりません（ID: ${id}）`, 'REWARD_NOT_FOUND');
  }
}

/**
 * 習慣が見つからないエラー
 */
export class HabitNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`習慣が見つかりません（ID: ${id}）`, 'HABIT_NOT_FOUND');
  }
}

/**
 * ユーザーが見つからないエラー
 */
export class UserNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`ユーザーが見つかりません（ID: ${id}）`, 'USER_NOT_FOUND');
  }
}
