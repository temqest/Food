import { supabase } from '@/lib/supabase';
import {
  BusinessProfile,
  BusinessProduct,
  PromotionCampaign,
  PayoutRecord,
  StoreWallet,
  GalleryPhoto,
  StoreSubscription,
} from '@/context/BusinessContext';
import { Platform } from 'react-native';

const STORAGE_PREFIX = '@naga_business_user_';
const ACTIVE_BIZ_KEY = '@naga_active_business_id';

// In-memory fallback map ensuring storage operations always succeed even if native modules are null
const memoryStore = new Map<string, string>();

const safeBusinessStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch {
        // Silently fall back
      }
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch {
      // Native module is null or unlinked (Expo Go / web / etc.)
    }
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    memoryStore.set(key, value);
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch {
        // Silently fall back
      }
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch {
      // Native module is null or unlinked; in-memory store already updated
    }
  },

  async removeItem(key: string): Promise<void> {
    memoryStore.delete(key);
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch {}
    }
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch {}
  },
};

export interface RegisterBusinessInput {
  name: string;
  tagline?: string;
  type: string;
  typeLabel: string;
  description: string;
  address: string;
  neighborhood: string;
  contactNumber: string;
  openingHours: string;
  heroImage?: string;
  logoImage?: string;
  atmosphereTags?: string[];
  initialProduct?: {
    name: string;
    bikolName?: string;
    description: string;
    category: string;
    categoryLabel: string;
    price: number;
    prepTime: string;
    image?: string;
    isSignature?: boolean;
  };
}

export const BusinessService = {
  /**
   * Fetch a registered business owned by the given user ID.
   * Checks Supabase 'businesses' table, with transparent offline / local AsyncStorage fallback.
   */
  async getBusinessByOwner(userId: string): Promise<BusinessProfile | null> {
    if (!userId || userId === 'usr_guest') return null;

    // 1. Try fetching from Supabase 'businesses' table
    try {
      const { data: bizRow, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && bizRow) {
        // Fetch products, wallet, gallery, subscription
        const businessId = bizRow.id;
        const [products, wallet, gallery, subscription] = await Promise.all([
          this.getProducts(businessId),
          this.getWallet(businessId),
          this.getGallery(businessId),
          this.getSubscription(businessId),
        ]);

        const profile: BusinessProfile = {
          id: bizRow.id,
          name: bizRow.name,
          tagline: bizRow.tagline || '',
          type: bizRow.type as any,
          typeLabel: bizRow.type_label || 'Carinderia',
          description: bizRow.description || '',
          address: bizRow.address,
          neighborhood: bizRow.neighborhood || 'Centro',
          contactNumber: bizRow.contact_number,
          openingHours: bizRow.opening_hours || '7:00 AM – 8:30 PM',
          isOpenNow: !!bizRow.is_open_now,
          heroImage: bizRow.hero_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
          logoImage: bizRow.logo_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
          atmosphereTags: bizRow.atmosphere_tags || ['Local Favorite', 'Freshly Cooked'],
          rating: Number(bizRow.rating) || 5.0,
          reviewCount: Number(bizRow.review_count) || 0,
          followersCount: Number(bizRow.followers_count) || 12,
          wallet: wallet || {
            balance: 0,
            todayEarnings: 0,
            pendingBalance: 0,
            lifetimePaid: 0,
            payoutHistory: [],
          },
          gallery: gallery || [],
          subscription: subscription || {
            status: 'inactive',
            plan: 'none',
            autoRenew: false,
          },
        };

        // Cache locally for offline reliability
        try {
          await safeBusinessStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify({ profile, products }));
        } catch {
          // Silently ignore storage errors
        }

        return profile;
      }
    } catch (err) {
      console.warn('[BusinessService] Error querying Supabase businesses:', err);
    }

    // 2. Check local fallback if offline or table pending in Supabase
    try {
      const cached = await safeBusinessStorage.getItem(`${STORAGE_PREFIX}${userId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.profile) {
          return parsed.profile;
        }
      }
    } catch (err) {
      console.warn('[BusinessService] Error reading local business cache:', err);
    }

    return null;
  },

  /**
   * Register a new business in the database (or locally if Supabase table is pending).
   */
  async registerBusiness(
    userId: string,
    input: RegisterBusinessInput
  ): Promise<{ success: boolean; business?: BusinessProfile; products?: BusinessProduct[]; error?: string }> {
    try {
      if (!userId || userId === 'usr_guest') {
        return { success: false, error: 'You must be signed in to register a food business.' };
      }

      // Generate a clean slug ID
      const baseSlug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'store';
      const uniqueSuffix = Math.random().toString(36).substring(2, 7);
      const businessId = `biz-${baseSlug}-${uniqueSuffix}`;

      const defaultHero =
        input.heroImage ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80';
      const defaultLogo =
        input.logoImage ||
        input.heroImage ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80';

      const initialWallet: StoreWallet = {
        balance: 0,
        todayEarnings: 0,
        pendingBalance: 0,
        lifetimePaid: 0,
        payoutHistory: [],
      };

      const initialSubscription: StoreSubscription = {
        status: 'inactive',
        plan: 'none',
        autoRenew: false,
      };

      const initialGallery: GalleryPhoto[] = input.heroImage
        ? [
            {
              id: `gal-${Date.now()}-1`,
              url: input.heroImage,
              caption: `${input.name} Storefront`,
              category: 'Dining Area',
              createdAt: 'Just now',
            },
          ]
        : [];

      const initialProductsList: BusinessProduct[] = [];
      if (input.initialProduct && input.initialProduct.name.trim()) {
        const prodId = `prod-${Date.now()}-1`;
        initialProductsList.push({
          id: prodId,
          foodId: prodId,
          name: input.initialProduct.name.trim(),
          bikolName: input.initialProduct.bikolName?.trim() || undefined,
          description: input.initialProduct.description.trim() || 'Prepared fresh with authentic local ingredients.',
          category: input.initialProduct.category || 'main-dishes',
          categoryLabel: input.initialProduct.categoryLabel || 'Main Dishes',
          price: Number(input.initialProduct.price) || 85,
          isSignature: input.initialProduct.isSignature ?? true,
          inStock: true,
          prepTime: input.initialProduct.prepTime || '5–10 mins',
          image: input.initialProduct.image || defaultHero,
          flavorProfile: ['Authentic Naga Flavor', 'Freshly Prepared'],
          totalOrdersCount: 0,
        });
      }

      const newProfile: BusinessProfile = {
        id: businessId,
        name: input.name.trim(),
        tagline: input.tagline?.trim() || `Authentic ${input.typeLabel} in Naga City`,
        type: input.type as any,
        typeLabel: input.typeLabel,
        description: input.description.trim() || `${input.name} is proud to serve flavorful Bicolano cuisine in Naga City.`,
        address: input.address.trim(),
        neighborhood: input.neighborhood.trim() || 'Centro',
        contactNumber: input.contactNumber.trim(),
        openingHours: input.openingHours.trim() || '7:00 AM – 8:30 PM',
        isOpenNow: true,
        heroImage: defaultHero,
        logoImage: defaultLogo,
        atmosphereTags: input.atmosphereTags && input.atmosphereTags.length > 0
          ? input.atmosphereTags
          : ['Local Food Spot', 'Fast Service', 'Cash & GCash'],
        rating: 5.0,
        reviewCount: 1,
        followersCount: 24,
        wallet: initialWallet,
        gallery: initialGallery,
        subscription: initialSubscription,
      };

      // 1. Attempt writing to Supabase
      try {
        const { error: bizInsertError } = await supabase.from('businesses').insert({
          id: businessId,
          owner_id: userId,
          name: newProfile.name,
          tagline: newProfile.tagline,
          type: newProfile.type,
          type_label: newProfile.typeLabel,
          description: newProfile.description,
          address: newProfile.address,
          neighborhood: newProfile.neighborhood,
          contact_number: newProfile.contactNumber,
          opening_hours: newProfile.openingHours,
          is_open_now: newProfile.isOpenNow,
          hero_image: newProfile.heroImage,
          logo_image: newProfile.logoImage,
          atmosphere_tags: newProfile.atmosphereTags,
          rating: newProfile.rating,
          review_count: newProfile.reviewCount,
          followers_count: newProfile.followersCount,
          status: 'active',
        });

        if (!bizInsertError) {
          // Insert initial product if exists
          if (initialProductsList.length > 0) {
            const p = initialProductsList[0];
            await supabase.from('business_products').insert({
              id: p.id,
              business_id: businessId,
              food_id: p.foodId,
              name: p.name,
              bikol_name: p.bikolName || null,
              description: p.description,
              category: p.category,
              category_label: p.categoryLabel,
              price: p.price,
              is_signature: p.isSignature,
              in_stock: p.inStock,
              prep_time: p.prepTime,
              image_url: typeof p.image === 'string' ? p.image : defaultHero,
              flavor_profile: p.flavorProfile,
              serving_note: p.servingNote || null,
            });
          }

          // Insert wallet
          await supabase.from('business_wallets').insert({
            business_id: businessId,
            balance: 0,
            today_earnings: 0,
            pending_balance: 0,
            lifetime_paid: 0,
            payout_history: [],
          });
        } else {
          console.warn('[BusinessService] Supabase insert error (will use local cache):', bizInsertError);
        }
      } catch (dbErr) {
        console.warn('[BusinessService] Caught DB error during registration:', dbErr);
      }

      // 2. Always persist locally for instant offline responsiveness
      try {
        await safeBusinessStorage.setItem(
          `${STORAGE_PREFIX}${userId}`,
          JSON.stringify({ profile: newProfile, products: initialProductsList })
        );
        await safeBusinessStorage.setItem(ACTIVE_BIZ_KEY, businessId);
      } catch (storageErr) {
        console.warn('[BusinessService] Warning saving to local storage:', storageErr);
      }

      return {
        success: true,
        business: newProfile,
        products: initialProductsList,
      };
    } catch (err: any) {
      console.error('[BusinessService] Unexpected error registering business:', err);
      return { success: false, error: err?.message || 'Failed to register business.' };
    }
  },

  /**
   * Fetch products for the given business ID
   */
  async getProducts(businessId: string): Promise<BusinessProduct[]> {
    try {
      const { data, error } = await supabase
        .from('business_products')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          foodId: row.food_id || row.id,
          name: row.name,
          bikolName: row.bikol_name || undefined,
          description: row.description || '',
          category: row.category,
          categoryLabel: row.category_label || 'Menu Item',
          price: Number(row.price) || 0,
          isSignature: !!row.is_signature,
          inStock: row.in_stock !== false,
          prepTime: row.prep_time || '5–10 mins',
          image: row.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          flavorProfile: row.flavor_profile || [],
          servingNote: row.serving_note || undefined,
          totalOrdersCount: Number(row.total_orders_count) || 0,
        }));
      }
    } catch (err) {
      console.warn('[BusinessService] Error querying business products:', err);
    }
    return [];
  },

  /**
   * Add a new product to the business menu
   */
  async addProduct(
    businessId: string,
    product: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>
  ): Promise<BusinessProduct> {
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullProduct: BusinessProduct = {
      ...product,
      id: newId,
      totalOrdersCount: 0,
    };

    try {
      await supabase.from('business_products').insert({
        id: newId,
        business_id: businessId,
        food_id: product.foodId || newId,
        name: product.name,
        bikol_name: product.bikolName || null,
        description: product.description,
        category: product.category,
        category_label: product.categoryLabel,
        price: product.price,
        is_signature: product.isSignature,
        in_stock: product.inStock,
        prep_time: product.prepTime,
        image_url: typeof product.image === 'string' ? product.image : '',
        flavor_profile: product.flavorProfile,
        serving_note: product.servingNote || null,
      });
    } catch (err) {
      console.warn('[BusinessService] Error inserting product to Supabase:', err);
    }

    return fullProduct;
  },

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<BusinessProduct>): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.bikolName !== undefined) dbUpdates.bikol_name = updates.bikolName;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.isSignature !== undefined) dbUpdates.is_signature = updates.isSignature;
      if (updates.prepTime !== undefined) dbUpdates.prep_time = updates.prepTime;
      if (updates.image !== undefined && typeof updates.image === 'string') {
        dbUpdates.image_url = updates.image;
      }

      await supabase.from('business_products').update(dbUpdates).eq('id', productId);
      return true;
    } catch (err) {
      console.warn('[BusinessService] Error updating product in DB:', err);
      return false;
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      await supabase.from('business_products').delete().eq('id', productId);
      return true;
    } catch (err) {
      console.warn('[BusinessService] Error deleting product from DB:', err);
      return false;
    }
  },

  /**
   * Fetch wallet details for the business
   */
  async getWallet(businessId: string): Promise<StoreWallet | null> {
    try {
      const { data, error } = await supabase
        .from('business_wallets')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (!error && data) {
        return {
          balance: Number(data.balance) || 0,
          todayEarnings: Number(data.today_earnings) || 0,
          pendingBalance: Number(data.pending_balance) || 0,
          lifetimePaid: Number(data.lifetime_paid) || 0,
          payoutHistory: Array.isArray(data.payout_history) ? data.payout_history : [],
        };
      }
    } catch (err) {
      console.warn('[BusinessService] Error querying wallet:', err);
    }
    return null;
  },

  /**
   * Record a payout / cashout
   */
  async recordCashout(businessId: string, payout: PayoutRecord, newBalance: number): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('business_wallets')
        .select('payout_history, lifetime_paid')
        .eq('business_id', businessId)
        .maybeSingle();

      const existingHistory = Array.isArray(data?.payout_history) ? data.payout_history : [];
      const updatedHistory = [payout, ...existingHistory];
      const lifetimePaid = (Number(data?.lifetime_paid) || 0) + payout.amount;

      await supabase.from('business_wallets').update({
        balance: newBalance,
        lifetime_paid: lifetimePaid,
        payout_history: updatedHistory,
      }).eq('business_id', businessId);

      return true;
    } catch (err) {
      console.warn('[BusinessService] Error recording cashout:', err);
      return false;
    }
  },

  /**
   * Fetch gallery photos
   */
  async getGallery(businessId: string): Promise<GalleryPhoto[]> {
    try {
      const { data, error } = await supabase
        .from('business_gallery')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          url: row.url,
          caption: row.caption || undefined,
          category: row.category as any,
          createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recently',
        }));
      }
    } catch (err) {
      console.warn('[BusinessService] Error querying gallery:', err);
    }
    return [];
  },

  /**
   * Add gallery photo
   */
  async addGalleryPhoto(businessId: string, photo: { url: string; caption?: string; category?: string }): Promise<GalleryPhoto> {
    const id = `gal-${Date.now()}`;
    const newPhoto: GalleryPhoto = {
      id,
      url: photo.url,
      caption: photo.caption,
      category: photo.category as any,
      createdAt: 'Just now',
    };

    try {
      await supabase.from('business_gallery').insert({
        id,
        business_id: businessId,
        url: photo.url,
        caption: photo.caption || null,
        category: photo.category || 'Dining Area',
      });
    } catch (err) {
      console.warn('[BusinessService] Error adding gallery photo:', err);
    }

    return newPhoto;
  },

  /**
   * Delete gallery photo
   */
  async deleteGalleryPhoto(photoId: string): Promise<boolean> {
    try {
      await supabase.from('business_gallery').delete().eq('id', photoId);
      return true;
    } catch (err) {
      console.warn('[BusinessService] Error deleting gallery photo:', err);
      return false;
    }
  },

  /**
   * Fetch promotions for business
   */
  async getPromotions(businessId: string): Promise<PromotionCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('business_promotions')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          establishmentId: businessId,
          title: row.title,
          description: row.description || '',
          badgeText: row.badge_text,
          discountPercent: row.discount_percent || undefined,
          targetDistrict: row.target_district,
          featuredFoodId: row.featured_food_id || undefined,
          featuredFoodName: row.featured_food_name || undefined,
          featuredProductIds: row.featured_product_ids || [],
          image: row.image_url || undefined,
          active: !!row.active,
          startDate: row.start_date || 'Ongoing',
          impressions: Number(row.impressions) || 0,
          clicks: Number(row.clicks) || 0,
          ordersDriven: Number(row.orders_driven) || 0,
          budgetTier: row.budget_tier || 'starter',
          durationDays: row.duration_days || 7,
          cost: Number(row.cost) || 0,
          paymentMode: row.payment_mode as any,
          paymentRef: row.payment_ref || undefined,
        }));
      }
    } catch (err) {
      console.warn('[BusinessService] Error querying promotions:', err);
    }
    return [];
  },

  /**
   * Create promotion
   */
  async createPromotion(
    businessId: string,
    promo: Omit<PromotionCampaign, 'id' | 'impressions' | 'clicks' | 'ordersDriven' | 'startDate'>
  ): Promise<PromotionCampaign> {
    const id = `promo-${Date.now()}`;
    const newPromo: PromotionCampaign = {
      ...promo,
      id,
      startDate: 'Just launched',
      impressions: 0,
      clicks: 0,
      ordersDriven: 0,
    };

    try {
      await supabase.from('business_promotions').insert({
        id,
        business_id: businessId,
        title: promo.title,
        description: promo.description,
        badge_text: promo.badgeText,
        discount_percent: promo.discountPercent || 0,
        target_district: promo.targetDistrict,
        featured_food_id: promo.featuredFoodId || null,
        featured_food_name: promo.featuredFoodName || null,
        featured_product_ids: promo.featuredProductIds || [],
        image_url: promo.image || null,
        active: promo.active,
        budget_tier: promo.budgetTier,
        duration_days: promo.durationDays || 7,
        cost: promo.cost || 0,
        payment_mode: promo.paymentMode || 'store_balance',
        payment_ref: promo.paymentRef || null,
      });
    } catch (err) {
      console.warn('[BusinessService] Error creating promotion:', err);
    }

    return newPromo;
  },

  /**
   * Fetch subscription details
   */
  async getSubscription(businessId: string): Promise<StoreSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('business_subscriptions')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (!error && data) {
        return {
          status: (data.status as any) || 'inactive',
          plan: (data.plan as any) || 'none',
          expiryDate: data.expiry_date || undefined,
          autoRenew: !!data.auto_renew,
          paymentMethod: data.payment_method as any,
          paymentRef: data.payment_ref || undefined,
          subscribedSince: data.subscribed_since || undefined,
        };
      }
    } catch (err) {
      console.warn('[BusinessService] Error fetching subscription:', err);
    }
    return null;
  },

  /**
   * Update store profile details
   */
  async updateBusinessProfile(businessId: string, updates: Partial<BusinessProfile>): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.tagline) dbUpdates.tagline = updates.tagline;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.address) dbUpdates.address = updates.address;
      if (updates.neighborhood) dbUpdates.neighborhood = updates.neighborhood;
      if (updates.contactNumber) dbUpdates.contact_number = updates.contactNumber;
      if (updates.openingHours) dbUpdates.opening_hours = updates.openingHours;
      if (updates.isOpenNow !== undefined) dbUpdates.is_open_now = updates.isOpenNow;
      if (updates.heroImage) dbUpdates.hero_image = updates.heroImage;
      if (updates.logoImage) dbUpdates.logo_image = updates.logoImage;
      if (updates.atmosphereTags) dbUpdates.atmosphere_tags = updates.atmosphereTags;

      await supabase.from('businesses').update(dbUpdates).eq('id', businessId);
      return true;
    } catch (err) {
      console.warn('[BusinessService] Error updating business profile:', err);
      return false;
    }
  },
};
