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
import { NavBar } from '@/components/common/NavBar';
import { NagaMapCanvas } from '@/components/map/NagaMapCanvas';
import { ESTABLISHMENTS } from '@/data/mockData';
import { Establishment } from '@/data/types';
import { useSaved } from '@/context/SavedContext';

export default function MapScreen() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment>(
    ESTABLISHMENTS[0]
  );
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();

  const filteredEstablishments = ESTABLISHMENTS.filter((est) => {
    if (selectedType === 'all') return true;
    return est.type === selectedType;
  });

  const isSaved = isEstablishmentSaved(selectedEstablishment.id);
  const distanceStr =
    selectedEstablishment.distanceKm < 1
      ? `${Math.round(selectedEstablishment.distanceKm * 1000)} m`
      : `${selectedEstablishment.distanceKm} km`;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Editorial Title */}
          <View style={styles.titleSection}>
            <Text style={styles.headingSans}>
              Flavors on <Text style={styles.headingSerif}>the map</Text>
            </Text>
            <Text style={styles.subheadText}>
              Locate authentic heritage eateries, carinderias, and bakeries across Naga.
            </Text>
          </View>

          {/* Quick Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <Pressable
              onPress={() => setSelectedType('all')}
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
              onPress={() => setSelectedType('kinalas-station')}
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
              onPress={() => setSelectedType('bakery')}
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
              onPress={() => setSelectedType('restaurant')}
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

          {/* Interactive Map Canvas */}
          <View style={styles.mapCard}>
            <NagaMapCanvas
              establishments={filteredEstablishments}
              selectedId={selectedEstablishment.id}
              onSelectEstablishment={(est) => setSelectedEstablishment(est)}
              height={330}
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
                  {selectedEstablishment.isOpenNow ? 'Open Now' : 'Closed'} ·{' '}
                  {selectedEstablishment.openingHours}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/establishment/[id]',
                  params: { id: selectedEstablishment.id },
                });
              }}
              style={({ pressed }) => [styles.detailsButton, pressed && styles.primaryPressed]}
              accessibilityRole="button"
              accessibilityLabel="View place details"
            >
              <Text style={styles.detailsButtonText}>View Place Details</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

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
    paddingBottom: 95,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
  },
  titleSection: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 34,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 20,
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
  },

  // Preview Sheet
  previewSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
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

  // Button
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
  },
  detailsButtonText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  pressed: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
