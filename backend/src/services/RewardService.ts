import { Reward } from '../types';
import { RewardNotFoundError, InsufficientPointsError, AlreadyRedeemedError } from '../errors';
import { userService } from './UserService';

/**
 * ご褒美サービス
 */
export class RewardService {
  // TODO: 実際のDBリポジトリに置き換え
  private rewards: Map<string, Reward> = new Map();

  /**
   * ご褒美一覧取得
   */
  async list(userId: string, redeemed?: boolean): Promise<Reward[]> {
    let rewards = Array.from(this.rewards.values()).filter(r => r.userId === userId);

    if (redeemed !== undefined) {
      rewards = rewards.filter(r => r.redeemed === redeemed);
    }

    // 作成日時順にソート（未交換を先に）
    return rewards.sort((a, b) => {
      if (a.redeemed !== b.redeemed) {
        return a.redeemed ? 1 : -1;
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }

  /**
   * ご褒美作成
   */
  async create(
    userId: string,
    name: string,
    description: string,
    cost: number,
    icon?: string
  ): Promise<Reward> {
    const reward: Reward = {
      id: this.generateId(),
      userId,
      name,
      description,
      cost,
      icon: icon || null,
      redeemed: false,
      redeemedAt: null,
      createdAt: new Date(),
    };

    this.rewards.set(reward.id, reward);
    return reward;
  }

  /**
   * ご褒美取得
   */
  async getById(userId: string, rewardId: string): Promise<Reward> {
    const reward = this.rewards.get(rewardId);
    if (!reward || reward.userId !== userId) {
      throw new RewardNotFoundError(rewardId);
    }
    return reward;
  }

  /**
   * ご褒美削除
   */
  async delete(userId: string, rewardId: string): Promise<void> {
    const reward = await this.getById(userId, rewardId);
    this.rewards.delete(reward.id);
  }

  /**
   * ご褒美交換
   */
  async redeem(userId: string, rewardId: string): Promise<{
    reward: Reward;
    pointsSpent: number;
    newTotalPoints: number;
  }> {
    const reward = await this.getById(userId, rewardId);

    // 既に交換済みかチェック
    if (reward.redeemed) {
      throw new AlreadyRedeemedError();
    }

    // ポイント残高チェック
    const currentPoints = await userService.getCurrentPoints(userId);
    if (currentPoints < reward.cost) {
      throw new InsufficientPointsError(reward.cost, currentPoints);
    }

    // ポイント消費
    const user = await userService.spendPoints(userId, reward.cost);

    // ご褒美を交換済みに
    reward.redeemed = true;
    reward.redeemedAt = new Date();

    return {
      reward,
      pointsSpent: reward.cost,
      newTotalPoints: user.currentPoints,
    };
  }

  /**
   * ID生成
   */
  private generateId(): string {
    return `reward-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const rewardService = new RewardService();
