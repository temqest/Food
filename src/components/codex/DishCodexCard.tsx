import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem, Establishment } from '@/data/types';
import { DishInsiderTip } from '@/data/gamification';

interface DishCodexCardProps {
  food: FoodItem;
  insiderTip?: DishInsiderTip;
  isLogged: boolean;
  primaryEstablishment?: Establishment;
  onInspect: () => void;
}

export const DishCodexCard: React.FC<DishCodexCardProps> = ({
  food,
  insiderTip,
  isLogged,
  primaryEstablishment,
  onInspect,
}) => {
  const siliLevel = insiderTip?.siliLevel ?? 2;

  let heatLabel = '🌶️ Mild';
  if (siliLevel === 3) heatLabel = '🌶️🌶️ Med';
  if (siliLevel >= 4) heatLabel = '🔥 Hot';

  return (
    <Pressable
      onPress={onInspect}
      style={({ pressed }) => [styles.cardContainer, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${food.name}, ${food.priceRange}, tap to inspect codex dossier`}
    >
      {/* 160px Hero Food Photo */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: food.image }} style={styles.image} resizeMode="cover" />

        {isLogged && (
          <View style={styles.tastedBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.tastedText}>Tasted</Text>
          </View>
        )}

        <View style={styles.pricePill}>
          <Text style={styles.priceText}>{food.priceRange}</Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View style={styles.headerRow}>
          <Text style={styles.dishName}>{food.name}</Text>
          {food.bikolName && (
            <Text style={styles.bikolName} numberOfLines={1}>
              {food.bikolName}
            </Text>
          )}
        </View>

        <Text style={styles.descriptionText} numberOfLines={2}>
          {food.tagline}
        </Text>

        {/* Quiet Meta Line */}
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            {primaryEstablishment && (
              <>
                <Text style={styles.metaSpot} numberOfLines={1}>
                  {primaryEstablishment.name}
                </Text>
                <Text style={styles.metaDot}>·</Text>
              </>
            )}
            <Text style={styles.metaHeat}>{heatLabel}</Text>
          </View>

          <View style={styles.metaRight}>
            <Text style={styles.inspectText}>Inspect</Text>
            <Ionicons name="chevron-forward" size={14} color="#D42F13" />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
  default: 'Georgia',
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      },
    }),
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#E5E5EA',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tastedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 43, 0.92)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tastedText: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pricePill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  priceText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardBody: {
    padding: 14,
  },
  headerRow: {
    marginBottom: 4,
  },
  dishName: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  bikolName: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 1,
  },
  descriptionText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.8)',
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  metaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  metaSpot: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    flexShrink: 1,
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#C7C7CC',
    fontSize: 12,
  },
  metaHeat: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  inspectText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#D42F13',
  },
});
