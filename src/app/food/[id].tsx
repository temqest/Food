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
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';
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
    <View style={styles.screen}>
      <Header
        showBack
        title={food.name}
        rightAction={
          <Pressable
            onPress={() => toggleSaveFood(food.id)}
            style={({ pressed }) => [styles.navBookmarkBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save dish'}
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
        {/* Hero Photo */}
        <View style={styles.heroImageWrapper}>
          <Image
            source={{ uri: food.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.mainContainer}>
          {/* Title Header */}
          <View style={styles.titleSection}>
            <Text style={styles.foodTitle}>{food.name}</Text>
            {food.bikolName && (
              <Text style={styles.bikolName}>Bikol: {food.bikolName}</Text>
            )}
            <Text style={styles.tagline}>{food.tagline}</Text>
          </View>

          {/* Inset Group 1: Dish Overview */}
          <View style={styles.insetGroup}>
            <View style={styles.groupRow}>
              <Text style={styles.groupRowLabel}>Price Range</Text>
              <Text style={styles.groupRowValueBold}>{food.priceRange}</Text>
            </View>
            <View style={styles.groupRow}>
              <Text style={styles.groupRowLabel}>Category</Text>
              <Text style={styles.groupRowValue}>{food.categoryLabel}</Text>
            </View>
            <View style={[styles.groupRow, styles.groupRowLast]}>
              <Text style={styles.groupRowLabel}>Serving Places</Text>
              <Text style={styles.groupRowValue}>
                {servingEstablishments.length} in Naga
              </Text>
            </View>
          </View>

          {/* Flavor Profile */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Flavor Profile</Text>
            <View style={styles.flavorTagsContainer}>
              {food.flavorProfile.map((flavor, index) => (
                <View key={index} style={styles.flavorTag}>
                  <Text style={styles.flavorTagText}>{flavor}</Text>
                </View>
              ))}
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
                        color={IOSTokens.colors.labelTertiary}
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
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Ionicons name="bag-handle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>Pre-Order Dish</Text>
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
    height: 240,
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
  foodTitle: {
    ...IOSTokens.typography.largeTitle,
    fontSize: 28,
    lineHeight: 34,
    color: IOSTokens.colors.label,
  },
  bikolName: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  tagline: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 6,
    lineHeight: 22,
  },

  // Inset Group
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
    marginBottom: 20,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  groupRowLast: {
    borderBottomWidth: 0,
  },
  groupRowLabel: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.label,
  },
  groupRowValue: {
    ...IOSTokens.typography.body,
    color: IOSTokens.colors.labelSecondary,
  },
  groupRowValueBold: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.tint,
  },

  // Sections
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeader: {
    ...IOSTokens.typography.title2,
    fontSize: 18,
    lineHeight: 22,
    color: IOSTokens.colors.label,
    marginBottom: 10,
  },
  flavorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorTag: {
    backgroundColor: IOSTokens.colors.fill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  flavorTagText: {
    ...IOSTokens.typography.subhead,
    fontSize: 13,
    color: IOSTokens.colors.label,
    fontWeight: '500',
  },
  textBlock: {
    padding: 16,
  },
  textBlockDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: IOSTokens.colors.separator,
  },
  contextHeader: {
    ...IOSTokens.typography.headline,
    fontSize: 15,
    color: IOSTokens.colors.label,
    marginBottom: 6,
  },
  bodyText: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: IOSTokens.colors.label,
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
    width: 60,
    height: 60,
    borderRadius: IOSTokens.shape.thumb,
    backgroundColor: IOSTokens.colors.fill,
  },
  estContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
    paddingBottom: 10,
    minHeight: 60,
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
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  estSubhead: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  estStatus: {
    ...IOSTokens.typography.footnote,
    marginTop: 2,
    fontWeight: '500',
  },
  statusOpen: {
    color: IOSTokens.colors.green,
  },
  statusClosed: {
    color: IOSTokens.colors.red,
  },

  // Primary Button
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
