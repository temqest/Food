import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { FoodItem, Establishment } from '@/data/types';

interface RecommendationModalProps {
  visible: boolean;
  onClose: () => void;
  preferredCategory?: string;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  visible,
  onClose,
  preferredCategory,
}) => {
  const [spinIndex, setSpinIndex] = useState(0);

  const eligiblePool: FoodItem[] = useMemo(() => {
    if (preferredCategory && preferredCategory !== 'all') {
      const filtered = FOOD_ITEMS.filter((f) => f.category === preferredCategory);
      if (filtered.length > 0) return filtered;
    }
    return FOOD_ITEMS;
  }, [preferredCategory]);

  const selectedFood = eligiblePool[spinIndex % eligiblePool.length] || FOOD_ITEMS[0];

  const bestSpot = useMemo<Establishment>(() => {
    return (
      ESTABLISHMENTS.find((e) => e.foodsOffered.some((fo) => fo.foodId === selectedFood.id)) ||
      ESTABLISHMENTS[0]
    );
  }, [selectedFood]);

  const getRandomRecommendation = () => {
    setSpinIndex((prev) => prev + 1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Top Bar with Grabber & Close Button */}
          <View style={styles.headerBar}>
            <View style={styles.headerLeft}>
              <View style={styles.sparkleIconBadge}>
                <Ionicons name="sparkles" size={14} color="#D42F13" />
              </View>
              <Text style={styles.headerLabel}>AI FOODIE ROULETTE</Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Close recommendation modal"
            >
              <Ionicons name="close" size={20} color="#1C1C1E" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            {/* Food Hero Image */}
            <View style={styles.imageCard}>
              <Image source={{ uri: selectedFood.image }} style={styles.foodImage} />
              <View style={styles.imageBadgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{selectedFood.categoryLabel}</Text>
                </View>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceBadgeText}>{selectedFood.priceRange}</Text>
                </View>
              </View>
            </View>

            {/* Title & Bikol Name */}
            <View style={styles.titleSection}>
              <Text style={styles.foodName}>{selectedFood.name}</Text>
              {selectedFood.bikolName && (
                <Text style={styles.bikolName}>Local Name: &ldquo;{selectedFood.bikolName}&rdquo;</Text>
              )}
              <Text style={styles.tagline}>{selectedFood.tagline}</Text>
            </View>

            {/* Flavor Profile Tags */}
            <View style={styles.flavorsRow}>
              {selectedFood.flavorProfile.map((flavor, i) => (
                <View key={i} style={styles.flavorChip}>
                  <Text style={styles.flavorChipText}>{flavor}</Text>
                </View>
              ))}
            </View>

            {/* Recommended Authentic Spot Inset */}
            {bestSpot && (
              <View style={styles.spotCard}>
                <View style={styles.spotHeader}>
                  <Ionicons name="restaurant" size={16} color="#D42F13" />
                  <Text style={styles.spotSectionTitle}>Best Authentic Spot in Naga</Text>
                </View>

                <View style={styles.spotContent}>
                  <Image source={{ uri: bestSpot.heroImage }} style={styles.spotThumb} />
                  <View style={styles.spotMeta}>
                    <Text style={styles.spotName}>{bestSpot.name}</Text>
                    <Text style={styles.spotAddress}>
                      {bestSpot.neighborhood} · {bestSpot.distanceKm} km away
                    </Text>
                    <View style={styles.spotRatingRow}>
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{bestSpot.typeLabel}</Text>
                      </View>
                      {bestSpot.isOpenNow && (
                        <View style={styles.openNowBadge}>
                          <Text style={styles.openNowText}>Open Now</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  router.push({
                    pathname: '/food/[id]',
                    params: { id: selectedFood.id },
                  });
                }}
                style={styles.primaryBtn}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryBtnText}>Explore Dish & Pre-Order</Text>
                <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={getRandomRecommendation}
                style={styles.secondaryBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="dice-outline" size={18} color="#111111" />
                <Text style={styles.secondaryBtnText}>
                  {spinIndex > 0 ? 'Spin Again for Another Dish' : 'Try Another Recommendation'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    ...Platform.select({
      web: {
        maxWidth: 580,
        width: '100%',
        alignSelf: 'center',
      } as any,
    }),
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 20,
  },
  imageCard: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageBadgeRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  priceBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceBadgeText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  titleSection: {
    marginBottom: 14,
  },
  foodName: {
    fontFamily: sansFamily,
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  bikolName: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#D42F13',
    marginTop: 2,
    fontWeight: '600',
  },
  tagline: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#6E6E73',
    lineHeight: 20,
    marginTop: 6,
  },
  flavorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  flavorChip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  flavorChipText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  spotCard: {
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.08)',
    marginBottom: 20,
  },
  spotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  spotSectionTitle: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  spotContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#E5E5EA',
  },
  spotMeta: {
    marginLeft: 12,
    flex: 1,
  },
  spotName: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  spotAddress: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  spotRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#6E6E73',
  },
  openNowBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  openNowText: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  actionButtonGroup: {
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#111111',
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  pressed: {
    opacity: 0.65,
  },
});
