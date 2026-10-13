import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// ============================================================================
// CUTOUT STICKER ICONS FROM ICON SHEET
// High-resolution transparent PNG cutouts with die-cut borders & natural shadows
// ============================================================================
export const STICKER_ICONS = {
  siliPepper: require('@/assets/icons/sili_pepper.png'),
  ancestralHouse: require('@/assets/icons/ancestral_house.png'),
  tableaCoffeeCup: require('@/assets/icons/tablea_coffee_cup.png'),
  secretSpots: require('@/assets/icons/secret_spots.png'),
  kinalasBowl: require('@/assets/icons/kinalas_bowl.png'),
  toastedSiopao: require('@/assets/icons/toasted_siopao.png'),
  coconutGata: require('@/assets/icons/coconut_gata.png'),
  streetFood: require('@/assets/icons/street_food_skewers.png'),
  palayokCauldron: require('@/assets/icons/palayok_cauldron.png'),
  pinangatPouch: require('@/assets/icons/pinangat_pouch.png'),
  tricycle: require('@/assets/icons/tricycle.png'),
  bellTower: require('@/assets/icons/bell_tower.png'),
  compassPin: require('@/assets/icons/compass_pin.png'),
  trailMap: require('@/assets/icons/trail_map.png'),
  starMedal: require('@/assets/icons/star_medal.png'),
  hotSpotBadge: require('@/assets/icons/hot_spot_badge.png'),
};

// ============================================================================
// CRAVING DIAL DATA
// Hand-drawn gamified sticker pills matching Naga & Bicol food culture!
// ============================================================================
export interface CravingItem {
  id: string;
  line1: string;
  line2: string;
  iconSource: any;
  bgColor: string;
  categoryId: string;
  tagline: string;
}

export const CRAVING_ITEMS: CravingItem[] = [
  {
    id: 'spicy-fiery',
    line1: 'Spicy',
    line2: '& Fiery',
    iconSource: STICKER_ICONS.siliPepper,
    bgColor: '#DF5D36', // Terracotta / Sili Red
    categoryId: 'gata-sili',
    tagline: 'Fiery siling labuyo & rich kakang gata',
  },
  {
    id: 'ancestral-taste',
    line1: 'Ancestral',
    line2: 'Taste',
    iconSource: STICKER_ICONS.ancestralHouse,
    bgColor: '#F8BA44', // Warm Mustard / Heritage Gold
    categoryId: 'heritage-soups',
    tagline: 'Simmered beef bone broths & century recipes',
  },
  {
    id: 'cafe-comforts',
    line1: 'Cafe',
    line2: 'Comforts',
    iconSource: STICKER_ICONS.tableaCoffeeCup,
    bgColor: '#D4BD9E', // Latte / Warm Tan
    categoryId: 'bakery-merienda',
    tagline: 'Hot tablea chocolate & toasted siopao',
  },
  {
    id: 'secret-spots',
    line1: 'Secret',
    line2: 'Spots',
    iconSource: STICKER_ICONS.secretSpots,
    bgColor: '#568761', // Sage / Forest Green
    categoryId: 'street-grill',
    tagline: 'Hidden neighborhood carinderias & grills',
  },
  {
    id: 'late-night',
    line1: 'Midnight',
    line2: 'Broth',
    iconSource: STICKER_ICONS.kinalasBowl,
    bgColor: '#9887C2', // Lavender / Twilight Plum
    categoryId: 'heritage-soups',
    tagline: 'Steaming cauldrons along Barlin street at night',
  },
  {
    id: 'toasted-buns',
    line1: 'Toasted',
    line2: 'Siopao',
    iconSource: STICKER_ICONS.toastedSiopao,
    bgColor: '#E28E3B', // Amber Caramel
    categoryId: 'bakery-merienda',
    tagline: 'Fresh oven-baked golden buns with flaky crust',
  },
  {
    id: 'gata-creams',
    line1: 'Kakang',
    line2: 'Gata',
    iconSource: STICKER_ICONS.coconutGata,
    bgColor: '#5C9EAD', // Soft Coastal Teal
    categoryId: 'gata-sili',
    tagline: 'Rich coconut milk pressed fresh from local palms',
  },
  {
    id: 'street-skewers',
    line1: 'Street',
    line2: 'Grills',
    iconSource: STICKER_ICONS.streetFood,
    bgColor: '#C05C46', // Deep Brick Red
    categoryId: 'street-grill',
    tagline: 'Night market skewers & golden banana cue',
  },
];

export interface VirtualCravingItem extends CravingItem {
  virtualKey: string;
  realIndex: number;
}

export interface CravingDialWidgetProps {
  items?: CravingItem[];
  selectedId?: string;
  onSelectCraving?: (id: string, categoryId: string) => void;
}

// Carousel dimensions & snapping (snug pills with clean breathing room)
const ITEM_WIDTH = 118;
const ITEM_GAP = 10;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_GAP;
const REPEAT_COUNT = 30; // 30 x 8 = 240 items for seamless infinite loop

// ============================================================================
// SINGLE ORGANIC STICKER BADGE COMPONENT
// ============================================================================
interface CravingPillProps {
  item: CravingItem;
  isSelected: boolean;
  onPress: () => void;
}

const CravingPill: React.FC<CravingPillProps> = React.memo(
  ({ item, isSelected, onPress }) => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pillWrapper,
          pressed && styles.pillPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${item.line1} ${item.line2} craving filter`}
      >
        {/* 1. Die-cut Colored Pill Body (Clean rounded capsule, centered inside wrapper) */}
        <View
          style={[
            styles.pillDieCut,
            { backgroundColor: item.bgColor },
            isSelected && styles.pillDieCutSelected,
          ]}
        >
          {/* Right 2-Line Bold Typography with snug spacing */}
          <View style={styles.textColumn}>
            <Text style={styles.pillTextLine1} numberOfLines={1}>
              {item.line1}
            </Text>
            <Text style={styles.pillTextLine2} numberOfLines={1}>
              {item.line2}
            </Text>
          </View>
        </View>

        {/* 2. Bigger Overlapping Sticker Icon (Breaks top-left boundary naturally) */}
        <View style={styles.overflowIconWrap} pointerEvents="none">
          <Image
            source={item.iconSource}
            style={styles.overflowIconImage}
            resizeMode="contain"
          />
        </View>

        {/* 3. Selected Active Sparkle Indicator */}
        {isSelected ? (
          <View style={styles.selectedSparkleBadge}>
            <Ionicons name="sparkles" size={9} color="#FFB703" />
          </View>
        ) : null}
      </Pressable>
    );
  }
);

CravingPill.displayName = 'CravingPill';

// ============================================================================
// MAIN CRAVING DIAL WIDGET COMPONENT (Clean, Edge-to-Edge Infinite Scroll)
// ============================================================================
export const CravingDialWidget: React.FC<CravingDialWidgetProps> = ({
  items = CRAVING_ITEMS,
  selectedId,
  onSelectCraving,
}) => {
  const [activeCravingId, setActiveCravingId] = useState<string>(
    selectedId || items[0]?.id || 'spicy-fiery'
  );

  const flatListRef = useRef<FlatList<VirtualCravingItem>>(null);

  // Generate virtual repeating dataset for seamless infinite looping
  const virtualData = useMemo<VirtualCravingItem[]>(() => {
    if (!items || items.length === 0) return [];
    const list: VirtualCravingItem[] = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      items.forEach((item, idx) => {
        list.push({
          ...item,
          virtualKey: `${item.id}-rep-${r}-${idx}`,
          realIndex: idx,
        });
      });
    }
    return list;
  }, [items]);

  // Center starting index
  const startIndex = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return Math.floor(REPEAT_COUNT / 2) * items.length;
  }, [items]);

  // Initialize FlatList scroll offset centered at mount
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

  // Silent infinite teleport on momentum scroll end
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      if (items.length === 0) return;

      const rawIndex = Math.round(offsetX / SNAP_INTERVAL);
      const realIdx = ((rawIndex % items.length) + items.length) % items.length;

      // When within 3 cycles of boundary, silently jump back to center cycle
      if (rawIndex < items.length * 3 || rawIndex > virtualData.length - items.length * 3) {
        const centerTarget = startIndex + realIdx;
        flatListRef.current?.scrollToOffset({
          offset: centerTarget * SNAP_INTERVAL,
          animated: false,
        });
      }
    },
    [items.length, virtualData.length, startIndex]
  );

  const handlePillPress = useCallback(
    (item: CravingItem) => {
      setActiveCravingId(item.id);
      if (onSelectCraving) {
        onSelectCraving(item.id, item.categoryId);
      } else {
        // Default action: navigate to search / map with category filter
        router.push({
          pathname: '/search',
          params: { category: item.categoryId, craving: item.id },
        });
      }
    },
    [onSelectCraving]
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
    ({ item }: { item: VirtualCravingItem }) => (
      <CravingPill
        item={item}
        isSelected={activeCravingId === item.id}
        onPress={() => handlePillPress(item)}
      />
    ),
    [activeCravingId, handlePillPress]
  );

  const keyExtractor = useCallback((item: VirtualCravingItem) => item.virtualKey, []);

  return (
    <View style={styles.container}>
      {/* Craving Dial Track: Clean, continuous infinite horizontal carousel */}
      <View style={styles.trackContainer}>
        <FlatList
          ref={flatListRef}
          data={virtualData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          decelerationRate="fast"
          disableIntervalMomentum={true}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          bounces={true}
          overScrollMode="never"
          initialScrollIndex={startIndex}
          getItemLayout={getItemLayout}
          windowSize={7}
          maxToRenderPerBatch={6}
          initialNumToRender={6}
        />
      </View>
    </View>
  );
};

export default CravingDialWidget;

// ============================================================================
// STYLESHEET
// ============================================================================
const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 6,
  },

  /* ---------------- Dial Track Container ---------------- */
  trackContainer: {
    backgroundColor: '#FAF5ED', // Warm soft cream banner track
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(216, 203, 181, 0.45)',
  },

  /* ---------------- FlatList Carousel Layout ---------------- */
  flatList: {
    overflow: 'visible',
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingVertical: 10, // Crucial: gives 10px headroom above & below, preventing ANY clipping!
    alignItems: 'center',
    overflow: 'visible',
  },

  /* ---------------- Pill Sticker Die-Cut Layout ---------------- */
  pillWrapper: {
    width: ITEM_WIDTH,
    height: 52, // Wraps 38px capsule + 44px sticker with zero clipping
    marginRight: ITEM_GAP,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // NO boxShadow here! Clean transparent wrapper eliminates ghost rectangular boxes.
  },
  pillPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },

  /* Organic Capsule matching user reference */
  pillDieCut: {
    height: 38,
    width: '100%',
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 42,
    paddingRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#2D2B2A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3.5,
      },
      android: {
        elevation: 2.5,
      },
      web: {
        boxShadow: '0 2px 6px rgba(45, 43, 42, 0.12)',
      },
    }),
  },
  pillDieCutSelected: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.02 }],
    ...Platform.select({
      ios: {
        shadowColor: '#2D2B2A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.20,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 3px 8px rgba(45, 43, 42, 0.20)',
      },
    }),
  },

  /* Overlapping Die-Cut Sticker Icon (Breaks top-left boundary naturally) */
  overflowIconWrap: {
    position: 'absolute',
    left: -4,
    top: 4,
    width: 44,
    height: 44,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overflowIconImage: {
    width: 42,
    height: 42,
  },

  /* Right 2-Line Bold Typography with snug spacing */
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  pillTextLine1: {
    fontSize: 11,
    lineHeight: 13.5,
    fontWeight: '800',
    color: '#1E1D1B',
    letterSpacing: -0.2,
  },
  pillTextLine2: {
    fontSize: 11,
    lineHeight: 13.5,
    fontWeight: '800',
    color: '#1E1D1B',
    letterSpacing: -0.2,
  },

  /* Selected Active Sparkle */
  selectedSparkleBadge: {
    position: 'absolute',
    top: 3,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFB703',
    zIndex: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      },
    }),
  },
});
