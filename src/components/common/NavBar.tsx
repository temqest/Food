import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { IOSTokens } from '@/constants/theme';
import { useBasket } from '@/context/BasketContext';

export type NavTab = 'home' | 'search' | 'map' | 'saved' | 'explore' | 'basket';

interface NavBarProps {
  currentTab?: NavTab;
}

export const NavBar: React.FC<NavBarProps> = ({ currentTab }) => {
  const pathname = usePathname();
  const { getBasketCount } = useBasket();
  const basketCount = getBasketCount();

  const determineTab = (): NavTab => {
    if (currentTab) return currentTab;
    if (pathname === '/' || pathname === '/index') return 'home';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/map')) return 'map';
    if (pathname.startsWith('/saved')) return 'saved';
    if (pathname.startsWith('/basket')) return 'basket';
    if (pathname.startsWith('/explore')) return 'explore';
    return 'home';
  };

  const active = determineTab();

  const navItems = [
    {
      tab: 'home' as NavTab,
      label: 'Home',
      route: '/',
      activeIcon: 'home' as const,
      inactiveIcon: 'home-outline' as const,
    },
    {
      tab: 'explore' as NavTab,
      label: 'Categories',
      route: '/explore',
      activeIcon: 'grid' as const,
      inactiveIcon: 'grid-outline' as const,
    },
    {
      tab: 'map' as NavTab,
      label: 'Map',
      route: '/map',
      activeIcon: 'map' as const,
      inactiveIcon: 'map-outline' as const,
      isCenter: true,
    },
    {
      tab: 'basket' as NavTab,
      label: 'Basket',
      route: '/basket',
      activeIcon: 'bag-handle' as const,
      inactiveIcon: 'bag-handle-outline' as const,
      badgeCount: basketCount,
    },
    {
      tab: 'saved' as NavTab,
      label: 'Saved',
      route: '/saved',
      activeIcon: 'heart' as const,
      inactiveIcon: 'heart-outline' as const,
    },
  ];

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={styles.pillContainer}>
        {navItems.map((item) => {
          const isFocused = active === item.tab;

          if (item.isCenter) {
            return (
              <Pressable
                key={item.tab}
                onPress={() => {
                  if (pathname !== item.route) {
                    router.push(item.route as any);
                  }
                }}
                style={({ pressed }) => [
                  styles.centerButton,
                  isFocused && styles.centerButtonActive,
                  pressed && styles.centerButtonPressed,
                ]}
                hitSlop={8}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={item.label}
              >
                <Ionicons
                  name={isFocused ? item.activeIcon : item.inactiveIcon}
                  size={26}
                  color="#FFFFFF"
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={item.tab}
              onPress={() => {
                if (pathname !== item.route) {
                  router.push(item.route as any);
                }
              }}
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
  centerButtonActive: {
    transform: [{ scale: 1.05 }],
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

