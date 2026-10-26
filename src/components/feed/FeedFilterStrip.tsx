import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocialFeed, FeedFilterType } from '@/context/SocialFeedContext';

export const FeedFilterStrip: React.FC = () => {
  const { activeFilter, setActiveFilter } = useSocialFeed();

  const filterTabs: { id: FeedFilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'all', label: 'All Stories', icon: 'layers-outline' },
    { id: 'trips', label: 'Foodies & Trips', icon: 'map-outline' },
    { id: 'businesses', label: 'Verified Eateries', icon: 'restaurant-outline' },
    { id: 'trending', label: 'Trending', icon: 'flame-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveFilter(tab.id)}
              style={({ pressed }) => [
                styles.filterPill,
                isActive && styles.filterPillActive,
                pressed && styles.pressed,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={isActive ? '#FFFFFF' : '#8E8E93'}
              />
              <Text
                style={[
                  styles.filterLabel,
                  isActive && styles.filterLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 235, 0.9)',
  },
  filterPillActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
