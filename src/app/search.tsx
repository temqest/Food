import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/common/Header';
import { SearchInput } from '@/components/common/SearchInput';
import { NavBar } from '@/components/common/NavBar';
import { FoodCard } from '@/components/food/FoodCard';
import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { FOOD_ITEMS, ESTABLISHMENTS, CATEGORIES } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';

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
    <View style={styles.screen}>
      <Header showBack title="Search" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* iOS Search Bar */}
          <View style={styles.searchWrapper}>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search dishes or places"
              autoFocus={!params.q && !params.category}
              onClear={() => setQuery('')}
            />
          </View>

          {/* Quick Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <Pressable
              onPress={() => setSelectedCategory('all')}
              style={[
                styles.categoryFilter,
                selectedCategory === 'all' && styles.categoryFilterActive,
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
              style={[
                styles.categoryFilter,
                openOnly && styles.categoryFilterActive,
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
                style={[
                  styles.categoryFilter,
                  selectedCategory === cat.id && styles.categoryFilterActive,
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
                <Ionicons
                  name="search"
                  size={44}
                  color={IOSTokens.colors.labelTertiary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No Dishes Found</Text>
                <Text style={styles.emptyDesc}>
                  Try searching for another dish like Kinalas or Pinangat.
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
              <Ionicons
                name="storefront-outline"
                size={44}
                color={IOSTokens.colors.labelTertiary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No Places Found</Text>
              <Text style={styles.emptyDesc}>
                Try adjusting your search terms or category filter.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: IOSTokens.colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: IOSTokens.spacing.margin,
    paddingTop: 12,
  },
  searchWrapper: {
    marginBottom: 12,
  },

  // Category Filters
  filterScroll: {
    paddingBottom: 12,
    gap: 8,
  },
  categoryFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: IOSTokens.colors.fill,
  },
  categoryFilterActive: {
    backgroundColor: IOSTokens.colors.tint,
  },
  categoryFilterText: {
    fontSize: 13,
    fontWeight: '500',
    color: IOSTokens.colors.label,
  },
  categoryFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Segmented Control
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: IOSTokens.colors.fill,
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
    height: 32,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentTabActive: {
    backgroundColor: IOSTokens.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: IOSTokens.colors.labelSecondary,
  },
  segmentLabelActive: {
    fontWeight: '600',
    color: IOSTokens.colors.label,
  },

  // Inset Group
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
    marginBottom: 4,
  },
  emptyDesc: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
});
