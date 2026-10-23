export interface ExplorerRank {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  description: string;
}

export const EXPLORER_RANKS: ExplorerRank[] = [
  {
    level: 1,
    title: 'Foodie Bagito',
    minXp: 0,
    maxXp: 150,
    badgeIcon: 'footsteps-outline',
    description: 'Starting your culinary adventure on the vibrant streets of Naga.',
  },
  {
    level: 2,
    title: 'Street Wanderer',
    minXp: 150,
    maxXp: 350,
    badgeIcon: 'compass-outline',
    description: 'Locating hidden carinderias and local neighborhood joints.',
  },
  {
    level: 3,
    title: 'Broth Seeker',
    minXp: 350,
    maxXp: 650,
    badgeIcon: 'restaurant-outline',
    description: 'Conquering rich miki noodles, bone broth, and savory brain gravies.',
  },
  {
    level: 4,
    title: 'Sili Hunter',
    minXp: 650,
    maxXp: 1050,
    badgeIcon: 'flame-outline',
    description: 'Bravely enduring the fiery sting of siling labuyo and rich kakang gata.',
  },
  {
    level: 5,
    title: 'Heritage Connoisseur',
    minXp: 1050,
    maxXp: 1600,
    badgeIcon: 'ribbon-outline',
    description: 'Unlocking centuries-old Bicolano recipes and artisanal bakeries.',
  },
  {
    level: 6,
    title: 'Titano kan Sili',
    minXp: 1600,
    maxXp: 2500,
    badgeIcon: 'trophy-outline',
    description: 'Master of Naga flavor lore. Respected by every carinderia auntie in town.',
  },
];

export interface BadgeItem {
  id: string;
  name: string;
  category: 'trail' | 'heat' | 'heritage' | 'district';
  icon: string;
  description: string;
  criteria: string;
  xpReward: number;
  color: string;
}

export const COLLECTIBLE_BADGES: BadgeItem[] = [
  {
    id: 'kinalas-initiate',
    name: 'Gravy Initiate',
    category: 'heritage',
    icon: 'water',
    description: 'Tasted and logged your first authentic bowl of Naga Kinalas.',
    criteria: 'Log any Kinalas dish',
    xpReward: 50,
    color: '#D42F13',
  },
  {
    id: 'sili-survivor',
    name: 'Sili Survivor',
    category: 'heat',
    icon: 'flame',
    description: 'Handled a Level 4+ fiery chili dish without flinching.',
    criteria: 'Try Sinanglay or Bicol Express with spicy rating',
    xpReward: 75,
    color: '#FF3B30',
  },
  {
    id: 'toasted-siopao-run',
    name: 'Golden Crust Master',
    category: 'heritage',
    icon: 'star',
    description: 'Picked up a freshly baked Naga toasted siopao straight from the oven.',
    criteria: 'Log a visit to a heritage bakery',
    xpReward: 50,
    color: '#FF9500',
  },
  {
    id: 'district-centro-scout',
    name: 'Centro Conquistador',
    category: 'district',
    icon: 'location',
    description: 'Explored and logged 3 distinct foodie spots in Centro district.',
    criteria: 'Log 3 spots in Centro',
    xpReward: 100,
    color: '#34C759',
  },
  {
    id: 'night-grill-crawler',
    name: 'Midnight Ihaw Scout',
    category: 'trail',
    icon: 'moon',
    description: 'Enjoyed street grills and skewers under Naga’s evening neon.',
    criteria: 'Check in at a night stall after 6:00 PM',
    xpReward: 60,
    color: '#5856D6',
  },
  {
    id: 'pili-artisan',
    name: 'Pili Nut Virtuoso',
    category: 'heritage',
    icon: 'sparkles',
    description: 'Sampled indigenous roasted or glazed Camarines Sur pili sweets.',
    criteria: 'Log any pili delicacy or cooler',
    xpReward: 50,
    color: '#AF52DE',
  },
  {
    id: 'mystery-box-unboxed',
    name: 'Silito’s Lucky Spoon',
    category: 'heritage',
    icon: 'gift',
    description: 'Unboxed your first Stilitio Mystery Box flavor discovery.',
    criteria: 'Open a Stilitio Mystery Box',
    xpReward: 50,
    color: '#FF2D55',
  },
];

export interface FoodTrail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badgeId: string;
  district: string;
  estimatedMinutes: number;
  difficulty: 'Easy Stroll' | 'Flavor Sprint' | 'Fiery Gauntlet';
  icon: string;
  heroImage: string;
  establishmentIds: string[];
  foodIds: string[];
  xpBonus: number;
}

export const FOOD_TRAILS: FoodTrail[] = [
  {
    id: 'trail-barlin-kinalas',
    title: 'The Legendary Barlin Kinalas Crawl',
    tagline: 'Compare the legendary brain gravy broths of historic Barlin & Bagumbayan',
    description:
      'Walk the storied noodle alleyways where kinalas was born. Taste the rich difference in bone reduction broths and homemade sili paste across top heritage stalls.',
    badgeId: 'kinalas-initiate',
    district: 'Bagumbayan / Barlin',
    estimatedMinutes: 60,
    difficulty: 'Flavor Sprint',
    icon: 'restaurant',
    heroImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['cha-chas-kinalas', 'aling-celys-kinalasan', 'naga-peoples-mall-stalls'],
    foodIds: ['kinalas', 'toasted-siopao'],
    xpBonus: 150,
  },
  {
    id: 'trail-gata-sili-trial',
    title: 'The Fiery Gata & Sili Trial',
    tagline: 'Rich coconut cream infused with authentic wild siling labuyo',
    description:
      'A true initiation into the heart of Bikol cooking. Experience tender tilapia wrapped in river greens and slow-simmered pork belly in fresh kakang gata.',
    badgeId: 'sili-survivor',
    district: 'Centro & Magsaysay',
    estimatedMinutes: 90,
    difficulty: 'Fiery Gauntlet',
    icon: 'flame',
    heroImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['geewan-bicolano-eatery', 'cha-chas-kinalas', 'bob-marlin-restaurant'],
    foodIds: ['sinanglay', 'pinangat', 'bicol-express'],
    xpBonus: 180,
  },
  {
    id: 'trail-heritage-merienda',
    title: 'Old Naga 4 PM Merienda Run',
    tagline: 'Golden toasted buns, pan bonete, and hot native tablea chocolate',
    description:
      'Follow the classic afternoon ritual of Nagueños. Crisp oven-baked siopao with savory pork asado paired with creamy pili nut coolers.',
    badgeId: 'toasted-siopao-run',
    district: 'Centro District',
    estimatedMinutes: 45,
    difficulty: 'Easy Stroll',
    icon: 'cafe',
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['pan-de-naga-heritage', 'bakers-plaza-naga', 'j-emanuel-pili'],
    foodIds: ['toasted-siopao', 'crispy-pili', 'mazapan-de-pili'],
    xpBonus: 120,
  },
];

/**
 * Resolves a trail by either its trail ID, quest ID alias, or slug keyword.
 */
export function getTrailById(idOrSlug?: string): FoodTrail | undefined {
  if (!idOrSlug) return FOOD_TRAILS[0];
  const normalized = idOrSlug.toLowerCase();

  // Direct match
  const direct = FOOD_TRAILS.find((t) => t.id === idOrSlug || t.id.toLowerCase() === normalized);
  if (direct) return direct;

  // Quest ID to Trail ID alias mapping
  if (normalized.includes('kinalas')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-barlin-kinalas');
  }
  if (normalized.includes('centro') || normalized.includes('merienda') || normalized.includes('siopao')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-heritage-merienda');
  }
  if (normalized.includes('spice') || normalized.includes('gata') || normalized.includes('sili')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-gata-sili-trial');
  }

  return FOOD_TRAILS[0];
}

export interface QuestItem {
  id: string;
  title: string;
  prompt: string;
  district: string;
  category: string;
  xpReward: number;
  badgeRewardIcon?: string;
  targetDish?: string;
  timeContext?: string;
  progressText: string;
  actionText: string;
}

export const DAILY_QUESTS: QuestItem[] = [
  {
    id: 'quest-1',
    title: 'Broth Patrol',
    prompt: 'Slurp a piping hot bowl of Kinalas with extra chili paste & brain gravy.',
    district: 'Bagumbayan',
    category: 'heritage-soups',
    xpReward: 50,
    badgeRewardIcon: 'restaurant',
    targetDish: 'kinalas',
    timeContext: 'Best for Lunch or Rainy Days',
    progressText: 'Cauldron simmering along Barlin St.',
    actionText: 'Slurp & Log',
  },
  {
    id: 'quest-2',
    title: '4 PM Merienda Gold',
    prompt: 'Grab a freshly baked Toasted Siopao while the crust is still flaky & amber-hot.',
    district: 'Centro',
    category: 'bakery-merienda',
    xpReward: 40,
    badgeRewardIcon: 'star',
    targetDish: 'toasted-siopao',
    timeContext: 'Peak Freshness: 2:30 PM – 5:00 PM',
    progressText: '1 of 1 Ready to Claim!',
    actionText: 'Claim Merienda XP',
  },
  {
    id: 'quest-3',
    title: 'Sili Heat Challenge',
    prompt: 'Tackle tender Tilapia in rich kakang gata & wild crushed siling labuyo.',
    district: 'Magsaysay Ave',
    category: 'gata-sili',
    xpReward: 60,
    badgeRewardIcon: 'flame',
    targetDish: 'sinanglay',
    timeContext: 'Dinner with Mountain Rice',
    progressText: 'Spicy Level 4 test ready',
    actionText: 'Accept Challenge',
  },
  {
    id: 'quest-4',
    title: 'Pili Nut Artisan Scout',
    prompt: 'Taste native honey-glazed roasted pili nuts or handmade mazapan.',
    district: 'Diversion',
    category: 'pili-delicacies',
    xpReward: 45,
    badgeRewardIcon: 'sparkles',
    targetDish: 'crispy-pili',
    timeContext: 'Afternoon Sweet Treat',
    progressText: 'Artisanal confections available',
    actionText: 'Discover Pili',
  },
];

export interface MysteryDrop {
  id: string;
  foodId: string;
  foodName: string;
  bikolName?: string;
  establishmentId: string;
  establishmentName: string;
  neighborhood: string;
  image: string;
  rarity: 'Common Gem' | 'Secret Local Hack' | 'Legendary Heritage';
  xpReward: number;
  insiderSecret: string;
  siliRating: number;
}

export const MYSTERY_DROPS: MysteryDrop[] = [
  {
    id: 'drop-kinalas-special',
    foodId: 'kinalas',
    foodName: 'Special Kinalas with Brain Gravy',
    bikolName: 'Kinalas na Baka',
    establishmentId: 'cha-chas-kinalas',
    establishmentName: "Cha-Cha's Kinalas Station",
    neighborhood: 'Barlin & Bagumbayan',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    rarity: 'Legendary Heritage',
    xpReward: 75,
    insiderSecret:
      'Locals request an extra spoonful of brown brain sauce mixed with sili paste and crushed toasted garlic right into the broth!',
    siliRating: 3,
  },
  {
    id: 'drop-siopao-hot',
    foodId: 'toasted-siopao',
    foodName: 'Oven-Hot Toasted Siopao',
    bikolName: 'Tinapang Siopao',
    establishmentId: 'pan-de-naga-heritage',
    establishmentName: 'Pan De Naga Heritage Bakery',
    neighborhood: 'Centro District',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    rarity: 'Secret Local Hack',
    xpReward: 50,
    insiderSecret:
      'The batch at 3:30 PM is pulled right from the brick oven. Pair it with native tablea tsokolate for the ultimate Bicolano dip.',
    siliRating: 1,
  },
  {
    id: 'drop-sinanglay-tilapia',
    foodId: 'sinanglay',
    foodName: 'Sinanglay na Tilapia sa Gata',
    bikolName: 'Sinanglay',
    establishmentId: 'bob-marlin-restaurant',
    establishmentName: 'Bob Marlin Bicolano Cuisine',
    neighborhood: 'Magsaysay Avenue',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    rarity: 'Legendary Heritage',
    xpReward: 80,
    insiderSecret:
      'Wrapped in tender mustard greens and simmered in first-press kakang gata. Squeeze fresh calamansi over the coconut cream to cut the fat.',
    siliRating: 4,
  },
  {
    id: 'drop-pinangat-gabi',
    foodId: 'pinangat',
    foodName: 'Claypot Steamed Pinangat',
    bikolName: 'Pangat na Gabi',
    establishmentId: 'geewan-bicolano-eatery',
    establishmentName: 'Geewan Bicolano Heritage Eatery',
    neighborhood: 'Centro District',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80',
    rarity: 'Secret Local Hack',
    xpReward: 60,
    insiderSecret:
      'Slow-simmered for 3 hours so the taro leaves melt like silk over smoked fish flakes and balaw shrimp paste.',
    siliRating: 3,
  },
  {
    id: 'drop-bicol-express',
    foodId: 'bicol-express',
    foodName: 'Authentic Balaw Bicol Express',
    bikolName: 'Sinilihan',
    establishmentId: 'bob-marlin-restaurant',
    establishmentName: 'Bob Marlin Bicolano Cuisine',
    neighborhood: 'Magsaysay Avenue',
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=900&q=80',
    rarity: 'Legendary Heritage',
    xpReward: 70,
    insiderSecret:
      'True Naga sinilihan has more wild green chilies than pork! The sauce should glisten with pure coconut oil separation.',
    siliRating: 5,
  },
  {
    id: 'drop-crispy-pili',
    foodId: 'crispy-pili',
    foodName: 'Honey-Glazed Crispy Pili Nuts',
    bikolName: 'Pili kan Isarog',
    establishmentId: 'j-emanuel-pili',
    establishmentName: 'J. Emanuel Pastries',
    neighborhood: 'Diversion / Magsaysay',
    image: 'https://images.unsplash.com/photo-1536591375315-1b836814d60a?auto=format&fit=crop&w=900&q=80',
    rarity: 'Common Gem',
    xpReward: 45,
    insiderSecret:
      'Harvested from wild trees on the volcanic slopes of Mt. Isarog. Hand-cracked using a traditional bolo knife for peak crunch.',
    siliRating: 1,
  },
];

export interface DistrictProgressData {
  id: string;
  name: string;
  title: string;
  tagline: string;
  spotsCount: number;
  icon: string;
  accentColor: string;
  specialtyDishes: string[];
}

export const NAGA_DISTRICTS_DATA: DistrictProgressData[] = [
  {
    id: 'district-bagumbayan',
    name: 'Bagumbayan / Barlin',
    title: 'Bagumbayan & Barlin',
    tagline: 'Broth & Kinalas Heartland',
    spotsCount: 4,
    icon: 'restaurant-outline',
    accentColor: '#D42F13',
    specialtyDishes: ['Kinalas', 'Toasted Siopao'],
  },
  {
    id: 'district-centro',
    name: 'Centro',
    title: 'Centro & Plaza Quezon',
    tagline: 'Heritage Bakeries & Grills',
    spotsCount: 6,
    icon: 'storefront-outline',
    accentColor: '#FF9500',
    specialtyDishes: ['Toasted Siopao', 'Pinangat', 'Night Grills'],
  },
  {
    id: 'district-magsaysay',
    name: 'Magsaysay Ave',
    title: 'Magsaysay Dining Strip',
    tagline: 'Cafes & Fiery Feasts',
    spotsCount: 5,
    icon: 'cafe-outline',
    accentColor: '#FF2D55',
    specialtyDishes: ['Bicol Express', 'Sinanglay', 'Crispy Pili'],
  },
  {
    id: 'district-penafrancia',
    name: 'Peñafrancia',
    title: 'Peñafrancia Riverside',
    tagline: 'Pilgrimage Merienda & Lore',
    spotsCount: 3,
    icon: 'water-outline',
    accentColor: '#5856D6',
    specialtyDishes: ['Tablea Tsokolate', 'Native Kakanin'],
  },
];

export interface TastingEntry {
  id: string;
  foodId: string;
  foodName: string;
  establishmentId: string;
  establishmentName: string;
  date: string;
  rating: number; // 1-5
  spiceRating: number; // 1-5
  notes: string;
  image?: string;
}

export interface DishInsiderTip {
  dishId: string;
  secretHack: string;
  orderingLingo: string;
  funFact: string;
  siliLevel: number; // 1 to 5
}

export const DISH_INSIDER_TIPS: Record<string, DishInsiderTip> = {
  kinalas: {
    dishId: 'kinalas',
    secretHack:
      'Locals always ask for "sinapot" (crunchy banana blossom fritters) or sili paste squeezed into the brown brain gravy for the legendary flavor balance.',
    orderingLingo: '"Manong, pasobrahan nin utak buda sili!" (Extra brain gravy and chili)',
    funFact:
      'Named from the Bikol root word "kalas", meaning meat that falls off boiled cattle skull bones.',
    siliLevel: 3,
  },
  sinanglay: {
    dishId: 'sinanglay',
    secretHack:
      'Squeeze a drop of fresh calamansi over the coconut gravy to cut through the rich coconut fat and elevate the sweet river tilapia.',
    orderingLingo: '"Masiram an gata pag mainit-init pa!" (Best while the coconut milk is piping hot)',
    funFact:
      'Wrapping the fish in blanched gabi (taro) leaves protects the tender meat while absorbing chili oils.',
    siliLevel: 4,
  },
  'toasted-siopao': {
    dishId: 'toasted-siopao',
    secretHack:
      'If taking out, pop it in a toaster oven for 2 minutes to restore the trademark crisp golden amber shell.',
    orderingLingo: '"Bag-ong luto tabi, baga an mainit pa." (Give me the batch fresh from the oven)',
    funFact:
      'Invented in Naga during the 1980s as a mess-free commuter merienda for travelers boarding buses at the CBD terminal.',
    siliLevel: 1,
  },
  pinangat: {
    dishId: 'pinangat',
    secretHack:
      'Eat with generous spoonfuls of hot steamed sinandomeng rice. The coconut cream melts over the grains into savory velvet.',
    orderingLingo: '"Padugangi tabi nin sarsa!" (Add extra simmered coconut sauce)',
    funFact:
      'Tied with banana fiber twine and cooked with no stirring to keep the intricate leaf folds intact.',
    siliLevel: 3,
  },
  'bicol-express': {
    dishId: 'bicol-express',
    secretHack:
      'Authentic Bicol Express should feature shimmering coconut oil on top from long reduction of kakang gata.',
    orderingLingo: '"An tunay na bikolano, daing takot sa sili." (True Bicolanos fear no chili!)',
    funFact:
      'Named after the train service running from Manila to the Bicol region in the 1970s.',
    siliLevel: 5,
  },
  'crispy-pili': {
    dishId: 'crispy-pili',
    secretHack:
      'Store in a cool dry jar. Locals love crushing candied pili nuts over warm morning oats or vanilla ice cream.',
    orderingLingo: '"Pang-pasalubong tabi, bag-ong luto." (Freshly made for gifts)',
    funFact:
      'Camarines Sur produces over 80% of the world’s edible pili nut harvest thanks to Mt. Isarog’s mineral-rich volcanic soil.',
    siliLevel: 1,
  },
};
