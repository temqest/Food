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
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';

export default function EstablishmentDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();
  const { addToBasket, setActiveTabSection } = useBasket();

  const [addedFoodId, setAddedFoodId] = useState<string | null>(null);

  const establishment =
    ESTABLISHMENTS.find((e) => e.id === id) || ESTABLISHMENTS[0];
  const saved = isEstablishmentSaved(establishment.id);

  const distanceStr =
    establishment.distanceKm < 1
      ? `${Math.round(establishment.distanceKm * 1000)}m away`
      : `${establishment.distanceKm.toFixed(1)} km away`;

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? RNStatusBar.currentHeight || 24 : 16
  );
  const bottomInset = Math.max(insets.bottom, 16);

  const logoUri =
    establishment.logo ||
    establishment.galleryImages?.[1] ||
    establishment.heroImage;

  const handleNavigateMap = () => {
    router.push({
      pathname: '/map',
      params: { selectedPlaceId: establishment.id },
    });
  };

  const handleCall = () => {
    if (establishment.contactNumber) {
      Linking.openURL(`tel:${establishment.contactNumber.replace(/[^0-9+]/g, '')}`);
    }
  };

  const handleAddDish = (food: (typeof establishment.foodsOffered)[0]) => {
    const fullFoodObj = FOOD_ITEMS.find((f) => f.id === food.foodId);
    addToBasket({
      foodId: food.foodId,
      foodName: food.foodName,
      price: food.price,
      establishmentId: establishment.id,
      establishmentName: establishment.name,
      establishmentAddress: establishment.address,
      image: fullFoodObj?.image || establishment.heroImage,
      quantity: 1,
      selectedNote: food.servingNote,
    });
    setAddedFoodId(food.foodId);
    setTimeout(() => setAddedFoodId(null), 1800);
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

        <Pressable
          onPress={() => toggleSaveEstablishment(establishment.id)}
          style={({ pressed }) => [styles.glassIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved' : 'Save place'}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={saved ? '#FF4D2E' : '#FFFFFF'}
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Banner */}
        <View style={styles.bannerWrapper}>
          <Image
            source={{ uri: establishment.heroImage }}
            style={styles.bannerImage}
            resizeMode="cover"
          />

          {/* Gradient Scrim */}
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="bannerGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity="0.6" />
                <Stop offset="0.35" stopColor="#000000" stopOpacity="0.05" />
                <Stop offset="0.75" stopColor="#000000" stopOpacity="0.2" />
                <Stop offset="1" stopColor="#000000" stopOpacity="0.6" />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#bannerGradient)" />
          </Svg>
        </View>

        {/* Main Content Sheet */}
        <View style={styles.mainContainer}>
          {/* Store Logo & Identity Block */}
          <View style={styles.storeHeaderBlock}>
            {/* Store Logo */}
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: logoUri }}
                style={styles.storeLogo}
                resizeMode="cover"
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              </View>
            </View>

            {/* Store Title */}
            <Text
              style={styles.storeTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {establishment.name}
            </Text>

            {/* Neighborhood, Distance & Open Status Row */}
            <View style={styles.storeMetaRow}>
              <View style={styles.locationMeta}>
                <Ionicons name="location-sharp" size={14} color="#D42F13" style={{ marginRight: 4 }} />
                <Text style={styles.storeNeighborhoodText} numberOfLines={1} ellipsizeMode="tail">
                  {establishment.neighborhood} · {distanceStr}
                </Text>
              </View>

              <View
                style={[
                  styles.inlineStatusBadge,
                  establishment.isOpenNow ? styles.statusBadgeOpen : styles.statusBadgeClosed,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    establishment.isOpenNow ? styles.statusDotOpen : styles.statusDotClosed,
                  ]}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    establishment.isOpenNow ? styles.statusTextOpen : styles.statusTextClosed,
                  ]}
                >
                  {establishment.isOpenNow ? 'Open Now' : 'Closed'}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Venue Stats Strip */}
          <View style={styles.venueStatsRow}>
            {/* Price Level */}
            <View style={styles.venueStatCard}>
              <Text style={styles.venueStatValue}>
                {establishment.priceLevel === 'budget'
                  ? '₱ Budget'
                  : establishment.priceLevel === 'moderate'
                  ? '₱₱ Moderate'
                  : '₱₱₱ Upscale'}
              </Text>
              <Text style={styles.venueStatLabel}>Price Range</Text>
            </View>

            {/* Operating Hours */}
            <View style={styles.venueStatCard}>
              <Text style={styles.venueStatValue} numberOfLines={1}>
                {establishment.openingHours.split('–')[0].trim()}
              </Text>
              <Text style={styles.venueStatLabel}>Opens Daily</Text>
            </View>

            {/* Distance */}
            <View style={styles.venueStatCard}>
              <Text style={styles.venueStatValue}>{distanceStr}</Text>
              <Text style={styles.venueStatLabel}>From Centro</Text>
            </View>
          </View>

          {/* Section Divider 1 */}
          <View style={styles.colorDividerRow}>
            <View style={styles.colorDividerLine} />
            <View style={styles.colorDividerAccent} />
            <View style={styles.colorDividerLine} />
          </View>

          {/* Section: Dishes Offered Here (Properly Sized Cards) */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionIconBadge}>
                  <Ionicons name="restaurant" size={13} color="#D42F13" />
                </View>
                <Text style={styles.sectionTitle}>Dishes Offered Here</Text>
              </View>
              <View style={styles.sectionCountBadge}>
                <Text style={styles.sectionCountText}>
                  {establishment.foodsOffered.length} items
                </Text>
              </View>
            </View>

            <View style={styles.menuList}>
              {establishment.foodsOffered.map((food, index) => {
                const fullFoodObj = FOOD_ITEMS.find((f) => f.id === food.foodId);
                const isJustAdded = addedFoodId === food.foodId;

                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      router.push({
                        pathname: '/food/[id]',
                        params: { id: food.foodId },
                      });
                    }}
                    style={({ pressed }) => [styles.dishCard, pressed && styles.cardPressed]}
                    accessibilityRole="button"
                    accessibilityLabel={`${food.foodName}, ₱${food.price}`}
                  >
                    {/* Fixed Proportional Food Thumbnail (Never over-extends) */}
                    <View style={styles.dishThumbnailContainer}>
                      <Image
                        source={{
                          uri: fullFoodObj?.image || establishment.heroImage,
                        }}
                        style={styles.dishThumbnail}
                        resizeMode="cover"
                      />
                      {food.isSignature && (
                        <View style={styles.signatureBadge}>
                          <Text style={styles.signatureBadgeText}>★ SIGNATURE</Text>
                        </View>
                      )}
                    </View>

                    {/* Dish Content Details */}
                    <View style={styles.dishContent}>
                      <Text style={styles.dishName} numberOfLines={2}>
                        {food.foodName}
                      </Text>
                      {food.servingNote ? (
                        <Text style={styles.dishServingNote} numberOfLines={2}>
                          {food.servingNote}
                        </Text>
                      ) : null}

                      {/* Price & Action Row */}
                      <View style={styles.dishFooterRow}>
                        <View style={styles.dishPriceBadge}>
                          <Text style={styles.dishPrice}>₱{food.price}</Text>
                        </View>

                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddDish(food);
                          }}
                          style={({ pressed }) => [
                            styles.addOrderBtn,
                            isJustAdded && styles.addOrderBtnSuccess,
                            pressed && styles.pressed,
                          ]}
                          hitSlop={8}
                          accessibilityLabel="Add to pre-order basket"
                        >
                          <Ionicons
                            name={isJustAdded ? 'checkmark' : 'add'}
                            size={16}
                            color="#FFFFFF"
                            style={{ marginRight: 2 }}
                          />
                          <Text style={styles.addOrderBtnText}>
                            {isJustAdded ? 'Added' : 'Order'}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section: Photo Gallery (Store Atmosphere) */}
          {establishment.galleryImages && establishment.galleryImages.length > 1 && (
            <>
              {/* Section Divider 2 */}
              <View style={styles.colorDividerRow}>
                <View style={styles.colorDividerLine} />
                <View style={styles.colorDividerAccent} />
                <View style={styles.colorDividerLine} />
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionIconBadge, { backgroundColor: '#F0EBF8' }]}>
                      <Ionicons name="images" size={13} color="#7C3AED" />
                    </View>
                    <Text style={styles.sectionTitle}>Store Atmosphere</Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>Photos from visitors</Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.galleryScroll}
                >
                  {establishment.galleryImages.map((imgUri, idx) => (
                    <View key={idx} style={styles.galleryCard}>
                      <Image
                        source={{ uri: imgUri }}
                        style={styles.galleryPhoto}
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {/* Section Divider 3 */}
          <View style={styles.colorDividerRow}>
            <View style={styles.colorDividerLine} />
            <View style={styles.colorDividerAccent} />
            <View style={styles.colorDividerLine} />
          </View>

          {/* Section: Details & Contact Card */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionIconBadge, { backgroundColor: '#FEF3E2' }]}>
                  <Ionicons name="information-circle" size={14} color="#D97706" />
                </View>
                <Text style={styles.sectionTitle}>Store Details</Text>
              </View>
              <Text style={styles.sectionSubtitle}>Location & Hours</Text>
            </View>

            <View style={styles.detailsCard}>
              {/* Address */}
              <View style={styles.detailRow}>
                <View style={[styles.detailIconBox, { backgroundColor: '#FEECE8' }]}>
                  <Ionicons name="location" size={16} color="#D42F13" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>{establishment.address}</Text>
                </View>
              </View>

              {/* Hours */}
              <View style={styles.detailRow}>
                <View style={[styles.detailIconBox, { backgroundColor: '#FEF3E2' }]}>
                  <Ionicons name="time" size={16} color="#D97706" />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Operating Hours</Text>
                  <Text style={styles.detailValue}>
                    {establishment.openingHours}
                    {establishment.isOpenNow ? ' (Open)' : ' (Currently Closed)'}
                  </Text>
                </View>
              </View>

              {/* Phone */}
              {establishment.contactNumber && (
                <Pressable
                  onPress={handleCall}
                  style={({ pressed }) => [
                    styles.detailRow,
                    styles.detailRowLast,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.detailIconBox, { backgroundColor: '#EBF8EE' }]}>
                    <Ionicons name="call" size={16} color="#2E7D32" />
                  </View>
                  <View style={styles.detailInfo}>
                    <Text style={styles.detailLabel}>Contact Phone (Tap to Call)</Text>
                    <Text style={styles.detailValuePhone}>{establishment.contactNumber}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Section Divider 4 */}
          <View style={styles.colorDividerRow}>
            <View style={styles.colorDividerLine} />
            <View style={styles.colorDividerAccent} />
            <View style={styles.colorDividerLine} />
          </View>

          {/* Section: About Store */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionIconBadge, { backgroundColor: '#FFF0ED' }]}>
                  <Ionicons name="book" size={13} color="#D42F13" />
                </View>
                <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">
                  About {establishment.name}
                </Text>
              </View>
            </View>

            <View style={styles.aboutCard}>
              <Text style={styles.aboutText}>{establishment.description}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Frosted Floating Bottom Action Bar */}
      <View style={[styles.bottomBarWrapper, { paddingBottom: bottomInset, height: 74 + bottomInset }]}>
        <View style={styles.bottomBarContent}>
          {/* Call Shortcut Button (if phone exists) */}
          {establishment.contactNumber && (
            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [styles.secondarySquareButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Call store"
            >
              <Ionicons name="call" size={18} color="#1C1C1E" />
            </Pressable>
          )}

          {/* View Basket Shortcut */}
          <Pressable
            onPress={() => {
              setActiveTabSection('current');
              router.push('/basket');
            }}
            style={({ pressed }) => [styles.secondaryPassButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="View pre-order passes"
          >
            <Ionicons name="ticket-outline" size={16} color="#D42F13" style={{ marginRight: 4 }} />
            <Text style={styles.secondaryPassText}>Passes</Text>
          </Pressable>

          {/* Primary CTA: Locate on Naga Map */}
          <Pressable
            onPress={handleNavigateMap}
            style={({ pressed }) => [styles.primaryMapButton, pressed && styles.primaryPressed]}
            accessibilityRole="button"
            accessibilityLabel="Locate on interactive map"
          >
            <Ionicons name="navigate" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryMapButtonText}>Locate on Naga Map</Text>
          </Pressable>
        </View>
      </View>
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
    backgroundColor: '#F8F6F3',
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

  // Store Banner
  bannerWrapper: {
    width: '100%',
    height: 250,
    position: 'relative',
    backgroundColor: '#1C1C1E',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  // Main Container Sheet
  mainContainer: {
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  // Store Header Block & Logo
  storeHeaderBlock: {
    marginBottom: 12,
  },
  logoWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginTop: -42,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      },
    }),
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 1,
  },
  storeTitle: {
    fontFamily: serifFamily,
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.4,
    lineHeight: 28,
    marginBottom: 6,
    flexShrink: 1,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  storeNeighborhoodText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#636366',
    fontWeight: '600',
    flexShrink: 1,
  },
  inlineStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
    flexShrink: 0,
  },
  statusBadgeOpen: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  statusBadgeClosed: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotOpen: {
    backgroundColor: '#2E7D32',
  },
  statusDotClosed: {
    backgroundColor: '#C62828',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextOpen: {
    color: '#2E7D32',
  },
  statusTextClosed: {
    color: '#C62828',
  },

  // Venue Stats Row
  venueStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  venueStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAE4DE',
    ...Platform.select({
      ios: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      },
    }),
  },
  venueStatValue: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  venueStatLabel: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#8A827B',
  },

  // Color Divider System
  colorDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 2,
  },
  colorDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6E0DA',
  },
  colorDividerAccent: {
    width: 22,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D42F13',
    opacity: 0.3,
    marginHorizontal: 10,
  },

  // Sections
  sectionContainer: {
    marginBottom: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 8,
  },
  sectionIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FFF0ED',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.3,
    flex: 1,
    flexShrink: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A827B',
    flexShrink: 0,
  },
  sectionCountBadge: {
    backgroundColor: '#F2ECE6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    flexShrink: 0,
  },
  sectionCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#635D57',
  },

  // Dishes Offered List (Properly Sized & Bounded)
  menuList: {
    gap: 10,
  },
  dishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAE4DE',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      },
    }),
  },
  cardPressed: {
    backgroundColor: '#F9F8F6',
    transform: [{ scale: 0.99 }],
  },
  dishThumbnailContainer: {
    width: 84,
    height: 84,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F2ECE6',
  },
  dishThumbnail: {
    width: 84,
    height: 84,
  },
  signatureBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(212, 47, 19, 0.92)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  signatureBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  dishContent: {
    flex: 1,
    minHeight: 84,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  dishName: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 19,
  },
  dishServingNote: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 16,
  },
  dishFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  dishPriceBadge: {
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.14)',
  },
  dishPrice: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#D42F13',
  },
  addOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addOrderBtnSuccess: {
    backgroundColor: '#34C759',
  },
  addOrderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Gallery Scroll
  galleryScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  galleryCard: {
    width: 140,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5DFDA',
    borderWidth: 1,
    borderColor: '#EAE4DE',
  },
  galleryPhoto: {
    width: '100%',
    height: '100%',
  },

  // Details Card
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE4DE',
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE5',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A827B',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 1,
  },
  detailValuePhone: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 1,
  },

  // About Card
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE4DE',
    ...Platform.select({
      ios: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      },
    }),
  },
  aboutText: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 22,
    color: '#3C3C43',
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
  secondarySquareButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryPassButton: {
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
  secondaryPassText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },
  primaryMapButton: {
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
  primaryMapButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  primaryPressed: {
    opacity: 0.88,
  },
  pressed: {
    opacity: 0.75,
  },
});
