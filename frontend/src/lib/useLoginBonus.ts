'use client';

import { useState, useEffect } from 'react';

const LAST_LOGIN_KEY = 'lastLoginDate';
const STREAK_KEY = 'loginStreak';
const DAILY_BONUS = 1;
const WEEKLY_BONUS = 5;
const STREAK_GOAL = 7;

interface UseLoginBonusResult {
  showBonus: boolean;
  bonusPoints: number;
  streakDays: number;
  isWeeklyBonus: boolean;
  claimBonus: () => void;
  dismissBonus: () => void;
}

function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function isToday(dateString: string): boolean {
  return new Date(dateString).toDateString() === new Date().toDateString();
}

export function useLoginBonus(): UseLoginBonusResult {
  const [showBonus, setShowBonus] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(DAILY_BONUS);
  const [streakDays, setStreakDays] = useState(1);
  const [isWeeklyBonus, setIsWeeklyBonus] = useState(false);

  useEffect(() => {
    const lastLogin = localStorage.getItem(LAST_LOGIN_KEY);
    const savedStreak = parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);

    if (!lastLogin || !isToday(lastLogin)) {
      // 今日初めてのログイン
      let newStreak = 1;

      if (lastLogin && isYesterday(lastLogin)) {
        // 昨日もログインしていた → 連続記録を継続
        newStreak = savedStreak + 1;
      }
      // それ以外（初回 or 連続が途切れた）→ リセットして1から

      setStreakDays(newStreak);

      // 7日達成チェック
      if (newStreak > 0 && newStreak % STREAK_GOAL === 0) {
        setBonusPoints(DAILY_BONUS + WEEKLY_BONUS);
        setIsWeeklyBonus(true);
      } else {
        setBonusPoints(DAILY_BONUS);
        setIsWeeklyBonus(false);
      }

      setShowBonus(true);
    } else {
      // 今日すでにログイン済み
      setStreakDays(savedStreak);
    }
  }, []);

  const claimBonus = () => {
    const today = new Date().toDateString();
    localStorage.setItem(LAST_LOGIN_KEY, today);
    localStorage.setItem(STREAK_KEY, streakDays.toString());
    setShowBonus(false);
  };

  const dismissBonus = () => {
    const today = new Date().toDateString();
    localStorage.setItem(LAST_LOGIN_KEY, today);
    localStorage.setItem(STREAK_KEY, streakDays.toString());
    setShowBonus(false);
  };

  return {
    showBonus,
    bonusPoints,
    streakDays,
    isWeeklyBonus,
    claimBonus,
    dismissBonus,
  };
}
