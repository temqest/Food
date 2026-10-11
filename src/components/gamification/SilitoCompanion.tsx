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
import { useAuth } from '@/context/AuthContext';
import { useQuest } from '@/context/QuestContext';

interface SilitoTip {
  greeting: string;
  subGreeting: string;
  message: string;
  targetDishId: string;
  actionText: string;
  moodEmoji: string;
}

export const SilitoCompanion: React.FC = () => {
  const { user } = useAuth();
  const { currentRank } = useQuest();
  const userName = user?.name ? user.name.split(' ')[0] : 'Foodie';
  const [tipIndex, setTipIndex] = useState(0);

  const [bounceAnim] = useState(() => new Animated.Value(1));

  // Time-aware contextual recommendations
  const tips: SilitoTip[] = useMemo(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
      // Morning
      return [
        {
          greeting: `Marhay na aga, ${userName}! ☀️`,
          subGreeting: 'Early Morning Broth',
          message:
            'A steaming cauldron of fresh miki noodles and bone broth along Barlin is the true Bikolano start to the day.',
          targetDishId: 'kinalas',
          actionText: 'Find Morning Broths ›',
          moodEmoji: '🍜',
        },
        {
          greeting: `Gising na, ${userName}! ☕`,
          subGreeting: 'Native Breakfast',
          message:
            'Pair a warm cup of native tablea tsokolate with crunchy toasted buns for an authentic breakfast kick.',
          targetDishId: 'toasted-siopao',
          actionText: 'Explore Bakeries ›',
          moodEmoji: '🥟',
        },
      ];
    } else if (hour >= 11 && hour < 14) {
      // Lunch
      return [
        {
          greeting: `Marhay na aldaw, ${userName}! 🌶️`,
          subGreeting: 'Peak Kinalas Hour',
          message:
            'Cauldrons along Bagumbayan are at their richest right now! Don’t forget to ask for extra brain gravy and calamansi.',
          targetDishId: 'kinalas',
          actionText: 'Slurp Kinalas Now ›',
          moodEmoji: '🔥',
        },
        {
          greeting: `Gutoc ka na ba, ${userName}? 🥥`,
          subGreeting: 'Fiery Lunch Feast',
          message:
            'Sinanglay na Tilapia braised in freshly pressed kakang gata and wild labuyo will satisfy any serious lunch craving.',
          targetDishId: 'sinanglay',
          actionText: 'Taste Sinanglay ›',
          moodEmoji: '🐟',
        },
      ];
    } else if (hour >= 14 && hour < 17) {
      // Afternoon Merienda
      return [
        {
          greeting: `Marhay na hapon, ${userName}! 🥟`,
          subGreeting: '4 PM Merienda Rush',
          message:
            'Ovens at Pan De Naga and Baker’s Plaza are pulling out hot toasted siopao with golden, flaky crusts right now!',
          targetDishId: 'toasted-siopao',
          actionText: 'Grab Fresh Merienda ›',
          moodEmoji: '⭐',
        },
        {
          greeting: `Merienda time, ${userName}! 🌰`,
          subGreeting: 'Sweet Pili Craving',
          message:
            'Beat the afternoon heat with an ice-cold pili nut shake or glazed crispy mazapan confections.',
          targetDishId: 'crispy-pili',
          actionText: 'Sweet Treats ›',
          moodEmoji: '✨',
        },
      ];
    } else {
      // Evening / Night
      return [
        {
          greeting: `Marhay na banggi, ${userName}! 🍢`,
          subGreeting: 'Night Market Vibes',
          message:
            'Centro and Plaza Quezon are bustling with charcoal grills, spicy chicken isaw, and savory street merienda under the evening breeze.',
          targetDishId: 'kinalas',
          actionText: 'Explore Night Eats ›',
          moodEmoji: '🌙',
        },
        {
          greeting: `Chill evening, ${userName}! 🍲`,
          subGreeting: 'Late Night Sabaw',
          message:
            'Nothing beats a hot midnight broth seasoned with toasted garlic and chili oil to close out a long day in Naga.',
          targetDishId: 'kinalas',
          actionText: 'Where to Eat Tonight ›',
          moodEmoji: '🍜',
        },
      ];
    }
  }, [userName]);

  const currentTip = tips[tipIndex % tips.length];

  const handleShuffle = () => {
    const isWeb = Platform.OS === 'web';
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.15,
        duration: 100,
        useNativeDriver: !isWeb,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: !isWeb,
      }),
    ]).start();

    setTipIndex((prev) => prev + 1);
  };

  const handleAction = () => {
    if (currentTip.targetDishId) {
      router.push({
        pathname: '/food/[id]',
        params: { id: currentTip.targetDishId },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubbleCard}>
        {/* Left: Interactive Silito Mascot Avatar */}
        <Pressable
          onPress={handleShuffle}
          style={({ pressed }) => [styles.mascotAvatarWrapper, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityLabel="Silito the Bicol Chili Mascot. Tap to shuffle tip."
        >
          <Animated.View style={[styles.chiliGraphic, { transform: [{ scale: bounceAnim }] }]}>
            <View style={styles.chiliStem} />
            <View style={styles.chiliBody}>
              {/* Cute Mascot Eyes */}
              <View style={styles.eyesRow}>
                <View style={styles.eye} />
                <View style={styles.eye} />
              </View>
              {/* Happy Smile */}
              <View style={styles.smile} />
            </View>
          </Animated.View>
          <View style={styles.mascotBadgePill}>
            <Text style={styles.mascotBadgeText}>Silito</Text>
          </View>
        </Pressable>

        {/* Right: Conversational Content */}
        <View style={styles.bubbleContent}>
          <View style={styles.bubbleHeaderRow}>
            <View style={styles.greetingTitleRow}>
              <Text style={styles.greetingText}>{currentTip.greeting}</Text>
              <View style={styles.rankLevelMini}>
                <Text style={styles.rankLevelMiniText}>Lvl {currentRank.level}</Text>
              </View>
            </View>
            <Pressable onPress={handleShuffle} hitSlop={8} style={styles.shuffleIconBtn}>
              <Ionicons name="dice-outline" size={15} color="#8E8E93" />
            </Pressable>
          </View>

          <Text style={styles.subGreetingText}>{currentTip.subGreeting}</Text>
          <Text style={styles.messageText}>{currentTip.message}</Text>

          {/* Quick Action Link */}
          <View style={styles.actionsFooter}>
            <Pressable
              onPress={handleAction}
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              hitSlop={6}
            >
              <Text style={styles.actionButtonText}>{currentTip.actionText}</Text>
              <Ionicons name="arrow-forward" size={12} color="#D42F13" style={{ marginLeft: 3 }} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
  },
  bubbleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5EA',
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
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  mascotAvatarWrapper: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 2,
  },
  chiliGraphic: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chiliStem: {
    width: 6,
    height: 7,
    backgroundColor: '#34C759',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: -1,
  },
  chiliBody: {
    width: 32,
    height: 38,
    backgroundColor: '#D42F13',
    borderRadius: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 8,
    transform: [{ rotate: '-8deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  eyesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  eye: {
    width: 4,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  smile: {
    width: 8,
    height: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  mascotBadgePill: {
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.2)',
  },
  mascotBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D42F13',
  },
  bubbleContent: {
    flex: 1,
  },
  bubbleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  rankLevelMini: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
  },
  rankLevelMiniText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFD60A',
  },
  shuffleIconBtn: {
    padding: 3,
  },
  subGreetingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D42F13',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 12,
    color: '#3C3C43',
    lineHeight: 17,
    marginBottom: 8,
  },
  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  pressed: {
    opacity: 0.8,
  },
});
