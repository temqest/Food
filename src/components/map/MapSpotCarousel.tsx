import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Establishment } from '@/data/types';
import { useSaved } from '@/context/SavedContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(320, SCREEN_WIDTH - 48);
const CARD_MARGIN = 8;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

interface MapSpotCarouselProps {
  establishments: Establishment[];
  selectedId: string;
  onSelectEstablishment: (establishment: Establishment) => void;
}

interface SpotCardProps {
  item: Establishment;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: (item: Establishment) => void;
  onToggleSave: (id: string) => void;
  onOpenDirections: (item: Establishment) => void;
}

const SpotCard = React.memo<SpotCardProps>(
  ({ item, isSelected, isSaved, onSelect, onToggleSave, onOpenDirections }) => {
    const signatureFood =
      item.foodsOffered.find((f) => f.isSignature) || item.foodsOffered[0];
    const distanceStr =
      item.distanceKm < 1
        ? `${Math.round(item.distanceKm * 1000)} m`
        : `${item.distanceKm} km`;

    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={({ pressed }) => [
          styles.card,
          isSelected && styles.cardSelected,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.cardTopRow}>
          {/* Eatery Image + Open Status */}
          <View style={styles.thumbWrapper}>
            <Image
              source={{ uri: item.heroImage }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View
              style={[
                styles.statusBadge,
                item.isOpenNow ? styles.statusBadgeOpen : styles.statusBadgeClosed,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  item.isOpenNow ? styles.statusDotOpen : styles.statusDotClosed,
                ]}
              />
              <Text style={styles.statusText}>
                {item.isOpenNow ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          {/* Eatery Meta */}
          <View style={styles.metaCol}>
            <View style={styles.nameBookmarkRow}>
              <Text style={styles.establishmentName} numberOfLines={1}>
                {item.name}
              </Text>
              <Pressable
                onPress={() => onToggleSave(item.id)}
                hitSlop={8}
                style={styles.bookmarkBtn}
                accessibilityRole="button"
                accessibilityLabel="Save spot"
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={19}
                  color={isSaved ? '#D42F13' : '#8E8E93'}
                />
              </Pressable>
            </View>

            <Text style={styles.neighborhoodText} numberOfLines={1}>
              {distanceStr} · {item.neighborhood}
            </Text>

            {/* Signature Food Highlight Pill */}
            {signatureFood && (
              <View style={styles.foodHighlightPill}>
                <Ionicons name="sparkles" size={11} color="#D42F13" />
                <Text style={styles.foodHighlightText} numberOfLines={1}>
                  {signatureFood.foodName.split('(')[0].trim()} · ₱{signatureFood.price}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Button Row */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/establishment/[id]',
                params: { id: item.id },
              });
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`View menu and details for ${item.name}`}
          >
            <Text style={styles.primaryBtnText}>View Menu & Order</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color="#FFFFFF"
              style={{ marginLeft: 4 }}
            />
          </Pressable>

          <Pressable
            onPress={() => onOpenDirections(item)}
            style={({ pressed }) => [
              styles.directionsBtn,
              pressed && styles.btnPressed,
            ]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Get directions to ${item.name}`}
          >
            <Ionicons name="navigate-outline" size={14} color="#111111" />
            <Text style={styles.directionsBtnText}>Directions</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  },
  (prev, next) =>
    prev.isSelected === next.isSelected &&
    prev.isSaved === next.isSaved &&
    prev.item === next.item
);

export const MapSpotCarousel: React.FC<MapSpotCarouselProps> = ({
  establishments,
  selectedId,
  onSelectEstablishment,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();
  const isUserScrollingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  // Auto-scroll carousel when selectedId changes externally (e.g. pin tap on map)
  useEffect(() => {
    if (isUserScrollingRef.current) return;
    const index = establishments.findIndex((e) => e.id === selectedId);
    if (index !== -1 && flatListRef.current) {
      isProgrammaticScrollRef.current = true;
      try {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      } catch {
        // Fallback for initial layout calculation
        flatListRef.current.scrollToOffset({
          offset: index * SNAP_INTERVAL,
          animated: true,
        });
      }
      const timer = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [selectedId, establishments]);

  // Handle user swiping carousel
  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        isUserScrollingRef.current = false;
        return;
      }
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SNAP_INTERVAL);
      const clampedIndex = Math.max(0, Math.min(index, establishments.length - 1));
      const target = establishments[clampedIndex];
      if (target && target.id !== selectedId) {
        onSelectEstablishment(target);
      }
      isUserScrollingRef.current = false;
    },
    [establishments, selectedId, onSelectEstablishment]
  );

  const handleOpenDirections = useCallback((est: Establishment) => {
    const { latitude, longitude } = est.coordinates;
    const label = encodeURIComponent(est.name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
      web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url).catch((err) =>
      console.warn('Could not open map navigation:', err)
    );
  }, []);

  const handleToggleSave = useCallback(
    (id: string) => {
      toggleSaveEstablishment(id);
    },
    [toggleSaveEstablishment]
  );

  const renderItem = useCallback(
    ({ item }: { item: Establishment }) => {
      return (
        <SpotCard
          item={item}
          isSelected={item.id === selectedId}
          isSaved={isEstablishmentSaved(item.id)}
          onSelect={onSelectEstablishment}
          onToggleSave={handleToggleSave}
          onOpenDirections={handleOpenDirections}
        />
      );
    },
    [selectedId, isEstablishmentSaved, onSelectEstablishment, handleToggleSave, handleOpenDirections]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Establishment) => item.id, []);

  if (!establishments || establishments.length === 0) {
    return null;
  }

  const selectedIndex = establishments.findIndex((e) => e.id === selectedId);

  return (
    <View style={styles.carouselContainer}>
      {/* Index Counter Indicator */}
      <View style={styles.indicatorRow}>
        <View style={styles.counterBadge}>
          <Ionicons name="location-sharp" size={11} color="#D42F13" />
          <Text style={styles.counterText}>
            Spot {selectedIndex !== -1 ? selectedIndex + 1 : 1} of {establishments.length} in Naga
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={establishments}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => {
          isUserScrollingRef.current = true;
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
};

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    paddingBottom: 6,
  },
  indicatorRow: {
    alignItems: 'center',
    marginBottom: 6,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  counterText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#3A3A3C',
    letterSpacing: -0.1,
  },
  listContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN,
    paddingBottom: 4,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginHorizontal: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  cardSelected: {
    borderColor: '#D42F13',
    shadowColor: '#D42F13',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    marginBottom: 10,
  },
  thumbWrapper: {
    position: 'relative',
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3.5,
  },
  statusBadgeOpen: {
    backgroundColor: 'rgba(30, 58, 43, 0.92)',
  },
  statusBadgeClosed: {
    backgroundColor: 'rgba(58, 20, 20, 0.92)',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusDotOpen: {
    backgroundColor: '#34C759',
  },
  statusDotClosed: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    fontFamily: sansFamily,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  metaCol: {
    flex: 1,
    justifyContent: 'center',
  },
  nameBookmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  establishmentName: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
    marginRight: 4,
    letterSpacing: -0.2,
  },
  bookmarkBtn: {
    padding: 2,
  },
  neighborhoodText: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    marginBottom: 5,
  },
  foodHighlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    maxWidth: '100%',
  },
  foodHighlightText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    backgroundColor: '#D42F13',
    paddingHorizontal: 12,
  },
  primaryBtnText: {
    fontFamily: sansFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    gap: 4,
  },
  directionsBtnText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
