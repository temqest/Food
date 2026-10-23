import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FoodTrail } from '@/data/gamification';

interface FoodTrailCardProps {
  trail: FoodTrail;
}

export const FoodTrailCard: React.FC<FoodTrailCardProps> = ({ trail }) => {
  const handlePress = () => {
    // Route to dedicated food trail expedition screen
    router.push({
      pathname: '/trail/[id]',
      params: { id: trail.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Food trail: ${trail.title}`}
    >
      <Image source={{ uri: trail.heroImage }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.districtBadge}>
            <Ionicons name="footsteps" size={11} color="#D42F13" />
            <Text style={styles.districtBadgeText}>{trail.district}</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{trail.xpBonus} XP</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {trail.title}
        </Text>
        <Text style={styles.tagline} numberOfLines={2}>
          {trail.tagline}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color="#8E8E93" />
            <Text style={styles.metaText}>{trail.estimatedMinutes} mins</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.difficultyText}>{trail.difficulty}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.stopsText}>{trail.establishmentIds.length} stops</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  cardPressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E5EA',
  },
  content: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  districtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  districtBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
    marginLeft: 3,
  },
  xpBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  xpText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 3,
    lineHeight: 18,
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.70)',
    lineHeight: 16,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 3,
  },
  dot: {
    fontSize: 11,
    color: '#C7C7CC',
    marginHorizontal: 4,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D42F13',
  },
  stopsText: {
    fontSize: 11,
    color: '#8E8E93',
  },
});
