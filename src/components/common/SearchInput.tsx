import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOSTokens } from '@/constants/theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onCancel?: () => void;
  isFocused?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Search dishes or places',
  onClear,
  autoFocus = false,
  onFilterPress,
  hasActiveFilters = false,
  onFocus,
  onBlur,
  onCancel,
  isFocused = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search"
          size={16}
          color={IOSTokens.colors.labelSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={IOSTokens.colors.labelSecondary}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {value.length > 0 && (
          <Pressable
            onPress={() => {
              onChangeText('');
              if (onClear) onClear();
            }}
            hitSlop={8}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Ionicons
              name="close-circle"
              size={16}
              color={IOSTokens.colors.labelSecondary}
            />
          </Pressable>
        )}

        {onFilterPress && !isFocused && (
          <Pressable
            onPress={onFilterPress}
            style={({ pressed }) => [styles.inlineFilterButton, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Filter options"
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={hasActiveFilters ? IOSTokens.colors.tint : IOSTokens.colors.labelSecondary}
            />
            {hasActiveFilters && <View style={styles.activeDot} />}
          </Pressable>
        )}
      </View>

      {isFocused && (
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOSTokens.colors.fill,
    borderRadius: IOSTokens.shape.field,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16, // At least 16px to prevent iOS Safari auto-zoom
    color: IOSTokens.colors.label,
    fontWeight: '400',
    paddingVertical: 0,
    height: '100%',
    outlineWidth: 0,
  } as any,
  clearButton: {
    padding: 2,
    marginLeft: 4,
  },
  inlineFilterButton: {
    padding: 4,
    marginLeft: 6,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: IOSTokens.colors.tint,
  },
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    minHeight: 36,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 17,
    color: IOSTokens.colors.tint,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  pressed: {
    opacity: 0.6,
  },
});
