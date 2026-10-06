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
import { CATEGORIES, FOOD_ITEMS } from '@/data/mockData';
import { useBusiness } from '@/context/BusinessContext';

export default function ExploreScreen() {
  const { activePromotion, profile } = useBusiness();
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
              Explore <Text style={styles.headingSerif}>categories</Text>
            </Text>
            <Text style={styles.subheadText}>
              Curated regional specialties and culinary heritage across Naga City.
            </Text>
          </View>

          {/* Active Merchant Promotion Spotlight */}
          {activePromotion && (
            <Pressable
              onPress={() => {
                if (activePromotion.featuredFoodId) {
                  router.push({
                    pathname: '/food/[id]',
                    params: { id: activePromotion.featuredFoodId },
                  });
                } else {
                  router.push({
                    pathname: '/establishment/[id]',
                    params: { id: activePromotion.establishmentId },
                  });
                }
              }}
              style={({ pressed }) => [styles.promoHighlightCard, pressed && styles.cardPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Promotion from ${profile.name}: ${activePromotion.title}`}
            >
              <View style={styles.promoHighlightTop}>
                <View style={styles.promoHighlightBadge}>
                  <Ionicons name="megaphone" size={11} color="#FFFFFF" />
                  <Text style={styles.promoHighlightBadgeText}>{activePromotion.badgeText}</Text>
                </View>
                <Text style={styles.promoHighlightStore}>{profile.name}</Text>
              </View>

              <Text style={styles.promoHighlightTitle}>{activePromotion.title}</Text>
              <Text style={styles.promoHighlightDesc}>{activePromotion.description}</Text>

              <View style={styles.promoHighlightFooter}>
                <View style={styles.promoHighlightDistrict}>
                  <Ionicons name="location-sharp" size={12} color="#D42F13" />
                  <Text style={styles.promoHighlightDistrictText}>{activePromotion.targetDistrict}</Text>
                </View>
                <View style={styles.promoHighlightAction}>
                  <Text style={styles.promoHighlightActionText}>Order Now ›</Text>
                </View>
              </View>
            </Pressable>
          )}

          {/* Featured Highlight Banner */}
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/search',
                params: { category: 'heritage-soups' },
              });
            }}
            style={({ pressed }) => [styles.featureCard, pressed && styles.cardPressed]}
          >
            <View style={styles.featureCardContent}>
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>NAGA SIGNATURE</Text>
              </View>
              <Text style={styles.featureTitle}>🍜 Kinalas & Heritage Soups</Text>
              <Text style={styles.featureDesc}>
                Rich savory brain gravy, fall-off-the-bone beef head meat, and springy noodles.
              </Text>
            </View>
            <View style={styles.featureArrowCircle}>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Try Something New Interactive Action */}
          <Pressable
            onPress={() => setIsRecommendationOpen(true)}
            style={({ pressed }) => [styles.tryNewExploreCard, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel="Spin for a random foodie recommendation"
          >
            <View style={styles.tryNewExploreLeft}>
              <View style={styles.tryNewSparkleCircle}>
                <Ionicons name="dice" size={18} color="#D42F13" />
              </View>
              <View style={styles.tryNewTextWrap}>
                <Text style={styles.tryNewExploreTitle}>Can&apos;t pick a category?</Text>
                <Text style={styles.tryNewExploreSubtitle}>
                  Let Foodie Roulette recommend your next meal.
                </Text>
              </View>
            </View>
            <View style={styles.tryNewExplorePill}>
              <Text style={styles.tryNewExplorePillText}>Surprise Me</Text>
              <Ionicons name="sparkles" size={12} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Food Categories</Text>
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
                      color="#000000"
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
  },
  titleSection: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 34,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 20,
  },

  // Featured Highlight Banner
  featureCard: {
    backgroundColor: '#111111',
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureCardContent: {
    flex: 1,
    paddingRight: 12,
  },
  featureBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D42F13',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    marginBottom: 8,
  },
  featureBadgeText: {
    fontFamily: sansFamily,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  featureTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  featureDesc: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    lineHeight: 16,
  },
  featureArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Try New Explore Card
  tryNewExploreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.15)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(212, 47, 19, 0.08)',
      } as any,
      default: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
      },
    }),
  },
  tryNewExploreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    paddingRight: 8,
  },
  tryNewSparkleCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryNewTextWrap: {
    flex: 1,
  },
  tryNewExploreTitle: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  tryNewExploreSubtitle: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  tryNewExplorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
    flexShrink: 0,
  },
  tryNewExplorePillText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sectionMeta: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Inset Group
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    minHeight: 68,
  },
  categoryRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  rowContentLast: {
    borderBottomWidth: 0,
  },
  textColumn: {
    flex: 1,
    marginRight: 8,
  },
  categoryName: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.2,
  },
  categoryDesc: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  trailingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  countText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6E73',
  },

  // Merchant Promo Highlight Card
  promoHighlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
  },
  promoHighlightTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promoHighlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  promoHighlightBadgeText: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  promoHighlightStore: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  promoHighlightTitle: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  promoHighlightDesc: {
    fontFamily: sansFamily,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.75)',
    marginBottom: 12,
  },
  promoHighlightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
  },
  promoHighlightDistrict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  promoHighlightDistrictText: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#D42F13',
    fontWeight: '500',
  },
  promoHighlightAction: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  promoHighlightActionText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});
