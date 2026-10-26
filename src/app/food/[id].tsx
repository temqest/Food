import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';
import { useQuest } from '@/context/QuestContext';
import { DISH_INSIDER_TIPS } from '@/data/gamification';
import { PassportStampModal } from '@/components/gamification/PassportStampModal';

export default function FoodDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFoodSaved, toggleSaveFood } = useSaved();
  const { addToBasket, setActiveTabSection } = useBasket();
  const { isFoodLogged } = useQuest();

  const [stampModalVisible, setStampModalVisible] = useState(false);

  const food = FOOD_ITEMS.find((f) => f.id === id) || FOOD_ITEMS[0];
  const saved = isFoodSaved(food.id);
  const isLogged = isFoodLogged(food.id);

  // Establishments serving this food
  const servingEstablishments = ESTABLISHMENTS.filter((est) =>
    est.foodsOffered.some((item) => item.foodId === food.id)
  );

  const primaryEst = servingEstablishments[0] || ESTABLISHMENTS[0];
  const insiderTip = DISH_INSIDER_TIPS[food.id];
  const siliLevel = insiderTip?.siliLevel || 2;

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  const handleOpenStamp = () => {
    setStampModalVisible(true);
  };

  const handlePreOrder = () => {
    const offering = primaryEst.foodsOffered.find((f) => f.foodId === food.id);
    addToBasket({
      foodId: food.id,
      foodName: food.name,
      price: offering ? offering.price : 85,
      establishmentId: primaryEst.id,
      establishmentName: primaryEst.name,
      establishmentAddress: primaryEst.address,
      image: food.image,
      quantity: 1,
    });
    setActiveTabSection('current');
    router.push('/basket');
  };

  const handleNavigateMap = (estId?: string) => {
    router.push({
      pathname: '/map',
      params: estId ? { selectedPlaceId: estId } : {},
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* Floating Header Controls */}
      <View style={[styles.floatingHeader, { top: topInset + 4 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.glassIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.floatingHeaderRight}>
          {isLogged && (
            <View style={styles.glassTastedBadge}>
              <Ionicons name="ribbon" size={14} color="#FFD700" />
              <Text style={styles.glassTastedText}>Tasted</Text>
            </View>
          )}

          <Pressable
            onPress={() => toggleSaveFood(food.id)}
            style={({ pressed }) => [styles.glassIconButton, pressed && styles.pressed]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save dish'}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={saved ? '#FF4D2E' : '#FFFFFF'}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-Bleed Hero Section */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: food.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Gradient Scrim for Contrast */}
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="0.45" />
                <Stop offset="0.35" stopColor="#000000" stopOpacity="0.05" />
                <Stop offset="0.65" stopColor="#000000" stopOpacity="0.45" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.95" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroGradient)" />
          </Svg>

          {/* Hero Bottom Typography Banner */}
          <View style={styles.heroOverlayContent}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{food.categoryLabel.toUpperCase()}</Text>
            </View>

            <Text style={styles.heroTitle}>{food.name}</Text>

            {food.bikolName && (
              <View style={styles.bikolNameRow}>
                <Ionicons name="sparkles" size={12} color="#FFC857" style={{ marginRight: 4 }} />
                <Text style={styles.bikolNameLabel}>
                  Native Bikolano: <Text style={styles.bikolNameItalic}>{food.bikolName}</Text>
                </Text>
              </View>
            )}

            <Text style={styles.heroTagline} numberOfLines={2}>
              {food.tagline}
            </Text>
          </View>
        </View>

        {/* Content Sheet */}
        <View style={styles.mainContainer}>
          {/* Quick Sensory Badge Strip */}
          <View style={styles.sensoryRow}>
            {/* Heat Meter */}
            <View style={styles.sensoryCard}>
              <View style={styles.sensoryIconRow}>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <Ionicons
                    key={lvl}
                    name="flame"
                    size={14}
                    color={lvl <= siliLevel ? '#D42F13' : '#E5E5EA'}
                  />
                ))}
              </View>
              <Text style={styles.sensoryLabel}>
                {siliLevel >= 4 ? 'Fiery Labuyo' : siliLevel === 3 ? 'Authentic Kick' : 'Mild Heat'}
              </Text>
            </View>

            {/* Price Meter */}
            <View style={styles.sensoryCard}>
              <Text style={styles.sensoryValue}>{food.priceRange}</Text>
              <Text style={styles.sensoryLabel}>Typical Price</Text>
            </View>

            {/* Serving Spots */}
            <View style={styles.sensoryCard}>
              <Text style={styles.sensoryValue}>{servingEstablishments.length} Spots</Text>
              <Text style={styles.sensoryLabel}>In Naga City</Text>
            </View>
          </View>

          {/* Authentic Dining Ritual (Nagueño Secret Hack) */}
          {insiderTip && (
            <View style={styles.ritualCard}>
              <View style={styles.ritualBadgeRow}>
                <View style={styles.ritualBadge}>
                  <Ionicons name="restaurant" size={14} color="#D42F13" />
                  <Text style={styles.ritualBadgeText}>EAT LIKE A LOCAL</Text>
                </View>
                <Text style={styles.ritualSubbadge}>Nagueño Dining Ritual</Text>
              </View>

              <Text style={styles.ritualSecret}>{insiderTip.secretHack}</Text>

              {/* Local Dialect Quote Box */}
              <View style={styles.dialectBox}>
                <View style={styles.dialectHeader}>
                  <Ionicons name="chatbubble-ellipses" size={14} color="#D42F13" />
                  <Text style={styles.dialectLabel}>What to say to the cook (Bikol lingo):</Text>
                </View>
                <Text style={styles.dialectQuote}>{insiderTip.orderingLingo}</Text>
              </View>

              {/* Origin Fun Fact */}
              {insiderTip.funFact && (
                <View style={styles.funFactRow}>
                  <Ionicons name="bulb-outline" size={15} color="#FF9500" style={{ marginTop: 1 }} />
                  <Text style={styles.funFactText}>{insiderTip.funFact}</Text>
                </View>
              )}
            </View>
          )}

          {/* Flavor Anatomy Strip */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Flavor Anatomy</Text>
              <Text style={styles.sectionSubtitle}>Key Taste Notes</Text>
            </View>

            <View style={styles.flavorTagsGrid}>
              {food.flavorProfile.map((flavor, index) => {
                const isHighlight = index === 0 || flavor.toLowerCase().includes('sili');
                return (
                  <View
                    key={index}
                    style={[
                      styles.flavorChip,
                      isHighlight ? styles.flavorChipHighlight : styles.flavorChipNormal,
                    ]}
                  >
                    <Ionicons
                      name={
                        flavor.toLowerCase().includes('coconut') || flavor.toLowerCase().includes('gata')
                          ? 'leaf-outline'
                          : flavor.toLowerCase().includes('spicy') || flavor.toLowerCase().includes('sili')
                          ? 'flame'
                          : flavor.toLowerCase().includes('citrus') || flavor.toLowerCase().includes('calamansi')
                          ? 'water-outline'
                          : 'sparkles'
                      }
                      size={13}
                      color={isHighlight ? '#D42F13' : '#636366'}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        styles.flavorChipText,
                        isHighlight && styles.flavorChipTextHighlight,
                      ]}
                    >
                      {flavor}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Cultural Provenance & Lore */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Lore & Heritage</Text>
              <Text style={styles.sectionSubtitle}>Historical Roots</Text>
            </View>

            <View style={styles.loreCard}>
              <Text style={styles.loreBodyText}>{food.description}</Text>

              {food.culturalContext && (
                <View style={styles.loreRootsBlock}>
                  <View style={styles.loreRootsHeader}>
                    <Ionicons name="book-outline" size={14} color="#D42F13" />
                    <Text style={styles.loreRootsTitle}>Cultural Roots in Naga</Text>
                  </View>
                  <Text style={styles.loreRootsText}>{food.culturalContext}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Where to Taste in Naga (Rich Establishment Cards) */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Where to Taste in Naga</Text>
              <Text style={styles.sectionSubtitle}>
                {servingEstablishments.length} authentic spots
              </Text>
            </View>

            <View style={styles.placesList}>
              {servingEstablishments.map((est) => {
                const offering = est.foodsOffered.find((f) => f.foodId === food.id);
                const distanceStr =
                  est.distanceKm < 1
                    ? `${Math.round(est.distanceKm * 1000)}m away`
                    : `${est.distanceKm.toFixed(1)} km away`;

                return (
                  <Pressable
                    key={est.id}
                    onPress={() => {
                      router.push({
                        pathname: '/establishment/[id]',
                        params: { id: est.id },
                      });
                    }}
                    style={({ pressed }) => [
                      styles.richEateryCard,
                      pressed && styles.cardPressed,
                    ]}
                  >
                    <Image
                      source={{ uri: est.heroImage }}
                      style={styles.eateryImage}
                      resizeMode="cover"
                    />

                    <View style={styles.eateryContent}>
                      <View style={styles.eateryHeaderRow}>
                        <Text style={styles.eateryName} numberOfLines={1}>
                          {est.name}
                        </Text>
                        {offering && (
                          <Text style={styles.eateryPrice}>₱{offering.price}</Text>
                        )}
                      </View>

                      <View style={styles.eateryMetaRow}>
                        <View style={styles.neighborhoodBadge}>
                          <Text style={styles.neighborhoodBadgeText}>
                            {est.neighborhood}
                          </Text>
                        </View>
                        <Text style={styles.eateryDot}>•</Text>
                        <Text style={styles.eateryDistance}>{distanceStr}</Text>
                      </View>

                      <View style={styles.eateryFooterRow}>
                        <View style={styles.statusPill}>
                          <View
                            style={[
                              styles.statusDot,
                              est.isOpenNow ? styles.statusDotOpen : styles.statusDotClosed,
                            ]}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              est.isOpenNow ? styles.statusTextOpen : styles.statusTextClosed,
                            ]}
                          >
                            {est.isOpenNow ? 'Open Now' : 'Closed'}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => handleNavigateMap(est.id)}
                          style={({ pressed }) => [
                            styles.mapShortcutBtn,
                            pressed && styles.pressed,
                          ]}
                          hitSlop={8}
                        >
                          <Ionicons name="map-outline" size={13} color="#D42F13" />
                          <Text style={styles.mapShortcutText}>Map</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Frosted Floating Bottom Action Bar */}
      <View style={[styles.bottomBarWrapper, { paddingBottom: bottomInset, height: 74 + bottomInset }]}>
        <View style={styles.bottomBarContent}>
          {/* Map / Itinerary Secondary Button */}
          <Pressable
            onPress={() => handleNavigateMap(primaryEst.id)}
            style={({ pressed }) => [styles.secondaryMapButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="View serving spots on map"
          >
            <Ionicons name="map" size={18} color="#1C1C1E" />
          </Pressable>

          {/* Dine-In Pass Secondary Action */}
          <Pressable
            onPress={handlePreOrder}
            style={({ pressed }) => [styles.dineInButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Reserve dine-in pass"
          >
            <Ionicons name="ticket-outline" size={16} color="#D42F13" style={{ marginRight: 4 }} />
            <Text style={styles.dineInButtonText}>Pass</Text>
          </Pressable>

          {/* Primary CTA: Stamp Passport (+60 XP) */}
          <Pressable
            onPress={handleOpenStamp}
            style={({ pressed }) => [styles.primaryStampButton, pressed && styles.primaryPressed]}
            accessibilityRole="button"
            accessibilityLabel="Stamp passport for this dish"
          >
            <Ionicons
              name={isLogged ? 'checkmark-circle' : 'ribbon'}
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryStampButtonText}>
              {isLogged ? 'Tasted (+60 XP Logged)' : 'Stamp Passport (+60 XP)'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Passport Stamp Logger Modal */}
      <PassportStampModal
        visible={stampModalVisible}
        onClose={() => setStampModalVisible(false)}
        foodId={food.id}
        foodName={food.name}
        establishmentId={primaryEst.id}
        establishmentName={primaryEst.name}
        image={food.image}
      />
    </View>
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
    backgroundColor: '#F7F7FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Floating Header Controls
  floatingHeader: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30,
  },
  floatingHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  glassIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(20, 20, 20, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      },
    }),
  },
  glassTastedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
  },
  glassTastedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },

  // Full-Bleed Hero
  heroWrapper: {
    width: '100%',
    height: 380,
    position: 'relative',
    backgroundColor: '#1C1C1E',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlayContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#D42F13',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: serifFamily,
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bikolNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bikolNameLabel: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  bikolNameItalic: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    color: '#FFC857',
    fontWeight: '700',
  },
  heroTagline: {
    fontFamily: sansFamily,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 6,
  },

  // Main Container Body
  mainContainer: {
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    marginTop: -16,
  },

  // Sensory Badge Strip
  sensoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  sensoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      },
    }),
  },
  sensoryIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  sensoryValue: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  sensoryLabel: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },

  // Authentic Dining Ritual Card
  ritualCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 47, 19, 0.18)',
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 14px rgba(212, 47, 19, 0.08)',
      },
    }),
  },
  ritualBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ritualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  ritualBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  ritualSubbadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  ritualSecret: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 21,
    color: '#2C2C2E',
    marginBottom: 14,
  },
  dialectBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.12)',
    marginBottom: 12,
  },
  dialectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dialectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  dialectQuote: {
    fontFamily: serifFamily,
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 20,
  },
  funFactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 10,
  },
  funFactText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#664D00',
  },

  // Sections
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },

  // Flavor Profile Chips
  flavorTagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  flavorChipNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
  },
  flavorChipHighlight: {
    backgroundColor: '#FFF2F0',
    borderColor: 'rgba(212, 47, 19, 0.25)',
  },
  flavorChipText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  flavorChipTextHighlight: {
    color: '#D42F13',
    fontWeight: '700',
  },

  // Lore Card
  loreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      },
    }),
  },
  loreBodyText: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 22,
    color: '#3C3C43',
  },
  loreRootsBlock: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  loreRootsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  loreRootsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },
  loreRootsText: {
    fontFamily: sansFamily,
    fontSize: 13,
    lineHeight: 20,
    color: '#48484A',
  },

  // Where to Taste (Rich Cards)
  placesList: {
    gap: 12,
  },
  richEateryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      },
    }),
  },
  eateryImage: {
    width: 100,
    height: '100%',
    minHeight: 96,
    backgroundColor: '#E5E5EA',
  },
  eateryContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  eateryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eateryName: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 6,
  },
  eateryPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D42F13',
  },
  eateryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  neighborhoodBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  neighborhoodBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#636366',
  },
  eateryDot: {
    fontSize: 10,
    color: '#8E8E93',
    marginHorizontal: 5,
  },
  eateryDistance: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  eateryFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotOpen: {
    backgroundColor: '#34C759',
  },
  statusDotClosed: {
    backgroundColor: '#8E8E93',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextOpen: {
    color: '#34C759',
  },
  statusTextClosed: {
    color: '#8E8E93',
  },
  mapShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  mapShortcutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Frosted Floating Bottom Action Bar
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    justifyContent: 'center',
    zIndex: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      },
    }),
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  secondaryMapButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dineInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D42F13',
  },
  dineInButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },
  primaryStampButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 14px rgba(212, 47, 19, 0.35)',
      },
    }),
  },
  primaryStampButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  primaryPressed: {
    opacity: 0.88,
  },
  cardPressed: {
    opacity: 0.92,
  },
  pressed: {
    opacity: 0.75,
  },
});
