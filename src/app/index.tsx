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
import { SilitoCompanion } from '@/components/gamification/SilitoCompanion';
import { SilitoMysteryBox } from '@/components/gamification/SilitoMysteryBox';
import { ActiveQuestLogWidget } from '@/components/gamification/ActiveQuestLogWidget';
import { DistrictProgressWidget } from '@/components/gamification/DistrictProgressWidget';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useQuest } from '@/context/QuestContext';

const RECENT_SUGGESTIONS = [
  'Kinalas with Brain Gravy',
  'Toasted Siopao',
  'Sinanglay na Tilapia',
  'Pinangat',
  'Bicol Express',
  'Pili Mazapan',
];

const MOOD_FILTERS = [
  { id: 'all', label: 'All Flavors', icon: 'sparkles-outline' },
  { id: 'heritage-soups', label: '🍜 Comfort Soups' },
  { id: 'gata-sili', label: '🥥 Gata & Sili' },
  { id: 'bakery-merienda', label: '🥟 Merienda Run' },
  { id: 'street-grill', label: '🍢 Night Grills' },
];

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { currentRank, xp, rankProgressPercent } = useQuest();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);

  // Filter establishments based on selected mood/category
  const matchingSpots =
    selectedCategory === 'all'
      ? ESTABLISHMENTS.slice(0, 5)
      : ESTABLISHMENTS.filter((e) =>
          e.foodsOffered.some(
            (f) => FOOD_ITEMS.find((fi) => fi.id === f.foodId)?.category === selectedCategory
          )
        );

  const nearbySpots = matchingSpots.length > 0 ? matchingSpots : ESTABLISHMENTS.slice(0, 4);

  // Hero dish adapts dynamically to the selected category or defaults to Kinalas
  const heroFood =
    selectedCategory === 'all'
      ? FOOD_ITEMS[0]
      : FOOD_ITEMS.find((f) => f.category === selectedCategory) || FOOD_ITEMS[0];

  const heroEstablishment =
    ESTABLISHMENTS.find((e) =>
      e.foodsOffered.some((item) => item.foodId === heroFood.id)
    ) || ESTABLISHMENTS[0];

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
      {/* Top App Header with Location, Explorer Rank & Profile Avatar */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.push('/map')}
          style={({ pressed }) => [styles.locationBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Location: Naga City, ${currentDistrict}`}
        >
          <View style={styles.locationPinDot} />
          <Text style={styles.locationCity}>Naga City</Text>
          <Text style={styles.locationDot}>·</Text>
          <Text style={styles.locationDistrict}>{currentDistrict}</Text>
          <Ionicons name="chevron-down" size={13} color="#D42F13" style={styles.chevronIcon} />
        </Pressable>

        <View style={styles.headerRightRow}>
          {/* Gamified Explorer Rank Chip with XP Progress */}
          <Pressable
            onPress={() => router.push('/basket')}
            style={({ pressed }) => [styles.levelChip, pressed && styles.pressed]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Explorer Rank: Level ${currentRank.level} ${currentRank.title}, ${xp} XP`}
          >
            <View style={styles.flameIconWrap}>
              <Ionicons name="flame" size={12} color="#D42F13" />
            </View>
            <View style={styles.levelChipContent}>
              <Text style={styles.levelChipText}>Lvl {currentRank.level}</Text>
              <View style={styles.miniProgressTrack}>
                <View
                  style={[styles.miniProgressFill, { width: `${rankProgressPercent}%` }]}
                />
              </View>
            </View>
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
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Conversational Mascot Companion Banner */}
          <SilitoCompanion />

          {/* Minimalist Search Field */}
          <View style={styles.searchWrapper}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search Kinalas, Toasted Siopao, Sinanglay..."
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
              {/* Centerpiece 1: Interactive Stilitio Mystery Box ("Loot Box" Flavor Drop) */}
              <SilitoMysteryBox />

              {/* Centerpiece 2: Active Daily Quests with Claimable XP */}
              <ActiveQuestLogWidget />

              {/* Tactile Mood Filter Pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moodPillsContainer}
              >
                {MOOD_FILTERS.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      style={({ pressed }) => [
                        styles.moodPill,
                        isActive && styles.moodPillActive,
                        pressed && styles.pressed,
                      ]}
                      hitSlop={4}
                    >
                      <Text
                        style={[
                          styles.moodPillText,
                          isActive && styles.moodPillTextActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Centerpiece 3: Single Hero Spotlight Card (Food is the Hero) */}
              <View style={styles.heroSection}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/food/[id]',
                      params: { id: heroFood.id },
                    })
                  }
                  style={({ pressed }) => [styles.heroCard, pressed && styles.cardPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Hero spotlight dish: ${heroFood.name}`}
                >
                  <Image source={{ uri: heroFood.image }} style={styles.heroImage} />
                  <View style={styles.heroOverlay}>
                    <View style={styles.heroBadgeRow}>
                      <View style={styles.heroBadge}>
                        <Ionicons name="sparkles" size={10} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.heroBadgeText}>HERITAGE SPOTLIGHT</Text>
                      </View>
                      <Text style={styles.heroEstTag}>
                        at {heroEstablishment.name} · {heroEstablishment.neighborhood}
                      </Text>
                    </View>

                    <Text style={styles.heroTitle}>{heroFood.name}</Text>
                    {heroFood.bikolName && (
                      <Text style={styles.heroBikolName}>Bikolano: {heroFood.bikolName}</Text>
                    )}
                    <Text style={styles.heroTagline} numberOfLines={2}>
                      {heroFood.tagline}
                    </Text>

                    <View style={styles.heroFooter}>
                      <Text style={styles.heroPrice}>{heroFood.priceRange}</Text>
                      <View style={styles.heroActionBtn}>
                        <Text style={styles.heroActionText}>Taste Dish Lore</Text>
                        <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              </View>

              {/* Centerpiece 4: Naga District Conquest Progress */}
              <DistrictProgressWidget />

              {/* Curated Local Spots Header */}
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Authentic Spots in Naga</Text>
                  <Text style={styles.sectionSubTitle}>
                    {matchingSpots.length} heritage carinderias &amp; bakeries
                  </Text>
                </View>
                <Pressable
                  onPress={() => router.push('/map')}
                  style={({ pressed }) => [styles.seeAllButton, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Text style={styles.seeAllText}>View Map ›</Text>
                </Pressable>
              </View>

              {/* Clean Inset Grouped Eatery List */}
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

      {/* Recommendation Sheet Modal */}
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
  locationPinDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D42F13',
    marginRight: 6,
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
    fontWeight: '600',
    color: '#D42F13',
  },
  chevronIcon: {
    marginLeft: 3,
    marginTop: 1,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 5,
  },
  flameIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelChipContent: {
    gap: 2,
  },
  levelChipText: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  miniProgressTrack: {
    width: 32,
    height: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#D42F13',
    borderRadius: 2,
  },
  profileAvatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    paddingBottom: 95,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },

  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // Suggested Searches
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  suggestionsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  suggestionsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  suggestionRowLast: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  rowPressed: {
    backgroundColor: '#F2F2F7',
  },

  // Mood Filter Pills
  moodPillsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 14,
  },
  moodPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodPillActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  moodPillText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.85)',
  },
  moodPillTextActive: {
    color: '#FFFFFF',
  },

  // Single Hero Spotlight Card
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1C1C1E',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.82,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroEstTag: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  heroTitle: {
    fontFamily: sansFamily,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  heroBikolName: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 1,
  },
  heroTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 10,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  heroActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sectionSubTitle: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  seeAllButton: {
    paddingVertical: 4,
  },
  seeAllText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Inset group table
  insetGroup: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.8,
  },
});
