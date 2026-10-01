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
import { FoodCard } from '@/components/food/FoodCard';
import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { useSaved } from '@/context/SavedContext';

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<'dishes' | 'places'>('dishes');
  const { savedFoods, savedEstablishments, clearAllSaved } = useSaved();

  const totalSaved = savedFoods.length + savedEstablishments.length;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Top Bar with Editorial Title & Clear Action */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.headingSans}>
                Saved <Text style={styles.headingSerif}>favorites</Text>
              </Text>
              {totalSaved > 0 && (
                <Pressable
                  onPress={clearAllSaved}
                  style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Clear all saved items"
                >
                  <Text style={styles.clearText}>Clear All</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.subheadText}>
              Your curated collection of Naga delicacies and favorite local eateries.
            </Text>
          </View>

          {/* Sleek Segmented Control */}
          <View style={styles.segmentWrapper}>
            <View style={styles.segmentContainer}>
              <Pressable
                onPress={() => setActiveTab('dishes')}
                style={[
                  styles.segmentTab,
                  activeTab === 'dishes' && styles.segmentTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    activeTab === 'dishes' && styles.segmentLabelActive,
                  ]}
                >
                  Dishes ({savedFoods.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('places')}
                style={[
                  styles.segmentTab,
                  activeTab === 'places' && styles.segmentTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    activeTab === 'places' && styles.segmentLabelActive,
                  ]}
                >
                  Places ({savedEstablishments.length})
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Content Lists */}
          {activeTab === 'dishes' ? (
            savedFoods.length > 0 ? (
              <View style={styles.insetGroup}>
                {savedFoods.map((food) => (
                  <FoodCard key={food.id} food={food} layout="row" />
                ))}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons
                    name="bookmark-outline"
                    size={36}
                    color="#8E8E93"
                  />
                </View>
                <Text style={styles.emptyTitle}>No Saved Dishes Yet</Text>
                <Text style={styles.emptyDesc}>
                  Tap the bookmark icon on any dish to save it to your personalized Naga tasting list.
                </Text>
                <Pressable
                  onPress={() => router.push('/')}
                  style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.primaryPressed]}
                >
                  <Text style={styles.emptyActionText}>Explore Dishes</Text>
                </Pressable>
              </View>
            )
          ) : savedEstablishments.length > 0 ? (
            <View style={styles.insetGroup}>
              {savedEstablishments.map((est, index) => (
                <EstablishmentCard
                  key={est.id}
                  establishment={est}
                  layout="row"
                  isFirst={index === 0}
                  isLast={index === savedEstablishments.length - 1}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="storefront-outline"
                  size={36}
                  color="#8E8E93"
                />
              </View>
              <Text style={styles.emptyTitle}>No Saved Places Yet</Text>
              <Text style={styles.emptyDesc}>
                Bookmark carinderias, heritage dining spots, and bakeries in Naga to plan your food trip.
              </Text>
              <Pressable
                onPress={() => router.push('/')}
                style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.primaryPressed]}
              >
                <Text style={styles.emptyActionText}>Discover Places</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      <NavBar currentTab="saved" />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#D42F13',
    fontWeight: '600',
  },

  // Segmented Control
  segmentWrapper: {
    marginBottom: 18,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 12,
    padding: 3,
    height: 40,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  segmentLabel: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  segmentLabelActive: {
    fontWeight: '700',
    color: '#000000',
  },

  // Grouped List
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
    marginBottom: 20,
  },
  emptyActionBtn: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActionText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  pressed: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
