import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BrandColors, Spacing, BorderRadius } from '@/constants/theme';

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.badgePlaceholder} />
        <View style={styles.titlePlaceholder} />
        <View style={styles.subtitlePlaceholder} />
        <View style={styles.footerPlaceholder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: BrandColors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: BrandColors.borderSubtle,
    overflow: 'hidden',
    marginBottom: Spacing.three,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: BrandColors.surfaceSubtle,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  badgePlaceholder: {
    width: 80,
    height: 16,
    borderRadius: 4,
    backgroundColor: BrandColors.borderSubtle,
  },
  titlePlaceholder: {
    width: '70%',
    height: 20,
    borderRadius: 4,
    backgroundColor: BrandColors.borderSubtle,
  },
  subtitlePlaceholder: {
    width: '90%',
    height: 14,
    borderRadius: 4,
    backgroundColor: BrandColors.borderSubtle,
  },
  footerPlaceholder: {
    width: '40%',
    height: 14,
    borderRadius: 4,
    backgroundColor: BrandColors.borderSubtle,
    marginTop: 4,
  },
});
