import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { MapboxMapView } from '@/components/map/MapboxMapView';
import { ESTABLISHMENTS } from '@/data/mockData';
import { FOOD_TRAILS } from '@/data/gamification';
import { useSaved } from '@/context/SavedContext';
import { useQuest } from '@/context/QuestContext';

export default function MapScreen() {
  const params = useLocalSearchParams<{ trailId?: string }>();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string>(
    ESTABLISHMENTS[0].id
  );
  const [isScrollEnabled, setIsScrollEnabled] = useState<boolean>(true);
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();
  const { logTasting } = useQuest();
  const [checkedInIds, setCheckedInIds] = useState<string[]>([]);

  const activeTrail = FOOD_TRAILS.find((t) => t.id === params.trailId);

  const filteredEstablishments = ESTABLISHMENTS.filter((est) => {
    if (activeTrail) {
      return activeTrail.establishmentIds.includes(est.id);
    }
    if (selectedType === 'all') return true;
    return est.type === selectedType;
  });

  const selectedEstablishment =
    filteredEstablishments.find((e) => e.id === selectedEstablishmentId) ||
    filteredEstablishments[0] ||
    ESTABLISHMENTS[0];

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    const matches = ESTABLISHMENTS.filter((est) => type === 'all' || est.type === type);
    if (matches.length > 0 && !matches.some((m) => m.id === selectedEstablishmentId)) {
      setSelectedEstablishmentId(matches[0].id);
    }
  };

  const isSaved = isEstablishmentSaved(selectedEstablishment.id);
  const isCheckedIn = checkedInIds.includes(selectedEstablishment.id);

  const handleCheckIn = () => {
    if (isCheckedIn) return;
    const primary = selectedEstablishment.foodsOffered[0];
    logTasting({
      foodId: primary ? primary.foodId : 'kinalas',
      foodName: primary ? primary.foodName : selectedEstablishment.name,
      establishmentId: selectedEstablishment.id,
      establishmentName: selectedEstablishment.name,
      rating: 5,
      spiceRating: 3,
      notes: `Logged while exploring ${selectedEstablishment.neighborhood} on the Naga Map!`,
    });
    setCheckedInIds((prev) => [...prev, selectedEstablishment.id]);
  };

  const distanceStr =
    selectedEstablishment.distanceKm < 1
      ? `${Math.round(selectedEstablishment.distanceKm * 1000)} m`
      : `${selectedEstablishment.distanceKm} km`;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isScrollEnabled}
      >
        <View style={styles.mainContainer}>
          {/* Editorial Title */}
          <View style={styles.titleSection}>
            <Text style={styles.headingSans}>
              Flavors on <Text style={styles.headingSerif}>the map</Text>
            </Text>
            <Text style={styles.subheadText}>
              Locate authentic heritage eateries, carinderias, and walking crawl trails in Naga.
            </Text>
          </View>

          {/* Active Food Trail Banner (If selected) */}
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

          {/* Quick Filter Pills (Hidden if active trail) */}
          {!activeTrail && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <Pressable
                onPress={() => handleSelectType('all')}
                style={({ pressed }) => [
                  styles.filterPill,
                  selectedType === 'all' && styles.filterPillActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedType === 'all' && styles.filterTextActive,
                  ]}
                >
                  All Places
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSelectType('kinalas-station')}
                style={({ pressed }) => [
                  styles.filterPill,
                  selectedType === 'kinalas-station' && styles.filterPillActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedType === 'kinalas-station' && styles.filterTextActive,
                  ]}
                >
                  🍜 Kinalas Stations
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSelectType('bakery')}
                style={({ pressed }) => [
                  styles.filterPill,
                  selectedType === 'bakery' && styles.filterPillActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedType === 'bakery' && styles.filterTextActive,
                  ]}
                >
                  🥟 Bakeries
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleSelectType('restaurant')}
                style={({ pressed }) => [
                  styles.filterPill,
                  selectedType === 'restaurant' && styles.filterPillActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedType === 'restaurant' && styles.filterTextActive,
                  ]}
                >
                  🥥 Heritage Dining
                </Text>
              </Pressable>
            </ScrollView>
          )}

          {/* Interactive Map Canvas */}
          <View style={styles.mapCard}>
            <MapboxMapView
              establishments={filteredEstablishments}
              selectedId={selectedEstablishment.id}
              onSelectEstablishment={(est) => setSelectedEstablishmentId(est.id)}
              height={360}
              onInteractionStart={() => setIsScrollEnabled(false)}
              onInteractionEnd={() => setIsScrollEnabled(true)}
            />
          </View>

          {/* Selected Place Preview Sheet */}
          <View style={styles.previewSheet}>
            <View style={styles.grabber} />

            <View style={styles.sheetTopRow}>
              <View style={styles.sheetInfoLeft}>
                <Text style={styles.sheetName}>{selectedEstablishment.name}</Text>
                <Text style={styles.sheetSubhead}>
                  {selectedEstablishment.typeLabel} · {distanceStr}
                </Text>
              </View>

              <Pressable
                onPress={() => toggleSaveEstablishment(selectedEstablishment.id)}
                style={({ pressed }) => [styles.bookmarkBtn, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Save spot"
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isSaved ? '#D42F13' : '#8E8E93'}
                />
              </Pressable>
            </View>

            <View style={styles.sheetBody}>
              <Image
                source={{ uri: selectedEstablishment.heroImage }}
                style={styles.sheetThumb}
                resizeMode="cover"
              />

              <View style={styles.sheetBodyText}>
                <Text style={styles.sheetAddress} numberOfLines={1}>
                  {selectedEstablishment.address}
                </Text>
                <Text
                  style={[
                    styles.sheetStatus,
                    selectedEstablishment.isOpenNow ? styles.statusOpen : styles.statusClosed,
                  ]}
                >
                  {selectedEstablishment.isOpenNow ? 'Open Now' : 'Closed'} · {selectedEstablishment.openingHours}
                </Text>
              </View>
            </View>

            {/* Dual Actions: Check-in Tasting & View Full Details */}
            <View style={styles.sheetButtonsRow}>
              <Pressable
                onPress={handleCheckIn}
                style={({ pressed }) => [
                  styles.checkInBtn,
                  isCheckedIn && styles.checkInBtnActive,
                  pressed && styles.pressed,
                ]}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel="Check in tasting at this spot"
              >
                <Ionicons
                  name={isCheckedIn ? 'checkmark-circle' : 'flame'}
                  size={15}
                  color={isCheckedIn ? '#34C759' : '#D42F13'}
                />
                <Text
                  style={[
                    styles.checkInBtnText,
                    isCheckedIn && styles.checkInBtnTextActive,
                  ]}
                >
                  {isCheckedIn ? 'Checked In' : 'Taste (+60 XP)'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  router.push({
                    pathname: '/establishment/[id]',
                    params: { id: selectedEstablishment.id },
                  });
                }}
                style={({ pressed }) => [styles.detailsButton, pressed && styles.primaryPressed]}
                accessibilityRole="button"
                accessibilityLabel={`View details for ${selectedEstablishment.name}`}
              >
                <Text style={styles.detailsButtonText}>View Spot</Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color="#FFFFFF"
                  style={{ marginLeft: 4 }}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Nav */}
      <NavBar currentTab="map" />
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
    paddingHorizontal: 16,
  },

  // Title Section
  titleSection: {
    paddingTop: Platform.OS === 'ios' ? 14 : 20,
    paddingBottom: 14,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.8,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 30,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.65)',
    marginTop: 4,
    lineHeight: 18,
  },

  // Active Trail Banner
  activeTrailBanner: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  activeTrailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeTrailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    gap: 4,
  },
  activeTrailBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  exitTrailBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  exitTrailBtnText: {
    fontSize: 12,
    color: '#E5E5EA',
    fontWeight: '600',
  },
  activeTrailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  activeTrailTagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 8,
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

  // Filter Pills
  filterScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E73',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  // Map
  mapCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },

  // Preview Sheet
  previewSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  grabber: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
    marginBottom: 14,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 12,
  },
  sheetInfoLeft: {
    flex: 1,
    marginRight: 8,
  },
  sheetName: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sheetSubhead: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 4,
  },
  sheetBody: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  sheetThumb: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  sheetBodyText: {
    flex: 1,
    marginLeft: 12,
  },
  sheetAddress: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
  },
  sheetStatus: {
    fontFamily: sansFamily,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  statusOpen: {
    color: '#34C759',
  },
  statusClosed: {
    color: '#FF3B30',
  },

  // Action Buttons
  sheetButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFF2EE',
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.2)',
    gap: 5,
  },
  checkInBtnActive: {
    backgroundColor: '#E8F8EE',
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  checkInBtnText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },
  checkInBtnTextActive: {
    color: '#34C759',
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#D42F13',
  },
  detailsButtonText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  pressed: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
  },
});
