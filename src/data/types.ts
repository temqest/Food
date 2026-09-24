export type FoodCategory =
  | 'heritage-soups'
  | 'gata-sili'
  | 'pili-delicacies'
  | 'bakery-merienda'
  | 'street-grill'
  | 'coolers-beverages';

export type EstablishmentType =
  | 'kinalas-station'
  | 'carinderia'
  | 'bakery'
  | 'restaurant'
  | 'pasalubong-center'
  | 'street-stall';

export type PriceLevel = 'budget' | 'moderate' | 'upscale';

export interface FoodItem {
  id: string;
  name: string;
  bikolName?: string;
  tagline: string;
  description: string;
  culturalContext: string;
  category: FoodCategory;
  categoryLabel: string;
  image: string;
  priceRange: string;
  priceLevel: PriceLevel;
  servingSpotsCount: number;
  featured?: boolean;
  flavorProfile: string[];
  tags: string[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  mapX: number; // Percent position on Naga map canvas (10-90)
  mapY: number; // Percent position on Naga map canvas (10-90)
}

export interface EstablishmentFoodOffering {
  foodId: string;
  foodName: string;
  price: number;
  isSignature?: boolean;
  servingNote?: string;
}

export interface Establishment {
  id: string;
  name: string;
  type: EstablishmentType;
  typeLabel: string;
  description: string;
  address: string;
  neighborhood: string;
  coordinates: Coordinates;
  distanceKm: number;
  openingHours: string;
  isOpenNow: boolean;
  contactNumber?: string;
  heroImage: string;
  galleryImages: string[];
  foodsOffered: EstablishmentFoodOffering[];
  priceLevel: PriceLevel;
  atmosphereTags: string[];
}

export interface SearchFilters {
  query: string;
  category?: FoodCategory | 'all';
  type?: EstablishmentType | 'all';
  maxDistanceKm?: number;
  priceLevel?: PriceLevel | 'all';
  openOnly?: boolean;
  sortBy?: 'distance' | 'price' | 'popularity';
}
