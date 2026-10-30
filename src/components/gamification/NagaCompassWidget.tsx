import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { DISH_INSIDER_TIPS } from '@/data/gamification';
import { resolveFoodImage } from '@/utils/imageHelper';

export const NagaCompassWidget: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<'any' | 'sabaw' | 'spicy' | 'merienda'>('any');
  const [spinResult, setSpinResult] = useState<{
    food: (typeof FOOD_ITEMS)[0];
    establishment: (typeof ESTABLISHMENTS)[0];
    tip?: string;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);

    setTimeout(() => {
      let pool = FOOD_ITEMS;
      if (selectedMood === 'sabaw') {
        pool = FOOD_ITEMS.filter((f) => f.category === 'heritage-soups');
      } else if (selectedMood === 'spicy') {
        pool = FOOD_ITEMS.filter((f) => f.category === 'gata-sili');
      } else if (selectedMood === 'merienda') {
        pool = FOOD_ITEMS.filter((f) => f.category === 'bakery-merienda');
      }

      const randomFood = pool[Math.floor(Math.random() * pool.length)] || FOOD_ITEMS[0];
      const matchEst =
        ESTABLISHMENTS.find((e) =>
          e.foodsOffered.some((item) => item.foodId === randomFood.id)
        ) || ESTABLISHMENTS[0];

      const tipObj = DISH_INSIDER_TIPS[randomFood.id];

      setSpinResult({
        food: randomFood,
        establishment: matchEst,
        tip: tipObj?.secretHack,
      });
      setIsSpinning(false);
    }, 400);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="compass" size={18} color="#D42F13" />
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.title}>Naga Craving Compass</Text>
          <Text style={styles.subtitle}>Spin for today&apos;s authentic local flavor</Text>
        </View>
      </View>

      {/* Mood Selectors */}
      <View style={styles.moodSelectorRow}>
        <Pressable
          onPress={() => setSelectedMood('any')}
          style={[styles.moodPill, selectedMood === 'any' && styles.moodPillActive]}
        >
          <Text style={[styles.moodPillText, selectedMood === 'any' && styles.moodPillTextActive]}>
            🎲 Surprise Me
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedMood('sabaw')}
          style={[styles.moodPill, selectedMood === 'sabaw' && styles.moodPillActive]}
        >
          <Text style={[styles.moodPillText, selectedMood === 'sabaw' && styles.moodPillTextActive]}>
            🍜 Sabaw Comfort
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedMood('spicy')}
          style={[styles.moodPill, selectedMood === 'spicy' && styles.moodPillActive]}
        >
          <Text style={[styles.moodPillText, selectedMood === 'spicy' && styles.moodPillTextActive]}>
            🌶️ Fiery Gata
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedMood('merienda')}
          style={[styles.moodPill, selectedMood === 'merienda' && styles.moodPillActive]}
        >
          <Text style={[styles.moodPillText, selectedMood === 'merienda' && styles.moodPillTextActive]}>
            🥟 Merienda
          </Text>
        </Pressable>
      </View>

      {/* Spin Button */}
      <Pressable
        onPress={handleSpin}
        disabled={isSpinning}
        style={({ pressed }) => [styles.spinButton, pressed && styles.spinButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Spin the craving compass"
      >
        <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
        <Text style={styles.spinButtonText}>
          {isSpinning ? 'Consulting Naga Food Lore...' : 'Spin the Compass'}
        </Text>
      </Pressable>

      {/* Spin Result Card */}
      {spinResult && (
        <View style={styles.resultBox}>
          <View style={styles.resultContentRow}>
            <Image source={resolveFoodImage(spinResult.food.image)} style={styles.resultThumb} />
            <View style={styles.resultInfo}>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>YOUR DESTINATION</Text>
              </View>
              <Text style={styles.resultFoodName}>{spinResult.food.name}</Text>
              <Text style={styles.resultEstName}>
                at <Text style={styles.resultEstBold}>{spinResult.establishment.name}</Text> ({spinResult.establishment.neighborhood})
              </Text>
              <Text style={styles.resultPrice}>{spinResult.food.priceRange}</Text>
            </View>
          </View>

          {spinResult.tip && (
            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={13} color="#D42F13" style={{ marginRight: 4 }} />
              <Text style={styles.tipText} numberOfLines={2}>
                <Text style={{ fontWeight: '700' }}>Insider Tip: </Text>
                {spinResult.tip}
              </Text>
            </View>
          )}

          <View style={styles.resultActions}>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/food/[id]',
                  params: { id: spinResult.food.id },
                });
              }}
              style={styles.viewDishBtn}
            >
              <Text style={styles.viewDishBtnText}>View Dish Lore ›</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/establishment/[id]',
                  params: { id: spinResult.establishment.id },
                });
              }}
              style={styles.viewPlaceBtn}
            >
              <Ionicons name="location-outline" size={14} color="#D42F13" style={{ marginRight: 4 }} />
              <Text style={styles.viewPlaceBtnText}>Directions</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
    marginTop: 1,
  },
  moodSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  moodPill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  moodPillActive: {
    backgroundColor: '#1C1C1E',
  },
  moodPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.80)',
  },
  moodPillTextActive: {
    color: '#FFFFFF',
  },
  spinButton: {
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  spinButtonPressed: {
    opacity: 0.88,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  resultContentRow: {
    flexDirection: 'row',
  },
  resultThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E5E5EA',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 3,
  },
  resultBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D42F13',
    letterSpacing: 0.4,
  },
  resultFoodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  resultEstName: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.70)',
    marginTop: 2,
  },
  resultEstBold: {
    fontWeight: '600',
    color: '#1C1C1E',
  },
  resultPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
    marginTop: 2,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9FB',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(60, 60, 67, 0.85)',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  viewDishBtn: {
    paddingVertical: 4,
  },
  viewDishBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
  },
  viewPlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  viewPlaceBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
  },
});
