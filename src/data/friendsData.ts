import { getDiceBearAvatar } from '@/utils/dicebearAvatar';

export interface RecentTastingSnippet {
  foodName: string;
  establishmentName: string;
  timeAgo: string;
  xpEarned: number;
}

export interface FoodieProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  rankTitle: string;
  level: number;
  streakCount: number;
  weeklyXp: number;
  dishesTastedThisWeek: number;
  isFriend: boolean;
  nudgedToday: boolean;
  recentTasting?: RecentTastingSnippet;
  favoriteDish?: string;
  badgeCount?: number;
}

export interface LeagueDivision {
  id: string;
  name: string;
  tagline: string;
  tierColor: string;
  tierBg: string;
  endsIn: string;
  promotionSpots: number;
  relegationSpots: number;
}

export const CURRENT_LEAGUE_DIVISION: LeagueDivision = {
  id: 'gold-division',
  name: 'División de Oro',
  tagline: 'Top 3 foodies advance to Titano League',
  tierColor: '#D97706', // Warm Amber/Gold
  tierBg: '#FEF3C7',
  endsIn: '2d 14h',
  promotionSpots: 3,
  relegationSpots: 2,
};

export const INITIAL_FOODIE_FRIENDS: FoodieProfile[] = [
  {
    id: 'foodie-maria',
    name: 'Maria Santos',
    handle: '@mariasantos',
    avatar: getDiceBearAvatar('Maria', 'ffd5dc'),
    rankTitle: 'Sili Hunter',
    level: 4,
    streakCount: 14,
    weeklyXp: 780,
    dishesTastedThisWeek: 9,
    isFriend: true,
    nudgedToday: false,
    recentTasting: {
      foodName: 'Kinalas Twin Broth',
      establishmentName: "Cha-Cha's Kinalas",
      timeAgo: '2h ago',
      xpEarned: 60,
    },
    favoriteDish: 'Kinalas',
    badgeCount: 8,
  },
  {
    id: 'foodie-paolo',
    name: 'Paolo Reyes',
    handle: '@paoloeats',
    avatar: getDiceBearAvatar('Paolo', 'b6e3f4'),
    rankTitle: 'Heritage Connoisseur',
    level: 5,
    streakCount: 21,
    weeklyXp: 690,
    dishesTastedThisWeek: 8,
    isFriend: true,
    nudgedToday: false,
    recentTasting: {
      foodName: 'Hot Toasted Siopao',
      establishmentName: 'Pan De Naga Heritage',
      timeAgo: '4h ago',
      xpEarned: 50,
    },
    favoriteDish: 'Toasted Siopao',
    badgeCount: 11,
  },
  {
    id: 'foodie-tricia',
    name: 'Tricia Dee',
    handle: '@triciadee',
    avatar: getDiceBearAvatar('Tricia', 'd1d4f9'),
    rankTitle: 'Broth Seeker',
    level: 3,
    streakCount: 9,
    weeklyXp: 540,
    dishesTastedThisWeek: 6,
    isFriend: true,
    nudgedToday: false,
    recentTasting: {
      foodName: 'Spicy Laing Con Lechon',
      establishmentName: 'Bob Marlin Restaurant',
      timeAgo: 'Yesterday',
      xpEarned: 60,
    },
    favoriteDish: 'Bicol Express',
    badgeCount: 6,
  },
  {
    id: 'foodie-carlo',
    name: 'Carlo Mendoza',
    handle: '@carlocrawls',
    avatar: getDiceBearAvatar('Carlo', 'ffdfbf'),
    rankTitle: 'Broth Seeker',
    level: 3,
    streakCount: 5,
    weeklyXp: 460,
    dishesTastedThisWeek: 5,
    isFriend: true,
    nudgedToday: true,
    recentTasting: {
      foodName: 'Crispy Pata & Pinangat',
      establishmentName: 'Geewan Bicolano Resto',
      timeAgo: '1d ago',
      xpEarned: 70,
    },
    favoriteDish: 'Pinangat',
    badgeCount: 5,
  },
  {
    id: 'foodie-ramon',
    name: 'Ramon Velasco',
    handle: '@ramon_v',
    avatar: getDiceBearAvatar('Ramon', 'c0aede'),
    rankTitle: 'Street Wanderer',
    level: 2,
    streakCount: 3,
    weeklyXp: 380,
    dishesTastedThisWeek: 4,
    isFriend: true,
    nudgedToday: false,
    recentTasting: {
      foodName: 'Sili Ice Cream 3A',
      establishmentName: '1st Colonial Grill',
      timeAgo: '2d ago',
      xpEarned: 40,
    },
    favoriteDish: 'Sili Ice Cream',
    badgeCount: 4,
  },
  {
    id: 'foodie-bea',
    name: 'Bea Alcantara',
    handle: '@beafoodie',
    avatar: getDiceBearAvatar('Bea', 'd5e8d4'),
    rankTitle: 'Street Wanderer',
    level: 2,
    streakCount: 2,
    weeklyXp: 310,
    dishesTastedThisWeek: 3,
    isFriend: false,
    nudgedToday: false,
    recentTasting: {
      foodName: 'Pancit Bato Guisado',
      establishmentName: 'Aling Enta Carinderia',
      timeAgo: '3d ago',
      xpEarned: 40,
    },
    favoriteDish: 'Pancit Bato',
    badgeCount: 3,
  },
  {
    id: 'foodie-mark',
    name: 'Mark Gomez',
    handle: '@mark_naga',
    avatar: getDiceBearAvatar('Mark', 'ffe6cc'),
    rankTitle: 'Foodie Bagito',
    level: 1,
    streakCount: 1,
    weeklyXp: 220,
    dishesTastedThisWeek: 2,
    isFriend: false,
    nudgedToday: false,
    recentTasting: {
      foodName: 'Baduya (Maruya)',
      establishmentName: 'Centro Street Cart',
      timeAgo: '4d ago',
      xpEarned: 30,
    },
    favoriteDish: 'Baduya',
    badgeCount: 2,
  },
];
