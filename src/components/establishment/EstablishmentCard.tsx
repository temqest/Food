import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Establishment } from '@/data/types';
import { IOSTokens } from '@/constants/theme';
import { useSaved } from '@/context/SavedContext';

interface EstablishmentCardProps {
  establishment: Establishment;
  highlightFoodId?: string;
  layout?: 'row' | 'card';
  isFirst?: boolean;
  isLast?: boolean;
}

export const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  establishment,
  highlightFoodId,
  layout = 'row',
  isFirst = false,
  isLast = false,
}) => {
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();
  const saved = isEstablishmentSaved(establishment.id);

  const handleCardPress = () => {
    router.push({
      pathname: '/establishment/[id]',
      params: { id: establishment.id },
    });
  };

  const handleBookmarkPress = (e: any) => {
    e.stopPropagation?.();
    toggleSaveEstablishment(establishment.id);
  };

  const primaryFood = establishment.foodsOffered[0];
  const distanceFormatted =
    establishment.distanceKm < 1
      ? `${Math.round(establishment.distanceKm * 1000)} m`
      : `${establishment.distanceKm} km`;

  // Standard Inset Grouped Table Row (iOS HIG native pattern)
  if (layout === 'row') {
    return (
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [
          styles.rowContainer,
          isFirst && styles.rowFirst,
          isLast && styles.rowLast,
          pressed && styles.rowPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${establishment.name}, ${establishment.isOpenNow ? 'Open' : 'Closed'}`}
      >
        <Image
          source={{ uri: establishment.heroImage }}
          style={styles.rowThumbnail}
          resizeMode="cover"
        />

        <View style={[styles.rowContent, isLast && styles.rowContentLast]}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowName} numberOfLines={1}>
              {establishment.name}
            </Text>

            <Text style={styles.rowSubhead} numberOfLines={1}>
              {primaryFood ? `${primaryFood.foodName.split('(')[0].trim()} · ` : ''}
              {establishment.neighborhood} · {distanceFormatted}
            </Text>

            <Text
              style={[
                styles.rowStatus,
                establishment.isOpenNow ? styles.statusOpen : styles.statusClosed,
              ]}
              numberOfLines={1}
            >
              {establishment.isOpenNow ? 'Open' : 'Closed'}
              {establishment.openingHours ? ` · ${establishment.openingHours}` : ''}
            </Text>
          </View>

          <View style={styles.rowRight}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={IOSTokens.colors.labelTertiary}
            />
          </View>
        </View>
      </Pressable>
    );
  }

  // Card mode (for search map preview or detail related items)
  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [styles.cardContainer, pressed && styles.cardPressed]}
    >
      <View style={styles.cardImageWrapper}>
        <Image
          source={{ uri: establishment.heroImage }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <Pressable
          onPress={handleBookmarkPress}
          style={styles.floatingBookmark}
          hitSlop={8}
          accessibilityLabel="Save spot"
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={saved ? IOSTokens.colors.tint : '#FFFFFF'}
          />
        </Pressable>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{establishment.name}</Text>
        <Text style={styles.cardMeta}>
          {establishment.neighborhood} · {distanceFormatted}
        </Text>
        <Text
          style={[
            styles.cardStatus,
            establishment.isOpenNow ? styles.statusOpen : styles.statusClosed,
          ]}
        >
          {establishment.isOpenNow ? 'Open Now' : 'Closed'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Inset Grouped Table Row
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOSTokens.colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 74,
  },
  rowFirst: {
    borderTopLeftRadius: IOSTokens.shape.card,
    borderTopRightRadius: IOSTokens.shape.card,
  },
  rowLast: {
    borderBottomLeftRadius: IOSTokens.shape.card,
    borderBottomRightRadius: IOSTokens.shape.card,
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
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
    paddingBottom: 10,
    minHeight: 64,
  },
  rowContentLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  rowInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  rowName: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  rowSubhead: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  rowStatus: {
    ...IOSTokens.typography.footnote,
    marginTop: 2,
  },
  statusOpen: {
    color: IOSTokens.colors.green,
    fontWeight: '500',
  },
  statusClosed: {
    color: IOSTokens.colors.red,
    fontWeight: '500',
  },
  rowRight: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },

  // Card
  cardContainer: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImageWrapper: {
    height: 160,
    width: '100%',
    backgroundColor: IOSTokens.colors.fill,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  floatingBookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 14,
  },
  cardName: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  cardMeta: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 3,
  },
  cardStatus: {
    ...IOSTokens.typography.footnote,
    marginTop: 4,
  },
  cardPressed: {
    opacity: 0.8,
  },
});
