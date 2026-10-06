import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SearchInput } from '@/components/common/SearchInput';
import { NavBar } from '@/components/common/NavBar';
import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { RecommendationModal } from '@/components/common/RecommendationModal';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const RECENT_SUGGESTIONS = [
  'Kinalas',
  'Toasted Siopao',
  'Sinanglay',
  'Pinangat',
  'Bicol Express',
  'Pili Delicacies',
];

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Dishes', icon: 'sparkles-outline' },
  { id: 'heritage-soups', label: '🍜 Kinalas & Soups' },
  { id: 'gata-sili', label: '🥥 Gata & Sili' },
  { id: 'bakery-merienda', label: '🥟 Merienda' },
  { id: 'pili-delicacies', label: '🌰 Pili Sweets' },
  { id: 'street-grill', label: '🍢 Night Grills' },
];

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);

  const matchingSpots =
    selectedCategory === 'all'
      ? ESTABLISHMENTS.slice(0, 5)
      : ESTABLISHMENTS.filter((e) =>
          e.foodsOffered.some(
            (f) => FOOD_ITEMS.find((fi) => fi.id === f.foodId)?.category === selectedCategory
          )
        );

  const nearbySpots = matchingSpots.length > 0 ? matchingSpots : ESTABLISHMENTS.slice(0, 4);
  const spotlightFood = FOOD_ITEMS[0]; // Kinalas as hero spotlight

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

  const currentDistrict = user?.favoriteDistrict || 'Centro';

  return (
    <SafeAreaView style={styles.screen}>
      {/* Top App Header with Location & Profile */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.push('/map')}
          style={({ pressed }) => [styles.locationBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Location: Naga City, ${currentDistrict}`}
        >
          <Text style={styles.locationCity}>Naga City</Text>
          <Text style={styles.locationDot}>·</Text>
          <Text style={styles.locationDistrict}>{currentDistrict}</Text>
          <Ionicons name="chevron-down" size={14} color="#D42F13" style={styles.chevronIcon} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [styles.profileAvatarBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          {isAuthenticated && user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.profileAvatarImg} />
          ) : (
            <View style={styles.guestAvatarHeader}>
              <Ionicons name="person" size={16} color="#8E8E93" />
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Editorial Headline */}
          <View style={styles.titleSection}>
            <Text style={styles.largeTitleSans}>
              Discover <Text style={styles.largeTitleSerif}>local flavors</Text>
            </Text>
          </View>

          {/* iOS Clean Search Field */}
          <View style={styles.searchWrapper}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search dishes or places..."
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

          {/* When search is focused: show clean suggestions list */}
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
                      color="#8E8E93"
                      style={styles.suggestionIcon}
                    />
                    <Text style={styles.suggestionText}>{item}</Text>
                    <Ionicons name="chevron-forward" size={14} color="#C7C7CC" />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Main Feed Content */}
          {!isSearchFocused && (
            <>
              {/* Spotlight Dish of the Day (Feature Box) */}
              {spotlightFood && (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/food/[id]',
                      params: { id: spotlightFood.id },
                    })
                  }
                  style={({ pressed }) => [styles.spotlightCard, pressed && styles.cardPressed]}
                >
                  <Image source={{ uri: spotlightFood.image }} style={styles.spotlightImage} />
                  <View style={styles.spotlightOverlay}>
                    <View style={styles.spotlightTag}>
                      <Text style={styles.spotlightTagText}>FEATURED SPECIALTY</Text>
                    </View>
                    <Text style={styles.spotlightTitle}>{spotlightFood.name}</Text>
                    <Text style={styles.spotlightTagline} numberOfLines={2}>
                      {spotlightFood.tagline}
                    </Text>
                    <View style={styles.spotlightFooter}>
                      <Text style={styles.spotlightPrice}>{spotlightFood.priceRange}</Text>
                      <View style={styles.spotlightAction}>
                        <Text style={styles.spotlightActionText}>
                          {spotlightFood.servingSpotsCount} places
                        </Text>
                        <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}

              {/* Category Quick Filter Pills (Placed Below Feature Box) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryPillsContainer}
              >
                {QUICK_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      style={({ pressed }) => [
                        styles.categoryPill,
                        isActive && styles.categoryPillActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryPillText,
                          isActive && styles.categoryPillTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Try Something New - Foodie Recommendation Banner */}
              <Pressable
                onPress={() => setIsRecommendationOpen(true)}
                style={({ pressed }) => [styles.tryNewBanner, pressed && styles.cardPressed]}
                accessibilityRole="button"
                accessibilityLabel="Try something new recommendation roulette"
              >
                <View style={styles.tryNewContent}>
                  <View style={styles.tryNewBadge}>
                    <Ionicons name="sparkles" size={12} color="#D42F13" />
                    <Text style={styles.tryNewBadgeText}>AI FOODIE ROULETTE</Text>
                  </View>
                  <Text style={styles.tryNewHeading}>Can't decide what to eat?</Text>
                  <Text style={styles.tryNewSub}>
                    Spin to get a curated local dish & top authentic spot in Naga.
                  </Text>
                </View>
                <View style={styles.tryNewActionBtn}>
                  <Ionicons name="dice" size={18} color="#FFFFFF" />
                  <Text style={styles.tryNewActionText}>Try New</Text>
                </View>
              </Pressable>

              {/* Section: Near You in Naga (Inset Grouped Restaurant List) */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Near you in Naga</Text>
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

      {/* Try Something New Recommendation Sheet */}
      <RecommendationModal
        visible={isRecommendationOpen}
        onClose={() => setIsRecommendationOpen(false)}
        preferredCategory={selectedCategory}
      />
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
  topHeader: {
    backgroundColor: '#F2F2F7',
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  locationCity: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  locationDot: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginHorizontal: 4,
  },
  locationDistrict: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#D42F13',
  },
  chevronIcon: {
    marginLeft: 3,
    marginTop: 1,
  },
  profileAvatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  profileAvatarImg: {
    width: '100%',
    height: '100%',
  },
  guestAvatarHeader: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E5EA',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  // Editorial Title
  titleSection: {
    paddingTop: 14,
    paddingBottom: 12,
  },
  largeTitleSans: {
    fontFamily: sansFamily,
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
  },
  largeTitleSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 34,
    fontWeight: '400',
    color: '#000000',
  },

  searchWrapper: {
    marginBottom: 14,
  },

  // Category Pills
  categoryPillsContainer: {
    gap: 8,
    paddingBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  categoryPillText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E73',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },

  // Spotlight Card
  spotlightCard: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#000000',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
    opacity: 0.78,
  },
  spotlightOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  spotlightTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#D42F13',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 4,
  },
  spotlightTagText: {
    fontFamily: sansFamily,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  spotlightTitle: {
    fontFamily: sansFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  spotlightTagline: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
    lineHeight: 16,
  },
  spotlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  spotlightPrice: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spotlightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spotlightActionText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Suggestions List
  suggestionsContainer: {
    marginTop: 4,
  },
  suggestionsHeader: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  suggestionsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  suggestionRowLast: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#000000',
    flex: 1,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  seeAllText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#D42F13',
  },

  // Inset Grouped List
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Try Something New Banner
  tryNewBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(212, 47, 19, 0.08)',
      } as any,
      default: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  tryNewContent: {
    flex: 1,
    paddingRight: 12,
  },
  tryNewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tryNewBadgeText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.4,
  },
  tryNewHeading: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  tryNewSub: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 16,
  },
  tryNewActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    flexShrink: 0,
  },
  tryNewActionText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.6,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

