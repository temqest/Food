import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  View,
  Platform,
} from 'react-native';
import { CATEGORIES } from '@/data/mockData';

interface CodexFilterBarProps {
  selectedCategory: string; // 'all' or category.id
  onSelectCategory: (categoryId: string) => void;
}

export const CodexFilterBar: React.FC<CodexFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categoriesList = [
    { id: 'all', label: 'All' },
    { id: 'heritage-soups', label: 'Soups & Broths' },
    { id: 'gata-sili', label: 'Gata & Sili' },
    { id: 'pili-delicacies', label: 'Pili Sweets' },
    { id: 'bakery-merienda', label: 'Merienda' },
    { id: 'street-grill', label: 'Night Grills' },
    { id: 'coolers-beverages', label: 'Coolers' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              style={({ pressed }) => [
                styles.pill,
                isSelected && styles.pillSelected,
                pressed && styles.pillPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={cat.label}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  pillSelected: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.85)',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
