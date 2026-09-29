import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

type SpiceLevel = 'mild' | 'moderate' | 'fiery';

interface DistrictOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const DISTRICT_OPTIONS: DistrictOption[] = [
  {
    id: 'Centro',
    name: 'Centro & Plaza Quezon',
    badge: 'Heritage & Kinalas',
    description: 'Iconic heritage eateries, noodle joints & downtown street food.',
    icon: 'storefront-outline',
  },
  {
    id: 'Magsaysay',
    name: 'Magsaysay Avenue',
    badge: 'Cafes & Bistro Strip',
    description: 'Modern dining, third-wave cafes, nightlife & evening spots.',
    icon: 'cafe-outline',
  },
  {
    id: 'Penafrancia',
    name: 'Peñafrancia & Basilica',
    badge: 'Traditional & Sweets',
    description: 'Pili nut confectioneries, riverside family dining & classic snacks.',
    icon: 'leaf-outline',
  },
  {
    id: 'San Felipe',
    name: 'San Felipe & Concepcion',
    badge: 'Local Grills & Gems',
    description: 'Late night barbecue hubs, carinderias & hidden neighborhood favorites.',
    icon: 'flame-outline',
  },
];

const DISH_PREFERENCES = [
  { id: 'kinalas', label: '🍜 Kinalas', sub: 'Brain gravy noodles' },
  { id: 'bicol-express', label: '🥥 Bicol Express', sub: 'Pork in spiced coconut milk' },
  { id: 'pinangat', label: '🍃 Pinangat', sub: 'Taro leaves in gata' },
  { id: 'toasted-siopao', label: '🥟 Toasted Siopao', sub: 'Baked crisp buns' },
  { id: 'sinanglay', label: '🐟 Sinanglay', sub: 'Tilapia in coconut sauce' },
  { id: 'pili', label: '🌰 Pili Delicacies', sub: 'Pastillas & glazed nuts' },
  { id: 'pancit-bato', label: '🥢 Pancit Bato', sub: 'Roasted highland noodles' },
  { id: 'street-grills', label: '🍢 Naga Grills', sub: 'Isaw & pork barbecue' },
];

export default function OnboardingScreen() {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState<number>(0); // 0: Spice, 1: District, 2: Cravings

  // Selections
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>(user?.spicePreference || 'fiery');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(user?.favoriteDistrict || 'Centro');
  const [selectedDishes, setSelectedDishes] = useState<string[]>(['kinalas', 'bicol-express']);

  const totalSteps = 3;

  const toggleDish = (dishId: string) => {
    setSelectedDishes((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      router.replace('/');
    }
  };

  const finishOnboarding = () => {
    updateProfile({
      spicePreference: selectedSpice,
      favoriteDistrict: selectedDistrict,
      location: `${selectedDistrict}, Naga City`,
    });
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Top Bar: Back Button, Step Progress, Skip */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color="#000000" />
        </Pressable>

        {/* Segmented Step Indicator */}
        <View style={styles.progressSegments}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.segmentBar,
                i <= step ? styles.segmentBarActive : styles.segmentBarInactive,
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={finishOnboarding}
          style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Skip personalization"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* STEP 0: Spice Preference */}
          {step === 0 && (
            <View style={styles.stepContent}>
              <View style={styles.titleSection}>
                <Text style={styles.stepIndicatorText}>STEP 1 OF 3</Text>
                <Text style={styles.headingSans}>
                  Set your <Text style={styles.headingSerif}>spice level</Text>
                </Text>
                <Text style={styles.subheadText}>
                  Bicol cuisine is celebrated for rich gata and chili heat. How spicy do you like your food?
                </Text>
              </View>

              <View style={styles.cardGroup}>
                {/* Mild */}
                <Pressable
                  onPress={() => setSelectedSpice('mild')}
                  style={({ pressed }) => [
                    styles.optionCard,
                    selectedSpice === 'mild' && styles.optionCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.spiceLevelRow}>
                      <Text style={styles.optionEmoji}>🌶️</Text>
                      <View style={styles.spiceTextContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            selectedSpice === 'mild' && styles.optionTitleSelected,
                          ]}
                        >
                          Mild & Creamy
                        </Text>
                        <Text style={styles.optionSubtitle}>
                          Rich in fresh coconut milk with gentle warmth.
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedSpice === 'mild' && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedSpice === 'mild' && <View style={styles.radioInner} />}
                    </View>
                  </View>
                </Pressable>

                {/* Moderate */}
                <Pressable
                  onPress={() => setSelectedSpice('moderate')}
                  style={({ pressed }) => [
                    styles.optionCard,
                    selectedSpice === 'moderate' && styles.optionCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.spiceLevelRow}>
                      <Text style={styles.optionEmoji}>🌶️🌶️</Text>
                      <View style={styles.spiceTextContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            selectedSpice === 'moderate' && styles.optionTitleSelected,
                          ]}
                        >
                          Classic Bicolano
                        </Text>
                        <Text style={styles.optionSubtitle}>
                          Balanced native siling labuyo spice and aroma.
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedSpice === 'moderate' && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedSpice === 'moderate' && <View style={styles.radioInner} />}
                    </View>
                  </View>
                </Pressable>

                {/* Fiery */}
                <Pressable
                  onPress={() => setSelectedSpice('fiery')}
                  style={({ pressed }) => [
                    styles.optionCard,
                    selectedSpice === 'fiery' && styles.optionCardSelected,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.spiceLevelRow}>
                      <Text style={styles.optionEmoji}>🌶️🌶️🌶️</Text>
                      <View style={styles.spiceTextContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            selectedSpice === 'fiery' && styles.optionTitleSelected,
                          ]}
                        >
                          Fiery Native
                        </Text>
                        <Text style={styles.optionSubtitle}>
                          Full-throttle chili intensity for true spice lovers.
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedSpice === 'fiery' && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedSpice === 'fiery' && <View style={styles.radioInner} />}
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          )}

          {/* STEP 1: District Preference */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.titleSection}>
                <Text style={styles.stepIndicatorText}>STEP 2 OF 3</Text>
                <Text style={styles.headingSans}>
                  Where do you <Text style={styles.headingSerif}>eat?</Text>
                </Text>
                <Text style={styles.subheadText}>
                  Choose your primary dining area in Naga to get localized spot suggestions.
                </Text>
              </View>

              <View style={styles.cardGroup}>
                {DISTRICT_OPTIONS.map((item) => {
                  const isSelected = selectedDistrict === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setSelectedDistrict(item.id)}
                      style={({ pressed }) => [
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                        pressed && styles.cardPressed,
                      ]}
                    >
                      <View style={styles.optionHeader}>
                        <View style={styles.districtInfo}>
                          <View style={styles.districtTitleRow}>
                            <Ionicons
                              name={item.icon}
                              size={18}
                              color={isSelected ? '#000000' : '#8E8E93'}
                            />
                            <Text
                              style={[
                                styles.optionTitle,
                                isSelected && styles.optionTitleSelected,
                              ]}
                            >
                              {item.name}
                            </Text>
                          </View>
                          <Text style={styles.optionSubtitle}>{item.description}</Text>
                        </View>
                        <View
                          style={[
                            styles.radioOuter,
                            isSelected && styles.radioOuterSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 2: Food Cravings */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.titleSection}>
                <Text style={styles.stepIndicatorText}>STEP 3 OF 3</Text>
                <Text style={styles.headingSans}>
                  What are you <Text style={styles.headingSerif}>craving?</Text>
                </Text>
                <Text style={styles.subheadText}>
                  Tap the local dishes you love most to fine-tune your recommendations.
                </Text>
              </View>

              <View style={styles.chipGrid}>
                {DISH_PREFERENCES.map((dish) => {
                  const isSelected = selectedDishes.includes(dish.id);
                  return (
                    <Pressable
                      key={dish.id}
                      onPress={() => toggleDish(dish.id)}
                      style={({ pressed }) => [
                        styles.dishChip,
                        isSelected && styles.dishChipSelected,
                        pressed && styles.chipPressed,
                      ]}
                      accessibilityRole="button"
                    >
                      <View style={styles.chipContent}>
                        <Text
                          style={[
                            styles.chipLabel,
                            isSelected && styles.chipLabelSelected,
                          ]}
                        >
                          {dish.label}
                        </Text>
                        <Text
                          style={[
                            styles.chipSub,
                            isSelected && styles.chipSubSelected,
                          ]}
                        >
                          {dish.sub}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.chipCheck,
                          isSelected && styles.chipCheckSelected,
                        ]}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark-sharp" size={14} color="#FFFFFF" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Button */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
          accessibilityRole="button"
          accessibilityLabel={step === totalSteps - 1 ? 'Start exploring Naga' : 'Continue'}
        >
          <Text style={styles.primaryButtonText}>
            {step === totalSteps - 1 ? 'Start Exploring Naga' : 'Continue'}
          </Text>
          <Ionicons
            name={step === totalSteps - 1 ? 'arrow-forward' : 'chevron-forward'}
            size={18}
            color="#FFFFFF"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 4 : 8,
    paddingBottom: 8,
  },
  navIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSegments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    maxWidth: 140,
    marginHorizontal: 12,
  },
  segmentBar: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
  },
  segmentBarActive: {
    backgroundColor: '#111111',
  },
  segmentBarInactive: {
    backgroundColor: '#E5E5EA',
  },
  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
  },
  mainContainer: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },

  stepContent: {
    flex: 1,
  },
  stepIndicatorText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  titleSection: {
    marginBottom: 18,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.8,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 30,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#6E6E73',
    marginTop: 6,
    lineHeight: 18,
  },

  // Cards (Spice & District)
  cardGroup: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111111',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardPressed: {
    opacity: 0.8,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spiceLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  spiceTextContainer: {
    flex: 1,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionTitle: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.2,
  },
  optionTitleSelected: {
    color: '#000000',
  },
  optionSubtitle: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 16,
    flexShrink: 1,
  },
  districtInfo: {
    flex: 1,
    paddingRight: 10,
  },
  districtTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Radio button indicator
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#111111',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111111',
  },

  // Step 3: Dish Chips
  chipGrid: {
    gap: 8,
  },
  dishChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dishChipSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111111',
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipContent: {
    flex: 1,
  },
  chipLabel: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  chipLabelSelected: {
    color: '#000000',
  },
  chipSub: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  chipSubSelected: {
    color: '#6E6E73',
  },
  chipCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  chipCheckSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },

  // Bottom Action Bar
  bottomBar: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  pressed: {
    opacity: 0.5,
  },
});
