import { getDiceBearAvatar } from '@/utils/dicebearAvatar';
import { ImageSourcePropType } from 'react-native';

const FOOD_IMAGES = {
  baduya: require('../../Food Images/Baduya1.jpg'),
  bicolExpress: require('../../Food Images/BicolExpress1.webp'),
  kinalas: require('../../Food Images/kinalas1.webp'),
  laing: require('../../Food Images/Laing1.jpg'),
  sinanglay: require('../../Food Images/sinanglayTilapia1.jpg'),
  toastedSiopao: require('../../Food Images/toastedSiopao1.jpg'),
} as const;

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

export interface EngagementPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface EngagementPoll {
  question: string;
  options: EngagementPollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  rewardCode?: string;
  rewardDescription?: string;
}

export interface AdvertisementData {
  badge: string; // e.g. "SPONSORED" or "PROMOTED DEAL"
  headline: string;
  targetDistrict?: string;
  expirationNote?: string;
  callToAction: {
    label: string; // e.g. "Claim 20% OFF Voucher"
    actionType: 'claim_voucher' | 'order_now' | 'view_establishment';
    voucherCode?: string;
    discountBadge?: string;
    claimedCount?: number;
    totalAvailable?: number;
    isClaimed?: boolean;
  };
  poll?: EngagementPoll;
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
  image: string | ImageSourcePropType;
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
  aspectRatio?: number;
  isSponsored?: boolean;
  advertisement?: AdvertisementData;
}

export interface NagaMomentStory {
  id: string;
  author: PostAuthor;
  image: string | ImageSourcePropType;
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
    image: FOOD_IMAGES.kinalas,
    caption: 'Fresh morning broth simmering right now! Bone brain gravy is thick today. Come by before 1 PM! 🍲',
    timeAgo: '20m ago',
    isUnread: true,
    establishmentId: 'cha-chas-kinalas',
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
    image: FOOD_IMAGES.baduya,
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
    image: FOOD_IMAGES.bicolExpress,
    caption: 'Crispy Pata & creamy Bicol Express ready for tonight’s live acoustic session on Magsaysay! 🎸',
    timeAgo: '1h ago',
    isUnread: true,
    establishmentId: 'bob-marlin-restaurant',
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
    image: FOOD_IMAGES.toastedSiopao,
    caption: 'Toasted Siopao fresh from the brick oven at Baker’s Plaza. That crunchy crust is unmatched! 🔥',
    timeAgo: '2h ago',
    isUnread: false,
    establishmentId: 'bakers-plaza-naga',
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
    image: FOOD_IMAGES.laing,
    caption: 'Special Laing na may Bagis (toasted coconut crab) available for lunch today. Very limited pots!',
    timeAgo: '3h ago',
    isUnread: false,
    establishmentId: 'geewan-bicolano-eatery',
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
    establishmentId: 'cha-chas-kinalas',
    establishmentName: "Cha Cha's Kinalas",
    district: 'Barlin St., Santa Cruz, Naga City',
    foodId: 'baduya',
    foodName: 'Fresh Hot Baduya Fritters',
    foodPrice: '₱85',
    image: FOOD_IMAGES.baduya,
    caption:
      'Day 1 of our Naga Food Expedition! These fresh banana fritters are crisp at the edges, tender in the center, and exactly the kind of warm merienda that disappears before the next stop.',
    insiderTip: 'Ask for a fresh batch and enjoy the fritters while they are still hot with a cup of native coffee.',
    spiceLevel: 'mild',
    rating: 5,
    likesCount: 148,
    isLiked: false,
    isBookmarked: false,
    commentsCount: 19,
    tripStopCount: 4,
    tags: ['#NagaFoodCrawl', '#Baduya', '#BicolStreetEats', '#MeriendaTime'],
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
        authorName: 'Cha Cha’s Kitchen',
        authorAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        content: 'Mabalos for visiting our humble carinderia! Hope you enjoyed the fresh baduya! 🙏',
        timestamp: '45m ago',
        isVerified: true,
      },
    ],
  },
  {
    id: 'ad-chacha-merienda',
    author: {
      id: 'cha-chas-kinalas',
      name: 'Cha Cha’s Kinalas & Sinanglay',
      handle: '@chachaskinalas',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Verified Partner Eatery',
    },
    isSponsored: true,
    postType: 'business_announcement',
    timestamp: 'Sponsored',
    establishmentId: 'cha-chas-kinalas',
    establishmentName: 'Cha Cha’s Kinalas & Sinanglay',
    district: 'Barlin St / Santa Cruz, Naga City',
    foodId: 'kinalas',
    foodName: 'Kinalas Special (with Egg & Extra Brain Gravy)',
    foodPrice: '₱85',
    image: FOOD_IMAGES.kinalas,
    caption:
      '⚡ FLASH MERIENDA RUSH: Craving authentic Barlin Kinalas? Vote in our Merienda Taste Ritual poll in the comments to instantly unlock a 20% OFF voucher! Wood-fired beef bone broth and steaming puto ready right now.',
    insiderTip: 'Claim your voucher code in the comments or promo ribbon and show it at the counter or apply it in your Food Basket!',
    spiceLevel: 'fiery',
    rating: 5,
    likesCount: 342,
    isLiked: false,
    isBookmarked: false,
    commentsCount: 38,
    tags: ['#SponsoredDeal', '#NagaMerienda', '#ChaChasKinalas', '#TasteOfBarlin'],
    comments: [
      {
        id: 'ad-c1',
        authorName: 'Maria Santos',
        authorAvatar: getDiceBearAvatar('Maria Santos'),
        content: 'Just claimed my voucher! Dipping the puto directly into the gravy is the only true way!',
        timestamp: '30m ago',
      },
      {
        id: 'ad-c2',
        authorName: 'Paolo Reyes',
        authorAvatar: getDiceBearAvatar('Paolo Reyes'),
        content: 'Is this valid for takeout orders too? The brain gravy today is calling my name 🤤',
        timestamp: '15m ago',
      },
      {
        id: 'ad-c3',
        authorName: 'Cha Cha’s Kinalas',
        authorAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        content: '@paoloeats Yes po! Valid for both Dine-In and Takeout Passes until 6:00 PM today! 🙏',
        timestamp: '8m ago',
        isVerified: true,
      },
    ],
    advertisement: {
      badge: 'SPONSORED PROMOTION',
      headline: '⚡ Afternoon Merienda Rush: 20% OFF Kinalas Pass',
      targetDistrict: 'Barlin & Santa Cruz, Naga City',
      expirationNote: 'Valid today until 6:00 PM · 82/100 claimed',
      callToAction: {
        label: 'Claim 20% Voucher',
        actionType: 'claim_voucher',
        voucherCode: 'CHACHA20',
        discountBadge: '20% OFF',
        claimedCount: 82,
        totalAvailable: 100,
        isClaimed: false,
      },
      poll: {
        question: 'Which Kinalas ritual is your go-to afternoon merienda?',
        totalVotes: 486,
        userVotedOptionId: undefined,
        rewardCode: 'CHACHA20',
        rewardDescription: '20% OFF Merienda Voucher Unlocked!',
        options: [
          {
            id: 'opt-gravy-mix',
            text: 'Stir thick brain gravy directly into hot broth 🍲',
            votes: 326,
          },
          {
            id: 'opt-puto-dip',
            text: 'Dip hot puto & chicharon straight into gravy 🥖',
            votes: 160,
          },
        ],
      },
    },
  },
  {
    id: 'post-chacha-1',
    author: {
      id: 'cha-chas-kinalas',
      name: 'Cha Cha’s Kinalas & Sinanglay',
      handle: '@chachaskinalas',
      avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      isBusiness: true,
      isVerified: true,
      badge: 'Verified Local Eatery',
    },
    postType: 'business_announcement',
    timestamp: '3 hours ago',
    establishmentId: 'cha-chas-kinalas',
    establishmentName: 'Cha Cha’s Kinalas & Sinanglay',
    district: 'Barlin St / Santa Cruz, Naga City',
    foodId: 'sinanglay',
    foodName: 'Sinanglay na Tilapia sa Gata',
    foodPrice: '₱185',
    image: FOOD_IMAGES.sinanglay,
    caption:
      'Good morning Naga! Our sinanglay is ready: whole tilapia wrapped in tender leaves, stuffed with aromatics, and simmered in rich coconut milk until every bite is silky and fragrant. 🐟',
    insiderTip: 'Spoon the coconut sauce over warm garlic rice and add a little fresh sili for the full Bicolano experience.',
    spiceLevel: 'moderate',
    rating: 5,
    likesCount: 189,
    isLiked: false,
    isBookmarked: false,
    commentsCount: 2,
    tags: ['#FreshBatch', '#Sinanglay', '#GataAndSili', '#ChaChasKinalas'],
    comments: [
      {
        id: 'cc-1',
        authorName: 'Paolo Reyes',
        authorAvatar: getDiceBearAvatar('Paolo Reyes'),
        content: 'On my way! Save me a serving with extra coconut sauce and sili please!',
        timestamp: '2h ago',
      },
      {
        id: 'cc-2',
        authorName: 'Maria Santos',
        authorAvatar: getDiceBearAvatar('Maria Santos'),
        content: 'The coconut sauce looks so rich! That fish and leaf wrap are perfect together.',
        timestamp: '1h ago',
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
    establishmentId: 'bob-marlin-restaurant',
    establishmentName: 'Bob Marlin Restaurant',
    district: 'Magsaysay Avenue, Naga City',
    foodId: 'bicol-express',
    foodName: 'Signature Bicol Express & Pata Combo',
    foodPrice: '₱380',
    image: FOOD_IMAGES.bicolExpress,
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
    establishmentId: 'geewan-bicolano-eatery',
    establishmentName: 'Geewan Bicolano Cuisine',
    district: 'P. Burgos St., Centro, Naga City',
    foodId: 'sinanglay',
    foodName: 'Sinanglay na Tilapia sa Gata',
    foodPrice: '₱185',
    image: FOOD_IMAGES.sinanglay,
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
    establishmentId: 'bakers-plaza-naga',
    establishmentName: "Baker's Plaza",
    district: 'Panganiban Drive, Naga City',
    foodId: 'toasted-siopao',
    foodName: 'Original Crispy Toasted Siopao',
    foodPrice: '₱25 / pc',
    image: FOOD_IMAGES.toastedSiopao,
    caption:
      'Grabbed a dozen fresh out of the morning oven at Panganiban Drive! Unlike regular steamed buns, the Naga toasted siopao has this delicate, golden biscuit-like exterior with savory pork asado and salted egg filling.',
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
    establishmentId: 'aling-celys-kinalasan',
    establishmentName: "Aling Cely's Kitchen",
    district: 'Barlin St., Santa Cruz, Naga City',
    foodId: 'laing',
    foodName: 'Laing na Natong',
    foodPrice: '₱95',
    image: FOOD_IMAGES.laing,
    caption:
      'A bowl of slow-cooked laing with tender taro leaves, creamy coconut milk, and a gentle chili warmth. Simple, rich, and made for a plate of steaming rice.',
    insiderTip: 'Let the laing sit for a few minutes before serving so the coconut cream settles into the leaves.',
    spiceLevel: 'moderate',
    rating: 5,
    likesCount: 489,
    isLiked: true,
    isBookmarked: false,
    commentsCount: 57,
    tags: ['#AlingCely', '#Laing', '#GataAndSili', '#OldSchoolNaga'],
    comments: [
      {
        id: 'c6',
        authorName: 'Carlo Mendoza',
        authorAvatar: getDiceBearAvatar('Carlo Mendoza'),
        content: 'My grandmother used to make laing just like this. The coconut flavor is so comforting!',
        timestamp: '22h ago',
      },
    ],
  },
];
