import React from 'react';
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
import { useLocalSearchParams, router } from 'expo-router';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFoodSaved, toggleSaveFood } = useSaved();
  const { addToBasket, setActiveTabSection } = useBasket();

  const food = FOOD_ITEMS.find((f) => f.id === id) || FOOD_ITEMS[0];
  const saved = isFoodSaved(food.id);

  // Establishments serving this food
  const servingEstablishments = ESTABLISHMENTS.filter((est) =>
    est.foodsOffered.some((item) => item.foodId === food.id)
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* Minimal Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>

        <Pressable
          onPress={() => toggleSaveFood(food.id)}
          style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved' : 'Save dish'}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={saved ? '#D42F13' : '#000000'}
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Hero Photo Banner */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={{ uri: food.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Title Header with Editorial Styling */}
          <View style={styles.titleSection}>
            <Text style={styles.foodTitle}>{food.name}</Text>
            {food.bikolName && (
              <Text style={styles.bikolName}>
                Bikolano: <Text style={styles.bikolItalic}>{food.bikolName}</Text>
              </Text>
            )}
            <Text style={styles.tagline}>{food.tagline}</Text>
          </View>

          {/* Inset Group 1: Dish Overview */}
          <View style={styles.insetGroup}>
            <View style={styles.groupRow}>
              <Text style={styles.groupRowLabel}>Typical Price</Text>
              <Text style={styles.groupRowValueBold}>{food.priceRange}</Text>
            </View>
            <View style={styles.groupRow}>
              <Text style={styles.groupRowLabel}>Category</Text>
              <Text style={styles.groupRowValue}>{food.categoryLabel}</Text>
            </View>
            <View style={[styles.groupRow, styles.groupRowLast]}>
              <Text style={styles.groupRowLabel}>Serving Places</Text>
              <Text style={styles.groupRowValue}>
                {servingEstablishments.length} spots in Naga
              </Text>
            </View>
          </View>

          {/* Flavor Profile Pills (Mirroring Welcome Screen Style) */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Flavor Profile</Text>
            <View style={styles.flavorTagsContainer}>
              {food.flavorProfile.map((flavor, index) => {
                const isDashed = index % 2 === 0;
                return (
                  <View
                    key={index}
                    style={[
                      styles.flavorPill,
                      isDashed ? styles.flavorPillDashed : styles.flavorPillSolid,
                    ]}
                  >
                    <Text style={styles.flavorPillText}>{flavor}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Cultural Heritage & Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>About This Dish</Text>
            <View style={styles.insetGroup}>
              <View style={styles.textBlock}>
                <Text style={styles.bodyText}>{food.description}</Text>
              </View>
              {food.culturalContext && (
                <View style={[styles.textBlock, styles.textBlockDivider]}>
                  <Text style={styles.contextHeader}>Cultural Heritage</Text>
                  <Text style={styles.bodyText}>{food.culturalContext}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Serving Establishments Inset Group */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Where to Get It in Naga</Text>
            <View style={styles.insetGroup}>
              {servingEstablishments.map((est, index) => {
                const offering = est.foodsOffered.find((f) => f.foodId === food.id);
                const isLast = index === servingEstablishments.length - 1;
                const distanceStr =
                  est.distanceKm < 1
                    ? `${Math.round(est.distanceKm * 1000)} m`
                    : `${est.distanceKm} km`;

                return (
                  <Pressable
                    key={est.id}
                    onPress={() => {
                      router.push({
                        pathname: '/establishment/[id]',
                        params: { id: est.id },
                      });
                    }}
                    style={({ pressed }) => [
                      styles.establishmentRow,
                      isLast && styles.establishmentRowLast,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <Image
                      source={{ uri: est.heroImage }}
                      style={styles.estThumbnail}
                      resizeMode="cover"
                    />

                    <View style={[styles.estContent, isLast && styles.estContentLast]}>
                      <View style={styles.estInfo}>
                        <Text style={styles.estName} numberOfLines={1}>
                          {est.name}
                        </Text>
                        <Text style={styles.estSubhead} numberOfLines={1}>
                          {offering ? `₱${offering.price} · ` : ''}
                          {est.neighborhood} · {distanceStr}
                        </Text>
                        <Text
                          style={[
                            styles.estStatus,
                            est.isOpenNow ? styles.statusOpen : styles.statusClosed,
                          ]}
                        >
                          {est.isOpenNow ? 'Open Now' : 'Closed'}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#C7C7CC"
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Primary Action Button */}
          <Pressable
            onPress={() => {
              const est = servingEstablishments[0] || ESTABLISHMENTS[0];
              const offering = est.foodsOffered.find((f) => f.foodId === food.id);
              addToBasket({
                foodId: food.id,
                foodName: food.name,
                price: offering ? offering.price : 85,
                establishmentId: est.id,
                establishmentName: est.name,
                establishmentAddress: est.address,
                image: food.image,
                quantity: 1,
              });
              setActiveTabSection('current');
              router.push('/basket');
            }}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
            accessibilityRole="button"
            accessibilityLabel="Pre-order dish"
          >
            <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>Pre-Order Dish</Text>
          </Pressable>
        </View>
      </ScrollView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 6,
  },
  navIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  heroImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    paddingBottom: 16,
  },
  foodTitle: {
    fontFamily: sansFamily,
    fontSize: 30,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.8,
  },
  bikolName: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#6E6E73',
    marginTop: 3,
  },
  bikolItalic: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    color: '#000000',
    fontWeight: '500',
  },
  tagline: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 20,
  },

  // Inset Group
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  groupRowLast: {
    borderBottomWidth: 0,
  },
  groupRowLabel: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  groupRowValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
  },
  groupRowValueBold: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Flavor Profile
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  flavorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flavorPillDashed: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.35)',
    borderStyle: 'dashed',
  },
  flavorPillSolid: {
    backgroundColor: 'rgba(254, 215, 170, 0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 88, 12, 0.6)',
    borderStyle: 'dashed',
  },
  flavorPillText: {
    fontFamily: serifFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },

  textBlock: {
    padding: 16,
  },
  textBlockDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(60, 60, 67, 0.15)',
  },
  contextHeader: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  bodyText: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 21,
    color: '#48484A',
  },

  // Establishment row
  establishmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 72,
  },
  establishmentRowLast: {
    borderBottomWidth: 0,
  },
  estThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  estContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
    paddingBottom: 10,
    minHeight: 56,
  },
  estContentLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  estInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  estName: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  estSubhead: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  estStatus: {
    fontFamily: sansFamily,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  statusOpen: {
    color: '#34C759',
  },
  statusClosed: {
    color: '#FF3B30',
  },

  // Primary Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111111',
    marginTop: 4,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 16,
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
  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});
