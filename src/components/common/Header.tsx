import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { IOSTokens } from '@/constants/theme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onLocationPress?: () => void;
  locationName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  rightAction,
  onLocationPress,
  locationName = 'Naga City',
}) => {
  // If sub-screen with back navigation (iOS Navigation Bar pattern)
  if (showBack) {
    return (
      <View style={styles.navBarOuter}>
        <View style={styles.navBarContainer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={IOSTokens.colors.tint} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.navBarCenter}>
            {title && (
              <Text style={styles.navBarTitle} numberOfLines={1}>
                {title}
              </Text>
            )}
          </View>

          <View style={styles.navBarRight}>
            {rightAction}
          </View>
        </View>
      </View>
    );
  }

  // Root or section top bar: Location selector on left, right action on right
  return (
    <View style={styles.rootTopOuter}>
      <View style={styles.rootTopContainer}>
        <Pressable
          onPress={onLocationPress}
          style={({ pressed }) => [styles.locationButton, pressed && styles.buttonPressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Selected location: ${locationName}`}
        >
          <Text style={styles.locationText}>{locationName}</Text>
          <Ionicons name="chevron-down" size={14} color={IOSTokens.colors.tint} style={styles.chevronIcon} />
        </Pressable>

        <View style={styles.rootTopRight}>
          {rightAction}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBarOuter: {
    backgroundColor: IOSTokens.colors.barBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
    width: '100%',
    zIndex: 30,
    ...Platform.select({
      web: {
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        position: 'sticky',
        top: 0,
      } as any,
    }),
  },
  navBarContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: IOSTokens.spacing.margin,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 44,
    minWidth: 44,
  },
  backButtonText: {
    fontSize: 17,
    color: IOSTokens.colors.tint,
    fontWeight: '400',
    marginLeft: -2,
    letterSpacing: -0.41,
  },
  navBarCenter: {
    position: 'absolute',
    left: 72,
    right: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarTitle: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
    textAlign: 'center',
  },
  navBarRight: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rootTopOuter: {
    backgroundColor: IOSTokens.colors.bg,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: 2,
    zIndex: 20,
  },
  rootTopContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: IOSTokens.spacing.margin,
    minHeight: 36,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 8,
    minHeight: 44,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
    letterSpacing: -0.24,
  },
  chevronIcon: {
    marginLeft: 3,
    marginTop: 1,
  },
  rootTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
