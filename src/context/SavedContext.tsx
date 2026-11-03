import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { FoodItem, Establishment } from '@/data/types';

/**
 * State and action handlers for user-saved dishes and establishments.
 * Syncs seamlessly with Supabase public.user_saved table per authenticated user.
 */
interface SavedContextType {
  savedFoodIds: string[];
  savedEstablishmentIds: string[];
  toggleSaveFood: (id: string) => Promise<void>;
  toggleSaveEstablishment: (id: string) => Promise<void>;
  isFoodSaved: (id: string) => boolean;
  isEstablishmentSaved: (id: string) => boolean;
  savedFoods: FoodItem[];
  savedEstablishments: Establishment[];
  clearAllSaved: () => Promise<void>;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const [savedFoodIds, setSavedFoodIds] = useState<string[]>(['kinalas']);
  const [savedEstablishmentIds, setSavedEstablishmentIds] = useState<string[]>(['cha-chas-kinalas']);

  // Fetch bookmarks from Supabase when user logs in
  useEffect(() => {
    let isMounted = true;
    async function loadSavedItems() {
      if (!user?.id || isGuest) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_saved')
          .select('item_type, item_id')
          .eq('user_id', user.id);

        if (!error && data && isMounted) {
          const foods = data.filter((d) => d.item_type === 'food').map((d) => d.item_id);
          const eateries = data.filter((d) => d.item_type === 'establishment').map((d) => d.item_id);
          setSavedFoodIds(foods);
          setSavedEstablishmentIds(eateries);
        }
      } catch (err) {
        console.warn('Could not load user_saved:', err);
      }
    }

    loadSavedItems();
    return () => {
      isMounted = false;
    };
  }, [user, isGuest]);

  const toggleSaveFood = useCallback(async (id: string) => {
    setSavedFoodIds((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });

    if (user?.id && !isGuest) {
      try {
        const isCurrentlySaved = savedFoodIds.includes(id);
        if (isCurrentlySaved) {
          await supabase
            .from('user_saved')
            .delete()
            .match({ user_id: user.id, item_type: 'food', item_id: id });
        } else {
          await supabase
            .from('user_saved')
            .upsert({ user_id: user.id, item_type: 'food', item_id: id });
        }
      } catch (err) {
        console.warn('Sync toggleSaveFood error:', err);
      }
    }
  }, [user, isGuest, savedFoodIds]);

  const toggleSaveEstablishment = useCallback(async (id: string) => {
    setSavedEstablishmentIds((prev) => {
      const exists = prev.includes(id);
      return exists ? prev.filter((item) => item !== id) : [...prev, id];
    });

    if (user?.id && !isGuest) {
      try {
        const isCurrentlySaved = savedEstablishmentIds.includes(id);
        if (isCurrentlySaved) {
          await supabase
            .from('user_saved')
            .delete()
            .match({ user_id: user.id, item_type: 'establishment', item_id: id });
        } else {
          await supabase
            .from('user_saved')
            .upsert({ user_id: user.id, item_type: 'establishment', item_id: id });
        }
      } catch (err) {
        console.warn('Sync toggleSaveEstablishment error:', err);
      }
    }
  }, [user, isGuest, savedEstablishmentIds]);

  const isFoodSaved = useCallback((id: string) => savedFoodIds.includes(id), [savedFoodIds]);
  const isEstablishmentSaved = useCallback((id: string) => savedEstablishmentIds.includes(id), [savedEstablishmentIds]);

  const savedFoods = useMemo(
    () => FOOD_ITEMS.filter((f) => savedFoodIds.includes(f.id)),
    [savedFoodIds]
  );

  const savedEstablishments = useMemo(
    () => ESTABLISHMENTS.filter((e) => savedEstablishmentIds.includes(e.id)),
    [savedEstablishmentIds]
  );

  const clearAllSaved = useCallback(async () => {
    setSavedFoodIds([]);
    setSavedEstablishmentIds([]);

    if (user?.id && !isGuest) {
      try {
        await supabase.from('user_saved').delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Sync clearAllSaved error:', err);
      }
    }
  }, [user, isGuest]);

  return (
    <SavedContext.Provider
      value={{
        savedFoodIds,
        savedEstablishmentIds,
        toggleSaveFood,
        toggleSaveEstablishment,
        isFoodSaved,
        isEstablishmentSaved,
        savedFoods,
        savedEstablishments,
        clearAllSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
