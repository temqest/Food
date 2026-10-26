import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment, FoodItem } from '@/data/types';
import { TrailStopStatus } from '@/components/trail/TrailStopStation';

// Thematic Palette matching the vintage Naga Food Passport
const THEME = {
  cardBg: '#FFFDF7',           // Off-white / cream postcard paper
  borderWarm: '#D8CBB5',       // Thin warm border
  terracotta: '#E0533C',       // Terracotta accent
  terracottaDark: '#B83A25',   // Deep Terracotta
  forestGreen: '#1E3A2B',      // Forest Green title & headers
  yellowWarm: '#FFC857',       // Warm Yellow sticker/accent
  amberCta: '#FFB703',         // CTA Yellow/Terracotta button
  charcoal: '#2D2B2A',         // Charcoal typography
  mutedText: '#6F6A64',        // Warm secondary charcoal
  trackBg: '#EBE3D5',          // Progress bar track
  postmarkRed: 'rgba(212, 70, 50, 0.72)', // Vintage stamp ink
};

function getShortVenueName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('cha cha') || lower.includes('cha-cha') || lower.includes('cha')) return "Cha-Cha's";
  if (lower.includes('cely')) return "Aling Cely's";
  if (lower.includes("people's") || lower.includes('mall')) return "People's Mall";
  if (lower.includes('bob')) return "Bob Marlin";
  if (lower.includes('geord')) return "Geordean";
  if (lower.includes('red')) return "Red Platter";
  const words = name.split(' ');
  if (words.length >= 2 && words[0].length + words[1].length < 12) {
    return `${words[0]} ${words[1]}`;
  }
  return words[0] || 'Stop';
}

interface TrailProgressBarProps {
  completedCount: number;
  totalCount: number;
  xpBonus: number;
  establishments: Establishment[];
  trailFoods?: FoodItem[];
  stopStatuses: TrailStopStatus[];
  activeStopIndex: number;
  onPressStop?: (index: number) => void;
  onCheckIn?: (index: number) => void;
}

export const TrailProgressBar: React.FC<TrailProgressBarProps> = ({
  completedCount,
  totalCount,
  xpBonus,
  establishments,
  trailFoods = [],
  stopStatuses,
  activeStopIndex,
  onPressStop,
  onCheckIn,
}) => {
  const percent = Math.min(
    100,
    Math.round((completedCount / Math.max(1, totalCount)) * 100)
  );

  const safeActiveIndex =
    activeStopIndex >= 0 && activeStopIndex < establishments.length
      ? activeStopIndex
      : 0;
  const activeEstablishment = establishments[safeActiveIndex] || establishments[0];
  const signatureOffered =
    activeEstablishment?.foodsOffered?.find((f) => f.isSignature) ||
    activeEstablishment?.foodsOffered?.[0];
  const activeFoodName =
    trailFoods[safeActiveIndex]?.name ||
    signatureOffered?.foodName ||
    'Signature Naga Dish';

  const isFinished = completedCount === totalCount && totalCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.passportCard}>
        {/* ============================================================ */}
        {/* VINTAGE POSTMARK STAMP (Top-Right Authentic Postcard Accent) */}
        {/* ============================================================ */}
        <View style={styles.postmarkWrapper} pointerEvents="none">
          <View style={styles.postmarkOuterCircle}>
            <View style={styles.postmarkInnerDashedCircle}>
              <Text style={styles.postmarkTopText}>NAGA</Text>
              <Ionicons name="star" size={5} color={THEME.postmarkRed} />
              <Text style={styles.postmarkBottomText}>TRAIL</Text>
            </View>
          </View>
          <View style={styles.cancellationWaves}>
            <View style={styles.waveBar} />
            <View style={[styles.waveBar, { width: 14 }]} />
            <View style={[styles.waveBar, { width: 18 }]} />
          </View>
        </View>

        {/* ============================================================ */}
        {/* 1. HEADER ROW: PASSPORT IDENTITY & XP REWARD                 */}
        {/* ============================================================ */}
        <View style={styles.headerRow}>
          <View style={styles.passportBadgeGroup}>
            <View style={[styles.compassCircle, isFinished && styles.compassCircleDone]}>
              <Ionicons
                name={isFinished ? 'trophy' : 'compass'}
                size={16}
                color={isFinished ? '#FF9500' : THEME.terracotta}
              />
            </View>
            <View style={styles.titleTextCol}>
              <View style={styles.badgeLine}>
                <View style={styles.maskingTapeBadge}>
                  <Text style={styles.maskingTapeText}>EXPEDITION LOG</Text>
                </View>
                <View style={styles.xpBonusBadge}>
                  <Ionicons name="flame" size={11} color="#D42F13" />
                  <Text style={styles.xpBonusText}>+{xpBonus} XP</Text>
                </View>
              </View>
              <Text style={styles.passportTitle}>
                {isFinished
                  ? 'All Waypoints Conquered!'
                  : `${completedCount} of ${totalCount} Stops Stamped`}
              </Text>
            </View>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. PROGRESS BAR TRACK & PERCENT COMPLETE                    */}
        {/* ============================================================ */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percent}%` },
                isFinished && styles.progressBarFillDone,
              ]}
            />
          </View>
          <View style={styles.percentRow}>
            <Text style={styles.progressSubtext}>
              {isFinished
                ? 'Trail completed • Finisher badge awarded'
                : `${totalCount - completedCount} stop${totalCount - completedCount === 1 ? '' : 's'} remaining`}
            </Text>
            <Text style={styles.percentBadge}>{percent}%</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 3. DISCRETE PASSPORT WAYPOINT STAMP STRIP (O ── O ── O ── 🏆) */}
        {/* ============================================================ */}
        <View style={styles.stampTrackRow}>
          {establishments.map((est, idx) => {
            const status = stopStatuses[idx];
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const isLast = idx === establishments.length - 1;

            // Short readable display name (e.g. "Cha-Cha's", "Aling Cely's")
            const shortName = getShortVenueName(est.name);

            return (
              <React.Fragment key={`stamp-waypoint-${est.id}`}>
                {/* Stamp Waypoint Disc */}
                <Pressable
                  onPress={() => onPressStop?.(idx)}
                  style={styles.stampCol}
                  hitSlop={6}
                  accessibilityRole="button"
                  accessibilityLabel={`Waypoint ${idx + 1}: ${est.name}`}
                >
                  <View
                    style={[
                      styles.stampDisc,
                      isCompleted && styles.stampDiscCompleted,
                      isActive && styles.stampDiscActive,
                      status === 'locked' && styles.stampDiscLocked,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    ) : isActive ? (
                      <View style={styles.activeDiscInner}>
                        <Text style={styles.stampNumberActive}>{idx + 1}</Text>
                      </View>
                    ) : (
                      <Text style={styles.stampNumberLocked}>{idx + 1}</Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.stampLabel,
                      isCompleted && styles.stampLabelCompleted,
                      isActive && styles.stampLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {shortName}
                  </Text>
                </Pressable>

                {/* Connecting Path Segment */}
                {!isLast && (
                  <View style={styles.connectorSegmentCol}>
                    <View
                      style={[
                        styles.connectorSegmentLine,
                        idx < completedCount && styles.connectorLineCompleted,
                        idx === completedCount && styles.connectorLineActive,
                      ]}
                    />
                  </View>
                )}

                {/* Final Trophy Stamp */}
                {isLast && (
                  <>
                    <View style={styles.connectorSegmentCol}>
                      <View
                        style={[
                          styles.connectorSegmentLine,
                          isFinished && styles.connectorLineCompleted,
                        ]}
                      />
                    </View>
                    <View style={styles.stampCol}>
                      <View
                        style={[
                          styles.stampDisc,
                          styles.trophyDisc,
                          isFinished && styles.trophyDiscEarned,
                        ]}
                      >
                        <Ionicons
                          name={isFinished ? 'trophy' : 'ribbon-outline'}
                          size={13}
                          color={isFinished ? '#FFFFFF' : '#FF9500'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.stampLabel,
                          isFinished && styles.stampLabelEarned,
                        ]}
                        numberOfLines={1}
                      >
                        Badge
                      </Text>
                    </View>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* ============================================================ */}
        {/* 4. CURRENT WAYPOINT SPOTLIGHT / ACTIONABLE BRIEFING          */}
        {/* ============================================================ */}
        {activeEstablishment && !isFinished && (
          <View style={styles.spotlightContainer}>
            <View style={styles.spotlightHeaderRow}>
              <View style={styles.spotlightTag}>
                <View style={styles.pulseDot} />
                <Text style={styles.spotlightTagText}>NEXT OBJECTIVE</Text>
              </View>
              <Text style={styles.spotlightNeighborhood} numberOfLines={1}>
                {activeEstablishment.neighborhood}
              </Text>
            </View>

            <View style={styles.spotlightBodyRow}>
              <View style={styles.spotlightInfo}>
                <Text style={styles.spotlightVenueName} numberOfLines={1}>
                  {activeEstablishment.name}
                </Text>
                <Text style={styles.spotlightDishName} numberOfLines={1}>
                  Order: <Text style={styles.dishBold}>{activeFoodName}</Text>
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.spotlightActionRow}>
                <Pressable
                  onPress={() => onPressStop?.(safeActiveIndex)}
                  style={({ pressed }) => [
                    styles.detailsButton,
                    pressed && styles.btnPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="View venue details"
                >
                  <Text style={styles.detailsButtonText}>Details</Text>
                  <Ionicons name="chevron-forward" size={12} color={THEME.charcoal} />
                </Pressable>

                {onCheckIn && (
                  <Pressable
                    onPress={() => onCheckIn(safeActiveIndex)}
                    style={({ pressed }) => [
                      styles.stampButton,
                      pressed && styles.btnPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Stamp passport"
                  >
                    <Ionicons name="bookmark" size={11} color="#FFFFFF" />
                    <Text style={styles.stampButtonText}>Stamp</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Finisher Banner when complete */}
        {isFinished && (
          <View style={styles.finishedBanner}>
            <Ionicons name="ribbon" size={16} color="#FF9500" />
            <Text style={styles.finishedBannerText}>
              Expedition Completed! Finisher Crest unlocked below.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: -26, // Floats gracefully over the bottom of the full-bleed hero banner!
    marginBottom: 12,
    zIndex: 10,
  },
  passportCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: THEME.borderWarm,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  /* ================================================================== */
  /* VINTAGE POSTMARK STAMP (Top-Right Postcard Detail)                 */
  /* ================================================================== */
  postmarkWrapper: {
    position: 'absolute',
    top: -4,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
    transform: [{ rotate: '8deg' }],
    opacity: 0.85,
  },
  postmarkOuterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.1,
    borderColor: THEME.postmarkRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postmarkInnerDashedCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 0.9,
    borderColor: THEME.postmarkRed,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postmarkTopText: {
    fontSize: 5.8,
    fontWeight: '900',
    color: THEME.postmarkRed,
    letterSpacing: 0.4,
  },
  postmarkBottomText: {
    fontSize: 5.5,
    fontWeight: '900',
    color: THEME.postmarkRed,
    letterSpacing: 0.4,
  },
  cancellationWaves: {
    marginLeft: 2,
    justifyContent: 'space-between',
    height: 16,
  },
  waveBar: {
    height: 1.2,
    width: 16,
    backgroundColor: THEME.postmarkRed,
    borderRadius: 1,
  },

  /* ================================================================== */
  /* 1. HEADER ROW                                                     */
  /* ================================================================== */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  passportBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  compassCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(224, 83, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(224, 83, 60, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassCircleDone: {
    backgroundColor: 'rgba(255, 149, 0, 0.14)',
    borderColor: 'rgba(255, 149, 0, 0.35)',
  },
  titleTextCol: {
    flex: 1,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 3,
  },
  maskingTapeBadge: {
    backgroundColor: THEME.yellowWarm,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 3,
    transform: [{ rotate: '-1.5deg' }],
  },
  maskingTapeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: THEME.forestGreen,
    letterSpacing: 0.6,
  },
  passportTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: -0.2,
  },
  xpBonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: '#FFF1E8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
  },
  xpBonusText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#D42F13',
  },

  /* ================================================================== */
  /* 2. PROGRESS BAR                                                   */
  /* ================================================================== */
  progressSection: {
    marginBottom: 14,
  },
  progressBarTrack: {
    height: 9,
    backgroundColor: THEME.trackBg,
    borderRadius: 4.5,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  progressBarFill: {
    height: 9,
    borderRadius: 4.5,
    backgroundColor: THEME.terracotta,
  },
  progressBarFillDone: {
    backgroundColor: '#2E7D32',
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressSubtext: {
    fontSize: 10.5,
    fontWeight: '600',
    color: THEME.mutedText,
  },
  percentBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.terracotta,
  },

  /* ================================================================== */
  /* 3. STAMP TRACK ROW                                                */
  /* ================================================================== */
  stampTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 14,
  },
  stampCol: {
    alignItems: 'center',
    width: 48,
  },
  stampDisc: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: THEME.borderWarm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stampDiscCompleted: {
    backgroundColor: THEME.terracotta,
    borderColor: THEME.terracottaDark,
    ...Platform.select({
      ios: {
        shadowColor: THEME.terracotta,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  stampDiscActive: {
    backgroundColor: '#D42F13',
    borderColor: '#FFD700',
    borderWidth: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stampDiscLocked: {
    backgroundColor: 'rgba(118, 118, 128, 0.06)',
    borderColor: 'rgba(60, 60, 67, 0.18)',
    borderStyle: 'dashed',
  },
  trophyDisc: {
    borderColor: 'rgba(255, 149, 0, 0.45)',
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
  },
  trophyDiscEarned: {
    backgroundColor: '#FF9500',
    borderColor: '#E68500',
  },
  activeDiscInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampNumberActive: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  stampNumberLocked: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.45)',
  },
  stampLabel: {
    fontSize: 9.5,
    fontWeight: '500',
    color: THEME.mutedText,
    textAlign: 'center',
  },
  stampLabelCompleted: {
    color: THEME.terracotta,
    fontWeight: '700',
  },
  stampLabelActive: {
    color: '#D42F13',
    fontWeight: '800',
  },
  stampLabelEarned: {
    color: '#FF9500',
    fontWeight: '800',
  },
  connectorSegmentCol: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
    marginBottom: 14,
  },
  connectorSegmentLine: {
    height: 2,
    backgroundColor: THEME.trackBg,
  },
  connectorLineCompleted: {
    backgroundColor: THEME.terracotta,
    height: 2.5,
  },
  connectorLineActive: {
    backgroundColor: '#D42F13',
    height: 2.5,
  },

  /* ================================================================== */
  /* 4. CURRENT WAYPOINT SPOTLIGHT BRIEFING                             */
  /* ================================================================== */
  spotlightContainer: {
    backgroundColor: '#FAF5EA',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E8DCB8',
  },
  spotlightHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  spotlightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D42F13',
  },
  spotlightTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  spotlightNeighborhood: {
    fontSize: 10,
    color: THEME.mutedText,
    fontWeight: '500',
  },
  spotlightBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  spotlightInfo: {
    flex: 1,
  },
  spotlightVenueName: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: -0.2,
    marginBottom: 1,
  },
  spotlightDishName: {
    fontSize: 10.5,
    color: THEME.mutedText,
    fontWeight: '500',
  },
  dishBold: {
    fontWeight: '700',
    color: THEME.charcoal,
  },
  spotlightActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: THEME.borderWarm,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsButtonText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: THEME.charcoal,
  },
  stampButton: {
    backgroundColor: THEME.terracotta,
    borderRadius: 8,
    paddingVertical: 5.5,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  stampButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  finishedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  finishedBannerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B26A00',
    flex: 1,
  },
});
