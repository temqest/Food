import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform, Keyboard, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOSTokens } from '@/constants/theme';

export type BusinessTab = 'orders' | 'menu' | 'promote' | 'store';

interface BusinessNavBarProps {
  currentTab: BusinessTab;
  onSelectTab: (tab: BusinessTab) => void;
  onCenterPress: () => void;
  ordersBadgeCount?: number;
}

export const BusinessNavBar: React.FC<BusinessNavBarProps> = ({
  currentTab,
  onSelectTab,
  onCenterPress,
  ordersBadgeCount = 0,
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  const navItems = [
    {
      tab: 'orders' as BusinessTab,
      label: 'Orders',
      activeIcon: 'receipt' as const,
      inactiveIcon: 'receipt-outline' as const,
      badgeCount: ordersBadgeCount,
    },
    {
      tab: 'menu' as BusinessTab,
      label: 'Menu',
      activeIcon: 'restaurant' as const,
      inactiveIcon: 'restaurant-outline' as const,
    },
    {
      tab: 'center' as const,
      label: 'Add',
      isCenter: true,
      activeIcon: 'add' as const,
      inactiveIcon: 'add' as const,
    },
    {
      tab: 'promote' as BusinessTab,
      label: 'Promote',
      activeIcon: 'megaphone' as const,
      inactiveIcon: 'megaphone-outline' as const,
    },
    {
      tab: 'store' as BusinessTab,
      label: 'Store',
      activeIcon: 'storefront' as const,
      inactiveIcon: 'storefront-outline' as const,
    },
  ];

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={styles.pillContainer}>
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <Pressable
                key="center-add-btn"
                onPress={onCenterPress}
                style={({ pressed }) => [
                  styles.centerButton,
                  pressed && styles.centerButtonPressed,
                ]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Add New Dish"
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </Pressable>
            );
          }

          const isFocused = currentTab === item.tab;

          return (
            <Pressable
              key={item.tab}
              onPress={() => onSelectTab(item.tab as BusinessTab)}
              style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
              hitSlop={8}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={item.label}
            >
              <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
                <Ionicons
                  name={isFocused ? item.activeIcon : item.inactiveIcon}
                  size={22}
                  color={isFocused ? '#FFFFFF' : '#8E8E93'}
                />
                {item.badgeCount && item.badgeCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badgeCount}</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  pillContainer: {
    width: '100%',
    maxWidth: 400,
    height: 62,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 235, 0.8)',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerFocused: {
    backgroundColor: '#1C1C1E',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: IOSTokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 20px rgba(214, 47, 19, 0.35)',
      } as any,
      default: {
        shadowColor: IOSTokens.colors.tint,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  centerButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  tabPressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: IOSTokens.colors.tint,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});
