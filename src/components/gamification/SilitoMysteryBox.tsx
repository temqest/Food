import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';
import { MysteryDrop } from '@/data/gamification';

interface SilitoMysteryBoxProps {
  compact?: boolean;
}

export const SilitoMysteryBox: React.FC<SilitoMysteryBoxProps> = ({ compact = false }) => {
  const {
    isMysteryBoxOpenedToday,
    mysteryDrop,
    openMysteryBox,
    rerollMysteryBox,
  } = useQuest();

  const [isOpening, setIsOpening] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDrop, setActiveDrop] = useState<MysteryDrop | null>(mysteryDrop);

  // Animation values initialized with useState for React 19 / Compiler safety
  const [floatAnim] = useState(() => new Animated.Value(0));
  const [wobbleAnim] = useState(() => new Animated.Value(0));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [modalScaleAnim] = useState(() => new Animated.Value(0.85));
  const [modalOpacityAnim] = useState(() => new Animated.Value(0));

  // Ambient floating animation for idle chest
  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -7,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: !isWeb,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: !isWeb,
        }),
      ])
    );
    floatLoop.start();

    return () => floatLoop.stop();
  }, [floatAnim]);

  const handleOpenBox = () => {
    if (isOpening) return;
    setIsOpening(true);

    const isWeb = Platform.OS === 'web';

    // Fast wobble sequence
    Animated.sequence([
      Animated.timing(wobbleAnim, {
        toValue: 1,
        duration: 90,
        useNativeDriver: !isWeb,
      }),
      Animated.timing(wobbleAnim, {
        toValue: -1,
        duration: 90,
        useNativeDriver: !isWeb,
      }),
      Animated.timing(wobbleAnim, {
        toValue: 1,
        duration: 90,
        useNativeDriver: !isWeb,
      }),
      Animated.timing(wobbleAnim, {
        toValue: -1,
        duration: 90,
        useNativeDriver: !isWeb,
      }),
      Animated.timing(wobbleAnim, {
        toValue: 0,
        duration: 90,
        useNativeDriver: !isWeb,
      }),
    ]).start(() => {
      const drop = isMysteryBoxOpenedToday ? rerollMysteryBox() : openMysteryBox();
      setActiveDrop(drop);
      setIsOpening(false);
      setModalVisible(true);

      // Animate modal entry
      modalScaleAnim.setValue(0.85);
      modalOpacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(modalOpacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    });
  };

  const handleReroll = () => {
    const drop = rerollMysteryBox();
    setActiveDrop(drop);
    setModalVisible(true);
  };

  const wobbleInterpolate = useMemo(
    () =>
      wobbleAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-12deg', '0deg', '12deg'],
      }),
    [wobbleAnim]
  );

  const getRarityBadgeStyle = (rarity?: string) => {
    switch (rarity) {
      case 'Legendary Heritage':
        return { bg: '#FF2D55', label: 'LEGENDARY HERITAGE', icon: 'flame' as const };
      case 'Secret Local Hack':
        return { bg: '#AF52DE', label: 'SECRET LOCAL HACK', icon: 'sparkles' as const };
      default:
        return { bg: '#FF9500', label: 'AUTHENTIC GEM', icon: 'star' as const };
    }
  };

  const currentDisplayDrop = activeDrop || mysteryDrop;

  return (
    <View style={styles.container}>
      {compact ? (
        <Pressable
          onPress={handleOpenBox}
          style={({ pressed }) => [styles.compactCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Roll Silito's secret tasting box"
        >
          <View style={styles.compactLeft}>
            <View style={styles.compactIconCircle}>
              <Ionicons name="dice" size={17} color="#D42F13" />
            </View>
            <View style={styles.compactTextWrap}>
              <Text style={styles.compactTitle}>Can&apos;t pick a flavor?</Text>
              <Text style={styles.compactSubtitle} numberOfLines={1}>
                {isMysteryBoxOpenedToday && currentDisplayDrop
                  ? `Unboxed: ${currentDisplayDrop.foodName} (Tap to roll)`
                  : 'Roll Silito’s secret tasting box (+50 XP)'}
              </Text>
            </View>
          </View>
          <View style={styles.compactPill}>
            <Text style={styles.compactPillText}>Roll</Text>
            <Ionicons name="sparkles" size={11} color="#FFFFFF" />
          </View>
        </Pressable>
      ) : isMysteryBoxOpenedToday && currentDisplayDrop ? (
        <View style={styles.openedCard}>
          <View style={styles.openedTopRow}>
            <View style={styles.openedBadge}>
              <Ionicons name="gift" size={12} color="#D42F13" />
              <Text style={styles.openedBadgeText}>TODAY’S STILITIO UNBOXING</Text>
            </View>
            <Pressable
              onPress={handleOpenBox}
              style={({ pressed }) => [styles.rerollSmallBtn, pressed && styles.pressed]}
              hitSlop={6}
            >
              <Ionicons name="refresh" size={13} color="#FFFFFF" />
              <Text style={styles.rerollSmallText}>Spin Another Drop</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [styles.openedBody, pressed && styles.pressed]}
          >
            <Image source={{ uri: currentDisplayDrop.image }} style={styles.openedThumb} />
            <View style={styles.openedInfo}>
              <Text style={styles.openedDishName} numberOfLines={1}>
                {currentDisplayDrop.foodName}
              </Text>
              <Text style={styles.openedEstName} numberOfLines={1}>
                at {currentDisplayDrop.establishmentName} · {currentDisplayDrop.neighborhood}
              </Text>
              <View style={styles.openedXpRow}>
                <View style={styles.xpPillSmall}>
                  <Ionicons name="flash" size={10} color="#FF9500" />
                  <Text style={styles.xpPillText}>+{currentDisplayDrop.xpReward} XP Claimed</Text>
                </View>
                <Text style={styles.viewDropLink}>Tap for Lore ›</Text>
              </View>
            </View>
          </Pressable>
        </View>
      ) : (
        /* Fresh unopened / ready Stilitio Mystery Box */
        <Pressable
          onPress={handleOpenBox}
          disabled={isOpening}
          style={({ pressed }) => [styles.boxCard, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel="Silito Mystery Tasting Box. Tap to unbox secret Naga flavor drop"
        >
          {/* Animated Glow Aura */}
          <View style={styles.glowAura} />

          {/* Left: 3D Animated Silito Mystery Chest */}
          <Animated.View
            style={[
              styles.chestContainer,
              {
                transform: [
                  { translateY: floatAnim },
                  { rotate: wobbleInterpolate },
                  { scale: pulseAnim },
                ],
              },
            ]}
          >
            <View style={styles.chestArt}>
              {/* Golden Crate Lid */}
              <View style={styles.chestLid}>
                <View style={styles.chestLidHighlight} />
                <View style={styles.flameStemIcon}>
                  <Ionicons name="flame" size={16} color="#FFD60A" />
                </View>
              </View>
              {/* Fiery Crate Base */}
              <View style={styles.chestBase}>
                <View style={styles.lockEmblem}>
                  <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.crateShadow} />
            </View>
          </Animated.View>

          {/* Right: Copy & Action */}
          <View style={styles.contentColumn}>
            <View style={styles.tagRow}>
              <View style={styles.tagPill}>
                <Ionicons name="flame" size={10} color="#FFFFFF" />
                <Text style={styles.tagText}>STILITIO FLAVOR CRATE</Text>
              </View>
              <View style={styles.readyBadge}>
                <Text style={styles.readyBadgeText}>READY</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Silito&apos;s Secret Tasting Box</Text>
            <Text style={styles.cardSubtitle}>
              Tap to unbox today&apos;s mystery Naga food gem, secret insider hack &amp; earn +50 XP!
            </Text>

            <View style={styles.ctaRow}>
              <View style={styles.openButton}>
                <Ionicons
                  name={isOpening ? 'refresh' : 'gift-outline'}
                  size={14}
                  color="#FFFFFF"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.openButtonText}>
                  {isOpening ? 'Opening Crate...' : 'Tap to Unbox ›'}
                </Text>
              </View>
              <View style={styles.xpBonusBadge}>
                <Text style={styles.xpBonusText}>+50 XP</Text>
              </View>
            </View>
          </View>
        </Pressable>
      )}

      {/* Celebration Unboxing Modal */}
      {currentDisplayDrop && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <Animated.View
              style={[
                styles.modalCard,
                {
                  transform: [{ scale: modalScaleAnim }],
                  opacity: modalOpacityAnim,
                },
              ]}
            >
              {/* Close Button */}
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={10}
              >
                <Ionicons name="close" size={20} color="#8E8E93" />
              </Pressable>

              {/* Celebration Banner */}
              <View style={styles.celebrationHeader}>
                <View style={styles.sparksRow}>
                  <Ionicons name="sparkles" size={16} color="#FF9500" />
                  <Text style={styles.celebrationSub}>STILITIO CRATE REVEALED</Text>
                  <Ionicons name="sparkles" size={16} color="#FF9500" />
                </View>

                {/* Rarity Tag */}
                {(() => {
                  const badge = getRarityBadgeStyle(currentDisplayDrop.rarity);
                  return (
                    <View style={[styles.rarityPill, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon} size={11} color="#FFFFFF" />
                      <Text style={styles.rarityText}>{badge.label}</Text>
                    </View>
                  );
                })()}
              </View>

              {/* Dish Visual */}
              <View style={styles.dishImageWrap}>
                <Image
                  source={{ uri: currentDisplayDrop.image }}
                  style={styles.dishImage}
                  resizeMode="cover"
                />
                <View style={styles.xpFloater}>
                  <Ionicons name="flash" size={12} color="#FFFFFF" />
                  <Text style={styles.xpFloaterText}>+{currentDisplayDrop.xpReward} XP</Text>
                </View>
              </View>

              {/* Dish Titles */}
              <Text style={styles.modalDishTitle}>{currentDisplayDrop.foodName}</Text>
              {currentDisplayDrop.bikolName && (
                <Text style={styles.modalBikolName}>Bikol: {currentDisplayDrop.bikolName}</Text>
              )}
              <Text style={styles.modalEstTag}>
                at <Text style={styles.boldEst}>{currentDisplayDrop.establishmentName}</Text> · {currentDisplayDrop.neighborhood}
              </Text>

              {/* Spice Level Indicator */}
              <View style={styles.siliMeterRow}>
                <Text style={styles.siliMeterLabel}>Spice Level:</Text>
                <View style={styles.flameIconsRow}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Ionicons
                      key={level}
                      name="flame"
                      size={14}
                      color={level <= currentDisplayDrop.siliRating ? '#D42F13' : '#E5E5EA'}
                    />
                  ))}
                </View>
              </View>

              {/* Insider Secret Card */}
              <View style={styles.secretBox}>
                <View style={styles.secretTitleRow}>
                  <Ionicons name="bulb" size={15} color="#D42F13" />
                  <Text style={styles.secretTitle}>Local Insider Hack</Text>
                </View>
                <Text style={styles.secretContent}>{currentDisplayDrop.insiderSecret}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionsRow}>
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                    router.push({
                      pathname: '/food/[id]',
                      params: { id: currentDisplayDrop.foodId },
                    });
                  }}
                  style={({ pressed }) => [styles.actionPrimaryBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.actionPrimaryText}>Taste Dish Lore</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
                </Pressable>

                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/map');
                  }}
                  style={({ pressed }) => [styles.actionSecondaryBtn, pressed && styles.pressed]}
                >
                  <Ionicons name="map-outline" size={15} color="#1C1C1E" />
                  <Text style={styles.actionSecondaryText}>Locate on Map</Text>
                </Pressable>
              </View>

              {/* Re-roll Link */}
              <Pressable onPress={handleReroll} style={styles.rerollLink} hitSlop={8}>
                <Ionicons name="refresh-outline" size={13} color="#8E8E93" />
                <Text style={styles.rerollLinkText}>Roll another mystery drop (+25 bonus XP)</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
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
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  compactIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  compactTextWrap: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  compactSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  compactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  compactPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  boxCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 6px 18px rgba(212, 47, 19, 0.22)',
      },
    }),
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  glowAura: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 47, 19, 0.18)',
  },
  chestContainer: {
    width: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  chestArt: {
    alignItems: 'center',
    width: 66,
  },
  chestLid: {
    width: 58,
    height: 20,
    backgroundColor: '#D42F13',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD60A',
    position: 'relative',
  },
  chestLidHighlight: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 2,
  },
  flameStemIcon: {
    marginTop: -2,
  },
  chestBase: {
    width: 54,
    height: 34,
    backgroundColor: '#8B1E0B',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#FFD60A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockEmblem: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  crateShadow: {
    width: 44,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    marginTop: 4,
  },
  contentColumn: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  readyBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.4)',
  },
  readyBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34C759',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
    marginTop: 3,
    marginBottom: 10,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  openButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  xpBonusBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.4)',
  },
  xpBonusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF9500',
  },

  // Opened in-feed collapsed card
  openedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  openedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  openedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.4,
  },
  rerollSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  rerollSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  openedBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  openedThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  openedInfo: {
    flex: 1,
  },
  openedDishName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  openedEstName: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  openedXpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  xpPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF9500',
  },
  viewDropLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
  },
  pressed: {
    opacity: 0.8,
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  sparksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  celebrationSub: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF9500',
    letterSpacing: 0.6,
  },
  rarityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dishImageWrap: {
    width: '100%',
    height: 170,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  dishImage: {
    width: '100%',
    height: '100%',
  },
  xpFloater: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  xpFloaterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFD60A',
  },
  modalDishTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  modalBikolName: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
  modalEstTag: {
    fontSize: 13,
    color: '#3C3C43',
    marginTop: 4,
    textAlign: 'center',
  },
  boldEst: {
    fontWeight: '700',
    color: '#D42F13',
  },
  siliMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  siliMeterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  flameIconsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  secretBox: {
    width: '100%',
    backgroundColor: '#FFF4E5',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.25)',
  },
  secretTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  secretTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
  },
  secretContent: {
    fontSize: 12,
    color: '#3C3C43',
    lineHeight: 17,
  },
  modalActionsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
    gap: 10,
  },
  actionPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D42F13',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  actionPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  actionSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  rerollLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 14,
    paddingVertical: 4,
  },
  rerollLinkText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
});
