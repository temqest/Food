import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  FlatList,
  Platform,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// ============================================================================
// DYNAMIC BANNER IMAGE ASSETS
// Setup 3 local image asset variables/placeholders at the top of the file
// easily swappable with custom files, paths, or remote image URLs later.
// ============================================================================
export const banner1 = require('@/assets/maskot/carousel-1.jpg');
export const banner2 = require('@/assets/maskot/carousel-2.jpg');
export const banner3 = require('@/assets/maskot/carousel-3.jpg');

export const DEFAULT_BANNER_IMAGES = [banner1, banner2, banner3];

// Authentic die-cut sticker icons for scrapbook card overlays
export const BROTH_STICKER = require('@/assets/icons/kinalas_bowl.png');
export const SILI_STICKER = require('@/assets/icons/sili_pepper.png');

// ============================================================================
// THEME PALETTE
// Warm Cream, Terracotta, Forest Green, Warm Yellow, Charcoal Text
// ============================================================================
export const THEME = {
  cream: '#FAF6EE',            // Warm cream container / outer tint
  cardBg: '#FFFDF7',           // Off-white / cream postcard paper
  borderWarm: '#D8CBB5',       // Thin warm border
  borderWarmDashed: '#DDD2C0',  // Perforated stamp divider
  terracotta: '#E0533C',       // Terracotta accent
  terracottaDark: '#B83A25',   // Deep Terracotta
  terracottaSoft: '#FCECE8',   // Soft blush badge background
  forestGreen: '#1E3A2B',      // Forest Green title & headers
  forestGreenSoft: '#E8F3ED',  // Soft sage green
  yellowWarm: '#FFC857',       // Warm Yellow sticker/accent
  amberCta: '#FFB703',         // CTA Yellow/Terracotta button
  charcoal: '#2D2B2A',         // Charcoal typography
  mutedText: '#6F6A64',        // Warm secondary charcoal
  trackBg: '#EBE3D5',          // Progress bar track
  postmarkRed: 'rgba(212, 70, 50, 0.72)', // Vintage stamp ink
};

// ============================================================================
// TYPES & PROPS
// ============================================================================
export interface QuestProgress {
  current: number;
  total: number;
}

export type BannerImageSource = ImageSourcePropType | string | { uri: string };

export interface QuestItemData {
  id: string;
  title: string;
  category?: string;
  progress: QuestProgress;
  image: BannerImageSource;
  status?: 'not-started' | 'in-progress' | 'completed';
  tagline?: string;
  badgeLabel?: string;
  xpBonus?: number;
}

export interface VirtualQuestItem extends QuestItemData {
  virtualKey: string;
  realIndex: number;
}

export interface NagaQuestCarouselProps {
  /** Custom list of quests. Defaults to QUEST_DATA with 3 items. */
  quests?: QuestItemData[];
  /** Callback triggered when user taps the "Join Quest" / "Continue Trail" button. */
  onJoinQuest?: (id: string) => void;
  /** Optional custom section title override (defaults to "Naga Quest") */
  title?: string;
  /** Optional custom subtitle (defaults to "Hand-drawn culinary trails & passport missions") */
  subtitle?: string;
}

// ============================================================================
// DEFAULT MOCK DATA ARRAY
// Contains exactly 3 items, each referencing one of the 3 custom banner images
// ============================================================================
export const QUEST_DATA: QuestItemData[] = [
  {
    id: 'quest-kinalas-crawler',
    title: 'The Kinalas Crawler Trail',
    category: 'Food Quest',
    badgeLabel: 'HOT NOODLES',
    progress: { current: 3, total: 5 },
    image: banner1,
    status: 'in-progress',
    tagline: 'Savor rich bone broth & brain gravy along Barlin St.',
    xpBonus: 150,
  },
  {
    id: 'quest-old-centro',
    title: 'Old Centro Heritage Trail',
    category: 'Heritage Quest',
    badgeLabel: '4 PM MERIENDA',
    progress: { current: 2, total: 4 },
    image: banner2,
    status: 'in-progress',
    tagline: 'Golden toasted siopao & hot native tablea chocolate.',
    xpBonus: 120,
  },
  {
    id: 'quest-spice-gata',
    title: 'Spice & Gata Trail',
    category: 'Fiery Quest',
    badgeLabel: 'SILI LEVEL 4',
    progress: { current: 1, total: 4 },
    image: banner3,
    status: 'not-started',
    tagline: 'River tilapia & tender pork in spiced kakang gata.',
    xpBonus: 180,
  },
];

// Screen width & carousel sizing
// Designed so adjacent cards border each other and peek out visibly on both left and right edges!
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(Math.round(SCREEN_WIDTH * 0.74), 298);
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const SIDE_PADDING = Math.max((SCREEN_WIDTH - CARD_WIDTH) / 2, 20);

// Infinite Virtual Loop Multiplier (seamless infinite scrolling in both directions)
const REPEAT_COUNT = 30;

// Helper for dynamic image source resolution
function resolveImageSource(source: BannerImageSource): ImageSourcePropType {
  if (typeof source === 'string') {
    return { uri: source };
  }
  return source as ImageSourcePropType;
}

// ============================================================================
// STICKER & BADGE OVERLAYS (Absolute Positioning)
// ============================================================================

/** 1. Top-Right: Circular vintage postmark/stamp mark */
const VintagePostmarkStamp: React.FC = () => (
  <View style={styles.postmarkWrapper} pointerEvents="none">
    <View style={styles.postmarkOuterCircle}>
      <View style={styles.postmarkInnerDashedCircle}>
        <Text style={styles.postmarkTopText}>NAGA</Text>
        <Ionicons name="star" size={5.5} color={THEME.postmarkRed} />
        <Text style={styles.postmarkBottomText}>POST</Text>
      </View>
    </View>
    {/* Postal cancellation wave bars */}
    <View style={styles.cancellationWaves}>
      <View style={styles.waveBar} />
      <View style={[styles.waveBar, { width: 16, marginLeft: 2 }]} />
      <View style={[styles.waveBar, { width: 12 }]} />
    </View>
  </View>
);

/** 2. Top-Right: Floating food bowl sticker icon */
const FloatingFoodBowlSticker: React.FC = () => (
  <View style={styles.foodBowlStickerBadge} pointerEvents="none">
    <View style={styles.foodBowlStickerInner}>
      <Ionicons name="restaurant" size={12} color={THEME.charcoal} />
    </View>
  </View>
);

/** 3. Bottom-Left: Authentic Kinalas Broth Bowl sticker overlapping card edge */
interface SteamingBowlProps {
  floatY?: Animated.AnimatedInterpolation<number>;
}

const SteamingBowlSticker: React.FC<SteamingBowlProps> = ({ floatY }) => (
  <Animated.View
    style={[
      styles.steamingBowlStickerContainer,
      floatY ? { transform: [{ rotate: '-6deg' }, { translateY: floatY }] } : null,
    ]}
    pointerEvents="none"
  >
    <Image
      source={BROTH_STICKER}
      style={styles.carouselStickerImage}
      resizeMode="contain"
    />
  </Animated.View>
);

/** 4. Bottom-Right: Authentic Red Chili Pepper ("sili") sticker overlapping card edge */
interface SiliPepperProps {
  floatY?: Animated.AnimatedInterpolation<number>;
}

const SiliPepperSticker: React.FC<SiliPepperProps> = ({ floatY }) => (
  <Animated.View
    style={[
      styles.siliStickerContainer,
      floatY ? { transform: [{ rotate: '-10deg' }, { translateY: floatY }] } : null,
    ]}
    pointerEvents="none"
  >
    <Image
      source={SILI_STICKER}
      style={styles.carouselStickerImage}
      resizeMode="contain"
    />
  </Animated.View>
);

/** 5. Top-Center: Scrapbook Washi Tape Strip */
const WashiTapeStrip: React.FC = () => (
  <View style={styles.washiTapeWrapper} pointerEvents="none">
    <View style={styles.washiTape} />
  </View>
);

// ============================================================================
// MAIN CARD COMPONENT (`CardItem`) WITH 3D ANIMATION
// ============================================================================
interface CardItemProps {
  item: QuestItemData;
  index: number;
  realIndex: number;
  scrollX: Animated.Value;
  snapInterval: number;
  onJoin?: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = React.memo(
  ({ item, index, realIndex, scrollX, snapInterval, onJoin }) => {
    const current = item.progress.current;
    const total = item.progress.total || 1;
    const progressPercent = Math.min(100, Math.max(8, Math.round((current / total) * 100)));
    const isStarted = current > 0;
    const isCompleted = current >= total;

    // Subtle breathing floating sticker animation
    const [floatAnim] = useState(() => new Animated.Value(0));

    useEffect(() => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }, [floatAnim]);

    const steamFloatY = floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2.5],
    });

    const siliFloatY = floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2],
    });

    // Interactive 3D Postcard Carousel Interpolation
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.91, 1.0, 0.91],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.72, 1.0, 0.72],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [6, 0, 6],
      extrapolate: 'clamp',
    });

    const rotateZ = scrollX.interpolate({
      inputRange,
      outputRange: ['-2.2deg', '0deg', '2.2deg'],
      extrapolate: 'clamp',
    });

    const buttonLabel = isCompleted
      ? 'Quest Completed'
      : isStarted
      ? 'Continue Trail'
      : 'Join Quest';

    const handlePressAction = () => {
      if (onJoin) {
        onJoin(item.id);
      } else {
        router.push({
          pathname: '/trail/[id]',
          params: { id: item.id, title: item.title },
        });
      }
    };

    return (
      <Animated.View
        style={[
          styles.cardItemWrapper,
          {
            transform: [{ scale }, { translateY }, { rotate: rotateZ }],
            opacity,
          },
        ]}
      >
        {/* Washi Tape Header Detail */}
        <WashiTapeStrip />

        {/* Main Postcard Card Body */}
        <View style={styles.cardItemBody}>
          {/* Layout Split: LEFT SIDE = Illustrative Banner Image */}
          <View style={styles.imageColumn}>
            <Image
              source={resolveImageSource(item.image)}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            {/* Subtle warm photo vignette overlay */}
            <View style={styles.imageVignette} />

            {/* Photo corner stamp badge */}
            <View style={styles.photoCornerBadge}>
              <Text style={styles.photoCornerText}>#{realIndex + 1}</Text>
            </View>
          </View>

          {/* Postcard Perforated Tear-Line Divider */}
          <View style={styles.perforatedDivider}>
            <View style={styles.perforatedDashes} />
          </View>

          {/* Layout Split: RIGHT SIDE = Quest Details & Micro-UI */}
          <View style={styles.detailsColumn}>
            {/* 1. Top Row: XP Bonus Badge */}
            {item.xpBonus ? (
              <View style={styles.topBadgeRow}>
                <View style={styles.xpBonusBadge}>
                  <Text style={styles.xpBonusText}>+{item.xpBonus} XP</Text>
                </View>
              </View>
            ) : null}

            {/* 2. Main Title: Bold, warm dark green typography */}
            <Text style={styles.questTitle} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Optional Tagline */}
            {item.tagline ? (
              <Text style={styles.questTagline} numberOfLines={1}>
                {item.tagline}
              </Text>
            ) : null}

            {/* 3. Progress Section: 12px customized progress bar + subtext */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%` },
                    isCompleted && styles.progressBarFillDone,
                  ]}
                />
              </View>
              <View style={styles.progressSubtextRow}>
                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : 'location-sharp'}
                  size={10.5}
                  color={isCompleted ? '#2E7D32' : THEME.terracotta}
                />
                <Text style={styles.progressSubtext}>
                  {current}/{total} spots visited
                </Text>
              </View>
            </View>

            {/* 4. CTA Button: Scalloped/ticket-style action button */}
            <Pressable
              onPress={handlePressAction}
              style={({ pressed }) => [
                styles.ctaTicketButton,
                isStarted && styles.ctaTicketButtonContinue,
                isCompleted && styles.ctaTicketButtonDone,
                pressed && styles.ctaTicketButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${buttonLabel} for ${item.title}`}
            >
              {/* Scalloped ticket perforated notches */}
              <View style={styles.ticketNotchLeft} />
              <View style={styles.ticketNotchRight} />

              <Text
                style={[
                  styles.ctaTicketButtonText,
                  isCompleted && styles.ctaTicketButtonTextDone,
                ]}
                numberOfLines={1}
              >
                {buttonLabel}
              </Text>
              <Ionicons
                name={isCompleted ? 'checkmark' : 'chevron-forward'}
                size={11}
                color={THEME.charcoal}
                style={styles.ctaChevron}
              />
            </Pressable>
          </View>
        </View>

        {/* ================================================================== */}
        {/* STICKER & BADGE OVERLAYS (Absolute Positioning Overlapping Edges)   */}
        {/* ================================================================== */}
        {/* Top-Right: Circular vintage postmark & floating food bowl sticker */}
        <VintagePostmarkStamp />
        <FloatingFoodBowlSticker />

        {/* Bottom-Left: Floating steaming bowl illustration sticker */}
        <SteamingBowlSticker floatY={steamFloatY} />

        {/* Bottom-Right: Red chili pepper ("sili") sticker illustration */}
        <SiliPepperSticker floatY={siliFloatY} />
      </Animated.View>
    );
  }
);

CardItem.displayName = 'CardItem';

// ============================================================================
// MAIN CAROUSEL COMPONENT (`NagaQuestCarousel`) - INFINITE SCROLL & 3D ANIMATION
// ============================================================================
export const NagaQuestCarousel: React.FC<NagaQuestCarouselProps> = ({
  quests = QUEST_DATA,
  onJoinQuest,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<VirtualQuestItem>>(null);

  // Generate virtual repeating dataset for seamless infinite looping
  const virtualData = useMemo<VirtualQuestItem[]>(() => {
    if (!quests || quests.length === 0) return [];
    const list: VirtualQuestItem[] = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      quests.forEach((q, idx) => {
        list.push({
          ...q,
          virtualKey: `${q.id}-rep-${r}-${idx}`,
          realIndex: idx,
        });
      });
    }
    return list;
  }, [quests]);

  // Center starting index
  const startIndex = useMemo(() => {
    if (!quests || quests.length === 0) return 0;
    return Math.floor(REPEAT_COUNT / 2) * quests.length;
  }, [quests]);

  // Animated scroll value initialized to middle repetition offset
  const [scrollX] = useState(() => new Animated.Value(startIndex * SNAP_INTERVAL));
  const [virtualIndex, setVirtualIndex] = useState(startIndex);

  // Initialize FlatList scroll position on mount
  useEffect(() => {
    if (startIndex > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: startIndex * SNAP_INTERVAL,
          animated: false,
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [startIndex]);

  // Real-time scroll listener for active pagination dots & offset tracking
  const handleScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
          useNativeDriver: true,
          listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            if (quests.length > 0) {
              const rawIndex = Math.round(offsetX / SNAP_INTERVAL);
              const realIdx = ((rawIndex % quests.length) + quests.length) % quests.length;
              setActiveIndex((prev) => (prev !== realIdx ? realIdx : prev));
              setVirtualIndex((prev) => (prev !== rawIndex ? rawIndex : prev));
            }
          },
        }
      ),
    [scrollX, quests.length]
  );

  // Silent infinite teleport on momentum scroll end when approaching far edges
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      if (quests.length === 0) return;

      const rawIndex = Math.round(offsetX / SNAP_INTERVAL);
      const realIdx = ((rawIndex % quests.length) + quests.length) % quests.length;
      setVirtualIndex(rawIndex);

      // When within 3 cycles of boundary, silently jump back to center cycle
      if (rawIndex < quests.length * 3 || rawIndex > virtualData.length - quests.length * 3) {
        const centerTarget = startIndex + realIdx;
        flatListRef.current?.scrollToOffset({
          offset: centerTarget * SNAP_INTERVAL,
          animated: false,
        });
        scrollX.setValue(centerTarget * SNAP_INTERVAL);
        setVirtualIndex(centerTarget);
      }
    },
    [quests.length, virtualData.length, startIndex, scrollX]
  );

  // Tapping pagination dots navigates forward/backward infinitely
  const scrollToIndex = useCallback(
    (targetRealIndex: number) => {
      if (quests.length === 0) return;
      const currentReal = ((virtualIndex % quests.length) + quests.length) % quests.length;

      let stepDiff = targetRealIndex - currentReal;
      if (stepDiff > quests.length / 2) stepDiff -= quests.length;
      if (stepDiff < -quests.length / 2) stepDiff += quests.length;

      const targetRaw = virtualIndex + stepDiff;
      flatListRef.current?.scrollToOffset({
        offset: targetRaw * SNAP_INTERVAL,
        animated: true,
      });
      setVirtualIndex(targetRaw);
      setActiveIndex(targetRealIndex);
    },
    [quests.length, virtualIndex]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: VirtualQuestItem; index: number }) => (
      <CardItem
        item={item}
        index={index}
        realIndex={item.realIndex}
        scrollX={scrollX}
        snapInterval={SNAP_INTERVAL}
        onJoin={onJoinQuest}
      />
    ),
    [scrollX, onJoinQuest]
  );

  const keyExtractor = useCallback((item: VirtualQuestItem) => item.virtualKey, []);

  return (
    <View style={styles.carouselContainer}>
      {/* Infinite Horizontal Snap Carousel (Bordering previous & next cards visible on left and right) */}
      <Animated.FlatList
        ref={flatListRef}
        data={virtualData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.flatListContent,
          { paddingHorizontal: SIDE_PADDING },
        ]}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="never"
        initialScrollIndex={startIndex}
        getItemLayout={getItemLayout}
        windowSize={7}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
      />

      {/* 3. Active Pagination Dot Indicators */}
      <View style={styles.paginationRow}>
        {quests.map((_, index) => {
          const isActive = activeIndex === index;
          return (
            <Pressable
              key={`quest-dot-${index}`}
              onPress={() => scrollToIndex(index)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`View quest slide ${index + 1}`}
              style={[
                styles.paginationDot,
                isActive ? styles.paginationDotActive : styles.paginationDotInactive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default NagaQuestCarousel;

// ============================================================================
// STYLESHEET
// ============================================================================
const styles = StyleSheet.create({
  carouselContainer: {
    paddingVertical: 2,
    backgroundColor: 'transparent',
  },

  /* ---------------- FlatList Carousel Layout ---------------- */
  flatListContent: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  /* ---------------- Card Item Outer Wrapper & Shadows ---------------- */
  cardItemWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    position: 'relative',
    overflow: 'visible', // Crucial: Allows absolute stickers to overlap edges without clipping
    ...Platform.select({
      ios: {
        shadowColor: THEME.charcoal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 6px 18px rgba(45, 43, 42, 0.11)',
      },
    }),
  },

  /* ---------------- Scrapbook Washi Tape ---------------- */
  washiTapeWrapper: {
    position: 'absolute',
    top: -5,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  washiTape: {
    width: 48,
    height: 11,
    backgroundColor: 'rgba(255, 200, 87, 0.65)',
    borderRadius: 2,
    transform: [{ rotate: '-1.8deg' }],
    borderWidth: 0.5,
    borderColor: 'rgba(216, 203, 181, 0.5)',
  },

  /* ---------------- Postcard Card Body ---------------- */
  cardItemBody: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: THEME.borderWarm,
    flexDirection: 'row',
    height: 190,
    overflow: 'hidden', // Ensures left image conforms to card border radius
  },

  /* ---------------- Layout Split: LEFT IMAGE COLUMN ---------------- */
  imageColumn: {
    width: Math.round(CARD_WIDTH * 0.38),
    height: '100%',
    position: 'relative',
    backgroundColor: '#EBE3D5',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  imageVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 58, 43, 0.08)',
  },
  photoCornerBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(255, 253, 247, 0.92)',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: THEME.borderWarm,
  },
  photoCornerText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: THEME.forestGreen,
  },

  /* ---------------- Postcard Perforated Divider ---------------- */
  perforatedDivider: {
    width: 2,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  perforatedDashes: {
    width: 1.5,
    height: '86%',
    borderRightWidth: 1.5,
    borderRightColor: THEME.borderWarmDashed,
    borderStyle: 'dashed',
  },

  /* ---------------- Layout Split: RIGHT DETAILS COLUMN ---------------- */
  detailsColumn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 11,
    justifyContent: 'space-between',
  },

  /* 1. Top Badge Row */
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 16, // Space for postmark stamp
  },
  xpBonusBadge: {
    backgroundColor: THEME.forestGreenSoft,
    paddingHorizontal: 4.5,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  xpBonusText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: THEME.forestGreen,
  },

  /* 2. Main Title Typography */
  questTitle: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '800',
    color: THEME.forestGreen,
    letterSpacing: -0.2,
    marginTop: 1,
  },
  questTagline: {
    fontSize: 10,
    color: THEME.mutedText,
    marginTop: -2,
  },

  /* 3. Progress Section */
  progressContainer: {
    marginTop: 1,
  },
  progressBarTrack: {
    height: 11,
    backgroundColor: THEME.trackBg,
    borderRadius: 5.5,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  progressBarFill: {
    height: 11,
    borderRadius: 5.5,
    backgroundColor: THEME.terracotta,
  },
  progressBarFillDone: {
    backgroundColor: '#2E7D32',
  },
  progressSubtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3.5,
  },
  progressSubtext: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.mutedText,
    marginLeft: 3,
  },

  /* 4. CTA Button (Scalloped / Ticket Notch Style) */
  ctaTicketButton: {
    backgroundColor: THEME.amberCta,
    borderRadius: 13,
    borderWidth: 1.2,
    borderColor: THEME.charcoal,
    paddingVertical: 5.5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 3,
    ...Platform.select({
      ios: {
        shadowColor: THEME.charcoal,
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ctaTicketButtonContinue: {
    backgroundColor: '#FFBE1A',
  },
  ctaTicketButtonDone: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  ctaTicketButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  ticketNotchLeft: {
    position: 'absolute',
    left: -4,
    width: 5,
    height: 7,
    backgroundColor: THEME.cardBg,
    borderRadius: 2.5,
    borderRightWidth: 1.2,
    borderColor: THEME.charcoal,
  },
  ticketNotchRight: {
    position: 'absolute',
    right: -4,
    width: 5,
    height: 7,
    backgroundColor: THEME.cardBg,
    borderRadius: 2.5,
    borderLeftWidth: 1.2,
    borderColor: THEME.charcoal,
  },
  ctaTicketButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: 0.3,
  },
  ctaTicketButtonTextDone: {
    color: '#2E7D32',
  },
  ctaChevron: {
    marginLeft: 3.5,
  },

  /* ================================================================== */
  /* STICKERS & BADGES (ABSOLUTE POSITIONING)                            */
  /* ================================================================== */

  /* 1. Vintage Postmark Stamp (Top-Right) */
  postmarkWrapper: {
    position: 'absolute',
    top: -6,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
    transform: [{ rotate: '11deg' }],
    opacity: 0.88,
  },
  postmarkOuterCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.1,
    borderColor: THEME.postmarkRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postmarkInnerDashedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.9,
    borderColor: THEME.postmarkRed,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postmarkTopText: {
    fontSize: 6.5,
    fontWeight: '900',
    color: THEME.postmarkRed,
    letterSpacing: 0.5,
  },
  postmarkBottomText: {
    fontSize: 6,
    fontWeight: '900',
    color: THEME.postmarkRed,
    letterSpacing: 0.5,
  },
  cancellationWaves: {
    marginLeft: 2.5,
    justifyContent: 'space-between',
    height: 18,
  },
  waveBar: {
    height: 1.2,
    width: 18,
    backgroundColor: THEME.postmarkRed,
    borderRadius: 1,
  },

  /* 2. Floating Food Bowl Sticker Icon (Top-Right) */
  foodBowlStickerBadge: {
    position: 'absolute',
    top: -11,
    right: -6,
    zIndex: 26,
    transform: [{ rotate: '9deg' }],
    borderWidth: 2.2,
    borderColor: '#FFFFFF',
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: THEME.charcoal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  foodBowlStickerInner: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: THEME.yellowWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 3. Floating Broth Bowl Sticker (Bottom-Left Overlapping Edge) */
  steamingBowlStickerContainer: {
    position: 'absolute',
    bottom: -10,
    left: -8,
    zIndex: 26,
    width: 38,
    height: 38,
    ...Platform.select({
      ios: {
        shadowColor: THEME.charcoal,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  /* 4. Red Chili Pepper ("sili") Sticker (Bottom-Right Overlapping Edge) */
  siliStickerContainer: {
    position: 'absolute',
    bottom: -10,
    right: -8,
    zIndex: 26,
    width: 38,
    height: 38,
    ...Platform.select({
      ios: {
        shadowColor: THEME.charcoal,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.20,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  carouselStickerImage: {
    width: 38,
    height: 38,
  },

  /* ---------------- Pagination Dots ---------------- */
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },
  paginationDot: {
    height: 6.5,
    borderRadius: 3.25,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: THEME.terracotta,
  },
  paginationDotInactive: {
    width: 6.5,
    backgroundColor: THEME.borderWarm,
  },
});
