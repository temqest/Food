import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Platform,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  G,
  Circle,
  Polygon,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';
import { STICKER_ICONS } from './CravingDialWidget';

// ============================================================================
// THEME & PALETTE (Warm Tape, Kraft Paper, & Bicol Dish Colors)
// ============================================================================
const THEME = {
  tapeBg: '#F7EED8',          // Warm masking tape / kraft paper beige
  tapeBorder: '#D8C6A7',      // Subtle tape outline
  darkBorder: '#232120',      // Comic / sticker dark contour outline
  charcoal: '#1E1C1A',        // Dark typography
  mutedText: '#4A443C',       // Friendly warm charcoal subtitle
  orangeSlice: '#E05338',     // Terracotta / Toasted Siopao slice
  yellowSlice: '#F5B838',     // Mustard Yellow / Kinalas slice
  greenSlice: '#507E5D',      // Sage / Forest Green / Laing slice
  rimYellow: '#EED99E',       // Golden olive track rim
  bullseyeRed: '#D6452B',     // Archery target ring
  dartTeal: '#359DA9',        // Dart fletching / feather flight
  creamHub: '#FFFDF6',        // Bullseye cream ring
  accentGold: '#FFB800',
  xpTagBg: '#FFF2D9',
};

// ============================================================================
// CURATED SURPRISE PICKS POOL
// ============================================================================
export interface SurpriseOption {
  id: string;
  name: string;
  foodLabel: string;
  sectorIndex: number; // 0 = Orange (Toasted Siopao), 1 = Yellow (Kinalas), 2 = Green (Laing)
  category: string;
  establishment: string;
  district: string;
  rating: string;
  price: string;
  tagline: string;
  insiderTip: string;
  sticker: any;
  color: string;
}

export const SURPRISE_OPTIONS: SurpriseOption[] = [
  {
    id: 'kinalas',
    name: 'Kinalas na Baka',
    foodLabel: 'Kinalas?',
    sectorIndex: 1, // Yellow (center top)
    category: 'Heritage Soups & Noodles',
    establishment: "Cha Cha's Kinalas & Brain Gravy",
    district: 'Barlin St., Naga Centro',
    rating: '★ 4.9',
    price: '₱75',
    tagline: 'Simmered beef bone broth with thick, savory brain gravy.',
    insiderTip: 'Drizzle two spoons of sili paste and squeeze fresh calamansi into the gravy.',
    sticker: STICKER_ICONS.kinalasBowl,
    color: THEME.yellowSlice,
  },
  {
    id: 'toasted-siopao',
    name: 'Golden Toasted Siopao',
    foodLabel: 'Toasted Siopao?',
    sectorIndex: 0, // Orange (left)
    category: 'Local Bakeries & Merienda',
    establishment: "Baker's Plaza Heritage Buns",
    district: 'P. Burgos St., Naga Centro',
    rating: '★ 4.8',
    price: '₱22',
    tagline: 'Oven-toasted flaky golden crust stuffed with savory pork asado.',
    insiderTip: 'Best paired with hot native tablea chocolate right at 4 PM merienda.',
    sticker: STICKER_ICONS.toastedSiopao,
    color: THEME.orangeSlice,
  },
  {
    id: 'laing',
    name: 'Authentic Spicy Laing',
    foodLabel: 'Laing?',
    sectorIndex: 2, // Green (right)
    category: 'Gata & Sili Classics',
    establishment: 'Bob Marlin Authentic Dining',
    district: 'Magsaysay Ave., Naga City',
    rating: '★ 4.9',
    price: '₱165',
    tagline: 'Dried taro leaves gently simmered for hours in rich kakang gata.',
    insiderTip: 'Never stirred during cooking to preserve the silken leaf texture.',
    sticker: STICKER_ICONS.pinangatPouch || STICKER_ICONS.coconutGata,
    color: THEME.greenSlice,
  },
];

// Target angle offsets:
// Slices centered at:
// Sector 1 (Kinalas, Yellow)        ->   0° (12 o'clock under needle) -> target mod 360 = 0°
// Sector 0 (Toasted Siopao, Orange) -> 300° (10 o'clock)              -> target mod 360 = 60° (wheel rotated +60° brings 300° to 0°)
// Sector 2 (Laing, Green)           ->  60° (2 o'clock)               -> target mod 360 = 300° (wheel rotated -60° / +300° brings 60° to 0°)
const SECTOR_TARGET_MODS: Record<number, number> = {
  1: 0,
  0: 60,
  2: 300,
};

// 12 brass rivet degrees for wheel rim
const RIM_STUDS_DEG = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

// ============================================================================
// MINI DART TARGET ICON (Matching the 🎯 in the reference image)
// ============================================================================
export const MiniDartTargetIcon: React.FC<{ size?: number }> = ({ size = 26 }) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 32 32">
        <Circle cx="16" cy="16" r="14.5" fill={THEME.creamHub} stroke={THEME.darkBorder} strokeWidth="2.2" />
        <Circle cx="16" cy="16" r="11" fill={THEME.bullseyeRed} stroke={THEME.darkBorder} strokeWidth="1.2" />
        <Circle cx="16" cy="16" r="7.5" fill={THEME.creamHub} stroke={THEME.darkBorder} strokeWidth="1" />
        <Circle cx="16" cy="16" r="4" fill={THEME.bullseyeRed} stroke={THEME.darkBorder} strokeWidth="0.8" />
        <Circle cx="16" cy="16" r="1.5" fill={THEME.creamHub} />

        {/* Dart sticking into center at 45° */}
        <Line x1="16" y1="16" x2="27" y2="5" stroke={THEME.darkBorder} strokeWidth="2.2" strokeLinecap="round" />
        <Polygon points="24,8 28,4 29,8 26,10" fill={THEME.dartTeal} stroke={THEME.darkBorder} strokeWidth="0.9" />
        <Polygon points="22,6 26,2 29,4 25,8" fill="#5DC4CF" stroke={THEME.darkBorder} strokeWidth="0.9" />
      </Svg>
    </View>
  );
};

// ============================================================================
// MAIN COMPONENT: SurpriseMeSpinButton
// ============================================================================
export interface SurpriseMeSpinButtonProps {
  onSpotSelected?: (spot: SurpriseOption) => void;
  style?: any;
}

export const SurpriseMeSpinButton: React.FC<SurpriseMeSpinButtonProps> = ({
  onSpotSelected,
  style,
}) => {
  const { addXp } = useQuest();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<SurpriseOption | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [claimedXp, setClaimedXp] = useState(false);

  // Animation values
  const spinAnim = useRef(new Animated.Value(0)).current;
  const needleWobbleAnim = useRef(new Animated.Value(0)).current;
  const pressScaleAnim = useRef(new Animated.Value(1)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.85)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;

  // Track current accumulated degrees & idle animation ref
  const currentRotationRef = useRef(0);
  const idleAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const isSpinningRef = useRef(false);

  // Keep ref in sync
  isSpinningRef.current = isSpinning;

  // Gentle, continuous idle spin so the circle is actively spinning
  const startIdleSpin = useCallback((fromAngle: number) => {
    if (isSpinningRef.current) return;
    spinAnim.setValue(fromAngle);
    currentRotationRef.current = fromAngle;

    idleAnimRef.current = Animated.timing(spinAnim, {
      toValue: fromAngle + 360,
      duration: 18000,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    idleAnimRef.current.start(({ finished }) => {
      if (finished && !isSpinningRef.current) {
        startIdleSpin(fromAngle + 360);
      }
    });
  }, [spinAnim]);

  useEffect(() => {
    startIdleSpin(0);
    return () => {
      idleAnimRef.current?.stop();
    };
  }, [startIdleSpin]);

  // Handle tactile press in/out
  const handlePressIn = () => {
    Animated.spring(pressScaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  // SPIN ACTION
  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    isSpinningRef.current = true;
    setClaimedXp(false);

    // Stop gentle idle loop and capture exact angle
    idleAnimRef.current?.stop();

    // Pick a random surprise option
    const randomIndex = Math.floor(Math.random() * SURPRISE_OPTIONS.length);
    const chosen = SURPRISE_OPTIONS[randomIndex];

    // Safely retrieve current angle
    (spinAnim as any).stopAnimation((currentAngle: number) => {
      const baseAngle = currentAngle;

      // Compute target angle that brings chosen sector under top needle (0 deg / 12 o'clock)
      const desiredMod = SECTOR_TARGET_MODS[chosen.sectorIndex] ?? 0;
      const currentMod = ((baseAngle % 360) + 360) % 360;
      let forwardDelta = (desiredMod - currentMod) % 360;
      if (forwardDelta < 0) forwardDelta += 360;

      // 4 to 5 full rapid turns
      const fullSpins = (4 + Math.floor(Math.random() * 2)) * 360;
      const targetAngle = baseAngle + fullSpins + forwardDelta;

      // Needle ticker animation during fast spin
      const needleInterval = setInterval(() => {
        const wiggle = (Math.random() - 0.5) * 14;
        needleWobbleAnim.setValue(wiggle);
      }, 50);

      // Smooth deceleration animation with cubic easing
      Animated.timing(spinAnim, {
        toValue: targetAngle,
        duration: 2500,
        easing: Easing.bezier(0.12, 0.85, 0.25, 1.0),
        useNativeDriver: true,
      }).start(() => {
        clearInterval(needleInterval);
        currentRotationRef.current = targetAngle;
        needleWobbleAnim.setValue(0);
        setIsSpinning(false);
        isSpinningRef.current = false;
        setSelectedSpot(chosen);

        // Trigger reveal modal after settling
        setTimeout(() => {
          setModalVisible(true);
          Animated.parallel([
            Animated.spring(modalScaleAnim, {
              toValue: 1,
              friction: 6,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(modalOpacityAnim, {
              toValue: 1,
              duration: 220,
              useNativeDriver: true,
            }),
          ]).start();

          if (onSpotSelected) {
            onSpotSelected(chosen);
          }
        }, 250);
      });
    });
  }, [isSpinning, onSpotSelected, spinAnim, needleWobbleAnim, modalScaleAnim, modalOpacityAnim]);

  // Claim XP reward
  const handleClaimXp = () => {
    if (claimedXp) return;
    addXp(25);
    setClaimedXp(true);
  };

  // Close modal and resume gentle idle spin after brief pause
  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0.85,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      // Wait 1.2s so user can appreciate the landed sector before gently spinning again
      setTimeout(() => {
        (spinAnim as any).stopAnimation((currentAngle: number) => {
          startIdleSpin(currentAngle);
        });
      }, 1200);
    });
  };

  // Spin interpolation for rotating full 360-degree wheel
  const wheelRotateInterpolation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const needleRotateInterpolation = needleWobbleAnim.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  const cardWidth = Math.min(SCREEN_WIDTH - 36, 380);
  const cardHeight = 72;

  return (
    <>
      <View style={[styles.outerWrapper, style]}>
        <Animated.View style={{ transform: [{ scale: pressScaleAnim }], width: '100%', alignItems: 'center' }}>
          <Pressable
            onPress={handleSpin}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isSpinning}
            style={[
              styles.tapeBannerContainer,
              { width: cardWidth, height: cardHeight },
              isSpinning && styles.tapeBannerSpinning,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Surprise Me spin button. Tap to spin for your next spot."
          >
            {/* ============================================================== */}
            {/* LEFT: Full 360° Overextending Circle Wheel (0)==               */}
            {/* ============================================================== */}
            <View style={styles.wheelLeftArea} pointerEvents="none">
              {/* Rotating 360-Degree Wheel (Complete unclipped circle) */}
              <Animated.View
                style={[
                  styles.wheelCanvas,
                  {
                    transform: [{ rotate: wheelRotateInterpolation }],
                  },
                ]}
              >
                <Svg width="96" height="96" viewBox="0 0 120 120">
                  {/* Wheel Center is at (60, 60), Outer Track Rim Radius R = 57 */}
                  <Circle
                    cx="60"
                    cy="60"
                    r="57"
                    fill={THEME.rimYellow}
                    stroke={THEME.darkBorder}
                    strokeWidth="2.5"
                  />

                  {/* Decorative brass rivets/pegs along rim */}
                  {RIM_STUDS_DEG.map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const px = (60 + 54.5 * Math.sin(rad)).toFixed(1);
                    const py = (60 - 54.5 * Math.cos(rad)).toFixed(1);
                    return (
                      <Circle
                        key={deg}
                        cx={px}
                        cy={py}
                        r="1.4"
                        fill="#FFF0C2"
                        stroke={THEME.darkBorder}
                        strokeWidth="0.8"
                      />
                    );
                  })}

                  {/* -------------------------------------------------------- */}
                  {/* 6 SECTORS (60° each) - Full 360° Wheel with alternating dishes */}
                  {/* -------------------------------------------------------- */}

                  {/* Sector 1: 330° to 30° (Mustard Yellow: "Kinalas?") */}
                  <Path
                    d="M 60,60 L 34.5,15.8 A 51,51 0 0,1 85.5,15.8 Z"
                    fill={THEME.yellowSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="1.8"
                  />

                  {/* Sector 2: 30° to 90° (Sage Green: "Laing?") */}
                  <Path
                    d="M 60,60 L 85.5,15.8 A 51,51 0 0,1 111,60 Z"
                    fill={THEME.greenSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="1.8"
                  />

                  {/* Sector 3: 90° to 150° (Terracotta Orange: "Toasted Siopao?") */}
                  <Path
                    d="M 60,60 L 111,60 A 51,51 0 0,1 85.5,104.2 Z"
                    fill={THEME.orangeSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="1.8"
                  />

                  {/* Sector 4: 150° to 210° (Mustard Yellow: "Kinalas?") */}
                  <Path
                    d="M 60,60 L 85.5,104.2 A 51,51 0 0,1 34.5,104.2 Z"
                    fill={THEME.yellowSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="1.8"
                  />

                  {/* Sector 5: 210° to 270° (Sage Green: "Laing?") */}
                  <Path
                    d="M 60,60 L 34.5,104.2 A 51,51 0 0,1 9,60 Z"
                    fill={THEME.greenSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="1.8"
                  />

                  {/* Sector 0: 270° to 330° (Terracotta Orange: "Toasted Siopao?") */}
                  <Path
                    d="M 60,60 L 9,60 A 51,51 0 0,1 34.5,15.8 Z"
                    fill={THEME.orangeSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="1.8"
                  />

                  {/* Dividing Radial Spokes */}
                  <Line x1="60" y1="60" x2="31.5" y2="10.6" stroke={THEME.darkBorder} strokeWidth="2.2" />
                  <Line x1="60" y1="60" x2="88.5" y2="10.6" stroke={THEME.darkBorder} strokeWidth="2.2" />
                  <Line x1="60" y1="60" x2="117" y2="60" stroke={THEME.darkBorder} strokeWidth="2.2" />
                  <Line x1="60" y1="60" x2="88.5" y2="109.4" stroke={THEME.darkBorder} strokeWidth="2.2" />
                  <Line x1="60" y1="60" x2="31.5" y2="109.4" stroke={THEME.darkBorder} strokeWidth="2.2" />
                  <Line x1="60" y1="60" x2="3" y2="60" stroke={THEME.darkBorder} strokeWidth="2.2" />

                  {/* -------------------------------------------------------- */}
                  {/* BOLD FOOD LABELS RADIATING FROM CENTER                   */}
                  {/* -------------------------------------------------------- */}

                  {/* Sector 1: Kinalas? (0° - Top) */}
                  <G transform="rotate(0, 60, 60)">
                    <SvgText
                      x="60"
                      y="27"
                      fill={THEME.charcoal}
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Kinalas?
                    </SvgText>
                  </G>

                  {/* Sector 2: Laing? (60°) */}
                  <G transform="rotate(60, 60, 60)">
                    <SvgText
                      x="60"
                      y="27"
                      fill="#FFFFFF"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Laing?
                    </SvgText>
                  </G>

                  {/* Sector 3: Toasted Siopao? (120°) */}
                  <G transform="rotate(120, 60, 60)">
                    <SvgText
                      x="60"
                      y="22"
                      fill="#FFFFFF"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Toasted
                    </SvgText>
                    <SvgText
                      x="60"
                      y="31"
                      fill="#FFFFFF"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Siopao?
                    </SvgText>
                  </G>

                  {/* Sector 4: Kinalas? (180°) */}
                  <G transform="rotate(180, 60, 60)">
                    <SvgText
                      x="60"
                      y="27"
                      fill={THEME.charcoal}
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Kinalas?
                    </SvgText>
                  </G>

                  {/* Sector 5: Laing? (240°) */}
                  <G transform="rotate(240, 60, 60)">
                    <SvgText
                      x="60"
                      y="27"
                      fill="#FFFFFF"
                      fontSize="8.5"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Laing?
                    </SvgText>
                  </G>

                  {/* Sector 0: Toasted Siopao? (300°) */}
                  <G transform="rotate(300, 60, 60)">
                    <SvgText
                      x="60"
                      y="22"
                      fill="#FFFFFF"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Toasted
                    </SvgText>
                    <SvgText
                      x="60"
                      y="31"
                      fill="#FFFFFF"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily={Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-black'}
                      textAnchor="middle"
                    >
                      Siopao?
                    </SvgText>
                  </G>

                  {/* -------------------------------------------------------- */}
                  {/* INTACT ARCHERY BULLSEYE & DART CENTER HUB                */}
                  {/* -------------------------------------------------------- */}
                  <Circle cx="60" cy="60" r="16" fill={THEME.creamHub} stroke={THEME.darkBorder} strokeWidth="2.2" />
                  <Circle cx="60" cy="60" r="12" fill={THEME.bullseyeRed} stroke={THEME.darkBorder} strokeWidth="1.2" />
                  <Circle cx="60" cy="60" r="8" fill={THEME.creamHub} stroke={THEME.darkBorder} strokeWidth="1" />
                  <Circle cx="60" cy="60" r="4.5" fill={THEME.bullseyeRed} stroke={THEME.darkBorder} strokeWidth="0.8" />
                  <Circle cx="60" cy="60" r="1.6" fill={THEME.creamHub} />

                  {/* Bullseye Dart */}
                  <Line x1="60" y1="60" x2="71" y2="49" stroke={THEME.darkBorder} strokeWidth="2.2" strokeLinecap="round" />
                  <Polygon points="68,52 72,48 73,52 70,54" fill={THEME.dartTeal} stroke={THEME.darkBorder} strokeWidth="0.8" />
                  <Polygon points="66,50 70,46 73,48 69,52" fill="#5DC4CF" stroke={THEME.darkBorder} strokeWidth="0.8" />
                </Svg>
              </Animated.View>

              {/* Fixed Top Indicator Pointer (Triangle pointing down to winning slice) */}
              <Animated.View
                style={[
                  styles.topPointerWrapper,
                  {
                    transform: [{ rotate: needleRotateInterpolation }],
                  },
                ]}
                pointerEvents="none"
              >
                <Svg width="15" height="15" viewBox="0 0 18 18">
                  <Polygon
                    points="3,2 15,2 9,15"
                    fill={THEME.greenSlice}
                    stroke={THEME.darkBorder}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <Circle cx="9" cy="4" r="1.8" fill={THEME.creamHub} stroke={THEME.darkBorder} strokeWidth="1" />
                </Svg>
              </Animated.View>
            </View>

            {/* ============================================================== */}
            {/* RIGHT: Normal Clean Rectangle Area with "Surprise Me 🎯"       */}
            {/* ============================================================== */}
            <View style={styles.tapeTextContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>Surprise Me</Text>
                <MiniDartTargetIcon size={20} />
              </View>
              <Text style={styles.subtitleText}>
                {isSpinning ? 'Spinning flavor dial...' : 'Tap to spin for your next spot!'}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* ================================================================== */}
      {/* CELEBRATION REVEAL MODAL                                          */}
      {/* ================================================================== */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackdrop}>
          <Animated.View
            style={[
              styles.modalCard,
              {
                opacity: modalOpacityAnim,
                transform: [{ scale: modalScaleAnim }],
              },
            ]}
          >
            {/* Header Stamp Badge */}
            <View style={styles.modalBadgeRow}>
              <View style={[styles.stampTag, { backgroundColor: selectedSpot?.color || THEME.yellowSlice }]}>
                <Text style={styles.stampTagText}>🎯 SILITO'S RANDOM PICK</Text>
              </View>
              <Pressable
                onPress={handleCloseModal}
                style={styles.modalCloseBtn}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Close reveal modal"
              >
                <Ionicons name="close" size={18} color={THEME.charcoal} />
              </Pressable>
            </View>

            {/* Main Food Spotlight */}
            <View style={styles.modalFoodCenter}>
              {selectedSpot?.sticker ? (
                <View style={styles.stickerCircle}>
                  <Image
                    source={selectedSpot.sticker}
                    style={styles.modalStickerImage}
                    resizeMode="contain"
                  />
                </View>
              ) : null}

              <Text style={styles.modalDishTitle}>{selectedSpot?.name}</Text>
              <Text style={styles.modalCategoryText}>{selectedSpot?.category}</Text>
            </View>

            {/* Recommended Eatery Spotlight Card */}
            <View style={styles.eaterySpotlightCard}>
              <View style={styles.eateryRowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.spotlightLabel}>RECOMMENDED SPOT</Text>
                  <Text style={styles.spotlightName}>{selectedSpot?.establishment}</Text>
                </View>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>{selectedSpot?.rating}</Text>
                </View>
              </View>

              <View style={styles.eateryMetaRow}>
                <Ionicons name="location-sharp" size={13} color="#E0533C" />
                <Text style={styles.districtText}>{selectedSpot?.district}</Text>
                <Text style={styles.priceDot}>•</Text>
                <Text style={styles.priceTag}>{selectedSpot?.price}</Text>
              </View>

              <Text style={styles.taglineQuote}>"{selectedSpot?.tagline}"</Text>

              {/* Secret Tip Box */}
              <View style={styles.secretTipBox}>
                <Text style={styles.secretTipHeading}>💡 INSIDER TIP</Text>
                <Text style={styles.secretTipContent}>{selectedSpot?.insiderTip}</Text>
              </View>
            </View>

            {/* +25 XP Bonus Banner */}
            <Pressable
              onPress={handleClaimXp}
              disabled={claimedXp}
              style={[styles.xpBannerBtn, claimedXp && styles.xpBannerClaimed]}
            >
              <Ionicons
                name={claimedXp ? 'checkmark-circle' : 'sparkles'}
                size={18}
                color={claimedXp ? '#2E7D32' : '#C27803'}
              />
              <Text style={[styles.xpBannerText, claimedXp && styles.xpBannerTextClaimed]}>
                {claimedXp ? '+25 XP Claimed to Passport!' : 'Claim +25 XP Discovery Reward!'}
              </Text>
            </Pressable>

            {/* Actions */}
            <View style={styles.modalActionsRow}>
              <Pressable
                onPress={() => {
                  handleCloseModal();
                  router.push('/map');
                }}
                style={styles.viewOnMapBtn}
              >
                <Ionicons name="map-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.viewOnMapText}>View on Map</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  handleCloseModal();
                  setTimeout(() => handleSpin(), 300);
                }}
                style={styles.spinAgainBtn}
              >
                <Ionicons name="refresh" size={16} color={THEME.charcoal} style={{ marginRight: 4 }} />
                <Text style={styles.spinAgainText}>Spin Again</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

// ============================================================================
// STYLES
// ============================================================================
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: 16,
    marginTop: 20, // Moves box lower away from the Craving Dial carousel
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  tapeBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    backgroundColor: THEME.tapeBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: THEME.tapeBorder,
    ...Platform.select({
      ios: {
        shadowColor: THEME.darkBorder,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 3px 12px rgba(35, 33, 32, 0.08)',
        cursor: 'pointer',
      },
    }),
  },
  tapeBannerSpinning: {
    opacity: 0.96,
  },

  /* Left Area: Overextending Circle Area (0)== */
  wheelLeftArea: {
    width: 96,
    height: 96,
    position: 'absolute',
    left: -10,
    top: -12, // Centers the 96px circle vertically on the 72px card ((72 - 96) / 2 = -12)
    zIndex: 10,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelCanvas: {
    width: 96,
    height: 96,
  },
  topPointerWrapper: {
    position: 'absolute',
    top: -7,
    left: 40.5,
    zIndex: 25,
  },

  /* Right Area: Text Container */
  tapeTextContainer: {
    flex: 1,
    paddingLeft: 94, // Clears the overextending circle on the left
    paddingRight: 14,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  subtitleText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: THEME.mutedText,
    marginTop: 2,
    letterSpacing: -0.1,
  },

  /* ================================================================== */
  /* MODAL STYLES                                                       */
  /* ================================================================== */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(25, 23, 21, 0.68)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: THEME.tapeBorder,
    width: Math.min(SCREEN_WIDTH - 36, 380),
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 8px 26px rgba(0, 0, 0, 0.24)',
      },
    }),
  },
  modalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stampTag: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.darkBorder,
  },
  stampTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFE8D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFoodCenter: {
    alignItems: 'center',
    marginBottom: 14,
  },
  stickerCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#F9F3E5',
    borderWidth: 1.5,
    borderColor: '#E2D4BC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalStickerImage: {
    width: 60,
    height: 60,
  },
  modalDishTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: THEME.charcoal,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A8276',
    marginTop: 2,
  },

  /* Spotlight Card */
  eaterySpotlightCard: {
    backgroundColor: '#FDF8EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8DCC8',
    padding: 12,
    marginBottom: 12,
  },
  eateryRowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  spotlightLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#A45532',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  spotlightName: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.charcoal,
  },
  ratingPill: {
    backgroundColor: '#FFF0D4',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#E5A53B',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C5604',
  },
  eateryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  districtText: {
    fontSize: 11.5,
    color: THEME.mutedText,
    marginLeft: 3,
    fontWeight: '500',
  },
  priceDot: {
    fontSize: 11.5,
    color: '#B0A79B',
    marginHorizontal: 5,
  },
  priceTag: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2E7D32',
  },
  taglineQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#5E574E',
    marginTop: 6,
    lineHeight: 16,
  },
  secretTipBox: {
    backgroundColor: '#FFFDF7',
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#E2D4BC',
    padding: 8,
    marginTop: 8,
  },
  secretTipHeading: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B87200',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  secretTipContent: {
    fontSize: 11,
    color: '#554F46',
    lineHeight: 15,
  },

  /* XP Reward Banner */
  xpBannerBtn: {
    backgroundColor: THEME.xpTagBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0D49E',
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
  },
  xpBannerClaimed: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  xpBannerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8C5604',
  },
  xpBannerTextClaimed: {
    color: '#2E7D32',
  },

  /* Actions Row */
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewOnMapBtn: {
    flex: 1.3,
    backgroundColor: '#E0533C',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: THEME.darkBorder,
  },
  viewOnMapText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  spinAgainBtn: {
    flex: 1,
    backgroundColor: '#EFE6D5',
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: THEME.darkBorder,
  },
  spinAgainText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.charcoal,
  },
});
