import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FoodItem } from '@/data/types';
import { IOSTokens } from '@/constants/theme';
import { useSaved } from '@/context/SavedContext';

interface FoodCardProps {
  food: FoodItem;
  layout?: 'carousel' | 'standard' | 'row' | 'horizontal';
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, layout = 'carousel' }) => {
  const { isFoodSaved, toggleSaveFood } = useSaved();
  const saved = isFoodSaved(food.id);

  const handleCardPress = () => {
    router.push({
      pathname: '/food/[id]',
      params: { id: food.id },
    });
  };

  const handleBookmarkPress = (e: any) => {
    e.stopPropagation?.();
    toggleSaveFood(food.id);
  };

  // Carousel layout: The photo is the card. Text strictly below image.
  if (layout === 'carousel') {
    return (
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [styles.carouselContainer, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${food.name}, ${food.servingSpotsCount} places`}
      >
        <View style={styles.carouselImageWrapper}>
          <Image
            source={{ uri: food.image }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.carouselTextContainer}>
          <Text style={styles.carouselTitle} numberOfLines={1}>
            {food.name}
          </Text>
          <Text style={styles.carouselMeta} numberOfLines={1}>
            {food.servingSpotsCount} {food.servingSpotsCount === 1 ? 'place' : 'places'}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Row layout (inset grouped table style row)
  if (layout === 'row' || layout === 'horizontal') {
    return (
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [styles.rowContainer, pressed && styles.rowPressed]}
      >
        <Image
          source={{ uri: food.image }}
          style={styles.rowThumbnail}
          resizeMode="cover"
        />
        <View style={styles.rowContent}>
          <View style={styles.rowTextColumn}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {food.name}
            </Text>
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {food.categoryLabel} · {food.priceRange}
            </Text>
            <Text style={styles.rowMeta} numberOfLines={1}>
              {food.servingSpotsCount} {food.servingSpotsCount === 1 ? 'place' : 'places'} in Naga
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={IOSTokens.colors.labelTertiary}
            style={styles.trailingChevron}
          />
        </View>
      </Pressable>
    );
  }

  // Standard full-width featured card: restrained, photo on top, metadata below
  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [styles.standardCard, pressed && styles.pressed]}
    >
      <View style={styles.standardImageWrapper}>
        <Image
          source={{ uri: food.image }}
          style={styles.standardImage}
          resizeMode="cover"
        />
        <Pressable
          onPress={handleBookmarkPress}
          style={styles.floatingBookmark}
          hitSlop={8}
          accessibilityLabel="Save dish"
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={saved ? IOSTokens.colors.tint : '#FFFFFF'}
          />
        </Pressable>
      </View>

      <View style={styles.standardContent}>
        <View style={styles.standardTitleRow}>
          <Text style={styles.standardTitle}>{food.name}</Text>
          <Text style={styles.standardPrice}>{food.priceRange}</Text>
        </View>

        {food.bikolName && (
          <Text style={styles.standardBikolName}>Bikol: {food.bikolName}</Text>
        )}

        <Text style={styles.standardTagline} numberOfLines={2}>
          {food.tagline}
        </Text>

        <Text style={styles.standardMeta}>
          {food.servingSpotsCount} {food.servingSpotsCount === 1 ? 'place' : 'places'} serving this in Naga
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Carousel Photo Card
  carouselContainer: {
    width: 155,
    marginRight: 12,
  },
  carouselImageWrapper: {
    width: 155,
    height: 194, // 4:5 aspect ratio
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: IOSTokens.colors.fill,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselTextContainer: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  carouselTitle: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  carouselMeta: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },

  // Row
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOSTokens.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 72,
  },
  rowThumbnail: {
    width: 64,
    height: 64,
    borderRadius: IOSTokens.shape.thumb,
    backgroundColor: IOSTokens.colors.fill,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
    paddingBottom: 10,
  },
  rowTextColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  rowTitle: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  rowSubtitle: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  rowMeta: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  trailingChevron: {
    marginLeft: 8,
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },

  // Standard Card
  standardCard: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
    marginBottom: 16,
  },
  standardImageWrapper: {
    height: 180,
    width: '100%',
    backgroundColor: IOSTokens.colors.fill,
    position: 'relative',
  },
  standardImage: {
    width: '100%',
    height: '100%',
  },
  floatingBookmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  standardContent: {
    padding: 16,
  },
  standardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standardTitle: {
    ...IOSTokens.typography.headline,
    fontSize: 18,
    color: IOSTokens.colors.label,
    flex: 1,
  },
  standardPrice: {
    ...IOSTokens.typography.subhead,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },
  standardBikolName: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  standardTagline: {
    ...IOSTokens.typography.body,
    fontSize: 14,
    lineHeight: 19,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 6,
  },
  standardMeta: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 8,
  },

  pressed: {
    opacity: 0.8,
  },
});
