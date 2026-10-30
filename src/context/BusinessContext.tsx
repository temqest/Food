import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { FoodCategory, EstablishmentType } from '@/data/types';
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';

export interface BusinessProduct {
  id: string;
  foodId: string;
  name: string;
  bikolName?: string;
  description: string;
  category: FoodCategory | string;
  categoryLabel: string;
  price: number;
  isSignature: boolean;
  inStock: boolean;
  prepTime: string;
  image: string | ImageSourcePropType;
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
  featuredProductIds?: string[];
  featuredProductNames?: string[];
  image?: string;
  active: boolean;
  startDate: string;
  impressions: number;
  clicks: number;
  ordersDriven: number;
  budgetTier: string;
  durationDays?: number;
  cost?: number;
  paymentMode?: 'cash' | 'gcash' | 'maya' | 'store_balance';
  paymentRef?: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  method: 'gcash' | 'maya' | 'bank';
  account: string;
  accountName?: string;
  date: string;
  status: 'completed' | 'processing';
  referenceNumber: string;
}

export interface StoreWallet {
  balance: number;
  todayEarnings: number;
  pendingBalance: number;
  lifetimePaid: number;
  payoutHistory: PayoutRecord[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  category?: 'Kitchen & Prep' | 'Dining Area' | 'Signature Food' | 'Atmosphere & Team' | string;
  createdAt: string;
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
  logoImage: string;
  atmosphereTags: string[];
  rating: number;
  reviewCount: number;
  followersCount?: number;
  wallet: StoreWallet;
  gallery: GalleryPhoto[];
  subscription: StoreSubscription;
}

export interface StoreSubscription {
  status: 'active' | 'inactive';
  plan: 'monthly' | 'annual' | 'none';
  expiryDate?: string;
  autoRenew: boolean;
  paymentMethod?: 'gcash' | 'maya' | 'bank' | 'card';
  paymentRef?: string;
  subscribedSince?: string;
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
  updateProfilePhoto: (type: 'banner' | 'logo', url: string) => void;
  cashOutWallet: (
    amount: number,
    method: 'gcash' | 'maya' | 'bank',
    account: string,
    accountName?: string
  ) => boolean;
  addGalleryPhoto: (photo: { url: string; caption?: string; category?: string }) => void;
  deleteGalleryPhoto: (photoId: string) => void;
  subscribeStore: (
    plan: 'monthly' | 'annual',
    paymentMethod: 'gcash' | 'maya' | 'bank' | 'card',
    paymentRef?: string
  ) => void;
  cancelSubscription: () => void;
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

const DEFAULT_WALLET: StoreWallet = {
  balance: 24850,
  todayEarnings: 4850,
  pendingBalance: 1250,
  lifetimePaid: 142600,
  payoutHistory: [
    {
      id: 'payout-101',
      amount: 8500,
      method: 'gcash',
      account: '0917 ••• 8291',
      accountName: 'Cha Cha Kinalas St.',
      date: 'Yesterday, 6:30 PM',
      status: 'completed',
      referenceNumber: 'GCASH-98210452',
    },
    {
      id: 'payout-102',
      amount: 12000,
      method: 'bank',
      account: 'BDO •••• 5821',
      accountName: 'Cha Cha Eatery Inc.',
      date: '3 days ago',
      status: 'completed',
      referenceNumber: 'BDO-55291048',
    },
    {
      id: 'payout-103',
      amount: 4500,
      method: 'maya',
      account: '0918 ••• 3942',
      accountName: 'Cha Cha Store',
      date: 'Oct 20, 2026',
      status: 'completed',
      referenceNumber: 'MAYA-11829031',
    },
  ],
};

const localAssetUri = (source: ImageSourcePropType): string =>
  Image.resolveAssetSource(source)?.uri ?? '';

const LOCAL_BUSINESS_IMAGES = {
  baduya: localAssetUri(require('../../Food Images/Baduya1.jpg')),
  bicolExpress: localAssetUri(require('../../Food Images/BicolExpress1.webp')),
  kinalas: localAssetUri(require('../../Food Images/kinalas1.webp')),
  laing: localAssetUri(require('../../Food Images/Laing1.jpg')),
  sinanglay: localAssetUri(require('../../Food Images/sinanglayTilapia1.jpg')),
  toastedSiopao: localAssetUri(require('../../Food Images/toastedSiopao1.jpg')),
};

const DEFAULT_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    url: LOCAL_BUSINESS_IMAGES.bicolExpress,
    caption: 'Freshly prepared Bicol Express with coconut milk and native chilies',
    category: 'Signature Food',
    createdAt: 'Oct 24, 2026',
  },
  {
    id: 'gal-2',
    url: LOCAL_BUSINESS_IMAGES.kinalas,
    caption: 'Hot steaming bowl of special beef marrow kinalas with egg',
    category: 'Signature Food',
    createdAt: 'Oct 23, 2026',
  },
  {
    id: 'gal-3',
    url: LOCAL_BUSINESS_IMAGES.sinanglay,
    caption: 'Freshly wrapped and simmered Sinanglay na Tilapia in coconut milk',
    category: 'Signature Food',
    createdAt: 'Oct 21, 2026',
  },
  {
    id: 'gal-4',
    url: LOCAL_BUSINESS_IMAGES.laing,
    caption: 'Slow-cooked Laing na Natong with rich coconut cream',
    category: 'Signature Food',
    createdAt: 'Oct 19, 2026',
  },
  {
    id: 'gal-5',
    url: LOCAL_BUSINESS_IMAGES.toastedSiopao,
    caption: 'Golden toasted siopao fresh from the bakery oven',
    category: 'Signature Food',
    createdAt: 'Oct 18, 2026',
  },
  {
    id: 'gal-6',
    url: LOCAL_BUSINESS_IMAGES.baduya,
    caption: 'Crisp saba baduya ready for the afternoon merienda rush',
    category: 'Signature Food',
    createdAt: 'Oct 15, 2026',
  },
];

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
  openingHours: '7:00 AM – 8:30 PM',
  isOpenNow: true,
  heroImage: LOCAL_BUSINESS_IMAGES.kinalas,
  logoImage: LOCAL_BUSINESS_IMAGES.kinalas,
  atmosphereTags: ['Casual Dining', 'Open Air Kitchen', 'Heritage Recipe', 'Fast Service'],
  rating: 4.8,
  reviewCount: 384,
  followersCount: 1420,
  wallet: DEFAULT_WALLET,
  gallery: DEFAULT_GALLERY,
  subscription: {
    status: 'inactive',
    plan: 'none',
    autoRenew: false,
  },
};

const INITIAL_PRODUCTS: BusinessProduct[] = [
  {
    id: 'prod-kinalas-special',
    foodId: 'kinalas',
    name: 'Kinalas Special (with Egg & Extra Brain Gravy)',
    bikolName: 'Kinalas na may Itlog',
    description:
      'Our house specialty: freshly made miki noodles in simmering bone broth, scraped tender head meat, thick brain gravy, hard-boiled egg, toasted garlic, and spring onions.',
    category: 'soups-noodles',
    categoryLabel: 'Soups & Noodles',
    price: 85,
    isSignature: true,
    inStock: true,
    prepTime: '5–10 mins',
    image: LOCAL_BUSINESS_IMAGES.kinalas,
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
    category: 'soups-noodles',
    categoryLabel: 'Soups & Noodles',
    price: 70,
    isSignature: false,
    inStock: true,
    prepTime: '5–8 mins',
    image: LOCAL_BUSINESS_IMAGES.kinalas,
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
    category: 'main-dishes',
    categoryLabel: 'Main Dishes (Ulam)',
    price: 150,
    isSignature: true,
    inStock: true,
    prepTime: '15–20 mins',
    image: LOCAL_BUSINESS_IMAGES.sinanglay,
    flavorProfile: ['Creamy Coconut', 'Fresh Ginger', 'Fiery Sili'],
    servingNote: 'Simmered fresh daily in clay pots',
    totalOrdersCount: 96,
  },
  {
    id: 'prod-puto-seko',
    foodId: 'toasted-siopao',
    name: 'Fresh Steamed Puto (Pair of 2)',
    bikolName: 'Puto Biko',
    description: 'Fluffy white rice cakes gently steamed to pair perfectly with your hot bowl of Kinalas broth.',
    category: 'snacks-merienda',
    categoryLabel: 'Snacks & Merienda',
    price: 25,
    isSignature: false,
    inStock: true,
    prepTime: 'Instant',
    image: LOCAL_BUSINESS_IMAGES.toastedSiopao,
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
    featuredProductIds: ['prod-kinalas-special', 'prod-kinalas-regular'],
    featuredProductNames: ['Kinalas Special', 'Kinalas Regular'],
    image: LOCAL_BUSINESS_IMAGES.kinalas,
    active: true,
    startDate: 'Active today',
    impressions: 1420,
    clicks: 312,
    ordersDriven: 48,
    budgetTier: 'Community Booster (3 Days)',
    durationDays: 3,
    cost: 249,
    paymentMode: 'gcash',
    paymentRef: 'GCASH-78291044',
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
      est.logo = profile.logoImage;
      est.galleryImages = profile.gallery.map((g) => g.url);
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

  const updateProfilePhoto = (type: 'banner' | 'logo', url: string) => {
    if (!url.trim()) return;
    setProfile((prev) => {
      if (type === 'banner') {
        return { ...prev, heroImage: url.trim() };
      } else {
        return { ...prev, logoImage: url.trim() };
      }
    });
  };

  const cashOutWallet = (
    amount: number,
    method: 'gcash' | 'maya' | 'bank',
    account: string,
    accountName?: string
  ): boolean => {
    if (amount <= 0 || amount > profile.wallet.balance) {
      return false;
    }

    const newRecord: PayoutRecord = {
      id: `payout-${Date.now()}`,
      amount,
      method,
      account,
      accountName: accountName || profile.name,
      date: 'Just now',
      status: 'completed',
      referenceNumber: `${method.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setProfile((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance - amount,
        lifetimePaid: prev.wallet.lifetimePaid + amount,
        payoutHistory: [newRecord, ...prev.wallet.payoutHistory],
      },
    }));

    return true;
  };

  const addGalleryPhoto = (photo: { url: string; caption?: string; category?: string }) => {
    if (!photo.url.trim()) return;
    const newPhoto: GalleryPhoto = {
      id: `gal-${Date.now()}`,
      url: photo.url.trim(),
      caption: photo.caption?.trim() || `${profile.name} ambiance`,
      category: photo.category || 'Kitchen & Prep',
      createdAt: 'Just now',
    };

    setProfile((prev) => ({
      ...prev,
      gallery: [newPhoto, ...prev.gallery],
    }));
  };

  const deleteGalleryPhoto = (photoId: string) => {
    setProfile((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((p) => p.id !== photoId),
    }));
  };

  const toggleOpenStatus = () => {
    setProfile((prev) => ({
      ...prev,
      isOpenNow: !prev.isOpenNow,
      openingHours: !prev.isOpenNow ? '7:00 AM – 8:30 PM' : 'Opens tomorrow 7:00 AM',
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

  const subscribeStore = (
    plan: 'monthly' | 'annual',
    paymentMethod: 'gcash' | 'maya' | 'bank' | 'card',
    paymentRef?: string
  ) => {
    const today = new Date();
    const expiryDate = new Date();
    if (plan === 'monthly') {
      expiryDate.setMonth(today.getMonth() + 1);
    } else {
      expiryDate.setFullYear(today.getFullYear() + 1);
    }

    const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const formattedSince = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const ref = paymentRef || `SUB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    setProfile((prev) => ({
      ...prev,
      subscription: {
        status: 'active',
        plan,
        expiryDate: formattedExpiry,
        autoRenew: true,
        paymentMethod,
        paymentRef: ref,
        subscribedSince: formattedSince,
      },
    }));
  };

  const cancelSubscription = () => {
    setProfile((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        autoRenew: false,
      },
    }));
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
        logoImage: target.logo || target.heroImage,
        atmosphereTags: target.atmosphereTags,
        rating: 4.7,
        reviewCount: 180,
        followersCount: target.id === 'cha-chas-kinalas' ? 1420 : 960,
        wallet: profile.wallet,
        subscription: profile.subscription,
        gallery: target.galleryImages && target.galleryImages.length > 0
          ? target.galleryImages.map((img, i) => ({
              id: `gal-sw-${i}`,
              url: img,
              caption: `${target.name} specialty view`,
              category: i % 2 === 0 ? 'Signature Food' : 'Dining Area',
              createdAt: 'Recent',
            }))
          : profile.gallery,
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
        updateProfilePhoto,
        cashOutWallet,
        addGalleryPhoto,
        deleteGalleryPhoto,
        subscribeStore,
        cancelSubscription,
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
