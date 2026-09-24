import React from 'react';
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
import { CATEGORIES, FOOD_ITEMS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';

export default function ExploreScreen() {

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* iOS Large Title */}
          <View style={styles.titleSection}>
            <Text style={styles.largeTitle}>Categories</Text>
          </View>

          {/* iOS Inset Grouped Table of Categories */}
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
                      color={IOSTokens.colors.tint}
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
                      <Text style={styles.countText}>{count}</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={IOSTokens.colors.labelTertiary}
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
  titleSection: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  largeTitle: {
    ...IOSTokens.typography.largeTitle,
    color: IOSTokens.colors.label,
  },
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    minHeight: 64,
  },
  categoryRowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: IOSTokens.colors.tintSoft,
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
    borderBottomColor: IOSTokens.colors.separator,
  },
  rowContentLast: {
    borderBottomWidth: 0,
  },
  textColumn: {
    flex: 1,
    marginRight: 8,
  },
  categoryName: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  categoryDesc: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  trailingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },
});
