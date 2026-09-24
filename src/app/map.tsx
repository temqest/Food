import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { NagaMapCanvas } from '@/components/map/NagaMapCanvas';
import { ESTABLISHMENTS } from '@/data/mockData';
import { Establishment } from '@/data/types';
import { IOSTokens } from '@/constants/theme';
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
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* iOS Large Title */}
          <View style={styles.titleSection}>
            <Text style={styles.largeTitle}>Map</Text>
          </View>

          {/* Quick Segment Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <Pressable
              onPress={() => setSelectedType('all')}
              style={[
                styles.filterPill,
                selectedType === 'all' && styles.filterPillActive,
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
              style={[
                styles.filterPill,
                selectedType === 'kinalas-station' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === 'kinalas-station' && styles.filterTextActive,
                ]}
              >
                Kinalas Stations
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedType('bakery')}
              style={[
                styles.filterPill,
                selectedType === 'bakery' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === 'bakery' && styles.filterTextActive,
                ]}
              >
                Bakeries
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSelectedType('restaurant')}
              style={[
                styles.filterPill,
                selectedType === 'restaurant' && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === 'restaurant' && styles.filterTextActive,
                ]}
              >
                Heritage Dining
              </Text>
            </Pressable>
          </ScrollView>

          {/* Interactive Map Canvas */}
          <View style={styles.mapCard}>
            <NagaMapCanvas
              establishments={filteredEstablishments}
              selectedId={selectedEstablishment.id}
              onSelectEstablishment={(est) => setSelectedEstablishment(est)}
              height={340}
            />
          </View>

          {/* Selected Place Preview (iOS Sheet Style) */}
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
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isSaved ? IOSTokens.colors.tint : IOSTokens.colors.labelSecondary}
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
              style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}
            >
              <Text style={styles.detailsButtonText}>View Place Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <NavBar currentTab="map" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: IOSTokens.colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: IOSTokens.spacing.margin,
  },
  titleSection: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  largeTitle: {
    ...IOSTokens.typography.largeTitle,
    color: IOSTokens.colors.label,
  },

  // Filter Pills
  filterScroll: {
    paddingBottom: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: IOSTokens.colors.fill,
  },
  filterPillActive: {
    backgroundColor: IOSTokens.colors.tint,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: IOSTokens.colors.label,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Map
  mapCard: {
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
    backgroundColor: IOSTokens.colors.surface,
    marginBottom: 16,
  },

  // Preview Sheet
  previewSheet: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.sheet,
    padding: 16,
    alignItems: 'center',
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: IOSTokens.colors.labelTertiary,
    marginBottom: 12,
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
    ...IOSTokens.typography.headline,
    fontSize: 18,
    color: IOSTokens.colors.label,
  },
  sheetSubhead: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
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
    width: 60,
    height: 60,
    borderRadius: IOSTokens.shape.thumb,
    backgroundColor: IOSTokens.colors.fill,
  },
  sheetBodyText: {
    flex: 1,
    marginLeft: 12,
  },
  sheetAddress: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
  },
  sheetStatus: {
    ...IOSTokens.typography.footnote,
    marginTop: 4,
    fontWeight: '500',
  },
  statusOpen: {
    color: IOSTokens.colors.green,
  },
  statusClosed: {
    color: IOSTokens.colors.red,
  },

  // Button
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: IOSTokens.colors.tint,
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  pressed: {
    opacity: 0.6,
  },
});
