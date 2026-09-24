import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors, Spacing, BorderRadius } from '@/constants/theme';

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: any;
  count?: number;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  active,
  onPress,
  icon,
  count,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        active ? styles.pillActive : styles.pillInactive,
        pressed && styles.pressed,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={active ? '#FFFFFF' : BrandColors.textSecondary}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>
        {label}
      </Text>
      {count !== undefined && (
        <View style={[styles.countBadge, active ? styles.countBadgeActive : styles.countBadgeInactive]}>
          <Text style={[styles.countText, active ? styles.countTextActive : styles.countTextInactive]}>
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: Spacing.three,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.two,
  },
  pillActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  pillInactive: {
    backgroundColor: BrandColors.surface,
    borderColor: BrandColors.border,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: BrandColors.textPrimary,
  },
  icon: {
    marginRight: 6,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countBadgeInactive: {
    backgroundColor: BrandColors.surfaceSubtle,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  countTextInactive: {
    color: BrandColors.textSecondary,
  },
  pressed: {
    opacity: 0.8,
  },
});
