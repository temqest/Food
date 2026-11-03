import { supabase } from '@/lib/supabase';
import {
  FOOD_ITEMS as FALLBACK_FOOD_ITEMS,
  ESTABLISHMENTS as FALLBACK_ESTABLISHMENTS,
  CATEGORIES as FALLBACK_CATEGORIES,
} from '@/data/mockData';
import { FOOD_TRAILS as FALLBACK_TRAILS, FoodTrail } from '@/data/gamification';
import { FoodItem, Establishment, FoodCategory } from '@/data/types';

/**
 * Service to fetch culinary catalog from Supabase with instant offline/local fallback
 */

export const CatalogService = {
  /**
   * Fetch all categories
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_CATEGORIES;
      }

      return data.map((c) => ({
        id: c.id as FoodCategory,
        label: c.label,
        icon: c.icon,
        description: c.description,
      }));
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  /**
   * Fetch all food items / culinary codex
   */
  async getFoodItems(): Promise<FoodItem[]> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('name', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_FOOD_ITEMS;
      }

      return data.map((row) => ({
        id: row.id,
        name: row.name,
        bikolName: row.bikol_name || undefined,
        tagline: row.tagline || '',
        description: row.description || '',
        culturalContext: row.cultural_context || '',
        category: row.category_id as FoodCategory,
        categoryLabel: row.category_label || '',
        image: row.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        priceRange: row.price_range || '₱',
        priceLevel: row.price_level || 'budget',
        servingSpotsCount: row.serving_spots_count || 1,
        featured: !!row.featured,
        flavorProfile: row.flavor_profile || [],
        tags: row.tags || [],
      }));
    } catch {
      return FALLBACK_FOOD_ITEMS;
    }
  },

  /**
   * Get single food item by ID
   */
  async getFoodById(id: string): Promise<FoodItem | undefined> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        return FALLBACK_FOOD_ITEMS.find((f) => f.id === id);
      }

      return {
        id: data.id,
        name: data.name,
        bikolName: data.bikol_name || undefined,
        tagline: data.tagline || '',
        description: data.description || '',
        culturalContext: data.cultural_context || '',
        category: data.category_id as FoodCategory,
        categoryLabel: data.category_label || '',
        image: data.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        priceRange: data.price_range || '₱',
        priceLevel: data.price_level || 'budget',
        servingSpotsCount: data.serving_spots_count || 1,
        featured: !!data.featured,
        flavorProfile: data.flavor_profile || [],
        tags: data.tags || [],
      };
    } catch {
      return FALLBACK_FOOD_ITEMS.find((f) => f.id === id);
    }
  },

  /**
   * Fetch all establishments / restaurants
   */
  async getEstablishments(): Promise<Establishment[]> {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('name', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_ESTABLISHMENTS;
      }

      return data.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type as any,
        typeLabel: row.type_label,
        description: row.description || '',
        address: row.address,
        neighborhood: row.neighborhood,
        coordinates: {
          latitude: Number(row.latitude) || 13.6218,
          longitude: Number(row.longitude) || 123.1948,
          mapX: Number(row.map_x) || 50,
          mapY: Number(row.map_y) || 50,
        },
        distanceKm: Number(row.distance_km) || 0.5,
        openingHours: row.opening_hours,
        isOpenNow: row.is_open_now,
        contactNumber: row.contact_number || undefined,
        heroImage: row.hero_image,
        logo: row.logo || undefined,
        galleryImages: row.gallery_images || [],
        foodsOffered: row.foods_offered || [],
        priceLevel: row.price_level,
        atmosphereTags: row.atmosphere_tags || [],
      }));
    } catch {
      return FALLBACK_ESTABLISHMENTS;
    }
  },

  /**
   * Fetch food trails
   */
  async getFoodTrails(): Promise<FoodTrail[]> {
    try {
      const { data, error } = await supabase
        .from('food_trails')
        .select('*');

      if (error || !data || data.length === 0) {
        return FALLBACK_TRAILS;
      }

      return data.map((row) => {
        const fallback = FALLBACK_TRAILS.find((t) => t.id === row.id) || FALLBACK_TRAILS[0];
        return {
          ...fallback,
          id: row.id,
          title: row.title || fallback.title,
          description: row.description || fallback.description,
          heroImage: row.hero_image || fallback.heroImage,
          xpBonus: row.xp_reward || fallback.xpBonus,
        };
      });
    } catch {
      return FALLBACK_TRAILS;
    }
  },
};

