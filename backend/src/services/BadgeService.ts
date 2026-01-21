import { BadgeDefinition, UserBadge, BADGE_DEFINITIONS } from '../types';

/**
 * バッジ（獲得状況付き）
 */
export interface BadgeWithStatus extends BadgeDefinition {
  unlocked: boolean;
  unlockedAt: Date | null;
}

/**
 * バッジ判定用コンテキスト
 */
export interface BadgeContext {
  tasksCompleted: number;
  habitMaxStreak: number;
  pomodoroCount: number;
  totalPoints: number;
  earlyLogins: number;
}

/**
 * バッジサービス
 */
export class BadgeService {
  // TODO: 実際のDBリポジトリに置き換え
  private userBadges: Map<string, UserBadge> = new Map();

  // バッジ判定用のコンテキスト取得関数（外部から注入）
  private contextProviders: Map<string, (userId: string) => Promise<number>> = new Map();

  /**
   * コンテキストプロバイダー登録
   */
  registerContextProvider(conditionType: string, provider: (userId: string) => Promise<number>): void {
    this.contextProviders.set(conditionType, provider);
  }

  /**
   * バッジ一覧取得（獲得状況付き）
   */
  async list(userId: string): Promise<BadgeWithStatus[]> {
    const userBadges = this.getUserBadges(userId);

    return BADGE_DEFINITIONS.map(badge => {
      const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
      return {
        ...badge,
        unlocked: !!userBadge,
        unlockedAt: userBadge?.unlockedAt || null,
      };
    });
  }

  /**
   * バッジ判定と付与
   * @returns 新しく獲得したバッジIDの配列
   */
  async checkAndAwardBadges(userId: string): Promise<string[]> {
    const newBadges: string[] = [];
    const existingBadges = this.getUserBadges(userId);
    const existingBadgeIds = new Set(existingBadges.map(b => b.badgeId));

    for (const badge of BADGE_DEFINITIONS) {
      // 既に獲得済みならスキップ
      if (existingBadgeIds.has(badge.id)) {
        continue;
      }

      // 条件を満たしているかチェック
      const satisfied = await this.checkCondition(userId, badge);
      if (satisfied) {
        // バッジ付与
        const userBadge: UserBadge = {
          id: this.generateId(),
          userId,
          badgeId: badge.id,
          unlockedAt: new Date(),
        };
        this.userBadges.set(userBadge.id, userBadge);
        newBadges.push(badge.id);
      }
    }

    return newBadges;
  }

  /**
   * 特定のバッジを獲得しているか
   */
  async hasBadge(userId: string, badgeId: string): Promise<boolean> {
    return this.getUserBadges(userId).some(ub => ub.badgeId === badgeId);
  }

  /**
   * ユーザーのバッジ取得
   */
  private getUserBadges(userId: string): UserBadge[] {
    return Array.from(this.userBadges.values()).filter(ub => ub.userId === userId);
  }

  /**
   * バッジ条件チェック
   */
  private async checkCondition(userId: string, badge: BadgeDefinition): Promise<boolean> {
    const provider = this.contextProviders.get(badge.conditionType);
    if (!provider) {
      console.warn(`No context provider for condition type: ${badge.conditionType}`);
      return false;
    }

    const currentValue = await provider(userId);
    return badge.conditionValue !== null && currentValue >= badge.conditionValue;
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `ubadge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const badgeService = new BadgeService();
