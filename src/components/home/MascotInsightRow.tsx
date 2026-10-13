import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';

interface SilitoDishTip {
  dishId: string;
  tagline: string;
  lore: string;
  actionText: string;
}

const WEEK_DAYS = [
  { day: 'M', height: 14, active: true },
  { day: 'T', height: 22, active: true },
  { day: 'W', height: 18, active: true },
  { day: 'T', height: 28, active: true },
  { day: 'F', height: 32, active: true },
  { day: 'S', height: 24, active: false },
  { day: 'S', height: 16, active: false },
];

export const MascotInsightRow: React.FC = () => {
  const { tastingLog } = useQuest();
  const [tipIndex, setTipIndex] = useState(0);
  const [spinAnim] = useState(() => new Animated.Value(0));

  const tips: SilitoDishTip[] = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      return [
        {
          dishId: 'kinalas',
          tagline: 'Morning Broth Run',
          lore: 'Cauldrons along Barlin are boiling fresh beef skull broth and warm brain gravy right now. Perfect breakfast for a Bikolano!',
          actionText: 'Taste Kinalas',
        },
        {
          dishId: 'toasted-siopao',
          tagline: 'Fresh Bakery Buns',
          lore: 'Pair fresh toasted siopao from Pan De Naga with rich native tablea chocolate to jumpstart your morning.',
          actionText: 'Explore Bakeries',
        },
      ];
    } else if (hour >= 11 && hour < 15) {
      return [
        {
          dishId: 'sinanglay',
          tagline: 'Fiery Lunch Feast',
          lore: 'Fresh tilapia wrapped in pechay and simmered in kakang gata with siling labuyo is peak lunch comfort in Naga.',
          actionText: 'Taste Sinanglay',
        },
        {
          dishId: 'bicol-express',
          tagline: 'Pure Gata Sili',
          lore: 'Simmered slow in pure coconut milk with pork belly scrapings and heirloom balaw shrimp paste.',
          actionText: 'Bicol Express Lore',
        },
      ];
    } else if (hour >= 15 && hour < 18) {
      return [
        {
          dishId: 'toasted-siopao',
          tagline: '4 PM Merienda Rush',
          lore: 'Baker’s Plaza ovens are bringing out piping hot toasted buns with golden crunchy crusts and savory pork filling.',
          actionText: 'Grab Merienda',
        },
        {
          dishId: 'pili-shake',
          tagline: 'Creamy Pili Chill',
          lore: 'Cool off with a decadent blended shake of freshly crushed roasted pili nuts and native cacao drizzle.',
          actionText: 'Pili Delights',
        },
      ];
    } else {
      return [
        {
          dishId: 'kinalas',
          tagline: 'Late Night Sabaw',
          lore: 'Nothing beats a midnight noodle bowl drenched in garlic chili oil along Bagumbayan after an active evening in Centro.',
          actionText: 'Where to Slurp',
        },
        {
          dishId: 'pancit-bato',
          tagline: 'Wok-Fried Noodles',
          lore: 'Smoky sun-dried noodles wok-fried with chicharon scrapings and native calamansi juice.',
          actionText: 'Pancit Bato Lore',
        },
      ];
    }
  }, []);

  const currentTip = tips[tipIndex % tips.length];

  const handleShuffle = () => {
    const isWeb = Platform.OS === 'web';
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: !isWeb,
    }).start(() => {
      spinAnim.setValue(0);
    });
    setTipIndex((prev) => prev + 1);
  };

  const handleDishLorePress = () => {
    if (currentTip.dishId) {
      router.push({
        pathname: '/food/[id]',
        params: { id: currentTip.dishId },
      });
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loggedDaysCount = Math.min(7, Math.max(3, tastingLog.length));

  return (
    <View style={styles.container}>
      {/* Left Card: Silito's Food Insight */}
      <Pressable
        onPress={handleDishLorePress}
        style={({ pressed }) => [styles.insightCard, pressed && styles.cardPressed]}
        accessibilityLabel={`Silito's food insight: ${currentTip.lore}`}
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.insightTag}>INSIGHT</Text>
            <Text style={styles.insightCategory} numberOfLines={1}>
              {currentTip.tagline}
            </Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              handleShuffle();
            }}
            style={styles.diceBtn}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Shuffle Silito's tip"
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="dice-outline" size={15} color="#8E8E93" />
            </Animated.View>
          </Pressable>
        </View>

        <Text style={styles.insightBodyText} numberOfLines={3}>
          {currentTip.lore}
        </Text>

        <View style={styles.actionRow}>
          <Text style={styles.actionText}>{currentTip.actionText}</Text>
          <Ionicons name="chevron-forward" size={12} color="#D42F13" style={{ marginLeft: 2 }} />
        </View>
      </Pressable>

      {/* Right Card: Daily Taste Pulse (Weekly Bar Chart) */}
      <Pressable
        onPress={() => router.push('/basket')}
        style={({ pressed }) => [styles.pulseCard, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel="Tasting pulse streak. View tasting passport"
      >
        <View style={styles.pulseHeaderRow}>
          <Text style={styles.pulseTag}>DAILY PULSE</Text>
          <Ionicons name="flame" size={13} color="#D42F13" />
        </View>

        {/* 7 Vertical Bars */}
        <View style={styles.chartContainer}>
          {WEEK_DAYS.map((item, idx) => (
            <View key={idx} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: item.height },
                    item.active ? styles.barActive : styles.barInactive,
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  item.active && styles.barLabelActive,
                ]}
              >
                {item.day}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.streakFooter}>
          <Text style={styles.streakText}>{loggedDaysCount} Day Streak 🔥</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
  },
  insightCard: {
    flex: 1.35,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  insightTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.8,
  },
  insightCategory: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.60)',
    fontWeight: '500',
    flex: 1,
  },
  diceBtn: {
    padding: 2,
  },
  insightBodyText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#1C1C1E',
    fontWeight: '400',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  pulseCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  pulseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pulseTag: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(60, 60, 67, 0.60)',
    letterSpacing: 0.8,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 44,
    paddingHorizontal: 2,
  },
  barCol: {
    alignItems: 'center',
    width: 11,
  },
  barTrack: {
    height: 34,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: 5,
    borderRadius: 3,
  },
  barActive: {
    backgroundColor: '#34C759',
  },
  barInactive: {
    backgroundColor: 'rgba(118, 118, 128, 0.18)',
  },
  barLabel: {
    fontSize: 9,
    color: 'rgba(60, 60, 67, 0.40)',
    fontWeight: '600',
    marginTop: 4,
  },
  barLabelActive: {
    color: '#000000',
    fontWeight: '700',
  },
  streakFooter: {
    marginTop: 6,
    alignItems: 'center',
  },
  streakText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34C759',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
