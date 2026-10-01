import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { SearchInput } from '@/components/common/SearchInput';
import { NavBar } from '@/components/common/NavBar';
import { FoodCard } from '@/components/food/FoodCard';
import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { FOOD_ITEMS, ESTABLISHMENTS, CATEGORIES } from '@/data/mockData';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const [query, setQuery] = useState(params.q || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category || 'all');
  const [openOnly, setOpenOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'dishes' | 'places'>('dishes');

  // Filter food items
  const matchedFoods = useMemo(() => {
    return FOOD_ITEMS.filter((food) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        food.name.toLowerCase().includes(q) ||
        food.tagline.toLowerCase().includes(q) ||
        food.description.toLowerCase().includes(q) ||
        (food.bikolName && food.bikolName.toLowerCase().includes(q)) ||
        food.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'all' || food.category === selectedCategory;

      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory]);

  // Filter establishments
  const matchedEstablishments = useMemo(() => {
    const q = query.toLowerCase().trim();

    return ESTABLISHMENTS.filter((est) => {
      const nameOrAddressMatch =
        est.name.toLowerCase().includes(q) ||
        est.neighborhood.toLowerCase().includes(q) ||
        est.description.toLowerCase().includes(q);

      const foodMatch =
        !q ||
        nameOrAddressMatch ||
        est.foodsOffered.some((f) => {
          const matchFoodName = f.foodName.toLowerCase().includes(q);
          const matchFoodId = f.foodId.toLowerCase().includes(q);
          return matchFoodName || matchFoodId;
        }) ||
        matchedFoods.some((mf) => est.foodsOffered.some((ef) => ef.foodId === mf.id));

      const matchesOpen = !openOnly || est.isOpenNow;

      return foodMatch && matchesOpen;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, matchedFoods, openOnly]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Minimal Icon-Only Back Button */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Editorial Title */}
          <View style={styles.titleSection}>
            <Text style={styles.headingSans}>
              Search <Text style={styles.headingSerif}>flavors</Text>
            </Text>
            <Text style={styles.subheadText}>
              Find traditional dishes, secret carinderias, and top spots across Naga.
            </Text>
          </View>

          {/* Search Bar Input */}
          <View style={styles.searchWrapper}>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search dishes or places..."
              autoFocus={!params.q && !params.category}
              onClear={() => setQuery('')}
            />
          </View>

          {/* Quick Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <Pressable
              onPress={() => setSelectedCategory('all')}
              style={({ pressed }) => [
                styles.categoryFilter,
                selectedCategory === 'all' && styles.categoryFilterActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  selectedCategory === 'all' && styles.categoryFilterTextActive,
                ]}
              >
                All
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setOpenOnly(!openOnly)}
              style={({ pressed }) => [
                styles.categoryFilter,
                openOnly && styles.categoryFilterActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryFilterText,
                  openOnly && styles.categoryFilterTextActive,
                ]}
              >
                Open Now
              </Text>
            </Pressable>

            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() =>
                  setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)
                }
                style={({ pressed }) => [
                  styles.categoryFilter,
                  selectedCategory === cat.id && styles.categoryFilterActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.categoryFilterText,
                    selectedCategory === cat.id && styles.categoryFilterTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Segmented Control: Dishes vs Places */}
          <View style={styles.segmentWrapper}>
            <View style={styles.segmentContainer}>
              <Pressable
                onPress={() => setActiveTab('dishes')}
                style={[
                  styles.segmentTab,
                  activeTab === 'dishes' && styles.segmentTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    activeTab === 'dishes' && styles.segmentLabelActive,
                  ]}
                >
                  Dishes ({matchedFoods.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('places')}
                style={[
                  styles.segmentTab,
                  activeTab === 'places' && styles.segmentTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    activeTab === 'places' && styles.segmentLabelActive,
                  ]}
                >
                  Places ({matchedEstablishments.length})
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Results List */}
          {activeTab === 'dishes' ? (
            matchedFoods.length > 0 ? (
              <View style={styles.insetGroup}>
                {matchedFoods.map((food) => (
                  <FoodCard key={food.id} food={food} layout="row" />
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons
                    name="search"
                    size={36}
                    color="#8E8E93"
                  />
                </View>
                <Text style={styles.emptyTitle}>No Dishes Found</Text>
                <Text style={styles.emptyDesc}>
                  Try searching for another dish like Kinalas, Toasted Siopao, or Pinangat.
                </Text>
              </View>
            )
          ) : matchedEstablishments.length > 0 ? (
            <View style={styles.insetGroup}>
              {matchedEstablishments.map((est, index) => (
                <EstablishmentCard
                  key={est.id}
                  establishment={est}
                  layout="row"
                  isFirst={index === 0}
                  isLast={index === matchedEstablishments.length - 1}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="storefront-outline"
                  size={36}
                  color="#8E8E93"
                />
              </View>
              <Text style={styles.emptyTitle}>No Places Found</Text>
              <Text style={styles.emptyDesc}>
                Try adjusting your search terms or selecting a different category filter.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <NavBar />
    </SafeAreaView>
  );
}

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
  default: 'Georgia',
});

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
  topBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 2,
  },
  backIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingTop: 8,
    paddingBottom: 14,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 34,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 20,
  },
  searchWrapper: {
    marginBottom: 12,
  },

  // Category Filters
  filterScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  categoryFilter: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryFilterActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  categoryFilterText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E73',
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
  },

  // Segmented Control
  segmentWrapper: {
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 12,
    padding: 3,
    height: 40,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  segmentLabel: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  segmentLabelActive: {
    fontWeight: '700',
    color: '#000000',
  },

  // Inset Group
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    maxWidth: 270,
    lineHeight: 18,
  },

  pressed: {
    opacity: 0.6,
  },
});
