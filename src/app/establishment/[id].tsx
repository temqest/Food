import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '@/components/common/Header';
import { ESTABLISHMENTS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';
import { useSaved } from '@/context/SavedContext';

export default function EstablishmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();

  const establishment =
    ESTABLISHMENTS.find((e) => e.id === id) || ESTABLISHMENTS[0];
  const saved = isEstablishmentSaved(establishment.id);

  const distanceStr =
    establishment.distanceKm < 1
      ? `${Math.round(establishment.distanceKm * 1000)} m`
      : `${establishment.distanceKm} km`;

  return (
    <View style={styles.screen}>
      <Header
        showBack
        title={establishment.name}
        rightAction={
          <Pressable
            onPress={() => toggleSaveEstablishment(establishment.id)}
            style={({ pressed }) => [styles.navBookmarkBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save place'}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={saved ? IOSTokens.colors.tint : IOSTokens.colors.labelSecondary}
            />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Photo Banner */}
        <View style={styles.heroImageWrapper}>
          <Image
            source={{ uri: establishment.heroImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.mainContainer}>
          {/* Header Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.nameTitle}>{establishment.name}</Text>
            <Text style={styles.subhead}>
              {establishment.typeLabel} · {establishment.neighborhood} · {distanceStr}
            </Text>
            <Text
              style={[
                styles.statusText,
                establishment.isOpenNow ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              {establishment.isOpenNow ? 'Open Now' : 'Closed'} · {establishment.openingHours}
            </Text>
          </View>

          {/* Section: Dishes Served Here */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Dishes Offered Here</Text>
            <View style={styles.insetGroup}>
              {establishment.foodsOffered.map((food, index) => {
                const isLast = index === establishment.foodsOffered.length - 1;
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      router.push({
                        pathname: '/food/[id]',
                        params: { id: food.foodId },
                      });
                    }}
                    style={({ pressed }) => [
                      styles.foodRow,
                      isLast && styles.foodRowLast,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.foodName}</Text>
                      {food.servingNote && (
                        <Text style={styles.foodNote}>{food.servingNote}</Text>
                      )}
                    </View>
                    <View style={styles.foodRight}>
                      <Text style={styles.foodPrice}>₱{food.price}</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={IOSTokens.colors.labelTertiary}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section: Information Group */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.insetGroup}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{establishment.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hours</Text>
                <Text style={styles.infoValue}>{establishment.openingHours}</Text>
              </View>
              {establishment.contactNumber && (
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValueTint}>{establishment.contactNumber}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Section: About */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.insetGroup}>
              <View style={styles.aboutBlock}>
                <Text style={styles.aboutText}>{establishment.description}</Text>
              </View>
            </View>
          </View>

          {/* Primary Action Button */}
          <Pressable
            onPress={() => router.push('/map')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Ionicons name="navigate" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>Locate on Naga Map</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  navBookmarkBtn: {
    padding: 6,
  },
  heroImageWrapper: {
    width: '100%',
    height: 230,
    backgroundColor: IOSTokens.colors.fill,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: IOSTokens.spacing.margin,
  },
  titleSection: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  nameTitle: {
    ...IOSTokens.typography.largeTitle,
    fontSize: 26,
    lineHeight: 32,
    color: IOSTokens.colors.label,
  },
  subhead: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 4,
  },
  statusText: {
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

  // Sections
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...IOSTokens.typography.title2,
    fontSize: 18,
    lineHeight: 22,
    color: IOSTokens.colors.label,
    marginBottom: 10,
  },
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },

  // Food Rows
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  foodRowLast: {
    borderBottomWidth: 0,
  },
  foodInfo: {
    flex: 1,
    marginRight: 12,
  },
  foodName: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  foodNote: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  foodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  foodPrice: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.tint,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.label,
    width: 90,
  },
  infoValue: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.labelSecondary,
    flex: 1,
    textAlign: 'right',
  },
  infoValueTint: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.tint,
    flex: 1,
    textAlign: 'right',
  },

  aboutBlock: {
    padding: 16,
  },
  aboutText: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: IOSTokens.colors.label,
  },

  // Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    backgroundColor: IOSTokens.colors.tint,
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },

  pressed: {
    opacity: 0.6,
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },
});
