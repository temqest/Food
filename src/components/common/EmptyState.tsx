import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors, Spacing, BorderRadius } from '@/constants/theme';

interface EmptyStateProps {
  icon?: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  suggestions?: { label: string; onSelect: () => void }[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search-outline',
  title,
  description,
  actionLabel,
  onAction,
  suggestions,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={BrandColors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {suggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try looking for:</Text>
          <View style={styles.suggestionsList}>
            {suggestions.map((item, idx) => (
              <Pressable
                key={idx}
                onPress={item.onSelect}
                style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}
              >
                <Text style={styles.suggestionText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: BrandColors.borderSubtle,
    marginVertical: Spacing.three,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BrandColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  description: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 360,
  },
  suggestionsContainer: {
    marginTop: Spacing.four,
    alignItems: 'center',
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textMuted,
    marginBottom: Spacing.two,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  suggestionChip: {
    backgroundColor: BrandColors.surfaceSubtle,
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: BrandColors.border,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
  actionButton: {
    marginTop: Spacing.four,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: Spacing.four,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  actionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
