import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useQuest } from '@/context/QuestContext';
import { useNotifications } from '@/context/NotificationContext';
import { NagaQuestCarousel } from './NagaQuestCarousel';

export interface MascotHeroProps {
  children?: React.ReactNode;
}

export const MascotHero: React.FC<MascotHeroProps> = ({ children }) => {
  const { user } = useAuth();
  const { streakCount } = useQuest();
  const { unreadCount } = useNotifications();

  const displayName = user?.name ? user.name.split(' ')[0] : 'Bryl';

  // Time-of-day greeting (Good morning, Good afternoon, Good evening)
  const greetingTimeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Format date header: e.g. "WEDNESDAY, SEPTEMBER 16"
  const todayFormatted = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).toUpperCase();
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Top Bar: Streak Circle on Left + Utils Navbar Pill on Right */}
      <View style={styles.topBarRow}>
        {/* Left: Streak Circle Button with Counter Badge */}
        <Pressable
          onPress={() => router.push('/streak')}
          style={({ pressed }) => [styles.streakCircleBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Tasting Streak: ${streakCount} days active`}
        >
          <Ionicons name="flame" size={21} color="#FF6A00" />
          <View style={styles.streakBadge}>
            <Text style={styles.streakBadgeText}>{streakCount}</Text>
          </View>
        </Pressable>

        {/* Right: Rounded Utils Navbar Pill (Bell, People/Map, Settings/Profile) */}
        <View style={styles.utilsNavbar}>
          <Pressable
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [styles.utilIconBtn, pressed && styles.pressed]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Ionicons name="notifications-outline" size={19} color="#1C1C1E" />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push('/map')}
            style={({ pressed }) => [styles.utilIconBtn, pressed && styles.pressed]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Explore map and spots"
          >
            <Ionicons name="people-outline" size={20} color="#1C1C1E" />
          </Pressable>

          <Pressable
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [styles.utilIconBtn, pressed && styles.pressed]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Settings and profile"
          >
            <Ionicons name="settings-outline" size={19} color="#1C1C1E" />
          </Pressable>
        </View>
      </View>

      {/* 2. Personalized Greeting Row: Date + "Good evening, Bryl!" */}
      <View style={styles.greetingSection}>
        <Text style={styles.dateHeader}>{todayFormatted}</Text>
        <Text style={styles.greetingTitle}>
          {greetingTimeOfDay}, <Text style={styles.greetingName}>{displayName}!</Text>
        </Text>
      </View>

      {/* 3. Naga Quest Infinite Postcard Carousel (Replaces former static mascot box) */}
      <View style={styles.carouselContainer}>
        {children || <NagaQuestCarousel />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 2,
  },
  /* Top Bar Row */
  topBarRow: {
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  streakBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF6A00',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  streakBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  utilsNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    gap: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  utilIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: '#D32F2F',
    minWidth: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  notifBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 11,
  },

  /* Greeting Section */
  greetingSection: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  dateHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.50)',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  greetingTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.4,
  },
  greetingName: {
    fontWeight: '800',
    color: '#000000',
  },

  /* Carousel Container replacing old mascot box */
  carouselContainer: {
    paddingTop: 2,
    paddingBottom: 4,
  },
  pressed: {
    opacity: 0.75,
  },
});
