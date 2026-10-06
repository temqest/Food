import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { FoodCategory, EstablishmentType } from '@/data/types';
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';

export interface BusinessProduct {
  id: string;
  foodId: string;
  name: string;
  bikolName?: string;
  description: string;
  category: FoodCategory;
  categoryLabel: string;
  price: number;
  isSignature: boolean;
  inStock: boolean;
  prepTime: string;
  image: string;
  flavorProfile: string[];
  servingNote?: string;
  totalOrdersCount: number;
}

export interface PromotionCampaign {
  id: string;
  establishmentId: string;
  title: string;
  description: string;
  badgeText: string;
  discountPercent?: number;
  targetDistrict: string;
  featuredFoodId?: string;
  featuredFoodName?: string;
  active: boolean;
  startDate: string;
  impressions: number;
  clicks: number;
  ordersDriven: number;
  budgetTier: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  type: EstablishmentType;
  typeLabel: string;
  description: string;
  address: string;
  neighborhood: string;
  contactNumber: string;
  openingHours: string;
  isOpenNow: boolean;
  heroImage: string;
  atmosphereTags: string[];
  rating: number;
  reviewCount: number;
}

export interface BusinessAnalytics {
  todayGrossSales: number;
  todayOrdersCount: number;
  weeklyCustomerReach: number;
  profileSaves: number;
  conversionRate: number;
  popularHours: { hour: string; level: 'High' | 'Medium' | 'Low'; percentage: number }[];
}

interface BusinessContextType {
  profile: BusinessProfile;
  products: BusinessProduct[];
  promotions: PromotionCampaign[];
  activePromotion: PromotionCampaign | null;
  analytics: BusinessAnalytics;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  toggleOpenStatus: () => void;
  addProduct: (product: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>) => BusinessProduct;
  updateProduct: (id: string, updates: Partial<BusinessProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  createPromotion: (
    campaign: Omit<PromotionCampaign, 'id' | 'impressions' | 'clicks' | 'ordersDriven' | 'startDate'>
  ) => PromotionCampaign;
  togglePromotionActive: (id: string) => void;
  deletePromotion: (id: string) => void;
  switchEstablishment: (id: string) => void;
}

const DEFAULT_PROFILE: BusinessProfile = {
  id: 'cha-chas-kinalas',
  name: 'Cha Cha’s Kinalas & Sinanglay',
  tagline: 'Home of Authentic Barlin Street Kinalas & Rich Savory Gravy',
  type: 'kinalas-station',
  typeLabel: 'Kinalas Station & Carinderia',
  description:
    'An unpretentious, beloved open-air kinalasan on Barlin Street. Renowned for its dark, deeply flavorful brain gravy, tender beef scrapings, and freshly steamed puto on the side.',
  address: 'Barlin Street, Barangay Santa Cruz, Naga City',
  neighborhood: 'Barlin St / Santa Cruz',
  contactNumber: '+63 917 555 8291',
  openingHours: 'Open today · 7:00 AM – 8:30 PM',
  isOpenNow: true,
  heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  atmosphereTags: ['Casual Dining', 'Open Air Kitchen', 'Heritage Recipe', 'Fast Service'],
  rating: 4.8,
  reviewCount: 384,
};

const INITIAL_PRODUCTS: BusinessProduct[] = [
  {
    id: 'prod-kinalas-special',
    foodId: 'kinalas',
    name: 'Kinalas Special (with Egg & Extra Brain Gravy)',
    bikolName: 'Kinalas na may Itlog',
    description:
      'Our house specialty: freshly made miki noodles in simmering bone broth, scraped tender head meat, thick brain gravy, hard-boiled egg, toasted garlic, and spring onions.',
    category: 'heritage-soups',
    categoryLabel: 'Heritage Soups & Noodles',
    price: 85,
    isSignature: true,
    inStock: true,
    prepTime: '5–10 mins',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    flavorProfile: ['Rich & Savory', 'Umami Gravy', 'Spicy Kick'],
    servingNote: 'Served with crushed chili oil and calamansi',
    totalOrdersCount: 245,
  },
  {
    id: 'prod-kinalas-regular',
    foodId: 'kinalas',
    name: 'Kinalas Regular',
    bikolName: 'Kinalas Regular',
    description: 'Classic hearty bowl of tender scraped beef meat, rich marrow broth, and savory brown gravy.',
    category: 'heritage-soups',
    categoryLabel: 'Heritage Soups & Noodles',
    price: 70,
    isSignature: false,
    inStock: true,
    prepTime: '5–8 mins',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
    flavorProfile: ['Savory', 'Warm Broth', 'Tender Meat'],
    servingNote: 'Traditional recipe since 1994',
    totalOrdersCount: 182,
  },
  {
    id: 'prod-sinanglay-tilapia',
    foodId: 'sinanglay',
    name: 'Sinanglay na Tilapia',
    bikolName: 'Sinanglay',
    description:
      'Whole fresh tilapia stuffed with aromatics, wrapped in taro leaves, and braised in kakang gata with labuyo chilies.',
    category: 'gata-sili',
    categoryLabel: 'Gata & Sili Classics',
    price: 150,
    isSignature: true,
    inStock: true,
    prepTime: '15–20 mins',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
    flavorProfile: ['Creamy Coconut', 'Fresh Ginger', 'Fiery Sili'],
    servingNote: 'Simmered fresh daily in clay pots',
    totalOrdersCount: 96,
  },
  {
    id: 'prod-puto-seko',
    foodId: 'bakery-merienda',
    name: 'Fresh Steamed Puto (Pair of 2)',
    bikolName: 'Puto Biko',
    description: 'Fluffy white rice cakes gently steamed to pair perfectly with your hot bowl of Kinalas broth.',
    category: 'bakery-merienda',
    categoryLabel: 'Local Bakeries & Merienda',
    price: 25,
    isSignature: false,
    inStock: true,
    prepTime: 'Instant',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    flavorProfile: ['Subtle Sweet', 'Pillowy Texture'],
    servingNote: 'Best dipped in kinalas gravy',
    totalOrdersCount: 140,
  },
];

const INITIAL_PROMOTIONS: PromotionCampaign[] = [
  {
    id: 'promo-001',
    establishmentId: 'cha-chas-kinalas',
    title: 'Afternoon Merienda Rush: 15% Off All Kinalas Bowls',
    description:
      'Beat the afternoon hunger! Enjoy freshly scraped beef kinalas with free extra brain gravy between 2:00 PM and 5:00 PM.',
    badgeText: '15% OFF MERIENDA',
    discountPercent: 15,
    targetDistrict: 'Centro & Barlin District',
    featuredFoodId: 'kinalas',
    featuredFoodName: 'Kinalas Special',
    active: true,
    startDate: 'Active today',
    impressions: 1420,
    clicks: 312,
    ordersDriven: 48,
    budgetTier: 'Community Spotlight',
  },
];

const INITIAL_ANALYTICS: BusinessAnalytics = {
  todayGrossSales: 4850,
  todayOrdersCount: 38,
  weeklyCustomerReach: 3890,
  profileSaves: 247,
  conversionRate: 14.8,
  popularHours: [
    { hour: '8 AM', level: 'Medium', percentage: 45 },
    { hour: '12 PM', level: 'High', percentage: 95 },
    { hour: '3 PM', level: 'High', percentage: 88 },
    { hour: '6 PM', level: 'High', percentage: 92 },
    { hour: '8 PM', level: 'Low', percentage: 30 },
  ],
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [products, setProducts] = useState<BusinessProduct[]>(INITIAL_PRODUCTS);
  const [promotions, setPromotions] = useState<PromotionCampaign[]>(INITIAL_PROMOTIONS);
  const [analytics] = useState<BusinessAnalytics>(INITIAL_ANALYTICS);

  // Synchronize establishment changes with global mock dataset so customer view reflects updates
  useEffect(() => {
    const est = ESTABLISHMENTS.find((e) => e.id === profile.id);
    if (est) {
      est.name = profile.name;
      est.description = profile.description;
      est.address = profile.address;
      est.neighborhood = profile.neighborhood;
      est.contactNumber = profile.contactNumber;
      est.openingHours = profile.openingHours;
      est.isOpenNow = profile.isOpenNow;
      est.heroImage = profile.heroImage;
      est.atmosphereTags = profile.atmosphereTags;

      // Update food offerings from products
      est.foodsOffered = products.map((p) => ({
        foodId: p.foodId,
        foodName: p.name,
        price: p.price,
        isSignature: p.isSignature,
        servingNote: p.servingNote,
      }));
    }
  }, [profile, products]);

  const activePromotion = useMemo(() => {
    return promotions.find((p) => p.active) || null;
  }, [promotions]);

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleOpenStatus = () => {
    setProfile((prev) => ({
      ...prev,
      isOpenNow: !prev.isOpenNow,
      openingHours: !prev.isOpenNow ? 'Open today · 7:00 AM – 8:30 PM' : 'Closed · Opens tomorrow 7:00 AM',
    }));
  };

  const addProduct = (newProd: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>): BusinessProduct => {
    const id = `prod-${Date.now()}`;
    const product: BusinessProduct = {
      ...newProd,
      id,
      totalOrdersCount: 0,
    };
    setProducts((prev) => [product, ...prev]);

    // Also check if food exists in FOOD_ITEMS, if not add to catalog
    const foodExists = FOOD_ITEMS.some((f) => f.id === product.foodId);
    if (!foodExists) {
      FOOD_ITEMS.push({
        id: product.foodId,
        name: product.name,
        bikolName: product.bikolName,
        tagline: product.description,
        description: product.description,
        culturalContext: `Signature dish curated by ${profile.name} in Naga City.`,
        category: product.category,
        categoryLabel: product.categoryLabel,
        image: product.image,
        priceRange: `₱${product.price}`,
        priceLevel: product.price < 100 ? 'budget' : product.price < 250 ? 'moderate' : 'upscale',
        servingSpotsCount: 1,
        featured: product.isSignature,
        flavorProfile: product.flavorProfile.length > 0 ? product.flavorProfile : ['Savory', 'House Special'],
        tags: [product.categoryLabel, 'Local Favorite'],
      });
    }

    return product;
  };

  const updateProduct = (id: string, updates: Partial<BusinessProduct>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, inStock: !item.inStock };
        }
        return item;
      })
    );
  };

  const createPromotion = (
    campaignData: Omit<PromotionCampaign, 'id' | 'impressions' | 'clicks' | 'ordersDriven' | 'startDate'>
  ): PromotionCampaign => {
    const newPromo: PromotionCampaign = {
      ...campaignData,
      id: `promo-${Date.now()}`,
      startDate: 'Active today',
      impressions: 0,
      clicks: 0,
      ordersDriven: 0,
    };

    // If active, deactivate others to spotlight this single primary campaign
    setPromotions((prev) => {
      const updated = newPromo.active ? prev.map((p) => ({ ...p, active: false })) : prev;
      return [newPromo, ...updated];
    });

    return newPromo;
  };

  const togglePromotionActive = (id: string) => {
    setPromotions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, active: !item.active };
        }
        return item;
      })
    );
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const switchEstablishment = (id: string) => {
    const target = ESTABLISHMENTS.find((e) => e.id === id);
    if (target) {
      setProfile({
        id: target.id,
        name: target.name,
        tagline: `${target.typeLabel} in ${target.neighborhood}`,
        type: target.type,
        typeLabel: target.typeLabel,
        description: target.description,
        address: target.address,
        neighborhood: target.neighborhood,
        contactNumber: target.contactNumber || '+63 917 555 0000',
        openingHours: target.openingHours,
        isOpenNow: target.isOpenNow,
        heroImage: target.heroImage,
        atmosphereTags: target.atmosphereTags,
        rating: 4.7,
        reviewCount: 180,
      });

      // Map offerings into products
      const mapped = target.foodsOffered.map((f, idx) => {
        const fullFood = FOOD_ITEMS.find((fi) => fi.id === f.foodId);
        return {
          id: `prod-${target.id}-${idx}`,
          foodId: f.foodId,
          name: f.foodName,
          bikolName: fullFood?.bikolName,
          description: fullFood?.description || `Authentic ${f.foodName} served at ${target.name}.`,
          category: fullFood?.category || 'heritage-soups',
          categoryLabel: fullFood?.categoryLabel || 'Heritage Food',
          price: f.price,
          isSignature: !!f.isSignature,
          inStock: true,
          prepTime: '10–15 mins',
          image: fullFood?.image || target.heroImage,
          flavorProfile: fullFood?.flavorProfile || ['Local Special'],
          servingNote: f.servingNote,
          totalOrdersCount: Math.floor(Math.random() * 80) + 20,
        };
      });
      setProducts(mapped);
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        profile,
        products,
        promotions,
        activePromotion,
        analytics,
        updateProfile,
        toggleOpenStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        createPromotion,
        togglePromotionActive,
        deletePromotion,
        switchEstablishment,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
