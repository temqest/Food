import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { IOSTokens } from '@/constants/theme';

export type NavTab = 'home' | 'explore' | 'map' | 'saved';

interface NavBarProps {
  currentTab?: NavTab;
}

export const NavBar: React.FC<NavBarProps> = ({ currentTab }) => {
  const pathname = usePathname();

  const determineTab = (): NavTab => {
    if (currentTab) return currentTab;
    if (pathname === '/' || pathname === '/index') return 'home';
    if (pathname.startsWith('/explore')) return 'explore';
    if (pathname.startsWith('/map')) return 'map';
    if (pathname.startsWith('/saved')) return 'saved';
    return 'home';
  };

  const active = determineTab();

  const navItems = [
    {
      tab: 'home' as NavTab,
      label: 'Discover',
      route: '/',
      activeIcon: 'compass' as const,
      inactiveIcon: 'compass-outline' as const,
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
    },
    {
      tab: 'saved' as NavTab,
      label: 'Saved',
      route: '/saved',
      activeIcon: 'bookmark' as const,
      inactiveIcon: 'bookmark-outline' as const,
    },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {navItems.map((item) => {
          const isFocused = active === item.tab;
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
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={isFocused ? item.activeIcon : item.inactiveIcon}
                  size={24}
                  color={isFocused ? IOSTokens.colors.tint : IOSTokens.colors.inactive}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelFocused : styles.tabLabelUnfocused,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: IOSTokens.colors.barBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: IOSTokens.colors.separator,
    width: '100%',
    zIndex: 100,
    ...Platform.select({
      web: {
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      } as any,
      default: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
    }),
  },
  container: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 49,
    paddingBottom: Platform.OS === 'ios' ? 0 : 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 49,
    paddingVertical: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
    width: 26,
  },
  tabLabel: {
    ...IOSTokens.typography.tabLabel,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: IOSTokens.colors.tint,
  },
  tabLabelUnfocused: {
    color: IOSTokens.colors.inactive,
  },
  tabPressed: {
    opacity: 0.6,
  },
});
