import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { RecommendationModal } from '@/components/common/RecommendationModal';
import { NagaCompassWidget } from '@/components/gamification/NagaCompassWidget';
import { FoodTrailCard } from '@/components/gamification/FoodTrailCard';
import { CATEGORIES, FOOD_ITEMS } from '@/data/mockData';
import { FOOD_TRAILS } from '@/data/gamification';

export default function ExploreScreen() {
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Editorial Title */}
          <View style={styles.titleSection}>
            <Text style={styles.headingSans}>
              Naga Flavor <Text style={styles.headingSerif}>codex</Text>
            </Text>
            <Text style={styles.subheadText}>
              The official encyclopedia of Bicolano culinary heritage, guided food crawl routes, and dish lore.
            </Text>
          </View>

          {/* Section 1: Curated Food Crawl Expeditions */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="footsteps" size={16} color="#D42F13" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Food Crawl Expeditions</Text>
            </View>
            <Text style={styles.sectionMeta}>{FOOD_TRAILS.length} Routes</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trailsScroll}
          >
            {FOOD_TRAILS.map((trail) => (
              <FoodTrailCard key={trail.id} trail={trail} />
            ))}
          </ScrollView>

          {/* Section 2: Interactive Craving Compass */}
          <View style={styles.compassContainer}>
            <NagaCompassWidget />
          </View>

          {/* Section 3: Insider Food Lore & Trivia Card */}
          <View style={styles.loreCard}>
            <View style={styles.loreHeader}>
              <View style={styles.loreIconCircle}>
                <Ionicons name="book" size={14} color="#D42F13" />
              </View>
              <Text style={styles.loreTitle}>Bikolano Kitchen Customs</Text>
            </View>
            <Text style={styles.loreFact}>
              &ldquo;Kakang Gata&rdquo; (first press thick coconut cream) is never rushed over high heat. In authentic Naga cooking, the siling labuyo is bruised with the back of a spoon right before plating to release aromatics without scorching the gravy.
            </Text>
          </View>

          {/* Section 4: Culinary Chapters (Categories) */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="grid-outline" size={16} color="#D42F13" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Culinary Chapters</Text>
            </View>
            <Text style={styles.sectionMeta}>{CATEGORIES.length} Categories</Text>
          </View>

          {/* Inset Grouped Table of Categories */}
          <View style={styles.insetGroup}>
            {CATEGORIES.map((cat, index) => {
              const count = FOOD_ITEMS.filter((f) => f.category === cat.id).length;
              const isLast = index === CATEGORIES.length - 1;

              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    router.push({
                      pathname: '/search',
                      params: { category: cat.id },
                    });
                  }}
                  style={({ pressed }) => [
                    styles.categoryRow,
                    isLast && styles.categoryRowLast,
                    pressed && styles.rowPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${cat.label}, ${count} dishes`}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name={cat.icon as any}
                      size={20}
                      color="#D42F13"
                    />
                  </View>

                  <View style={[styles.rowContent, isLast && styles.rowContentLast]}>
                    <View style={styles.textColumn}>
                      <Text style={styles.categoryName}>{cat.label}</Text>
                      <Text style={styles.categoryDesc} numberOfLines={1}>
                        {cat.description}
                      </Text>
                    </View>

                    <View style={styles.trailingContainer}>
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{count} dishes</Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#C7C7CC"
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <NavBar currentTab="explore" />

      {/* Recommendation Roulette Modal */}
      <RecommendationModal
        visible={isRecommendationOpen}
        onClose={() => setIsRecommendationOpen(false)}
      />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 95,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  // Editorial Title
  titleSection: {
    paddingTop: Platform.OS === 'ios' ? 14 : 20,
    paddingBottom: 16,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.8,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 30,
    fontWeight: '400',
    color: '#D42F13',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.65)',
    marginTop: 4,
    lineHeight: 18,
  },

  // Trails section
  trailsScroll: {
    paddingBottom: 16,
  },

  // Compass section
  compassContainer: {
    marginBottom: 16,
  },

  // Lore Card
  loreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  loreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  loreIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loreTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  loreFact: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#3C3C43',
    lineHeight: 18,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sectionMeta: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },

  // Inset Group
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  categoryRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    paddingVertical: 2,
    paddingRight: 2,
  },
  rowContentLast: {
    borderBottomWidth: 0,
  },
  textColumn: {
    flex: 1,
    paddingRight: 8,
  },
  categoryName: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  categoryDesc: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
  },
  trailingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  countText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  rowPressed: {
    backgroundColor: 'rgba(60, 60, 67, 0.05)',
  },
});
