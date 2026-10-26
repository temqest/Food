import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuest } from '@/context/QuestContext';
import {
  FoodieProfile,
  LeagueDivision,
  INITIAL_FOODIE_FRIENDS,
  CURRENT_LEAGUE_DIVISION,
} from '@/data/friendsData';

export interface LeaderboardEntry extends FoodieProfile {
  isCurrentUser?: boolean;
  rankPosition: number;
}

interface FriendsContextType {
  division: LeagueDivision;
  friends: FoodieProfile[];
  leaderboard: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry;
  nudgeFriend: (friendId: string) => { success: boolean; friendName: string; alreadyNudged: boolean };
  toggleFollowFriend: (friendId: string) => void;
  addFriendByHandle: (handle: string) => { success: boolean; message: string };
  searchFoodies: (query: string) => FoodieProfile[];
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { xp, streakCount, currentRank, tastingLog } = useQuest();

  const [profiles, setProfiles] = useState<FoodieProfile[]>(INITIAL_FOODIE_FRIENDS);

  // Derive Current User Profile dynamically from Auth and Quest contexts
  const currentUserProfile: FoodieProfile = useMemo(() => {
    const rawName = user?.name || 'Bryl';
    const handle = `@${rawName.toLowerCase().replace(/\s+/g, '')}eats`;
    const avatar = user?.avatar || '';

    // Calculate dynamic weekly dishes and XP from user's current progress
    const dishesCount = Math.max(tastingLog.length + 3, 5);
    const weeklyXp = Math.min(xp, 1200) + (streakCount * 15);

    const latestTasting = tastingLog.length > 0 ? tastingLog[0] : undefined;

    return {
      id: 'current-user',
      name: `${rawName} (You)`,
      handle,
      avatar,
      rankTitle: currentRank?.title || 'Broth Seeker',
      level: currentRank?.level || 3,
      streakCount: streakCount || 5,
      weeklyXp,
      dishesTastedThisWeek: dishesCount,
      isFriend: false,
      nudgedToday: false,
      recentTasting: latestTasting
        ? {
            foodName: latestTasting.foodName,
            establishmentName: latestTasting.establishmentName,
            timeAgo: latestTasting.date,
            xpEarned: 60,
          }
        : {
            foodName: 'Kinalas Special Broth',
            establishmentName: "Cha-Cha's Kinalas",
            timeAgo: 'Today, 12:30 PM',
            xpEarned: 60,
          },
      favoriteDish: 'Kinalas',
      badgeCount: 6,
    };
  }, [user, xp, streakCount, currentRank, tastingLog]);

  // Generate real-time sorted leaderboard including current user
  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    const all = [
      ...profiles.map((p) => ({ ...p, isCurrentUser: false })),
      { ...currentUserProfile, isCurrentUser: true },
    ];

    // Sort descending by weekly XP
    all.sort((a, b) => b.weeklyXp - a.weeklyXp);

    // Assign rank positions (1-indexed)
    return all.map((entry, index) => ({
      ...entry,
      rankPosition: index + 1,
    }));
  }, [profiles, currentUserProfile]);

  const currentUserEntry = useMemo(() => {
    return (
      leaderboard.find((item) => item.isCurrentUser) || {
        ...currentUserProfile,
        isCurrentUser: true,
        rankPosition: 4,
      }
    );
  }, [leaderboard, currentUserProfile]);

  // Filter only added friends
  const friends = useMemo(() => {
    return profiles.filter((p) => p.isFriend);
  }, [profiles]);

  // Send a friendly mealtime nudge ("Tara Kain!")
  const nudgeFriend = (friendId: string) => {
    const target = profiles.find((p) => p.id === friendId);
    if (!target) return { success: false, friendName: '', alreadyNudged: false };

    if (target.nudgedToday) {
      return { success: false, friendName: target.name, alreadyNudged: true };
    }

    setProfiles((prev) =>
      prev.map((item) => (item.id === friendId ? { ...item, nudgedToday: true } : item))
    );

    return { success: true, friendName: target.name, alreadyNudged: false };
  };

  const toggleFollowFriend = (friendId: string) => {
    setProfiles((prev) =>
      prev.map((item) =>
        item.id === friendId ? { ...item, isFriend: !item.isFriend } : item
      )
    );
  };

  const addFriendByHandle = (rawHandle: string) => {
    const cleanHandle = rawHandle.trim().toLowerCase();
    if (!cleanHandle) {
      return { success: false, message: 'Please enter a valid foodie handle.' };
    }

    const formatted = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;

    const existing = profiles.find(
      (p) => p.handle.toLowerCase() === formatted
    );

    if (existing) {
      if (existing.isFriend) {
        return { success: false, message: `${existing.name} is already in your Foodie Squad!` };
      }
      toggleFollowFriend(existing.id);
      return { success: true, message: `Added ${existing.name} to your Foodie Squad!` };
    }

    return { success: false, message: `No foodie found matching "${formatted}".` };
  };

  const searchFoodies = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        p.rankTitle.toLowerCase().includes(q)
    );
  };

  return (
    <FriendsContext.Provider
      value={{
        division: CURRENT_LEAGUE_DIVISION,
        friends,
        leaderboard,
        currentUserEntry,
        nudgeFriend,
        toggleFollowFriend,
        addFriendByHandle,
        searchFoodies,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
