import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform, Keyboard, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOSTokens } from '@/constants/theme';

export type BusinessTab = 'orders' | 'menu' | 'posts' | 'promote' | 'store';

interface BusinessNavBarProps {
  currentTab: BusinessTab;
  onSelectTab: (tab: BusinessTab) => void;
  ordersBadgeCount?: number;
}

export const BusinessNavBar: React.FC<BusinessNavBarProps> = ({
  currentTab,
  onSelectTab,
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
      tab: 'posts' as BusinessTab,
      label: 'Posts',
      activeIcon: 'images' as const,
      inactiveIcon: 'images-outline' as const,
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
          const isFocused = currentTab === item.tab;

          return (
            <Pressable
              key={item.tab}
              onPress={() => onSelectTab(item.tab)}
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
                  style={item.tab === 'orders' ? styles.ordersIcon : undefined}
                />
                {item.badgeCount && item.badgeCount > 0 ? (
                  <View style={[styles.badge, isFocused && styles.badgeFocused]}>
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
    borderRadius: 21,
  },
  tabPressed: {
    opacity: 0.7,
  },
  ordersIcon: {
    transform: [{ translateY: -1.5 }, { translateX: -0.5 }],
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
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
  badgeFocused: {
    borderColor: '#1C1C1E',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});
