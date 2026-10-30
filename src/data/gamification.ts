import { ImageSourcePropType } from 'react-native';

export interface ExplorerRank {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
  description: string;
}

async function testing() {
  console.log("testing")
}

//commet here

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
    title: 'The Legendary Barlin & Dayangdang Kinalas Crawl',
    tagline: 'Slurp through the historic alleyways where Naga’s brain gravy noodle culture was born',
    description:
      'Walk the storied noodle alleyways of Santa Cruz and Dayangdang. Taste the rich difference in bone reduction broths, homemade sili paste, and crispy baduya pairings across top heritage stalls.',
    badgeId: 'kinalas-initiate',
    district: 'Santa Cruz & Dayangdang',
    estimatedMinutes: 65,
    difficulty: 'Flavor Sprint',
    icon: 'restaurant',
    heroImage: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['aling-celys-kinalasan', 'cha-chas-kinalas', 'cha-kamot-kinalas'],
    foodIds: ['kinalas', 'baduya', 'sinanglay'],
    xpBonus: 150,
  },
  {
    id: 'trail-gata-sili-trial',
    title: 'Magsaysay Food Strip — Modern Bicolano Feast',
    tagline: 'Premier dining boulevard from gourmet heirloom viands to sizzling regional grills',
    description:
      'A culinary walk down Naga’s premier dining boulevard. Experience elevated crispy liempo Bicol express, gourmet pechay-wrapped sinanglay, and cold pili milkshakes.',
    badgeId: 'sili-survivor',
    district: 'Magsaysay Avenue Corridor',
    estimatedMinutes: 90,
    difficulty: 'Fiery Gauntlet',
    icon: 'flame',
    heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['biggs-diner-magsaysay', 'red-platter', 'chef-doys-restaurant', 'bob-marlin-restaurant', 'j-emanuel-pili'],
    foodIds: ['pili-shake', 'bicol-express', 'sinanglay', 'crispy-pili'],
    xpBonus: 180,
  },
  {
    id: 'trail-heritage-merienda',
    title: 'Centro & Downtown Heritage Food Trail',
    tagline: 'Trace old Nueva Caceres through public market woks, carinderias, and heritage bakeries',
    description:
      'Follow the classic afternoon and morning culinary circuits of Centro Nagueños: market-style Pancit Bato, slow-simmered Pinangat, and oven-fresh Toasted Siopao.',
    badgeId: 'toasted-siopao-run',
    district: 'Downtown Centro District',
    estimatedMinutes: 60,
    difficulty: 'Easy Stroll',
    icon: 'cafe',
    heroImage: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['naga-peoples-mall-stalls', 'geewan-bicolano-eatery', 'biggs-diner-centro', 'pan-de-naga-heritage'],
    foodIds: ['pancit-bato', 'pinangat', 'toasted-siopao', 'mazapan-de-pili'],
    xpBonus: 120,
  },
  {
    id: 'trail-penafrancia-pilgrimage',
    title: 'The Peñafrancia Pilgrimage & Riverside Flavors Trail',
    tagline: 'Sacred pilgrimage landmarks, riverbank dining, and traditional festival delicacies',
    description:
      'Trace the sacred route of the world-famous Peñafrancia Festival. Experience riverbank delicacies, crispy pili nuts, and freshly baked toasted siopao across historic sanctuaries.',
    badgeId: 'kinalas-initiate',
    district: 'Peñafrancia & Balatas',
    estimatedMinutes: 120,
    difficulty: 'Easy Stroll',
    icon: 'water',
    heroImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    establishmentIds: ['pan-de-naga-heritage', 'geewan-bicolano-eatery', 'bakers-plaza-naga', 'j-emanuel-pili'],
    foodIds: ['baduya', 'tilmok', 'crispy-pili', 'toasted-siopao'],
    xpBonus: 200,
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
  if (normalized.includes('kinalas') || normalized.includes('barlin')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-barlin-kinalas');
  }
  if (normalized.includes('centro') || normalized.includes('merienda') || normalized.includes('siopao')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-heritage-merienda');
  }
  if (normalized.includes('magsaysay') || normalized.includes('spice') || normalized.includes('gata') || normalized.includes('sili')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-gata-sili-trial');
  }
  if (normalized.includes('penafrancia') || normalized.includes('pilgrim') || normalized.includes('river')) {
    return FOOD_TRAILS.find((t) => t.id === 'trail-penafrancia-pilgrimage');
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
  image: ImageSourcePropType | string;
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
    image: require('../../assets/images/dishes/kinalas.webp'),
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
    image: require('../../assets/images/dishes/toasted-siopao.jpg'),
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
    image: require('../../assets/images/dishes/sinanglay.jpg'),
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
    image: require('../../assets/images/dishes/pinangat.webp'),
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
    image: require('../../assets/images/dishes/bicol-express.jpg'),
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
    image: require('../../assets/images/dishes/crispy-pili.jpg'),
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
    spotsCount: 3,
    icon: 'restaurant-outline',
    accentColor: '#D42F13',
    specialtyDishes: ['Kinalas', 'Baduya', 'Sinanglay'],
  },
  {
    id: 'district-centro',
    name: 'Centro',
    title: 'Centro & Plaza Quezon',
    tagline: 'Heritage Bakeries & Grills',
    spotsCount: 4,
    icon: 'storefront-outline',
    accentColor: '#FF9500',
    specialtyDishes: ['Toasted Siopao', 'Pinangat', 'Pancit Bato', 'Mazapan de Pili'],
  },
  {
    id: 'district-magsaysay',
    name: 'Magsaysay Ave',
    title: 'Magsaysay Dining Strip',
    tagline: 'Cafes & Fiery Feasts',
    spotsCount: 5,
    icon: 'cafe-outline',
    accentColor: '#FF2D55',
    specialtyDishes: ['Bicol Express', 'Kinunot', 'Crispy Pili', 'Pili Shake'],
  },
  {
    id: 'district-penafrancia',
    name: 'Peñafrancia',
    title: 'Peñafrancia Riverside',
    tagline: 'Pilgrimage Merienda & Lore',
    spotsCount: 2,
    icon: 'water-outline',
    accentColor: '#5856D6',
    specialtyDishes: ['Tilmok', 'Sinantol', 'Toasted Siopao', 'Native Pili'],
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
  spiceRating?: number; // 1-5 (optional)
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
  'mazapan-de-pili': {
    dishId: 'mazapan-de-pili',
    secretHack:
      'Keep refrigerated for a firmer fudge texture, or let it sit at room temperature for the traditional melt-in-your-mouth marzipan softness.',
    orderingLingo: '"Gusto ko katong presko buda mahamis-hamis." (I want the freshest sweet bars)',
    funFact:
      'A colonial Spanish marzipan adaptation that Bicolano confectioners transformed into an indigenous luxury using pulverized pili kernels.',
    siliLevel: 1,
  },
  'pancit-bato': {
    dishId: 'pancit-bato',
    secretHack:
      'Always squeeze fresh calamansi and ask for a spoonful of dinuguan gravy or chili vinegar over the smoky noodles for peak market flavor.',
    orderingLingo: '"Sinabawan tabi buda pasobrahan chicharon!" (Broth-style with extra cracklings)',
    funFact:
      'Noodles from Lake Bato are sun-dried and wood-roasted in ovens, giving them a distinct smoky aroma that never turns soggy.',
    siliLevel: 2,
  },
  'pili-shake': {
    dishId: 'pili-shake',
    secretHack:
      'Ask the barista to blend native roasted tablea cacao shavings into the shake for a decadent Bicolano chocolate-nut cooler.',
    orderingLingo: '"Pili shake tabi, daing asukar sobra." (Pili shake, not too sweet)',
    funFact:
      'Pure pili nut butter creates an unctuous, velvety emulsion without needing synthetic dairy cream.',
    siliLevel: 1,
  },
  baduya: {
    dishId: 'baduya',
    secretHack:
      'Dunk a freshly fried, sugar-crusted saba banana fritter straight into hot, savory Kinalas brain broth for the holy grail sweet-savory crunch.',
    orderingLingo: '"Mainit-init pa tabi na baduya!" (Fresh from the frying wok)',
    funFact:
      'In Naga carinderias, baduya is the inseparable street-side companion to kinalas, ordered alongside nearly every bowl.',
    siliLevel: 1,
  },
  kinunot: {
    dishId: 'kinunot',
    secretHack:
      'Spoon generously over steamed mountain red rice so the ginger-scented coconut cream soaks every grain.',
    orderingLingo: '"Padugangi nin malunggay buda sili." (Extra moringa and chili)',
    funFact:
      'Traditionally made with flaked stingray, it is one of the oldest recorded indigenous Bicolano preparations.',
    siliLevel: 4,
  },
  sinantol: {
    dishId: 'sinantol',
    secretHack:
      'Incredible as a savory spread on warm pandesal or as a zesty condiment alongside fried tilapia or pork chop.',
    orderingLingo: '"Katong nagmamantika tabi." (Give me the portion with glistening coconut oil)',
    funFact:
      'Grating and squeezing wild sour santol fruit produces a texture remarkably indistinguishable from minced pork.',
    siliLevel: 4,
  },
  tilmok: {
    dishId: 'tilmok',
    secretHack:
      'Unfold the steaming banana leaf package and mix the sweet young coconut shreds directly with the crab flakes before taking your first bite.',
    orderingLingo: '"Tilmok na bag-ong bangot tabi." (Freshly wrapped and steamed tilmok)',
    funFact:
      'Steaming inside young banana leaves seals the natural ocean sweetness of crab meat and buko water.',
    siliLevel: 3,
  },
  laing: {
    dishId: 'laing',
    secretHack:
      'Top with crispy fried chicharon or pork belly cracklings for an addictive texture contrast against the velvety taro greens.',
    orderingLingo: '"An natong na luto sa kakang gata." (Taro leaves cooked down in pure first-press coconut cream)',
    funFact:
      'Authentic Bicolano cooks strictly forbid stirring the pot until the coconut oil naturally separates, preventing the leaves from irritating the tongue.',
    siliLevel: 4,
  },
  'naga-night-skewers': {
    dishId: 'naga-night-skewers',
    secretHack:
      'Double-dip your sizzling hot skewer into the jar of garlic-heavy sinamak chili vinegar to cut through the caramelized sweet pork glaze.',
    orderingLingo: '"Tolong barbecue buda duwang isaw, maharang na suka!" (Three pork BBQs and two isaw with spicy vinegar)',
    funFact:
      'The plaza night barbecues along Centro and Magsaysay have been the heartbeat of late-night Nagueño youth culture for generations.',
    siliLevel: 3,
  },
};

export interface StreakTrophy {
  id: string;
  title: string;
  daysRequired: number;
  description: string;
  icon: string;
  color: string;
  badgeTag: string;
  xpReward: number;
  unlocked: boolean;
  unlockedDate?: string;
}

export const STREAK_TROPHIES: StreakTrophy[] = [
  {
    id: 'trophy-bronze-3',
    title: 'Bronze Sili Cup',
    daysRequired: 3,
    description: 'Maintained a 3-day Naga culinary streak without letting the flame die.',
    icon: 'trophy',
    color: '#CD7F32',
    badgeTag: '🥉 Bronze Tier',
    xpReward: 100,
    unlocked: true,
    unlockedDate: 'Oct 24',
  },
  {
    id: 'trophy-silver-7',
    title: 'Silver Merienda Chalice',
    daysRequired: 7,
    description: 'Explored local carinderias and bakeries 7 consecutive days.',
    icon: 'trophy',
    color: '#A8A8A8',
    badgeTag: '🥈 Silver Tier',
    xpReward: 250,
    unlocked: false,
  },
  {
    id: 'trophy-gold-14',
    title: 'Golden Kinalas Cauldron',
    daysRequired: 14,
    description: 'Two unbroken weeks of savoring Naga’s rich heritage noodle broths and dishes.',
    icon: 'trophy',
    color: '#FFB800',
    badgeTag: '🥇 Gold Tier',
    xpReward: 500,
    unlocked: false,
  },
  {
    id: 'trophy-diamond-30',
    title: 'Diamond Titano Trophy',
    daysRequired: 30,
    description: 'A full month of non-stop culinary discovery across all Naga districts.',
    icon: 'ribbon',
    color: '#00B4D8',
    badgeTag: '💎 Diamond Tier',
    xpReward: 1000,
    unlocked: false,
  },
  {
    id: 'trophy-centennial-100',
    title: 'Legend of Mount Isarog',
    daysRequired: 100,
    description: 'The highest honor bestowed upon a master explorer of Camarines Sur flavor lore.',
    icon: 'star',
    color: '#9D4EDD',
    badgeTag: '👑 Mythic Tier',
    xpReward: 3000,
    unlocked: false,
  },
];
