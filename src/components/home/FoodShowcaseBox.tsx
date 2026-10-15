import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FOOD_ITEMS } from '@/data/mockData';
import { FoodItem } from '@/data/types';
import { STICKER_ICONS } from './CravingDialWidget';

export interface FoodShowcaseBoxProps {
  activeCravingId?: string;
}

const CARD_HEIGHT = 315;
const PEEK_OFFSET_1 = 15;
const PEEK_OFFSET_2 = 28;

// Maps craving carousel category/id to representative Naga dishes
const CRAVING_TO_FOOD_MAP: Record<string, string> = {
  'heritage-noodles': 'kinalas',
  'spicy-fiery': 'bicol-express',
  'toasted-buns': 'toasted-siopao',
  'gata-creams': 'sinanglay',
  'pili-sweets': 'crispy-pili',
  'late-night': 'kinalas',
  'secret-spots': 'pinangat',
  'street-skewers': 'pancit-bato',
  'ancestral-taste': 'kinalas',
  'cafe-comforts': 'toasted-siopao',
};

// Maps specific food items to our custom hand-drawn sticker icons
const getDishSticker = (foodId: string) => {
  switch (foodId) {
    case 'kinalas':
      return STICKER_ICONS.kinalasBowl;
    case 'toasted-siopao':
      return STICKER_ICONS.toastedSiopao;
    case 'pinangat':
      return STICKER_ICONS.pinangatPouch;
    case 'sinanglay':
      return STICKER_ICONS.coconutGata;
    case 'bicol-express':
      return STICKER_ICONS.siliPepper;
    case 'crispy-pili':
    case 'mazapan-de-pili':
    case 'pili-shake':
      return STICKER_ICONS.starMedal;
    case 'pancit-bato':
      return STICKER_ICONS.streetFood;
    default:
      return STICKER_ICONS.hotSpotBadge;
  }
};

const THEME = {
  cardBg: '#FFFDF7',
  cardBgLayer2: '#FAF5ED',
  cardBgLayer3: '#F5ECE0',
  cardBorder: '#E8DEC8',
  charcoal: '#1C1C1E',
  forestGreen: '#1E3A2B',
  forestGreenSoft: '#EAF5EE',
  mustardTape: 'rgba(255, 200, 87, 0.72)',
  tapeBorder: 'rgba(216, 203, 181, 0.6)',
  mutedText: '#6C6763',
  subtleBg: '#FAF5ED',
};

export const FoodShowcaseBox: React.FC<FoodShowcaseBoxProps> = ({
  activeCravingId = 'heritage-noodles',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values for top card
  const topCardTranslateY = useRef(new Animated.Value(0)).current;
  const topCardOpacity = useRef(new Animated.Value(1)).current;
  const topCardRotate = topCardTranslateY.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  // Layered cards in the deck
  const card1: FoodItem = FOOD_ITEMS[currentIndex] || FOOD_ITEMS[0];
  const card2: FoodItem = FOOD_ITEMS[(currentIndex + 1) % FOOD_ITEMS.length] || FOOD_ITEMS[0];
  const card3: FoodItem = FOOD_ITEMS[(currentIndex + 2) % FOOD_ITEMS.length] || FOOD_ITEMS[0];

  const handleOpenDish = useCallback((dishId: string) => {
    router.push(`/food/${dishId}` as any);
  }, []);

  // Up/Down transition handlers
  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(topCardTranslateY, {
        toValue: -170,
        duration: 170,
        useNativeDriver: true,
      }),
      Animated.timing(topCardOpacity, {
        toValue: 0,
        duration: 170,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) => (prev + 1) % FOOD_ITEMS.length);
      topCardTranslateY.setValue(0);
      topCardOpacity.setValue(1);
      setIsAnimating(false);
    });
  }, [isAnimating, topCardTranslateY, topCardOpacity]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(topCardTranslateY, {
        toValue: 170,
        duration: 170,
        useNativeDriver: true,
      }),
      Animated.timing(topCardOpacity, {
        toValue: 0,
        duration: 170,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex((prev) => (prev - 1 + FOOD_ITEMS.length) % FOOD_ITEMS.length);
      topCardTranslateY.setValue(0);
      topCardOpacity.setValue(1);
      setIsAnimating(false);
    });
  }, [isAnimating, topCardTranslateY, topCardOpacity]);

  // Sync with Craving Carousel above
  useEffect(() => {
    const targetFoodId = CRAVING_TO_FOOD_MAP[activeCravingId] || 'kinalas';
    const targetIdx = FOOD_ITEMS.findIndex((f) => f.id === targetFoodId);
    if (targetIdx !== -1 && targetIdx !== currentIndex) {
      Animated.timing(topCardOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(targetIdx);
        topCardTranslateY.setValue(0);
        Animated.timing(topCardOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [activeCravingId]);

  // Interpolations for interactive movement of the underlying cards
  const card2TranslateY = topCardTranslateY.interpolate({
    inputRange: [-160, 0, 160],
    outputRange: [0, PEEK_OFFSET_1, PEEK_OFFSET_1 + 8],
    extrapolate: 'clamp',
  });

  const card2Scale = topCardTranslateY.interpolate({
    inputRange: [-160, 0, 160],
    outputRange: [1, 0.95, 0.93],
    extrapolate: 'clamp',
  });

  // Mouse wheel / trackpad scroll handler for web
  const lastWheelTime = useRef(0);
  const handleWheel = useCallback(
    (e: any) => {
      // Prevent browser viewport scroll while cursor is over the food deck
      if (e?.cancelable && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      const now = Date.now();
      if (now - lastWheelTime.current < 220) return;
      const deltaY = e?.nativeEvent?.deltaY ?? e?.deltaY ?? 0;
      if (deltaY > 8) {
        lastWheelTime.current = now;
        goToNext();
      } else if (deltaY < -8) {
        lastWheelTime.current = now;
        goToPrev();
      }
    },
    [goToNext, goToPrev]
  );

  // Swipe up/down gesture tracking with guaranteed response and scroll locking
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dy) > 3 &&
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
          );
        },
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          return (
            Math.abs(gestureState.dy) > 3 &&
            Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
          );
        },
        // CRITICAL: Prevent parent ScrollView from stealing/terminating the gesture on swipe up
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          topCardTranslateY.stopAnimation();
        },
        onPanResponderMove: (_, gestureState) => {
          topCardTranslateY.setValue(gestureState.dy);
        },
        onPanResponderRelease: (_, gestureState) => {
          // If tap without drag, open dish
          if (Math.abs(gestureState.dy) < 6 && Math.abs(gestureState.dx) < 6) {
            handleOpenDish(card1.id);
            return;
          }

          if (gestureState.dy < -20 || gestureState.vy < -0.15) {
            goToNext();
          } else if (gestureState.dy > 20 || gestureState.vy > 0.15) {
            goToPrev();
          } else {
            Animated.spring(topCardTranslateY, {
              toValue: 0,
              friction: 7,
              tension: 90,
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(topCardTranslateY, {
            toValue: 0,
            friction: 7,
            tension: 90,
            useNativeDriver: true,
          }).start();
        },
      }),
    [goToNext, goToPrev, topCardTranslateY, card1.id, handleOpenDish]
  );

  return (
    <View style={styles.container}>
      {/* 1. Chapter-Style Subsection Divider */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Discover</Text>
        <View style={styles.sectionLine} />

        {/* Counter Badge */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {FOOD_ITEMS.length}
          </Text>
        </View>

        {/* Up / Down Chevron Buttons */}
        <View style={styles.navArrowsWrap}>
          <Pressable
            onPress={goToPrev}
            style={({ pressed }) => [styles.arrowBtn, pressed && styles.arrowPressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Show previous food card"
          >
            <Ionicons name="chevron-up" size={15} color={THEME.forestGreen} />
          </Pressable>
          <Pressable
            onPress={goToNext}
            style={({ pressed }) => [styles.arrowBtn, pressed && styles.arrowPressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Show next food card"
          >
            <Ionicons name="chevron-down" size={15} color={THEME.forestGreen} />
          </Pressable>
        </View>
      </View>

      {/* 2. Vertically Stacked Card Deck (Cards layered on top of each other, peeking below) */}
      <View
        style={styles.deckContainer}
        {...({ onWheel: handleWheel } as any)}
      >
        {/* ============================================================== */}
        {/* LAYER 3 (Back-most card peeking out at bottom)                 */}
        {/* ============================================================== */}
        <View style={styles.peekCardLayer3} pointerEvents="none">
          <View style={styles.peekInner}>
            <View style={styles.peekFooterHint}>
              <Text style={styles.peekText} numberOfLines={1}>
                {card3.name} • {card3.servingSpotsCount} spots
              </Text>
            </View>
          </View>
        </View>

        {/* ============================================================== */}
        {/* LAYER 2 (Middle card peeking directly underneath top card)     */}
        {/* ============================================================== */}
        <Animated.View
          style={[
            styles.peekCardLayer2,
            {
              transform: [{ translateY: card2TranslateY }, { scale: card2Scale }],
            },
          ]}
        >
          <Pressable
            onPress={goToNext}
            style={styles.peekPressableArea}
            accessibilityRole="button"
            accessibilityLabel={`Next: ${card2.name}. Tap to bring to front.`}
          >
            <View style={styles.peekInner}>
              <View style={styles.peekFooterRow}>
                <View style={styles.peekTitleRow}>
                  <Image
                    source={getDishSticker(card2.id)}
                    style={styles.peekMiniIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.peekDishTitle} numberOfLines={1}>
                    {card2.name}
                  </Text>
                </View>
                <View style={styles.peekPriceTag}>
                  <Text style={styles.peekPriceText}>{card2.priceRange}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* ============================================================== */}
        {/* LAYER 1 (Top Active Card with full details and swipe gesture)  */}
        {/* ============================================================== */}
        <Animated.View
          style={[
            styles.topCardAnimatedWrap,
            {
              transform: [{ translateY: topCardTranslateY }, { rotate: topCardRotate }],
              opacity: topCardOpacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Playful Scrapbook Washi Tape Accent */}
          <View style={styles.washiTapeWrapper} pointerEvents="none">
            <View style={styles.washiTape} />
          </View>

          {/* Big Overextending Die-Cut Food Sticker Icon (Breaks top-left boundary) */}
          <View style={styles.overextendingIconWrap} pointerEvents="none">
            <Image
              source={getDishSticker(card1.id)}
              style={styles.overextendingIconImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.topFoodCard}>
            {/* Photo Container */}
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: card1.image }}
                style={styles.foodImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />

              {/* Overlapping Floating Die-Cut Badge */}
              <View style={styles.dieCutBadge}>
                <Text style={styles.dieCutBadgeText}>
                  {card1.categoryLabel?.split(' ')[0] || 'Naga'} Specialty
                </Text>
              </View>

              {/* Floating Price Pill */}
              <View style={styles.pricePill}>
                <Text style={styles.pricePillText}>{card1.priceRange}</Text>
              </View>
            </View>

            {/* Details Content Area */}
            <View style={styles.cardDetails}>
              {/* Title & Bikol Native Name */}
              <View style={styles.nameRow}>
                <Text style={styles.dishName}>{card1.name}</Text>
                {card1.bikolName && (
                  <Text style={styles.bikolName}>({card1.bikolName})</Text>
                )}
              </View>

              {/* Tagline */}
              <Text style={styles.tagline} numberOfLines={2}>
                {card1.tagline}
              </Text>

              {/* Flavor Profile Tags */}
              <View style={styles.flavorRow}>
                {card1.flavorProfile?.slice(0, 3).map((flavor, index) => (
                  <View key={index} style={styles.flavorPill}>
                    <Text style={styles.flavorText}>{flavor}</Text>
                  </View>
                ))}
              </View>

              {/* Card Footer: Spot count & Action */}
              <View style={styles.cardFooter}>
                <View style={styles.spotCountWrap}>
                  <Image
                    source={STICKER_ICONS.hotSpotBadge}
                    style={styles.spotStickerIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.spotCountText}>
                    {card1.servingSpotsCount} heritage spot
                    {card1.servingSpotsCount !== 1 ? 's' : ''}
                  </Text>
                </View>

                <Pressable
                  onPress={() => handleOpenDish(card1.id)}
                  style={({ pressed }) => [styles.exploreAction, pressed && styles.actionPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`View details for ${card1.name}`}
                >
                  <Text style={styles.exploreActionText}>View Dish</Text>
                  <Ionicons name="chevron-forward" size={13} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* 3. Small Intuitive Instruction Below Cards (Clean plain text) */}
      <View style={styles.swipeHintRow} pointerEvents="none">
        <Text style={styles.swipeHintText}>
          Swipe up or down to navigate
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 6,
  },
  /* Section Subsection Divider */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.charcoal,
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black',
    textTransform: 'uppercase',
  },
  sectionLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: 'rgba(216, 203, 181, 0.65)',
    borderRadius: 1,
  },
  counterBadge: {
    backgroundColor: THEME.forestGreenSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  counterText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: THEME.forestGreen,
  },
  navArrowsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2DCD5',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#232120',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(35, 33, 32, 0.08)',
        cursor: 'pointer',
      },
    }),
  },
  arrowPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },

  /* Deck Viewport: Houses stacked cards peeking out from underneath */
  deckContainer: {
    height: CARD_HEIGHT + PEEK_OFFSET_2 + 2,
    width: '100%',
    position: 'relative',
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        touchAction: 'none' as any,
      },
    }),
  },

  /* LAYER 3 (Back-most peeking card) */
  peekCardLayer3: {
    position: 'absolute',
    top: PEEK_OFFSET_2,
    left: 28,
    right: 28,
    height: CARD_HEIGHT,
    backgroundColor: THEME.cardBgLayer3,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#DFD5C5',
    zIndex: 1,
    justifyContent: 'flex-end',
    ...Platform.select({
      ios: {
        shadowColor: '#232120',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 4px 10px rgba(35, 33, 32, 0.05)',
      },
    }),
  },

  /* LAYER 2 (Middle peeking card - visibly peeks below top card) */
  peekCardLayer2: {
    position: 'absolute',
    top: PEEK_OFFSET_1,
    left: 22,
    right: 22,
    height: CARD_HEIGHT,
    backgroundColor: THEME.cardBgLayer2,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: THEME.cardBorder,
    zIndex: 2,
    justifyContent: 'flex-end',
    ...Platform.select({
      ios: {
        shadowColor: '#232120',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 12px rgba(35, 33, 32, 0.07)',
        cursor: 'pointer',
      },
    }),
  },
  peekPressableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  peekInner: {
    paddingHorizontal: 14,
    paddingBottom: 7,
  },
  peekFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peekTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  peekMiniIcon: {
    width: 14,
    height: 14,
  },
  peekDishTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.forestGreen,
    letterSpacing: -0.2,
  },
  peekPriceTag: {
    backgroundColor: 'rgba(28, 28, 30, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  peekPriceText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  peekFooterHint: {
    alignItems: 'center',
  },
  peekText: {
    fontSize: 9.5,
    color: '#8A827B',
    fontWeight: '600',
  },

  /* LAYER 1 (Top Active Card) */
  topCardAnimatedWrap: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: CARD_HEIGHT,
    zIndex: 10,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        touchAction: 'none' as any,
        userSelect: 'none' as any,
      },
    }),
  },
  topFoodCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: THEME.cardBorder,
    overflow: 'hidden',
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#232120',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.11,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 5px 16px rgba(35, 33, 32, 0.10)',
        userSelect: 'none',
      },
    }),
  },

  /* Overextending Die-Cut Food Sticker Icon (Breaks top-left boundary) */
  overextendingIconWrap: {
    position: 'absolute',
    top: -16,
    left: -8,
    width: 60,
    height: 60,
    zIndex: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#232120',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        filter: 'drop-shadow(0px 3px 6px rgba(35, 33, 32, 0.22))',
      },
    }),
  },
  overextendingIconImage: {
    width: '100%',
    height: '100%',
  },

  /* Washi Tape */
  washiTapeWrapper: {
    position: 'absolute',
    top: -5,
    right: 20,
    zIndex: 20,
  },
  washiTape: {
    width: 52,
    height: 12,
    backgroundColor: THEME.mustardTape,
    borderRadius: 2,
    transform: [{ rotate: '-2.2deg' }],
    borderWidth: 0.6,
    borderColor: THEME.tapeBorder,
  },

  /* Photo Container */
  photoContainer: {
    height: 155,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EBE3D5',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 58, 43, 0.08)',
  },
  dieCutBadge: {
    position: 'absolute',
    bottom: 9,
    left: 10,
    backgroundColor: 'rgba(255, 253, 247, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    borderWidth: 1.2,
    borderColor: THEME.cardBorder,
  },
  dieCutBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: THEME.forestGreen,
    letterSpacing: -0.2,
  },
  pricePill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(28, 28, 30, 0.78)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pricePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Details Container */
  cardDetails: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    flex: 1,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2,
  },
  dishName: {
    fontSize: 17.5,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black',
  },
  bikolName: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: THEME.forestGreen,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 11.5,
    lineHeight: 15.5,
    color: '#4A4543',
    marginBottom: 6,
  },
  flavorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 8,
  },
  flavorPill: {
    backgroundColor: THEME.subtleBg,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8DEC8',
  },
  flavorText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5C5652',
  },

  /* Card Footer */
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: '#F0EAE1',
  },
  spotCountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  spotStickerIcon: {
    width: 16,
    height: 16,
  },
  spotCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: THEME.forestGreen,
  },
  exploreAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.forestGreen,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },
  actionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  exploreActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Instruction Hint Row Below Cards (Clean plain text) */
  swipeHintRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  swipeHintText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#8A827B',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
