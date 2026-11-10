import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { FoodCategory, EstablishmentType } from '@/data/types';
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { BusinessService, RegisterBusinessInput, safeBusinessStorage } from '@/services/businessService';

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
  fee?: number;
  netAmount?: number;
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
  hasBusiness: boolean;
  isLoadingBusiness: boolean;
  isDemoMode: boolean;
  registerBusiness: (input: RegisterBusinessInput) => Promise<{ success: boolean; error?: string }>;
  enableDemoMode: () => void;
  refreshBusiness: () => Promise<void>;
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
    accountName?: string,
    fee?: number,
    netAmount?: number
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

const DEFAULT_WALLET: StoreWallet = {
  balance: 24850,
  todayEarnings: 4850,
  pendingBalance: 1250,
  lifetimePaid: 142600,
  payoutHistory: [
    {
      id: 'payout-101',
      amount: 8500,
      fee: 255,
      netAmount: 8245,
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
      fee: 360,
      netAmount: 11640,
      method: 'bank',
      account: 'BDO •••• 5821',
      accountName: 'Cha Cha Eatery Inc.',
      date: '3 days ago',
      status: 'completed',
      referenceNumber: 'BDO-55291048',
    },
  ],
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

const DEMO_PROFILE: BusinessProfile = {
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

const DEMO_PRODUCTS: BusinessProduct[] = [
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
  const { user, isAuthenticated } = useAuth();

  const [hasBusiness, setHasBusiness] = useState<boolean>(false);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const [profile, setProfile] = useState<BusinessProfile>(DEMO_PROFILE);
  const [products, setProducts] = useState<BusinessProduct[]>(DEMO_PRODUCTS);
  const [promotions, setPromotions] = useState<PromotionCampaign[]>([]);
  const [analytics] = useState<BusinessAnalytics>(INITIAL_ANALYTICS);

  // Load business for the current authenticated user
  const loadUserBusiness = useCallback(async () => {
    if (!isAuthenticated || !user || user.id === 'usr_guest') {
      setHasBusiness(false);
      setIsLoadingBusiness(false);
      return;
    }

    setIsLoadingBusiness(true);
    try {
      const fetchedBiz = await BusinessService.getBusinessByOwner(user.id);
      if (fetchedBiz) {
        setProfile(fetchedBiz);
        setHasBusiness(true);
        setIsDemoMode(false);

        // Fetch products & promotions
        const [prodList, promoList] = await Promise.all([
          BusinessService.getProducts(fetchedBiz.id),
          BusinessService.getPromotions(fetchedBiz.id),
        ]);
        setProducts(prodList);
        setPromotions(promoList);
      } else {
        setHasBusiness(false);
      }
    } catch (err) {
      console.warn('[BusinessContext] Error loading user business:', err);
      setHasBusiness(false);
    } finally {
      setIsLoadingBusiness(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    loadUserBusiness();
  }, [loadUserBusiness]);

  const refreshBusiness = async () => {
    await loadUserBusiness();
  };

  const enableDemoMode = async () => {
    try {
      const cached = await safeBusinessStorage.getItem('@naga_demo_biz_profile_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.profile) {
          setProfile(parsed.profile);
          setProducts(parsed.products || DEMO_PRODUCTS);
          setHasBusiness(true);
          setIsDemoMode(true);
          return;
        }
      }
    } catch {
      // Fall through to initial demo profile
    }

    setProfile(DEMO_PROFILE);
    setProducts(DEMO_PRODUCTS);
    setHasBusiness(true);
    setIsDemoMode(true);
  };

  /**
   * Register a new business for current authenticated user
   */
  const registerBusiness = async (
    input: RegisterBusinessInput
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.id === 'usr_guest') {
      return { success: false, error: 'Please sign in to register your food business.' };
    }

    try {
      const res = await BusinessService.registerBusiness(user.id, input);
      if (res.success && res.business) {
        setProfile(res.business);
        if (res.products) {
          setProducts(res.products);
        }
        setHasBusiness(true);
        setIsDemoMode(false);
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to create business.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Unexpected registration error.' };
    }
  };

  // Synchronize establishment changes with global mock dataset so customer view reflects updates
  useEffect(() => {
    if (!hasBusiness) return;
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
  }, [profile, products, hasBusiness]);

  const activePromotion = useMemo(() => {
    return promotions.find((p) => p.active) || null;
  }, [promotions]);

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      if (hasBusiness && !isDemoMode) {
        BusinessService.updateBusinessProfile(prev.id, updates).catch(() => {});
      }
      return updated;
    });
  };

  const updateProfilePhoto = (type: 'banner' | 'logo', url: string) => {
    if (!url.trim()) return;
    setProfile((prev) => {
      const updated = type === 'banner' ? { ...prev, heroImage: url.trim() } : { ...prev, logoImage: url.trim() };
      if (hasBusiness && !isDemoMode) {
        BusinessService.updateBusinessProfile(prev.id, type === 'banner' ? { heroImage: url.trim() } : { logoImage: url.trim() }).catch(() => {});
      }
      return updated;
    });
  };

  const cashOutWallet = (
    amount: number,
    method: 'gcash' | 'maya' | 'bank',
    account: string,
    accountName?: string,
    fee?: number,
    netAmount?: number
  ): boolean => {
    if (amount <= 0 || amount > profile.wallet.balance) {
      return false;
    }

    const processingFee = fee !== undefined ? fee : Math.round(amount * 0.03 * 100) / 100;
    const finalNet = netAmount !== undefined ? netAmount : Math.max(0, Math.round((amount - processingFee) * 100) / 100);

    const newRecord: PayoutRecord = {
      id: `payout-${Date.now()}`,
      amount,
      fee: processingFee,
      netAmount: finalNet,
      method,
      account,
      accountName: accountName || profile.name,
      date: 'Just now',
      status: 'completed',
      referenceNumber: `${method.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    const newBal = profile.wallet.balance - amount;

    setProfile((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: newBal,
        lifetimePaid: prev.wallet.lifetimePaid + amount,
        payoutHistory: [newRecord, ...prev.wallet.payoutHistory],
      },
    }));

    if (hasBusiness && !isDemoMode) {
      BusinessService.recordCashout(profile.id, newRecord, newBal).catch(() => {});
    }

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

    if (hasBusiness && !isDemoMode) {
      BusinessService.addGalleryPhoto(profile.id, photo).catch(() => {});
    }
  };

  const deleteGalleryPhoto = (photoId: string) => {
    setProfile((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((p) => p.id !== photoId),
    }));

    if (hasBusiness && !isDemoMode) {
      BusinessService.deleteGalleryPhoto(photoId).catch(() => {});
    }
  };

  const toggleOpenStatus = () => {
    setProfile((prev) => {
      const nextOpen = !prev.isOpenNow;
      const updated = {
        ...prev,
        isOpenNow: nextOpen,
        openingHours: nextOpen ? '7:00 AM – 8:30 PM' : 'Opens tomorrow 7:00 AM',
      };
      if (hasBusiness && !isDemoMode) {
        BusinessService.updateBusinessProfile(prev.id, { isOpenNow: nextOpen }).catch(() => {});
      }
      return updated;
    });
  };

  const addProduct = (newProd: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>): BusinessProduct => {
    const id = `prod-${Date.now()}`;
    const product: BusinessProduct = {
      ...newProd,
      id,
      totalOrdersCount: 0,
    };
    setProducts((prev) => [product, ...prev]);

    if (hasBusiness && !isDemoMode) {
      BusinessService.addProduct(profile.id, newProd).catch(() => {});
    }

    return product;
  };

  const updateProduct = (id: string, updates: Partial<BusinessProduct>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if (hasBusiness && !isDemoMode) {
            BusinessService.updateProduct(id, updates).catch(() => {});
          }
          return updated;
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (hasBusiness && !isDemoMode) {
      BusinessService.deleteProduct(id).catch(() => {});
    }
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStock = !item.inStock;
          if (hasBusiness && !isDemoMode) {
            BusinessService.updateProduct(id, { inStock: nextStock }).catch(() => {});
          }
          return { ...item, inStock: nextStock };
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

    setPromotions((prev) => {
      const updated = newPromo.active ? prev.map((p) => ({ ...p, active: false })) : prev;
      return [newPromo, ...updated];
    });

    if (hasBusiness && !isDemoMode) {
      BusinessService.createPromotion(profile.id, campaignData).catch(() => {});
    }

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

    const ref = paymentRef || `SUB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newSubscription: StoreSubscription = {
      status: 'active',
      plan,
      expiryDate: expiryDate.toISOString(),
      autoRenew: true,
      paymentMethod,
      paymentRef: ref,
      subscribedSince: today.toISOString(),
    };

    setProfile((prev) => {
      const updated = {
        ...prev,
        subscription: newSubscription,
      };

      // Persist asynchronously to Supabase and local storage
      (async () => {
        try {
          await BusinessService.updateSubscription(prev.id, newSubscription);

          if (user?.id && user.id !== 'usr_guest') {
            await safeBusinessStorage.setItem(
              `@naga_registered_biz_${user.id}`,
              JSON.stringify({ profile: updated, products })
            );
          }

          if (isDemoMode) {
            await safeBusinessStorage.setItem(
              '@naga_demo_biz_profile_v1',
              JSON.stringify({ profile: updated, products })
            );
          }

          await safeBusinessStorage.setItem(
            `@naga_biz_store_${prev.id}`,
            JSON.stringify({ profile: updated, products })
          );
        } catch (err) {
          console.warn('[BusinessContext] Error saving subscription:', err);
        }
      })();

      return updated;
    });
  };

  const cancelSubscription = () => {
    setProfile((prev) => {
      const updatedSubscription: StoreSubscription = {
        ...prev.subscription,
        autoRenew: false,
      };

      const updated = {
        ...prev,
        subscription: updatedSubscription,
      };

      // Persist cancellation asynchronously
      (async () => {
        try {
          await BusinessService.updateSubscription(prev.id, updatedSubscription);

          if (user?.id && user.id !== 'usr_guest') {
            await safeBusinessStorage.setItem(
              `@naga_registered_biz_${user.id}`,
              JSON.stringify({ profile: updated, products })
            );
          }

          if (isDemoMode) {
            await safeBusinessStorage.setItem(
              '@naga_demo_biz_profile_v1',
              JSON.stringify({ profile: updated, products })
            );
          }

          await safeBusinessStorage.setItem(
            `@naga_biz_store_${prev.id}`,
            JSON.stringify({ profile: updated, products })
          );
        } catch (err) {
          console.warn('[BusinessContext] Error persisting subscription cancellation:', err);
        }
      })();

      return updated;
    });
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
        hasBusiness,
        isLoadingBusiness,
        isDemoMode,
        registerBusiness,
        enableDemoMode,
        refreshBusiness,
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
