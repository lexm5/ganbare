/**
 * ご褒美API
 */
import { get, post, del } from './client';
import { Reward, CreateRewardRequest, RewardRedeemResponse } from './types';

/**
 * ご褒美一覧取得
 */
export async function getRewards(redeemed?: boolean): Promise<{ rewards: Reward[] }> {
  const query = redeemed !== undefined ? `?redeemed=${redeemed}` : '';
  const response = await get<{ rewards: Reward[] }>(`/rewards${query}`);
  return response.data;
}

/**
 * ご褒美作成
 */
export async function createReward(data: CreateRewardRequest): Promise<{ reward: Reward }> {
  const response = await post<{ reward: Reward }>('/rewards', data);
  return response.data;
}

/**
 * ご褒美削除
 */
export async function deleteReward(id: string): Promise<void> {
  await del(`/rewards/${id}`);
}

/**
 * ご褒美交換
 */
export async function redeemReward(id: string): Promise<RewardRedeemResponse> {
  const response = await post<RewardRedeemResponse>(`/rewards/${id}/redeem`);
  return response.data;
}
