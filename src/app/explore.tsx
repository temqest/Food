import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '@/components/common/NavBar';
import { PassportStampModal } from '@/components/gamification/PassportStampModal';
import { CodexHeroHeader } from '@/components/codex/CodexHeroHeader';
import { CodexFilterBar } from '@/components/codex/CodexFilterBar';
import { DishCodexCard } from '@/components/codex/DishCodexCard';
import { DishDossierModal } from '@/components/codex/DishDossierModal';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { DISH_INSIDER_TIPS } from '@/data/gamification';
import { FoodItem, Establishment } from '@/data/types';
import { useQuest } from '@/context/QuestContext';

export default function ExploreScreen() {
  const { isFoodLogged } = useQuest();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals & Interactive Sheet State
  const [inspectedFood, setInspectedFood] = useState<FoodItem | null>(null);
  const [stampTargetFood, setStampTargetFood] = useState<FoodItem | null>(null);

  // Filtered Dishes
  const filteredDishes = useMemo(() => {
    return FOOD_ITEMS.filter((food) => {
      // 1. Text Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = food.name.toLowerCase().includes(q);
        const matchesBikol = food.bikolName?.toLowerCase().includes(q) ?? false;
        const matchesTagline = food.tagline.toLowerCase().includes(q);
        const matchesDesc = food.description.toLowerCase().includes(q);
        const matchesFlavor = food.flavorProfile.some((f) => f.toLowerCase().includes(q));

        if (!matchesName && !matchesBikol && !matchesTagline && !matchesDesc && !matchesFlavor) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && food.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  // Establishments helpers
  const getServingEstablishmentsForFood = (foodId: string): Establishment[] => {
    return ESTABLISHMENTS.filter((est) =>
      est.foodsOffered.some((item) => item.foodId === foodId)
    );
  };

  const getPrimaryEstablishmentForFood = (foodId: string): Establishment | undefined => {
    const spots = getServingEstablishmentsForFood(foodId);
    return spots[0] || ESTABLISHMENTS[0];
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Large Title & Search Header */}
          <CodexHeroHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Clean Category Filter Strip */}
          <CodexFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Dishes List */}
          {filteredDishes.length > 0 ? (
            <View style={styles.dishesList}>
              {filteredDishes.map((food) => {
                const insiderTip = DISH_INSIDER_TIPS[food.id];
                const isLogged = isFoodLogged(food.id);
                const primaryEst = getPrimaryEstablishmentForFood(food.id);

                return (
                  <DishCodexCard
                    key={food.id}
                    food={food}
                    insiderTip={insiderTip}
                    isLogged={isLogged}
                    primaryEstablishment={primaryEst}
                    onInspect={() => setInspectedFood(food)}
                  />
                );
              })}
            </View>
          ) : (
            /* Clean Empty State */
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Dishes Found</Text>
              <Text style={styles.emptyDesc}>
                Try adjusting your search terms or chapter filter.
              </Text>
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                style={styles.resetButton}
                accessibilityRole="button"
                accessibilityLabel="Clear search and show all dishes"
              >
                <Text style={styles.resetButtonText}>Show All Dishes</Text>
              </Pressable>
            </View>
          )}

          {/* Quiet Footer Note */}
          <View style={styles.footerNote}>
            <Text style={styles.footerCount}>
              {filteredDishes.length} {filteredDishes.length === 1 ? 'dish' : 'dishes'} recorded in the Codex
            </Text>
            <Text style={styles.footerHint}>
              Tap any dish to inspect cultural heritage, local ordering phrases, and verified spots.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* iOS Translucent Tab Bar */}
      <NavBar currentTab="explore" />

      {/* Deep Codex Dossier Modal */}
      <DishDossierModal
        visible={!!inspectedFood}
        food={inspectedFood}
        insiderTip={inspectedFood ? DISH_INSIDER_TIPS[inspectedFood.id] : undefined}
        servingEstablishments={inspectedFood ? getServingEstablishmentsForFood(inspectedFood.id) : []}
        isLogged={inspectedFood ? isFoodLogged(inspectedFood.id) : false}
        onClose={() => setInspectedFood(null)}
        onLogTasting={(targetFood) => {
          setInspectedFood(null);
          setStampTargetFood(targetFood);
        }}
      />

      {/* Passport Stamp Tasting Modal */}
      {stampTargetFood && (
        <PassportStampModal
          visible={!!stampTargetFood}
          onClose={() => setStampTargetFood(null)}
          foodId={stampTargetFood.id}
          foodName={stampTargetFood.name}
          establishmentId={getPrimaryEstablishmentForFood(stampTargetFood.id)?.id || 'cha-chas-kinalas'}
          establishmentName={getPrimaryEstablishmentForFood(stampTargetFood.id)?.name || "Cha-Cha's Kinalas"}
          image={stampTargetFood.image}
        />
      )}
    </SafeAreaView>
  );
}

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 95,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  dishesList: {
    gap: 0,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  emptyTitle: {
    fontFamily: sansFamily,
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  emptyDesc: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetButtonText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#D42F13',
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerCount: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 3,
  },
  footerHint: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.45)',
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 320,
  },
});
