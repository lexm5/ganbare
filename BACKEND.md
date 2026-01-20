# バックエンド設計書

やる気支援アプリのバックエンド開発に必要な情報をまとめています。

## 目次

1. [エンティティ/型定義](#エンティティ型定義)
2. [データベース設計](#データベース設計)
3. [API設計](#api設計)
4. [ビジネスロジック](#ビジネスロジック)

---

## エンティティ/型定義

### User（ユーザー）

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  level: number;           // 現在のレベル
  currentXP: number;       // 現在の経験値
  totalEarnedPoints: number;   // 累計獲得ポイント
  totalSpentPoints: number;    // 累計使用ポイント
  currentPoints: number;       // 現在のポイント残高
  createdAt: string;
  updatedAt: string;
}
```

### Task（タスク）

```typescript
type Difficulty = 'easy' | 'medium' | 'hard';

interface Task {
  id: string;
  userId: string;          // FK: User
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;    // 完了日時
  difficulty: Difficulty;
  points: number;          // 1-30（難易度により範囲制限）
  categoryId: string;      // FK: Category
  dueDate?: string;        // 期限日（YYYY-MM-DD）
  createdAt: string;
  updatedAt: string;
}
```

**難易度ごとのポイント範囲:**
| 難易度 | ラベル | ポイント範囲 |
|--------|--------|--------------|
| easy   | 簡単   | 1 〜 5       |
| medium | 普通   | 5 〜 15      |
| hard   | 難しい | 15 〜 30     |

### Category（カテゴリ）

```typescript
interface Category {
  id: string;
  userId?: string;         // FK: User（nullならデフォルトカテゴリ）
  name: string;
  color: string;           // HEXカラー（例: '#1976d2'）
  isDefault: boolean;      // システムデフォルトか
  createdAt: string;
}
```

**デフォルトカテゴリ:**
| ID        | 名前   | 色      |
|-----------|--------|---------|
| work      | 仕事   | #1976d2 |
| study     | 勉強   | #9c27b0 |
| housework | 家事   | #4caf50 |
| hobby     | 趣味   | #ff9800 |

### Habit（習慣）

```typescript
interface Habit {
  id: string;
  userId: string;          // FK: User
  name: string;
  icon?: string;           // アイコン識別子
  streak: number;          // 現在の連続日数
  bestStreak: number;      // 最長連続記録
  createdAt: string;
  updatedAt: string;
}
```

### HabitLog（習慣ログ）

```typescript
interface HabitLog {
  id: string;
  habitId: string;         // FK: Habit
  completedAt: string;     // 完了日（YYYY-MM-DD）
}
```

### Reward（ご褒美）

```typescript
interface Reward {
  id: string;
  userId: string;          // FK: User
  name: string;
  description: string;
  cost: number;            // 必要ポイント
  icon?: string;
  redeemed: boolean;       // 交換済みか
  redeemedAt?: string;     // 交換日時
  createdAt: string;
}
```

### Badge（バッジ）

```typescript
interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;            // アイコン識別子
  condition: string;       // 解除条件（JSON or 識別子）
}

interface UserBadge {
  id: string;
  userId: string;          // FK: User
  badgeId: string;         // FK: BadgeDefinition
  unlockedAt: string;      // 獲得日時
}
```

**バッジ定義例:**
| ID | 名前 | 条件 |
|----|------|------|
| first_task | 初めの一歩 | 最初のタスクを完了 |
| streak_7 | 7日連続 | 7日間連続でタスクを完了 |
| early_bird | 早起きマスター | 朝6時前に5回ログイン |
| pomodoro_10 | 集中の達人 | ポモドーロを10回完了 |
| habit_30 | 習慣の力 | 30日間連続で習慣を達成 |

### PomodoroSession（ポモドーロセッション）

```typescript
interface PomodoroSession {
  id: string;
  userId: string;          // FK: User
  duration: number;        // 分（通常25分）
  type: 'work' | 'break';  // 作業 or 休憩
  completedAt: string;
}
```

---

## データベース設計

### ER図（概要）

```
User 1 ──< Task
User 1 ──< Category
User 1 ──< Habit 1 ──< HabitLog
User 1 ──< Reward
User 1 ──< UserBadge >── BadgeDefinition
User 1 ──< PomodoroSession
```

### テーブル定義

#### users

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| name | VARCHAR(100) | NOT NULL | |
| password_hash | VARCHAR(255) | NOT NULL | |
| level | INT | DEFAULT 1 | |
| current_xp | INT | DEFAULT 0 | |
| total_earned_points | INT | DEFAULT 0 | |
| total_spent_points | INT | DEFAULT 0 | |
| current_points | INT | DEFAULT 0 | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

#### categories

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | VARCHAR(50) | PK | |
| user_id | UUID | FK (nullable) | nullならデフォルト |
| name | VARCHAR(50) | NOT NULL | |
| color | VARCHAR(7) | NOT NULL | HEXカラー |
| is_default | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### tasks

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| user_id | UUID | FK, NOT NULL | |
| title | VARCHAR(200) | NOT NULL | |
| description | TEXT | | |
| completed | BOOLEAN | DEFAULT false | |
| completed_at | TIMESTAMP | | |
| difficulty | ENUM | NOT NULL | easy/medium/hard |
| points | INT | NOT NULL | 1-30 |
| category_id | VARCHAR(50) | FK, NOT NULL | |
| due_date | DATE | | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

#### habits

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| user_id | UUID | FK, NOT NULL | |
| name | VARCHAR(100) | NOT NULL | |
| icon | VARCHAR(50) | | |
| streak | INT | DEFAULT 0 | |
| best_streak | INT | DEFAULT 0 | |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | | |

#### habit_logs

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| habit_id | UUID | FK, NOT NULL | |
| completed_at | DATE | NOT NULL | |
| | | UNIQUE(habit_id, completed_at) | 1日1回 |

#### rewards

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| user_id | UUID | FK, NOT NULL | |
| name | VARCHAR(100) | NOT NULL | |
| description | TEXT | | |
| cost | INT | NOT NULL | |
| icon | VARCHAR(50) | | |
| redeemed | BOOLEAN | DEFAULT false | |
| redeemed_at | TIMESTAMP | | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

#### badge_definitions

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | VARCHAR(50) | PK | |
| name | VARCHAR(100) | NOT NULL | |
| description | TEXT | | |
| icon | VARCHAR(50) | NOT NULL | |
| condition_type | VARCHAR(50) | NOT NULL | |
| condition_value | INT | | |

#### user_badges

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| user_id | UUID | FK, NOT NULL | |
| badge_id | VARCHAR(50) | FK, NOT NULL | |
| unlocked_at | TIMESTAMP | DEFAULT NOW() | |
| | | UNIQUE(user_id, badge_id) | |

#### pomodoro_sessions

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | |
| user_id | UUID | FK, NOT NULL | |
| duration | INT | NOT NULL | 分 |
| type | ENUM | NOT NULL | work/break |
| completed_at | TIMESTAMP | DEFAULT NOW() | |

---

## API設計

### 認証

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | /api/auth/register | ユーザー登録 |
| POST | /api/auth/login | ログイン |
| POST | /api/auth/logout | ログアウト |
| GET | /api/auth/me | 現在のユーザー情報 |

### タスク

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/tasks | タスク一覧取得 |
| POST | /api/tasks | タスク作成 |
| GET | /api/tasks/:id | タスク詳細取得 |
| PATCH | /api/tasks/:id | タスク更新（名前・説明・カテゴリのみ） |
| DELETE | /api/tasks/:id | タスク削除 |
| POST | /api/tasks/:id/complete | タスク完了（ポイント付与） |
| POST | /api/tasks/:id/uncomplete | タスク未完了に戻す（ポイント減算） |

**クエリパラメータ（GET /api/tasks）:**
- `status`: all / pending / completed
- `categoryId`: カテゴリID
- `difficulty`: easy / medium / hard
- `search`: 検索キーワード

### カテゴリ

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/categories | カテゴリ一覧 |
| POST | /api/categories | カテゴリ作成 |
| DELETE | /api/categories/:id | カテゴリ削除 |

### 習慣

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/habits | 習慣一覧 |
| POST | /api/habits | 習慣作成 |
| DELETE | /api/habits/:id | 習慣削除 |
| POST | /api/habits/:id/check | 今日の習慣をチェック |
| DELETE | /api/habits/:id/check | 今日のチェックを解除 |

### ご褒美

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/rewards | ご褒美一覧 |
| POST | /api/rewards | ご褒美作成 |
| DELETE | /api/rewards/:id | ご褒美削除 |
| POST | /api/rewards/:id/redeem | ご褒美交換（ポイント消費） |

### バッジ

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/badges | バッジ一覧（獲得状況含む） |

### ポモドーロ

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | /api/pomodoro/complete | セッション完了を記録 |
| GET | /api/pomodoro/stats | ポモドーロ統計 |

### 統計

| Method | Endpoint | 説明 |
|--------|----------|------|
| GET | /api/stats/overview | 全体統計 |
| GET | /api/stats/weekly | 週間統計 |

---

## ビジネスロジック

### ポイント計算

1. **タスク完了時**: `user.current_points += task.points`
2. **タスク未完了に戻す**: `user.current_points -= task.points`
3. **ご褒美交換時**: `user.current_points -= reward.cost`

### 経験値とレベル

```
レベルアップに必要なXP = レベル × 100

例:
- Lv1 → Lv2: 100 XP
- Lv2 → Lv3: 200 XP
- Lv5 → Lv6: 500 XP
```

**XP獲得:**
- タスク完了: ポイントと同じXPを獲得
- 習慣完了: 5 XP / 回
- ポモドーロ完了: 10 XP / セッション

### 習慣の連続記録（Streak）

1. 習慣をチェックした日を `habit_logs` に記録
2. 毎日0時（または設定時刻）にバッチ処理:
   - 昨日チェックしていない習慣の `streak` を 0 にリセット
3. チェック時に昨日もチェック済みなら `streak++`
4. `streak > best_streak` なら `best_streak` を更新

### バッジ解除条件

| バッジID | 条件チェック |
|----------|--------------|
| first_task | 完了タスク数 >= 1 |
| streak_7 | いずれかの習慣の streak >= 7 |
| early_bird | 6時前ログイン回数 >= 5 |
| pomodoro_10 | ポモドーロ完了数 >= 10 |
| habit_30 | いずれかの習慣の streak >= 30 |

### 編集制限

**タスク編集時に変更可能な項目:**
- ✅ タスク名 (title)
- ✅ 説明 (description)
- ✅ カテゴリ (categoryId)

**変更不可（作成時に固定）:**
- ❌ 難易度 (difficulty)
- ❌ ポイント (points)
- ❌ 期限日 (dueDate)

---

## 補足

### 日付フォーマット

- 日付のみ: `YYYY-MM-DD`（例: 2024-01-20）
- 日時: ISO 8601（例: 2024-01-20T15:30:00Z）
- 表示用: `YYYY/MM/DD`（例: 2024/01/20）

### エラーレスポンス

```json
{
  "error": {
    "code": "INSUFFICIENT_POINTS",
    "message": "ポイントが不足しています"
  }
}
```

**エラーコード例:**
- `INSUFFICIENT_POINTS`: ポイント不足
- `ALREADY_REDEEMED`: 既に交換済み
- `TASK_ALREADY_COMPLETED`: タスク既に完了
- `CATEGORY_IN_USE`: カテゴリが使用中で削除不可
