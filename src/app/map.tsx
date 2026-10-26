import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { MapboxMapView, MapboxMapViewRef } from '@/components/map/MapboxMapView';
import { MapSpotCarousel } from '@/components/map/MapSpotCarousel';
import { ESTABLISHMENTS } from '@/data/mockData';
import { FOOD_TRAILS } from '@/data/gamification';
import { Establishment, EstablishmentType } from '@/data/types';

interface FilterOption {
  id: string;
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  type?: EstablishmentType | 'all';
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Spots', iconName: 'grid-outline' },
  { id: 'kinalas-station', label: 'Kinalas', iconName: 'restaurant-outline', type: 'kinalas-station' },
  { id: 'carinderia', label: 'Carinderia', iconName: 'flame-outline', type: 'carinderia' },
  { id: 'restaurant', label: 'Heritage Dining', iconName: 'wine-outline', type: 'restaurant' },
  { id: 'bakery', label: 'Bakeries', iconName: 'cafe-outline', type: 'bakery' },
  { id: 'pasalubong-center', label: 'Pasalubong', iconName: 'gift-outline', type: 'pasalubong-center' },
  { id: 'street-stall', label: 'Street Stalls', iconName: 'trail-sign-outline', type: 'street-stall' },
];

export default function MapScreen() {
  const mapRef = useRef<MapboxMapViewRef>(null);
  const params = useLocalSearchParams<{ trailId?: string }>();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string>(
    ESTABLISHMENTS[0].id
  );

  const activeTrail = FOOD_TRAILS.find((t) => t.id === params.trailId);

  // Filter establishments by active trail, category, and open status
  const filteredEstablishments = useMemo(() => {
    return ESTABLISHMENTS.filter((est) => {
      if (activeTrail) {
        return activeTrail.establishmentIds.includes(est.id);
      }
      if (selectedType !== 'all' && est.type !== selectedType) {
        return false;
      }
      if (openOnly && !est.isOpenNow) {
        return false;
      }
      return true;
    });
  }, [activeTrail, selectedType, openOnly]);

  const selectedEstablishment =
    filteredEstablishments.find((e) => e.id === selectedEstablishmentId) ||
    filteredEstablishments[0] ||
    ESTABLISHMENTS[0];

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    const matches = ESTABLISHMENTS.filter((est) => {
      if (typeId !== 'all' && est.type !== typeId) return false;
      if (openOnly && !est.isOpenNow) return false;
      return true;
    });
    if (matches.length > 0 && !matches.some((m) => m.id === selectedEstablishmentId)) {
      setSelectedEstablishmentId(matches[0].id);
    }
  };

  const handleToggleOpenOnly = () => {
    const nextVal = !openOnly;
    setOpenOnly(nextVal);
    const matches = ESTABLISHMENTS.filter((est) => {
      if (selectedType !== 'all' && est.type !== selectedType) return false;
      if (nextVal && !est.isOpenNow) return false;
      return true;
    });
    if (matches.length > 0 && !matches.some((m) => m.id === selectedEstablishmentId)) {
      setSelectedEstablishmentId(matches[0].id);
    }
  };

  const handleSelectEstablishment = useCallback((est: Establishment) => {
    setSelectedEstablishmentId((prev) => (prev !== est.id ? est.id : prev));
  }, []);

  const handleRecenter = useCallback(() => {
    mapRef.current?.recenter();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* Viewport-Anchored Map Canvas */}
      <View style={styles.mapWrapper}>
        <MapboxMapView
          ref={mapRef}
          establishments={filteredEstablishments}
          selectedId={selectedEstablishment.id}
          onSelectEstablishment={handleSelectEstablishment}
          height="100%"
        />
      </View>

      {/* Floating Top Overlays */}
      <View style={styles.topOverlay} pointerEvents="box-none">
        {/* Top Info & Action Bar */}
        <View style={styles.topBar}>
          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={13} color="#D42F13" />
            <Text style={styles.locationTitle}>Naga City</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.spotCountText}>
              {filteredEstablishments.length} {filteredEstablishments.length === 1 ? 'spot' : 'spots'}
            </Text>
          </View>

          {/* Quick Open Now Toggle */}
          <Pressable
            onPress={handleToggleOpenOnly}
            style={({ pressed }) => [
              styles.openNowBtn,
              openOnly && styles.openNowBtnActive,
              pressed && styles.pressed,
            ]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Filter by currently open spots"
          >
            <View style={[styles.statusDot, openOnly && styles.statusDotActive]} />
            <Text style={[styles.openNowText, openOnly && styles.openNowTextActive]}>
              Open Now
            </Text>
          </Pressable>
        </View>

        {/* Active Trail Banner (If exploring a curated crawl) */}
        {activeTrail && (
          <View style={styles.activeTrailBanner}>
            <View style={styles.activeTrailTop}>
              <View style={styles.activeTrailBadge}>
                <Ionicons name="footsteps" size={11} color="#FFFFFF" />
                <Text style={styles.activeTrailBadgeText}>ACTIVE CRAWL ROUTE</Text>
              </View>
              <Pressable
                onPress={() => router.setParams({ trailId: undefined })}
                hitSlop={8}
                style={styles.exitTrailBtn}
              >
                <Text style={styles.exitTrailBtnText}>Exit Trail ×</Text>
              </Pressable>
            </View>
            <Text style={styles.activeTrailTitle}>{activeTrail.title}</Text>
            <Text style={styles.activeTrailTagline}>{activeTrail.tagline}</Text>
            <View style={styles.activeTrailFooter}>
              <Text style={styles.activeTrailStats}>
                {activeTrail.estimatedMinutes} mins · {activeTrail.difficulty} · +{activeTrail.xpBonus} XP
              </Text>
            </View>
          </View>
        )}

        {/* Horizontal Category Filter Pills */}
        {!activeTrail && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_OPTIONS.map((opt) => {
              const isActive = selectedType === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => handleSelectType(opt.id)}
                  style={({ pressed }) => [
                    styles.filterPill,
                    isActive && styles.filterPillActive,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${opt.label}`}
                >
                  {opt.iconName && (
                    <Ionicons
                      name={opt.iconName}
                      size={13}
                      color={isActive ? '#FFFFFF' : '#3A3A3C'}
                      style={{ marginRight: 5 }}
                    />
                  )}
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

      </View>

      {/* Floating Recenter Button (Elevated comfortably above the restaurant cards) */}
      <View style={styles.floatingRecenterContainer} pointerEvents="box-none">
        <Pressable
          onPress={handleRecenter}
          style={({ pressed }) => [
            styles.floatingRecenterBtn,
            pressed && styles.pressed,
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Recenter map to original Naga City center"
        >
          <Ionicons name="locate" size={20} color="#111111" />
        </Pressable>
      </View>

      {/* Floating Bottom Spot Carousel */}
      <View style={styles.bottomOverlay} pointerEvents="box-none">
        {filteredEstablishments.length > 0 ? (
          <MapSpotCarousel
            establishments={filteredEstablishments}
            selectedId={selectedEstablishment.id}
            onSelectEstablishment={handleSelectEstablishment}
          />
        ) : (
          <View style={styles.emptyStateCard}>
            <Ionicons name="search-outline" size={24} color="#8E8E93" />
            <Text style={styles.emptyStateTitle}>No spots found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try turning off "Open Now" or clearing the category filter.
            </Text>
            <Pressable
              onPress={() => {
                setSelectedType('all');
                setOpenOnly(false);
              }}
              style={({ pressed }) => [styles.resetFiltersBtn, pressed && styles.pressed]}
            >
              <Text style={styles.resetFiltersBtnText}>Reset Filters</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Floating Bottom Nav */}
      <NavBar currentTab="map" />
    </SafeAreaView>
  );
}

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8EEF3',
    position: 'relative',
  },
  mapWrapper: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },

  // Floating Top Overlays
  topOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 12,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: 14,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  locationTitle: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    marginLeft: 4,
    letterSpacing: -0.2,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#8E8E93',
    marginHorizontal: 6,
  },
  spotCountText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  openNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  openNowBtnActive: {
    backgroundColor: '#E8F8EE',
    borderColor: '#34C759',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8E8E93',
  },
  statusDotActive: {
    backgroundColor: '#34C759',
  },
  openNowText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#3A3A3C',
  },
  openNowTextActive: {
    color: '#1E3A2B',
  },

  // Active Trail Banner
  activeTrailBanner: {
    backgroundColor: 'rgba(28, 28, 30, 0.94)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  activeTrailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeTrailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    gap: 4,
  },
  activeTrailBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  exitTrailBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  exitTrailBtnText: {
    fontSize: 11.5,
    color: '#E5E5EA',
    fontWeight: '600',
  },
  activeTrailTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 1,
  },
  activeTrailTagline: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 6,
  },
  activeTrailFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTrailStats: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9500',
  },

  // Horizontal Category Filter Pills
  filterScroll: {
    paddingVertical: 2,
    gap: 7,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterText: {
    fontFamily: sansFamily,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  // Floating Recenter FAB Button (Elevated comfortably above the restaurant cards)
  floatingRecenterContainer: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 312 : 304,
    zIndex: 25,
  },
  floatingRecenterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },

  // Floating Bottom Spot Carousel
  bottomOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 94 : 86,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },

  // Empty state card if no spots match filter
  emptyStateCard: {
    width: 290,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  emptyStateTitle: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginTop: 6,
    marginBottom: 3,
  },
  emptyStateSubtitle: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  resetFiltersBtn: {
    backgroundColor: '#111111',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  resetFiltersBtnText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.7,
  },
});
