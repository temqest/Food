import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';
import { NAGA_DISTRICTS_DATA } from '@/data/gamification';

export const DistrictProgressWidget: React.FC = () => {
  const { getDistrictProgress } = useQuest();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.mapPinCircle}>
            <Ionicons name="map" size={14} color="#D42F13" />
          </View>
          <View>
            <Text style={styles.title}>Naga District Conquest</Text>
            <Text style={styles.subtitle}>Log authentic spots across all 4 corridors</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/map')}
          hitSlop={8}
          style={({ pressed }) => [styles.seeAllBtn, pressed && styles.pressed]}
        >
          <Text style={styles.seeAllText}>Open Map ›</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {NAGA_DISTRICTS_DATA.map((district) => {
          const progress = getDistrictProgress(district.name);

          return (
            <Pressable
              key={district.id}
              onPress={() => {
                router.push({
                  pathname: '/search',
                  params: { q: district.name.split(' ')[0] },
                });
              }}
              style={({ pressed }) => [styles.districtCard, pressed && styles.cardPressed]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.districtIconCircle, { backgroundColor: `${district.accentColor}15` }]}>
                  <Ionicons name={district.icon as any} size={16} color={district.accentColor} />
                </View>
                <View style={[styles.percentPill, { backgroundColor: `${district.accentColor}18` }]}>
                  <Text style={[styles.percentText, { color: district.accentColor }]}>
                    {progress.percent}%
                  </Text>
                </View>
              </View>

              <Text style={styles.districtName} numberOfLines={1}>
                {district.title}
              </Text>
              <Text style={styles.districtTagline} numberOfLines={1}>
                {district.tagline}
              </Text>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress.percent}%`,
                      backgroundColor: district.accentColor,
                    },
                  ]}
                />
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.spotsCounter}>
                  {progress.visited} of {progress.total} spots logged
                </Text>
                <Ionicons name="chevron-forward" size={12} color="#C7C7CC" />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapPinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#8E8E93',
  },
  seeAllBtn: {
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
  },
  pressed: {
    opacity: 0.8,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  districtCard: {
    width: 175,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  districtIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '800',
  },
  districtName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  districtTagline: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 10,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spotsCounter: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
});
