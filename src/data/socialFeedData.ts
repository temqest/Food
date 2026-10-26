import { getDiceBearAvatar } from '@/utils/dicebearAvatar';

export interface PostAuthor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isBusiness: boolean;
  isVerified?: boolean;
  badge?: string; // e.g. "Verified Carinderia", "Foodie Lv. 4", "Bicolano Explorer"
}

export interface SocialComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  isVerified?: boolean;
}

export interface SocialPost {
  id: string;
  author: PostAuthor;
  postType: 'trip' | 'food_review' | 'business_announcement' | 'dish_spotlight';
  timestamp: string;
  establishmentId?: string;
  establishmentName?: string;
  district?: string;
  foodId?: string;
  foodName?: string;
  foodPrice?: string;
  image: string;
  caption: string;
  insiderTip?: string;
  spiceLevel?: 'mild' | 'moderate' | 'fiery';
  rating?: number; // 1 to 5
  likesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  commentsCount: number;
  comments: SocialComment[];
  tripStopCount?: number;
  tags: string[];
}

export interface NagaMomentStory {
  id: string;
  author: PostAuthor;
  image: string;
  caption: string;
  timeAgo: string;
  isUnread: boolean;
  establishmentId?: string;
}

export const INITIAL_STORIES: NagaMomentStory[] = [
  {
    id: 'story-1',
    author: {
      id: 'biz_chacha',
      name: "Cha Cha's Kinalas",
      handle: '@chachaskinalas',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Heritage Eatery',
    },
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    caption: 'Fresh morning broth simmering right now! Bone brain gravy is thick today. Come by before 1 PM! 🍲',
    timeAgo: '20m ago',
    isUnread: true,
    establishmentId: 'chacha-kinalas',
  },
  {
    id: 'story-2',
    author: {
      id: 'usr_crawlers',
      name: 'Naga Food Patrol',
      handle: '@bicolcrawlers',
      avatar: getDiceBearAvatar('Naga Food Patrol'),
      isBusiness: false,
      badge: 'Expedition Guide',
    },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    caption: 'Stop #3 on our Centro Afternoon Food Crawl. Who knew Pan Bonete paired so well with native tsokolate? ☕',
    timeAgo: '45m ago',
    isUnread: true,
  },
  {
    id: 'story-3',
    author: {
      id: 'biz_bobmarlin',
      name: 'Bob Marlin Resto',
      handle: '@bobmarlinnaga',
      avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Verified Restaurant',
    },
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    caption: 'Crispy Pata & creamy Bicol Express ready for tonight’s live acoustic session on Magsaysay! 🎸',
    timeAgo: '1h ago',
    isUnread: true,
    establishmentId: 'bob-marlin',
  },
  {
    id: 'story-4',
    author: {
      id: 'usr_maria',
      name: 'Maria Santos',
      handle: '@mariasantos',
      avatar: getDiceBearAvatar('Maria Santos'),
      isBusiness: false,
      badge: 'Foodie Lv. 4',
    },
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
    caption: 'Toasted Siopao fresh from the brick oven at Baker’s Plaza. That crunchy crust is unmatched! 🔥',
    timeAgo: '2h ago',
    isUnread: false,
    establishmentId: 'bakers-plaza',
  },
  {
    id: 'story-5',
    author: {
      id: 'biz_geewan',
      name: 'Geewan Bicolano',
      handle: '@geewannaga',
      avatar: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=300&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Iconic Kitchen',
    },
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    caption: 'Special Laing na may Bagis (toasted coconut crab) available for lunch today. Very limited pots!',
    timeAgo: '3h ago',
    isUnread: false,
    establishmentId: 'geewan',
  },
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    author: {
      id: 'usr_crawlers',
      name: 'Bikolano Nomad',
      handle: '@bicolanonomad',
      avatar: getDiceBearAvatar('Bikolano Nomad'),
      isBusiness: false,
      badge: 'Trail Leader',
    },
    postType: 'trip',
    timestamp: '2 hours ago',
    establishmentId: 'chacha-kinalas',
    establishmentName: "Cha Cha's Kinalas",
    district: 'Bagumbayan Norte, Naga City',
    foodId: 'kinalas',
    foodName: 'Kinalas na Baka Especial',
    foodPrice: '₱85',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    caption:
      'Day 1 of our Naga Food Expedition! Nothing prepares you for the sheer umami intensity of genuine Kinalas until you watch the broth ladled straight from the wood-fired cauldron. The gravy coating every strand of miki is pure heaven.',
    insiderTip: 'Drizzle 3 drops of calamansi and half a spoon of toasted chili paste BEFORE stirring the gravy into the broth!',
    spiceLevel: 'fiery',
    rating: 5,
    likesCount: 148,
    isLiked: false,
    isBookmarked: false,
    commentsCount: 19,
    tripStopCount: 4,
    tags: ['#NagaFoodCrawl', '#KinalasRitual', '#BicolStreetEats', '#Bagumbayan'],
    comments: [
      {
        id: 'c1',
        authorName: 'Ramon Velasco',
        authorAvatar: getDiceBearAvatar('Ramon Velasco'),
        content: 'Did you get the extra sili oil? Cha Cha makes the best homemade chili paste in Centro!',
        timestamp: '1h ago',
      },
      {
        id: 'c2',
        authorName: 'Cha Cha’s Kinalas',
        authorAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        content: 'Mabalos for visiting our humble carinderia! Hope you enjoyed the bone brain gravy! 🙏',
        timestamp: '45m ago',
        isVerified: true,
      },
    ],
  },
  {
    id: 'post-2',
    author: {
      id: 'biz_bobmarlin',
      name: 'Bob Marlin Restaurant',
      handle: '@bobmarlinnaga',
      avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Verified Eatery',
    },
    postType: 'business_announcement',
    timestamp: '4 hours ago',
    establishmentId: 'bob-marlin',
    establishmentName: 'Bob Marlin',
    district: 'Magsaysay Avenue, Naga City',
    foodId: 'bicol-express',
    foodName: 'Signature Bicol Express & Pata Combo',
    foodPrice: '₱380',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    caption:
      'Chef’s weekend batch of slow-braised Bicol Express is ready! Cooked with double-pressed coconut milk (kakang gata) and authentic balaw (salted shrimp paste) harvested fresh from San Miguel Bay. Pairs best with our award-winning Crispy Pata.',
    insiderTip: 'Ask your server for our spice adjustment — we can serve it Mild, Bicolano Classic, or Sili Firecracker!',
    spiceLevel: 'fiery',
    rating: 5,
    likesCount: 264,
    isLiked: true,
    isBookmarked: true,
    commentsCount: 34,
    tags: ['#ChefSpecial', '#BicolExpress', '#BobMarlinNaga', '#MagsaysayEats'],
    comments: [
      {
        id: 'c3',
        authorName: 'Tricia Dee',
        authorAvatar: getDiceBearAvatar('Tricia Dee'),
        content: 'Bringing the whole family tonight! Best bicol express in Camarines Sur hands down.',
        timestamp: '3h ago',
      },
    ],
  },
  {
    id: 'post-3',
    author: {
      id: 'usr_maria',
      name: 'Maria Santos',
      handle: '@mariasantos',
      avatar: getDiceBearAvatar('Maria Santos'),
      isBusiness: false,
      badge: 'Foodie Lv. 4',
    },
    postType: 'food_review',
    timestamp: '6 hours ago',
    establishmentId: 'geewan',
    establishmentName: 'Geewan Bicolano Cuisine',
    district: 'P. Burgos St., Centro, Naga City',
    foodId: 'sinanglay',
    foodName: 'Sinanglay na Tilapia sa Gata',
    foodPrice: '₱185',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    caption:
      'Look at that silky coconut broth! Whole freshwater tilapia stuffed with tomatoes, ginger, and wild bird’s eye chilies, then bundled in pechay leaves. The smoky sweetness of fresh kakang gata cuts through the fiery pepper kick flawlessly.',
    insiderTip: 'Spoon the leaf wrap and stuff a forkful of warm steaming garlic rice inside for the ultimate bite.',
    spiceLevel: 'moderate',
    rating: 5,
    likesCount: 92,
    isLiked: false,
    isBookmarked: false,
    commentsCount: 11,
    tags: ['#Sinanglay', '#Geewan', '#GataAndSili', '#BicolHeritage'],
    comments: [
      {
        id: 'c4',
        authorName: 'Mark Alcantara',
        authorAvatar: getDiceBearAvatar('Mark Alcantara'),
        content: 'That leaf bundle keeps the fish so tender it melts on your tongue!',
        timestamp: '5h ago',
      },
    ],
  },
  {
    id: 'post-4',
    author: {
      id: 'usr_paolo',
      name: 'Paolo Reyes',
      handle: '@paoloeats',
      avatar: getDiceBearAvatar('Paolo Reyes'),
      isBusiness: false,
      badge: 'Pastry Explorer',
    },
    postType: 'food_review',
    timestamp: '12 hours ago',
    establishmentId: 'bakers-plaza',
    establishmentName: "Baker's Plaza",
    district: 'Plaza Quezon, Centro',
    foodId: 'toasted-siopao',
    foodName: 'Original Crispy Toasted Siopao',
    foodPrice: '₱25 / pc',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
    caption:
      'Grabbed a dozen fresh out of the morning oven at Plaza Quezon! Unlike regular steamed buns, the Naga toasted siopao has this delicate, golden biscuit-like exterior with savory pork asado and salted egg filling.',
    insiderTip: 'Buy an extra box because they disappear in the car ride home before you even cross the river bridge.',
    spiceLevel: 'mild',
    rating: 5,
    likesCount: 310,
    isLiked: false,
    isBookmarked: false,
    commentsCount: 42,
    tags: ['#ToastedSiopao', '#NagaPasalubong', '#MeriendaTime', '#PlazaQuezon'],
    comments: [
      {
        id: 'c5',
        authorName: 'Gemma Cruz',
        authorAvatar: getDiceBearAvatar('Gemma Cruz'),
        content: 'Always my first stop whenever arriving via Peñafrancia bus terminal!',
        timestamp: '10h ago',
      },
    ],
  },
  {
    id: 'post-5',
    author: {
      id: 'biz_alingcely',
      name: "Aling Cely's Kinalas Pit",
      handle: '@alingcelysnaga',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Legendary Carinderia',
    },
    postType: 'business_announcement',
    timestamp: '1 day ago',
    establishmentId: 'aling-cely',
    establishmentName: "Aling Cely's Kinalas",
    district: 'Barlin St., Santa Cruz, Naga City',
    foodId: 'kinalas',
    foodName: 'Special Noodle Soup w/ Toasted Garlic',
    foodPrice: '₱75',
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&w=900&q=80',
    caption:
      '40 years on Barlin Street and our broth recipe remains untouched. Simmered overnight with beef knuckles and marrow bones. We open at 7:00 AM sharp every morning!',
    insiderTip: 'Pair it with crunchy pork baduya (banana fritters) on the side — true old-school Naga breakfast!',
    spiceLevel: 'moderate',
    rating: 5,
    likesCount: 489,
    isLiked: true,
    isBookmarked: false,
    commentsCount: 57,
    tags: ['#AlingCely', '#BarlinStreet', '#OldSchoolNaga', '#OriginalKinalas'],
    comments: [
      {
        id: 'c6',
        authorName: 'Carlo Mendoza',
        authorAvatar: getDiceBearAvatar('Carlo Mendoza'),
        content: 'My grandfather brought me here in the 80s and the taste is exactly the same today!',
        timestamp: '22h ago',
      },
    ],
  },
];
