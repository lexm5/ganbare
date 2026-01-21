import { User, UserWithoutPassword, LEVEL_CONFIG } from '../types';
import { UserNotFoundError, UnauthorizedError, ConflictError } from '../errors';

/**
 * ユーザーサービス
 */
export class UserService {
  // TODO: 実際のDBリポジトリに置き換え
  private users: Map<string, User> = new Map();

  /**
   * ユーザー登録
   */
  async register(email: string, name: string, password: string): Promise<UserWithoutPassword> {
    // メール重複チェック
    const existing = Array.from(this.users.values()).find(u => u.email === email);
    if (existing) {
      throw new ConflictError('このメールアドレスは既に登録されています', 'EMAIL_ALREADY_EXISTS');
    }

    // TODO: パスワードハッシュ化（bcrypt等）
    const passwordHash = password; // 仮実装

    const user: User = {
      id: this.generateId(),
      email,
      name,
      passwordHash,
      level: 1,
      currentXP: 0,
      totalEarnedPoints: 0,
      totalSpentPoints: 0,
      currentPoints: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);
    return this.excludePassword(user);
  }

  /**
   * ログイン
   */
  async login(email: string, password: string): Promise<{ user: UserWithoutPassword; token: string }> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません', 'INVALID_CREDENTIALS');
    }

    // TODO: パスワード検証（bcrypt.compare等）
    if (user.passwordHash !== password) {
      throw new UnauthorizedError('メールアドレスまたはパスワードが正しくありません', 'INVALID_CREDENTIALS');
    }

    // TODO: JWTトークン生成
    const token = `token-${user.id}-${Date.now()}`;

    return { user: this.excludePassword(user), token };
  }

  /**
   * ユーザー取得
   */
  async getById(id: string): Promise<UserWithoutPassword> {
    const user = this.users.get(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return this.excludePassword(user);
  }

  /**
   * ポイント追加
   */
  async addPoints(userId: string, points: number): Promise<UserWithoutPassword> {
    const user = this.users.get(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    user.totalEarnedPoints += points;
    user.currentPoints += points;
    user.updatedAt = new Date();

    return this.excludePassword(user);
  }

  /**
   * ポイント消費
   */
  async spendPoints(userId: string, points: number): Promise<UserWithoutPassword> {
    const user = this.users.get(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    user.totalSpentPoints += points;
    user.currentPoints -= points;
    user.updatedAt = new Date();

    return this.excludePassword(user);
  }

  /**
   * ポイント減算（タスク未完了時）
   */
  async deductPoints(userId: string, points: number): Promise<UserWithoutPassword> {
    const user = this.users.get(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    user.totalEarnedPoints -= points;
    user.currentPoints -= points;
    user.updatedAt = new Date();

    return this.excludePassword(user);
  }

  /**
   * 経験値追加（レベルアップ処理含む）
   */
  async addXP(userId: string, xp: number): Promise<{ user: UserWithoutPassword; leveledUp: boolean; newLevel: number }> {
    const user = this.users.get(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const oldLevel = user.level;
    user.currentXP += xp;

    // レベルアップ処理
    let requiredXP = this.getRequiredXP(user.level);
    while (user.currentXP >= requiredXP) {
      user.currentXP -= requiredXP;
      user.level += 1;
      requiredXP = this.getRequiredXP(user.level);
    }

    user.updatedAt = new Date();

    return {
      user: this.excludePassword(user),
      leveledUp: user.level > oldLevel,
      newLevel: user.level,
    };
  }

  /**
   * 現在のポイント残高取得
   */
  async getCurrentPoints(userId: string): Promise<number> {
    const user = this.users.get(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return user.currentPoints;
  }

  /**
   * レベルアップに必要なXP計算
   */
  getRequiredXP(level: number): number {
    return level * LEVEL_CONFIG.multiplier * LEVEL_CONFIG.baseXP;
  }

  /**
   * パスワードを除外
   */
  private excludePassword(user: User): UserWithoutPassword {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const userService = new UserService();
