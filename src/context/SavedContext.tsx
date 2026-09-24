import React, { createContext, useContext, useState } from 'react';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { FoodItem, Establishment } from '@/data/types';

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

  const toggleSaveFood = (id: string) => {
    setSavedFoodIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSaveEstablishment = (id: string) => {
    setSavedEstablishmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFoodSaved = (id: string) => savedFoodIds.includes(id);
  const isEstablishmentSaved = (id: string) => savedEstablishmentIds.includes(id);

  const savedFoods = FOOD_ITEMS.filter((f) => savedFoodIds.includes(f.id));
  const savedEstablishments = ESTABLISHMENTS.filter((e) => savedEstablishmentIds.includes(e.id));

  const clearAllSaved = () => {
    setSavedFoodIds([]);
    setSavedEstablishmentIds([]);
  };

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
