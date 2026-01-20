// 難易度の定義
export type Difficulty = 'easy' | 'medium' | 'hard';

// 難易度ごとのポイント範囲
export const POINT_RANGES: Record<Difficulty, { min: number; max: number; label: string }> = {
  easy: { min: 1, max: 5, label: '簡単' },
  medium: { min: 5, max: 15, label: '普通' },
  hard: { min: 15, max: 30, label: '難しい' },
};

// ポイント付きタスク
export interface PointTask {
  id: string;
  title: string;
  completed: boolean;
  difficulty: Difficulty;
  points: number;
}

// ご褒美
export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon?: string;
  redeemed?: boolean;
  redeemedAt?: string;
}

// ユーザーのポイント状況
export interface PointStatus {
  totalEarned: number;    // 累計獲得ポイント
  totalSpent: number;     // 累計使用ポイント
  currentPoints: number;  // 現在のポイント
}
