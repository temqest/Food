import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { FoodItem, Establishment } from '@/data/types';

/**
 * State and action handlers for user-saved dishes and establishments.
 */
interface SavedContextType {
  savedFoodIds: string[];
  savedEstablishmentIds: string[];
  toggleSaveFood: (id: string) => void;
  toggleSaveEstablishment: (id: string) => void;
  isFoodSaved: (id: string) => boolean;
  isEstablishmentSaved: (id: string) => boolean;
  savedFoods: FoodItem[];
  savedEstablishments: Establishment[];
  clearAllSaved: () => void;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Seed with 1 food and 1 establishment for initial discovery, but easily removable
  const [savedFoodIds, setSavedFoodIds] = useState<string[]>(['kinalas']);
  const [savedEstablishmentIds, setSavedEstablishmentIds] = useState<string[]>(['cha-chas-kinalas']);

  const toggleSaveFood = useCallback((id: string) => {
    setSavedFoodIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSaveEstablishment = useCallback((id: string) => {
    setSavedEstablishmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

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

  const clearAllSaved = useCallback(() => {
    setSavedFoodIds([]);
    setSavedEstablishmentIds([]);
  }, []);

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
