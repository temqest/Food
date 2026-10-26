import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FoodTrail } from '@/data/gamification';
import { banner1, banner2, banner3 } from '@/components/home/NagaQuestCarousel';

interface TrailHeroBannerProps {
  trail: FoodTrail;
  totalStopsCount: number;
  onBack: () => void;
}

export const TrailHeroBanner: React.FC<TrailHeroBannerProps> = ({
  trail,
  totalStopsCount,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  // Match the custom illustrated banner from the homepage carousel
  const bannerSource = useMemo(() => {
    const id = trail.id.toLowerCase();
    if (id.includes('kinalas')) return banner1;
    if (id.includes('centro') || id.includes('merienda') || id.includes('siopao')) return banner2;
    if (id.includes('spice') || id.includes('gata') || id.includes('sili')) return banner3;
    if (trail.heroImage) return { uri: trail.heroImage };
    return banner1;
  }, [trail.id, trail.heroImage]);

  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 20
  );
  const totalBannerHeight = 260 + topInset;

  return (
    <View style={[styles.bannerContainer, { height: totalBannerHeight }]}>
      {/* 1. Full-Bleed Artwork Image */}
      <Image
        source={bannerSource}
        style={styles.bannerImage}
        resizeMode="cover"
      />

      {/* 2. Rich Dark Scrim / Vignette for pristine text readability */}
      <View style={[styles.gradientOverlay, { paddingTop: topInset + 6 }]}>
        {/* Top Header Row: Floating Frosted Back Button + Trail Category Badge */}
        <View style={styles.topActionRow}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.floatingBackBtn, pressed && styles.btnPressed]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back to previous screen"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.categoryPill}>
            <Ionicons name="map-outline" size={12} color="#FFFFFF" />
            <Text style={styles.categoryPillText}>FOOD QUEST</Text>
          </View>
        </View>

        {/* Bottom Editorial Content */}
        <View style={styles.bottomContent}>
          {/* Eyebrow District Kicker */}
          <View style={styles.kickerRow}>
            <Ionicons name="location-sharp" size={11} color="#FF6A4D" />
            <Text style={styles.kickerText}>
              NAGA CITY · {trail.district.toUpperCase()}
            </Text>
          </View>

          {/* Majestic Trail Title */}
          <Text style={styles.trailTitle} numberOfLines={2}>
            {trail.title}
          </Text>

          {/* Authentic Trail Story Tagline */}
          <Text style={styles.trailTagline} numberOfLines={2}>
            {trail.tagline}
          </Text>

          {/* Unified Refined Meta Strip */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={13} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.metaItemText}>{totalStopsCount} stops</Text>
            </View>
            <Text style={styles.metaBullet}>•</Text>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.metaItemText}>~{trail.estimatedMinutes} mins</Text>
            </View>
            <Text style={styles.metaBullet}>•</Text>
            <View style={styles.metaItem}>
              <Ionicons name="footsteps-outline" size={13} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.metaItemText}>{trail.difficulty} walk</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#1C1C1E',
    overflow: 'hidden',
  },
  bannerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.44)',
    paddingHorizontal: 16,
    paddingBottom: 32, // Gives room for the floating passport card overlay
    justifyContent: 'space-between',
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floatingBackBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  btnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  categoryPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  bottomContent: {
    width: '100%',
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  kickerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF6A4D',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  trailTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 30,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },
  trailTagline: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 18,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  metaBullet: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
