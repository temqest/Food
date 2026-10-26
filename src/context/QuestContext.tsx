import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ExplorerRank,
  EXPLORER_RANKS,
  BadgeItem,
  COLLECTIBLE_BADGES,
  QuestItem,
  DAILY_QUESTS,
  TastingEntry,
  FoodTrail,
  FOOD_TRAILS,
  MysteryDrop,
  MYSTERY_DROPS,
  NAGA_DISTRICTS_DATA,
  StreakTrophy,
  STREAK_TROPHIES,
} from '@/data/gamification';

interface DistrictProgress {
  total: number;
  visited: number;
  percent: number;
}

interface QuestContextType {
  xp: number;
  currentRank: ExplorerRank;
  nextRank: ExplorerRank | null;
  rankProgressPercent: number;
  unlockedBadgeIds: string[];
  unlockedBadges: BadgeItem[];
  completedQuestIds: string[];
  tastingLog: TastingEntry[];
  trails: FoodTrail[];
  dailyQuests: QuestItem[];
  recentUnlockedBadge: BadgeItem | null;

  // Stilitio Mystery Box State
  isMysteryBoxOpenedToday: boolean;
  mysteryDrop: MysteryDrop | null;
  openMysteryBox: () => MysteryDrop;
  rerollMysteryBox: () => MysteryDrop;

  // Streak & Habit State
  streakCount: number;
  streakFreezeCount: number;
  todayCheckInDone: boolean;
  reminderTime: '11:45 AM' | '3:45 PM' | '6:30 PM' | 'off';
  trophies: StreakTrophy[];
  checkInToday: () => { xpAwarded: number; newStreak: number };
  setReminderTime: (time: '11:45 AM' | '3:45 PM' | '6:30 PM' | 'off') => void;
  useSiliShield: () => boolean;

  // Actions
  addXp: (amount: number) => void;
  logTasting: (entry: Omit<TastingEntry, 'id' | 'date'>) => { newBadgeAwarded?: BadgeItem };
  completeQuest: (questId: string) => void;
  claimQuestReward: (questId: string) => { xpAwarded: number; newBadgeAwarded?: BadgeItem };
  isFoodLogged: (foodId: string) => boolean;
  isBadgeUnlocked: (badgeId: string) => boolean;
  clearRecentBadge: () => void;
  getDistrictProgress: (districtQuery: string) => DistrictProgress;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

// Initial seeds for a lively user starting experience
const INITIAL_TASTINGS: TastingEntry[] = [
  {
    id: 'taste-001',
    foodId: 'kinalas',
    foodName: 'Kinalas',
    establishmentId: 'cha-chas-kinalas',
    establishmentName: "Cha-Cha's Kinalas Station",
    date: 'Yesterday, 1:15 PM',
    rating: 5,
    spiceRating: 4,
    notes: 'Incredible brain gravy with crunchy toasted garlic and spicy sili kick!',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'taste-002',
    foodId: 'toasted-siopao',
    foodName: 'Naga Toasted Siopao',
    establishmentId: 'pan-de-naga-heritage',
    establishmentName: 'Pan De Naga Heritage Bakery',
    date: '3 days ago, 4:00 PM',
    rating: 5,
    spiceRating: 1,
    notes: 'Flaky crust hot from the oven with savory asado & salted egg yolk.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
];

export const QuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(420); // Broth Seeker level initial
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<string[]>([
    'kinalas-initiate',
    'toasted-siopao-run',
  ]);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [tastingLog, setTastingLog] = useState<TastingEntry[]>(INITIAL_TASTINGS);
  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<BadgeItem | null>(null);

  // Mystery Box State
  const [isMysteryBoxOpenedToday, setIsMysteryBoxOpenedToday] = useState<boolean>(false);
  const [mysteryDrop, setMysteryDrop] = useState<MysteryDrop | null>(null);

  // Streak & Habit State
  const [streakCount, setStreakCount] = useState<number>(5);
  const [streakFreezeCount, setStreakFreezeCount] = useState<number>(2);
  const [todayCheckInDone, setTodayCheckInDone] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<'11:45 AM' | '3:45 PM' | '6:30 PM' | 'off'>('3:45 PM');
  const [trophies, setTrophies] = useState<StreakTrophy[]>(STREAK_TROPHIES);

  const checkInToday = () => {
    if (todayCheckInDone) {
      return { xpAwarded: 0, newStreak: streakCount };
    }
    const xpReward = 30;
    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    setTodayCheckInDone(true);
    addXp(xpReward);

    // Check if 7-day trophy unlocks
    if (newStreak >= 7) {
      setTrophies((prev) =>
        prev.map((t) => (t.id === 'trophy-silver-7' ? { ...t, unlocked: true, unlockedDate: 'Today' } : t))
      );
    }
    return { xpAwarded: xpReward, newStreak };
  };

  const useSiliShield = () => {
    if (streakFreezeCount <= 0) return false;
    setStreakFreezeCount((prev) => prev - 1);
    return true;
  };

  // Compute Rank based on XP
  const { currentRank, nextRank, rankProgressPercent } = useMemo(() => {
    let rank = EXPLORER_RANKS[0];
    let next: ExplorerRank | null = EXPLORER_RANKS[1] || null;

    for (let i = 0; i < EXPLORER_RANKS.length; i++) {
      if (xp >= EXPLORER_RANKS[i].minXp) {
        rank = EXPLORER_RANKS[i];
        next = EXPLORER_RANKS[i + 1] || null;
      }
    }

    let progress = 100;
    if (next) {
      const range = next.minXp - rank.minXp;
      const currentInRank = xp - rank.minXp;
      progress = Math.min(100, Math.max(0, Math.round((currentInRank / range) * 100)));
    }

    return { currentRank: rank, nextRank: next, rankProgressPercent: progress };
  }, [xp]);

  const unlockedBadges = useMemo(() => {
    return COLLECTIBLE_BADGES.filter((b) => unlockedBadgeIds.includes(b.id));
  }, [unlockedBadgeIds]);

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const openMysteryBox = (): MysteryDrop => {
    // Pick a random drop
    const drop = MYSTERY_DROPS[Math.floor(Math.random() * MYSTERY_DROPS.length)];
    setMysteryDrop(drop);
    setIsMysteryBoxOpenedToday(true);

    // Award XP
    addXp(drop.xpReward);

    // Unlock 'mystery-box-unboxed' badge
    if (!unlockedBadgeIds.includes('mystery-box-unboxed')) {
      const luckyBadge = COLLECTIBLE_BADGES.find((b) => b.id === 'mystery-box-unboxed');
      if (luckyBadge) {
        setUnlockedBadgeIds((prev) => [...prev, 'mystery-box-unboxed']);
        setRecentUnlockedBadge(luckyBadge);
        addXp(luckyBadge.xpReward);
      }
    }

    return drop;
  };

  const rerollMysteryBox = (): MysteryDrop => {
    // Pick another random drop distinct from current
    const remaining = MYSTERY_DROPS.filter((d) => d.id !== mysteryDrop?.id);
    const drop = remaining[Math.floor(Math.random() * remaining.length)] || MYSTERY_DROPS[0];
    setMysteryDrop(drop);
    addXp(25); // bonus re-roll XP
    return drop;
  };

  const completeQuest = (questId: string) => {
    if (completedQuestIds.includes(questId)) return;
    const quest = DAILY_QUESTS.find((q) => q.id === questId);
    setCompletedQuestIds((prev) => [...prev, questId]);
    if (quest) {
      addXp(quest.xpReward);
    }
  };

  const claimQuestReward = (questId: string): { xpAwarded: number; newBadgeAwarded?: BadgeItem } => {
    if (completedQuestIds.includes(questId)) {
      return { xpAwarded: 0 };
    }
    const quest = DAILY_QUESTS.find((q) => q.id === questId);
    const reward = quest ? quest.xpReward : 40;
    setCompletedQuestIds((prev) => [...prev, questId]);
    addXp(reward);

    let newBadge: BadgeItem | undefined;
    // Check if Centro badge unlocked
    if (quest?.district.toLowerCase().includes('centro') && !unlockedBadgeIds.includes('district-centro-scout')) {
      const centroBadge = COLLECTIBLE_BADGES.find((b) => b.id === 'district-centro-scout');
      if (centroBadge) {
        setUnlockedBadgeIds((prev) => [...prev, 'district-centro-scout']);
        setRecentUnlockedBadge(centroBadge);
        addXp(centroBadge.xpReward);
        newBadge = centroBadge;
      }
    }

    return { xpAwarded: reward, newBadgeAwarded: newBadge };
  };

  const isFoodLogged = (foodId: string) => {
    return tastingLog.some((t) => t.foodId === foodId);
  };

  const isBadgeUnlocked = (badgeId: string) => {
    return unlockedBadgeIds.includes(badgeId);
  };

  const clearRecentBadge = () => {
    setRecentUnlockedBadge(null);
  };

  const logTasting = (entry: Omit<TastingEntry, 'id' | 'date'>) => {
    const newEntry: TastingEntry = {
      ...entry,
      id: `taste-${Date.now()}`,
      date: 'Just now',
    };

    setTastingLog((prev) => [newEntry, ...prev]);
    addXp(60); // base tasting XP

    // If streak not checked in today, logging a tasting counts as today's streak activity!
    if (!todayCheckInDone) {
      setTodayCheckInDone(true);
      setStreakCount((s) => s + 1);
    }

    let newlyAwarded: BadgeItem | undefined;

    // Check automatic badge unlock: e.g. sili-survivor
    if (entry.spiceRating >= 4 && !unlockedBadgeIds.includes('sili-survivor')) {
      newlyAwarded = COLLECTIBLE_BADGES.find((b) => b.id === 'sili-survivor');
      if (newlyAwarded) {
        setUnlockedBadgeIds((prev) => [...prev, 'sili-survivor']);
        setRecentUnlockedBadge(newlyAwarded);
        addXp(newlyAwarded.xpReward);
      }
    }

    return { newBadgeAwarded: newlyAwarded };
  };

  const getDistrictProgress = (districtQuery: string): DistrictProgress => {
    const query = districtQuery.toLowerCase();
    const meta = NAGA_DISTRICTS_DATA.find(
      (d) => d.name.toLowerCase().includes(query) || d.id.toLowerCase().includes(query)
    );
    const total = meta ? meta.spotsCount : 4;
    // Count distinct foods logged in this district
    const countVisited = tastingLog.filter((t) => {
      if (query.includes('bagumbayan') || query.includes('barlin')) {
        return t.foodId === 'kinalas';
      }
      if (query.includes('centro')) {
        return t.foodId === 'toasted-siopao' || t.foodId === 'pinangat';
      }
      if (query.includes('magsaysay')) {
        return t.foodId === 'sinanglay' || t.foodId === 'bicol-express';
      }
      return false;
    }).length;

    const visited = Math.min(total, Math.max(1, countVisited));
    const percent = Math.round((visited / total) * 100);
    return { total, visited, percent };
  };

  return (
    <QuestContext.Provider
      value={{
        xp,
        currentRank,
        nextRank,
        rankProgressPercent,
        unlockedBadgeIds,
        unlockedBadges,
        completedQuestIds,
        tastingLog,
        trails: FOOD_TRAILS,
        dailyQuests: DAILY_QUESTS,
        recentUnlockedBadge,
        isMysteryBoxOpenedToday,
        mysteryDrop,
        openMysteryBox,
        rerollMysteryBox,
        streakCount,
        streakFreezeCount,
        todayCheckInDone,
        reminderTime,
        trophies,
        checkInToday,
        setReminderTime,
        useSiliShield,
        addXp,
        logTasting,
        completeQuest,
        claimQuestReward,
        isFoodLogged,
        isBadgeUnlocked,
        clearRecentBadge,
        getDistrictProgress,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};
