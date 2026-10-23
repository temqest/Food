import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CodexHeroHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CodexHeroHeader: React.FC<CodexHeroHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.largeTitle}>Flavor Codex</Text>
      <Text style={styles.subheadText}>
        Traditional Bicolano dishes, ingredients, and heritage lore.
      </Text>

      {/* iOS-native Search Field */}
      <View style={styles.searchFieldWrapper}>
        <Ionicons name="search" size={17} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search dishes, ingredients, or places..."
          placeholderTextColor="#8E8E93"
          style={styles.searchInput}
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && Platform.OS !== 'ios' && (
          <Pressable
            onPress={() => onSearchChange('')}
            style={styles.clearButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={16} color="#8E8E93" />
          </Pressable>
        )}
      </View>
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
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 10,
  },
  largeTitle: {
    fontFamily: sansFamily,
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.8,
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.65)',
    marginTop: 2,
    marginBottom: 12,
  },
  searchFieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#000000',
    paddingVertical: 0,
    ...Platform.select({
      web: { outlineStyle: 'none' } as any,
    }),
  },
  clearButton: {
    padding: 2,
  },
});
