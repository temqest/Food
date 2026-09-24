import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { FoodCard } from '@/components/food/FoodCard';
import { EstablishmentCard } from '@/components/establishment/EstablishmentCard';
import { useSaved } from '@/context/SavedContext';
import { IOSTokens } from '@/constants/theme';

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<'dishes' | 'places'>('dishes');
  const { savedFoods, savedEstablishments, clearAllSaved } = useSaved();

  const totalSaved = savedFoods.length + savedEstablishments.length;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* iOS Top Bar with Large Title and Clear action */}
          <View style={styles.headerRow}>
            <Text style={styles.largeTitle}>Saved</Text>
            {totalSaved > 0 && (
              <Pressable
                onPress={clearAllSaved}
                style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Text style={styles.clearText}>Clear All</Text>
              </Pressable>
            )}
          </View>

          {/* iOS Segmented Control */}
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
                <Ionicons
                  name="bookmark-outline"
                  size={48}
                  color={IOSTokens.colors.labelTertiary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No Saved Dishes</Text>
                <Text style={styles.emptyDesc}>
                  Tap the bookmark on any dish to save it to your list.
                </Text>
                <Pressable
                  onPress={() => router.push('/')}
                  style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.pressed]}
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
              <Ionicons
                name="storefront-outline"
                size={48}
                color={IOSTokens.colors.labelTertiary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No Saved Places</Text>
              <Text style={styles.emptyDesc}>
                Bookmark restaurants and carinderias in Naga to plan your visit.
              </Text>
              <Pressable
                onPress={() => router.push('/')}
                style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.pressed]}
              >
                <Text style={styles.emptyActionText}>Find Places</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      <NavBar currentTab="saved" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: IOSTokens.colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: IOSTokens.spacing.margin,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
  },
  largeTitle: {
    ...IOSTokens.typography.largeTitle,
    color: IOSTokens.colors.label,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  clearText: {
    fontSize: 15,
    color: IOSTokens.colors.tint,
    fontWeight: '400',
  },

  // iOS Segmented Control
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: IOSTokens.colors.fill,
    borderRadius: 8,
    padding: 2,
    marginBottom: 20,
    height: 32,
  },
  segmentTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  segmentTabActive: {
    backgroundColor: IOSTokens.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: IOSTokens.colors.labelSecondary,
  },
  segmentLabelActive: {
    fontWeight: '600',
    color: IOSTokens.colors.label,
  },

  // Group
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
    marginBottom: 4,
  },
  emptyDesc: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 20,
  },
  emptyActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  emptyActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },

  pressed: {
    opacity: 0.6,
  },
});
