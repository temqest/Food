import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/common/Header';
import { SearchInput } from '@/components/common/SearchInput';
import { NavBar } from '@/components/common/NavBar';
import { FoodCard } from '@/components/food/FoodCard';
import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';

const RECENT_SUGGESTIONS = [
  'Kinalas',
  'Toasted Siopao',
  'Sinanglay',
  'Pinangat',
  'Bicol Express',
  'Pili Treats',
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const featuredFoods = FOOD_ITEMS.filter((f) => f.featured);
  const nearbySpots = ESTABLISHMENTS.slice(0, 4);

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      router.push({
        pathname: '/search',
        params: { q: searchQuery.trim() },
      });
    }
  };

  const handleSuggestionPress = (query: string) => {
    router.push({
      pathname: '/search',
      params: { q: query },
    });
  };

  return (
    <View style={styles.screen}>
      {/* Top Location Bar */}
      <Header
        locationName="Naga City"
        onLocationPress={() => router.push('/map')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* iOS Large Title */}
          <View style={styles.titleSection}>
            <Text style={styles.largeTitle}>Discover</Text>
          </View>

          {/* iOS Standard Search Bar */}
          <View style={styles.searchWrapper}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search dishes or places"
              onFilterPress={() => router.push('/search')}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onCancel={() => {
                setIsSearchFocused(false);
                setSearchQuery('');
              }}
              isFocused={isSearchFocused}
            />
          </View>

          {/* When search is focused: show clean suggestions list instead of chip clutter */}
          {isSearchFocused && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsHeader}>Suggested Searches</Text>
              <View style={styles.suggestionsGroup}>
                {RECENT_SUGGESTIONS.map((item, idx) => (
                  <Pressable
                    key={item}
                    onPress={() => handleSuggestionPress(item)}
                    style={({ pressed }) => [
                      styles.suggestionRow,
                      idx === RECENT_SUGGESTIONS.length - 1 && styles.suggestionRowLast,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <Ionicons
                      name="search-outline"
                      size={16}
                      color={IOSTokens.colors.labelSecondary}
                      style={styles.suggestionIcon}
                    />
                    <Text style={styles.suggestionText}>{item}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={IOSTokens.colors.labelTertiary}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Main Feed Content (Dish Photos Lead Immediately) */}
          {!isSearchFocused && (
            <>
              {/* Section: Bicol classics (Horizontal Photo Carousel) */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Bicol classics</Text>
                <Pressable
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [styles.seeAllButton, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
                decelerationRate="fast"
                snapToInterval={167} // 155 card + 12 gap
                snapToAlignment="start"
              >
                {featuredFoods.map((food) => (
                  <FoodCard key={food.id} food={food} layout="carousel" />
                ))}
              </ScrollView>

              {/* Section: Near you (Inset Grouped Restaurant List) */}
              <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
                <Text style={styles.sectionTitle}>Near you</Text>
                <Pressable
                  onPress={() => router.push('/map')}
                  style={({ pressed }) => [styles.seeAllButton, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>

              <View style={styles.insetGroup}>
                {nearbySpots.map((establishment, index) => (
                  <EstablishmentCard
                    key={establishment.id}
                    establishment={establishment}
                    layout="row"
                    isFirst={index === 0}
                    isLast={index === nearbySpots.length - 1}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* iOS Translucent Tab Bar */}
      <NavBar currentTab="home" />
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
    paddingBottom: 80, // Allow space for translucent bottom tab bar
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: IOSTokens.spacing.margin,
  },
  titleSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  largeTitle: {
    ...IOSTokens.typography.largeTitle,
    color: IOSTokens.colors.label,
  },
  searchWrapper: {
    marginBottom: 20,
  },

  // Suggestions List
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsHeader: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  suggestionRowLast: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.label,
    flex: 1,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderSpaced: {
    marginTop: IOSTokens.spacing.gapSection,
  },
  sectionTitle: {
    ...IOSTokens.typography.title2,
    color: IOSTokens.colors.label,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '400',
    color: IOSTokens.colors.tint,
    letterSpacing: -0.24,
  },

  // Carousel
  carouselContent: {
    paddingRight: IOSTokens.spacing.margin,
  },

  // Inset Grouped List
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },

  pressed: {
    opacity: 0.6,
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },
});
