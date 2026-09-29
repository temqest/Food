import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';

interface PillItem {
  id: string;
  type: 'pill' | 'icon';
  text?: string;
  emoji?: string;
  style?: 'blue' | 'dashed' | 'yellow';
}

const ROW_ONE_ITEMS: PillItem[] = [
  { id: '1-1', type: 'pill', text: 'Authentic spots', style: 'blue' },
  { id: '1-2', type: 'icon', emoji: '🍎', style: 'dashed' },
  { id: '1-3', type: 'pill', text: 'Steaming hot Kinalas', style: 'dashed' },
  { id: '1-4', type: 'icon', emoji: '🌶️', style: 'dashed' },
  { id: '1-5', type: 'pill', text: 'Traditional recipes', style: 'dashed' },
  { id: '1-6', type: 'icon', emoji: '🍲', style: 'dashed' },
  { id: '1-7', type: 'pill', text: 'Fiery sili', style: 'blue' },
];

const ROW_TWO_ITEMS: PillItem[] = [
  { id: '2-1', type: 'pill', text: 'Fresh Pinangat & Laing', style: 'dashed' },
  { id: '2-2', type: 'icon', emoji: '🥦', style: 'dashed' },
  { id: '2-3', type: 'pill', text: 'Support local spots', style: 'blue' },
  { id: '2-4', type: 'icon', emoji: '🥥', style: 'dashed' },
  { id: '2-5', type: 'pill', text: 'Pure coconut broth', style: 'dashed' },
  { id: '2-6', type: 'icon', emoji: '🥟', style: 'dashed' },
  { id: '2-7', type: 'pill', text: 'Toasted Siopao', style: 'yellow' },
];

const ROW_THREE_ITEMS: PillItem[] = [
  { id: '3-1', type: 'pill', text: 'Centro & Magsaysay', style: 'blue' },
  { id: '3-2', type: 'icon', emoji: '🥗', style: 'dashed' },
  { id: '3-3', type: 'pill', text: 'Rich brain gravy', style: 'dashed' },
  { id: '3-4', type: 'icon', emoji: '🍜', style: 'dashed' },
  { id: '3-5', type: 'pill', text: 'Sinanglay & Bicol Express', style: 'dashed' },
  { id: '3-6', type: 'icon', emoji: '🌿', style: 'dashed' },
];

function MarqueeRow({
  items,
  direction = 'left',
  duration = 26000,
}: {
  items: PillItem[];
  direction?: 'left' | 'right';
  duration?: number;
}) {
  const [animatedVal] = React.useState(() => new Animated.Value(0));

  useEffect(() => {
    animatedVal.setValue(0);
    const animation = Animated.loop(
      Animated.timing(animatedVal, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    animation.start();

    return () => animation.stop();
  }, [animatedVal, duration]);

  // Duplicate items array 3 times for a seamless infinite loop
  const displayItems = [...items, ...items, ...items];

  const translateX = animatedVal.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'left' ? [0, -420] : [-420, 0],
  });

  return (
    <View style={styles.marqueeRowContainer}>
      <Animated.View
        style={[
          styles.marqueeTrack,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {displayItems.map((item, idx) => {
          if (item.type === 'icon') {
            return (
              <View key={`${item.id}-${idx}`} style={[styles.pillIcon, styles.pillDashed]}>
                <Text style={styles.emojiText}>{item.emoji}</Text>
              </View>
            );
          }

          const isBlue = item.style === 'blue';
          const isYellow = item.style === 'yellow';

          return (
            <View
              key={`${item.id}-${idx}`}
              style={[
                styles.pill,
                styles.pillDashed,
                isBlue && styles.pillBlue,
                isYellow && styles.pillYellow,
              ]}
            >
              <Text style={styles.pillTextSerif}>{item.text}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.mainLayout}>
        {/* Top High-Impact Editorial Title */}
        <View style={styles.headerSection}>
          <Text style={styles.headingSans}>Let’s make</Text>
          <Text style={styles.headingSerif}>your days</Text>
          <Text style={styles.headingSans}>tastier</Text>

          <Text style={styles.subhead}>
            No Rushing. Only your feelings.
          </Text>
        </View>

        {/* Center Animated Moving Pill Cloud */}
        <View style={styles.pillCloudWrapper}>
          <MarqueeRow items={ROW_ONE_ITEMS} direction="left" duration={24000} />
          <MarqueeRow items={ROW_TWO_ITEMS} direction="right" duration={28000} />
          <MarqueeRow items={ROW_THREE_ITEMS} direction="left" duration={26000} />
        </View>

        {/* Bottom Actions (Comfortably placed in one-handed thumb zone) */}
        <View style={styles.actionsSection}>
          <Pressable
            onPress={() => router.push('/signup')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/login')}
            style={({ pressed }) => [styles.secondaryLink, pressed && styles.secondaryPressed]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="I Already Have an Account"
          >
            <Text style={styles.secondaryLinkText}>I Already Have an Account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
  default: 'Georgia',
});

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainLayout: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 94,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
  },

  // Header Area (Larger & More Impactful)
  headerSection: {
    maxWidth: 440,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 52,
    lineHeight: 56,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1.8,
    textAlign: 'center',
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 56,
    lineHeight: 60,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginVertical: -3,
  },
  subhead: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // Moving Pill Cloud (Centered gracefully closer to top text)
  pillCloudWrapper: {
    width: '100%',
    gap: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  marqueeRowContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  marqueeTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 2000,
  },

  // Pill Styles
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillDashed: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.45)',
    borderStyle: 'dashed',
  },
  pillBlue: {
    backgroundColor: 'rgba(186, 230, 253, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(14, 165, 233, 0.7)',
    borderStyle: 'dashed',
  },
  pillYellow: {
    backgroundColor: 'rgba(254, 215, 170, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(234, 88, 12, 0.7)',
    borderStyle: 'dashed',
  },
  pillIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  emojiText: {
    fontSize: 20,
  },
  pillTextSerif: {
    fontFamily: serifFamily,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    letterSpacing: -0.1,
  },

  // Bottom Actions (Easy one-handed thumb access)
  actionsSection: {
    maxWidth: 440,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  secondaryLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryLinkText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.2,
  },
  secondaryPressed: {
    opacity: 0.5,
  },
});
