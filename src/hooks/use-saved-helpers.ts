import { useMemo } from 'react';
import { useSaved } from '@/context/SavedContext';
import { FoodCategory, FoodItem } from '@/data/types';

/**
 * Hook providing aggregate saved item counts for badges and headers.
 */
export function useSavedCounts() {
  const { savedFoodIds, savedEstablishmentIds } = useSaved();

  return useMemo(() => {
    const savedFoodCount = savedFoodIds.length;
    const savedEstablishmentCount = savedEstablishmentIds.length;
    const totalSavedCount = savedFoodCount + savedEstablishmentCount;

    return {
      savedFoodCount,
      savedEstablishmentCount,
      totalSavedCount,
      hasSavedItems: totalSavedCount > 0,
    };
  }, [savedFoodIds.length, savedEstablishmentIds.length]);
}

/**
 * Hook to retrieve saved food items filtered by category.
 */
export function useSavedFoodsByCategory(category?: FoodCategory | 'all'): FoodItem[] {
  const { savedFoods } = useSaved();

  return useMemo(() => {
    if (!category || category === 'all') {
      return savedFoods;
    }
    return savedFoods.filter((item) => item.category === category);
  }, [savedFoods, category]);
}
