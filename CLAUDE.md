# プロジェクト概要

**やる気支援アプリ** - Next.js + TypeScript + Material UI (MUI)

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **UIライブラリ**: Material UI (MUI)
- **スタイリング**: Tailwind CSS + MUI sx props
- **アイコン**: @mui/icons-material

## フォルダ構成

```
frontend/
├── src/
│   ├── app/                          # ページ (App Router)
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # トップ (/)
│   │   ├── dashboard/page.tsx        # ダッシュボード
│   │   ├── tasks/page.tsx            # タスク管理
│   │   ├── habits/page.tsx           # 習慣トラッカー
│   │   ├── stats/page.tsx            # 統計・分析
│   │   ├── timer/page.tsx            # ポモドーロタイマー
│   │   ├── badges/page.tsx           # バッジ・実績
│   │   └── setting/page.tsx          # 設定
│   │
│   ├── context/                      # コンテキスト (状態管理)
│   │   ├── ThemeContext.tsx           # ダーク/ライトモード管理
│   │   └── NotificationContext.tsx   # 通知管理 (localStorage永続化)
│   │
│   └── components/
│       ├── common/                   # 共通コンポーネント
│       │   ├── PageHeader.tsx        # ページヘッダー
│       │   ├── StatCard.tsx          # 統計カード
│       │   ├── ProgressBar.tsx       # プログレスバー
│       │   └── QuoteCard.tsx         # 名言カード
│       │
│       ├── header/                   # ヘッダー関連
│       │   ├── Header.tsx
│       │   ├── Menu.tsx
│       │   ├── SearchBar.tsx
│       │   ├── ProfileMenu.tsx
│       │   ├── TipsMenu.tsx            # Tips/ヒントメニュー
│       │   ├── NotificationsMenu.tsx
│       │   └── MobileMenu.tsx
│       │
│       ├── dashboard/                # ダッシュボード用
│       │   ├── TodayProgress.tsx
│       │   ├── QuickActions.tsx
│       │   └── RecentActivity.tsx
│       │
│       ├── tasks/                    # タスク管理用
│       │   ├── TaskItem.tsx
│       │   ├── TaskList.tsx
│       │   └── TaskForm.tsx
│       │
│       ├── habits/                   # 習慣トラッカー用
│       │   ├── HabitItem.tsx
│       │   ├── HabitList.tsx
│       │   └── StreakBadge.tsx
│       │
│       ├── stats/                    # 統計用
│       │   ├── ChartCard.tsx
│       │   └── WeeklyChart.tsx
│       │
│       ├── timer/                    # タイマー用
│       │   ├── TimerDisplay.tsx
│       │   └── TimerControls.tsx
│       │
│       └── badges/                   # バッジ用
│           ├── BadgeCard.tsx
│           └── LevelProgress.tsx
```

## ページ一覧

| パス | 説明 |
|------|------|
| `/` | トップページ（ランディングページ、機能紹介、ダッシュボードへのCTA） |
| `/dashboard` | ダッシュボード（今日の進捗、統計、クイックアクション） |
| `/tasks` | タスク管理（追加、編集、完了、フィルタ） |
| `/habits` | 習慣トラッカー（毎日のチェック、連続記録） |
| `/stats` | 統計・分析（グラフ、達成率） |
| `/timer` | ポモドーロタイマー（25分集中 + 5分休憩） |
| `/badges` | バッジ・実績（レベル、経験値、獲得バッジ） |
| `/setting` | 設定（プロフィール、テーマ、通知、アカウント） |

## コンポーネント設計方針

1. **パーツ化**: 1ファイル1コンポーネント、再利用可能に
2. **Props型定義**: interfaceで明確に定義
3. **共通化**: `common/` に汎用コンポーネント
4. **機能別分類**: 各機能ごとにフォルダ分け

## 開発コマンド

```bash
cd frontend
npm run dev      # 開発サーバー
npm run build    # ビルド
```

## 主な機能

- **タスク管理**: 優先度付きタスクの追加・完了・削除
- **習慣トラッカー**: 毎日の習慣チェック、連続記録表示
- **ポモドーロタイマー**: 25分集中 + 5分休憩のサイクル
- **バッジ/実績**: 達成時に獲得、レベルアップシステム
- **統計**: 週間グラフ、達成率表示
- **名言表示**: モチベーション向上のためのランダム名言
- **通知システム**: アプリ内通知 (タスク完了、ストリーク達成、バッジ獲得等)、Context + localStorage で永続化
- **Tipsメニュー**: ヘッダーにモチベーション向上のヒント表示（ランダム3件、更新ボタン付き）
- **検索バー**: タスク・習慣をlocalStorageから横断検索、ポップオーバーで結果表示、クリックで該当ページへ遷移
- **データ永続化**: タスク・習慣・ご褒美・ポイントをlocalStorageに自動保存（`useLocalStorage`フック）
- **動的ダッシュボード**: localStorageの実データから統計を集計表示、通知履歴を最近のアクティビティとして表示

## localStorage キー一覧

| キー | 内容 |
|------|------|
| `app_tasks` | タスク一覧 |
| `app_habits` | 習慣一覧 |
| `app_rewards` | ご褒美一覧 |
| `app_point_status` | ポイント状態（獲得/使用/現在） |
| `app_notifications` | 通知一覧 |
| `LAST_LOGIN_KEY` | 最終ログイン日 |
| `STREAK_KEY` | ログインストリーク |

## 通知システム

- `NotificationContext` でアプリ全体の通知状態を管理
- `useNotifications()` フックで通知の追加・既読・削除が可能
- 通知タイプ: `task_complete`, `streak_achieved`, `badge_earned`, `reward_redeemed`, `login_bonus`, `info`
- localStorage に自動保存 (最大50件)
- ヘッダーの通知アイコンから未読件数確認・一覧表示
