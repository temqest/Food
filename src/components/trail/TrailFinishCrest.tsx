import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLLECTIBLE_BADGES } from '@/data/gamification';

// Thematic Palette matching the vintage Naga Food Passport
const THEME = {
  cardBg: '#FFFDF7',           // Off-white / cream postcard paper
  borderWarm: '#D8CBB5',       // Thin warm border
  borderGold: '#D4AF37',       // Gold certificate border
  terracotta: '#E0533C',       // Terracotta accent
  terracottaDark: '#B83A25',   // Deep Terracotta
  forestGreen: '#1E3A2B',      // Forest Green title & headers
  yellowWarm: '#FFC857',       // Warm Yellow sticker/accent
  amberCta: '#FFB703',         // CTA Yellow/Terracotta button
  charcoal: '#2D2B2A',         // Charcoal typography
  mutedText: '#6F6A64',        // Warm secondary charcoal
  postmarkRed: 'rgba(212, 70, 50, 0.72)', // Vintage stamp ink
};

interface TrailFinishCrestProps {
  badgeId: string;
  xpBonus: number;
  isAllCompleted: boolean;
  remainingCount: number;
}

export const TrailFinishCrest: React.FC<TrailFinishCrestProps> = ({
  badgeId,
  xpBonus,
  isAllCompleted,
  remainingCount,
}) => {
  const badge = COLLECTIBLE_BADGES.find((b) => b.id === badgeId);
  const badgeName = badge?.name || 'Trail Finisher Badge';
  const badgeDesc = badge?.description || 'Awarded for conquering all stops on the culinary crawl.';

  return (
    <View style={styles.container}>
      {/* Decorative Ribbon Header */}
      <View style={styles.ribbonWrapper}>
        {/* Road arrival docking port */}
        <View
          style={[
            styles.roadDockTop,
            isAllCompleted && styles.roadDockActive,
          ]}
        />
        <View style={[styles.ribbonPill, isAllCompleted && styles.ribbonCompleted]}>
          <Ionicons
            name={isAllCompleted ? 'trophy' : 'ribbon-outline'}
            size={13}
            color={isAllCompleted ? '#FFFFFF' : '#FF9500'}
          />
          <Text style={[styles.ribbonText, isAllCompleted && styles.ribbonTextCompleted]}>
            {isAllCompleted ? 'EXPEDITION CONQUERED' : 'TRAIL FINISH SHRINE'}
          </Text>
        </View>
      </View>

      {/* Main Golden Wax Seal / Crest Body */}
      <View style={[styles.card, isAllCompleted && styles.cardCompleted]}>
        {/* Vintage Postmark Stamp when completed */}
        {isAllCompleted && (
          <View style={styles.postmarkWrapper} pointerEvents="none">
            <View style={styles.postmarkOuterCircle}>
              <View style={styles.postmarkInnerDashedCircle}>
                <Text style={styles.postmarkTopText}>MASTER</Text>
                <Ionicons name="star" size={5} color={THEME.postmarkRed} />
                <Text style={styles.postmarkBottomText}>PASSED</Text>
              </View>
            </View>
          </View>
        )}

        {/* Golden Wax Seal Medallion */}
        <View style={[styles.crestCircle, isAllCompleted && styles.crestCircleCompleted]}>
          <Ionicons
            name={isAllCompleted ? 'ribbon' : 'medal-outline'}
            size={38}
            color={isAllCompleted ? '#FFFFFF' : '#B87333'}
          />
        </View>

        {/* Certificate Titles */}
        <View style={styles.certificateSubtitleBadge}>
          <Text style={styles.certificateSubtitleText}>NAGA FOOD GUILD HONOR</Text>
        </View>

        <Text style={styles.badgeTitle}>{badgeName}</Text>
        <Text style={styles.badgeDescription}>{badgeDesc}</Text>

        {/* Rewards Row */}
        <View style={styles.rewardRow}>
          <View style={styles.xpRewardPill}>
            <Ionicons name="flame" size={13} color="#D42F13" />
            <Text style={styles.xpRewardText}>+{xpBonus} XP Bonus</Text>
          </View>
          <View style={styles.passportRewardPill}>
            <Ionicons name="shield-checkmark" size={13} color={THEME.forestGreen} />
            <Text style={styles.passportRewardText}>Passport Crest</Text>
          </View>
        </View>

        {/* Status Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            {isAllCompleted
              ? '✨ Fantastic job! You have fully explored and conquered every stop along this authentic Naga food trail.'
              : `🎯 Check in at ${remainingCount} more ${remainingCount === 1 ? 'stop' : 'stops'} to unlock this badge and claim your +${xpBonus} XP!`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: -1, // Seamlessly connects with the incoming dashed road
    marginBottom: 32,
    alignItems: 'center',
    zIndex: 2,
  },
  ribbonWrapper: {
    marginBottom: -12,
    zIndex: 4,
    alignItems: 'center',
  },
  roadDockTop: {
    width: 12,
    height: 3,
    backgroundColor: 'rgba(135, 125, 115, 0.45)',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignSelf: 'center',
    marginBottom: -1,
    zIndex: 10,
  },
  roadDockActive: {
    backgroundColor: '#D42F13',
  },
  ribbonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#FFC857',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ribbonCompleted: {
    backgroundColor: '#FF9500',
    borderColor: '#E68500',
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B87333',
    letterSpacing: 0.6,
  },
  ribbonTextCompleted: {
    color: '#FFFFFF',
  },
  card: {
    width: '100%',
    maxWidth: 348,
    backgroundColor: THEME.cardBg,
    borderRadius: 22,
    paddingTop: 26,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.4,
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
        elevation: 5,
      },
    }),
  },
  cardCompleted: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  postmarkWrapper: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 5,
    transform: [{ rotate: '12deg' }],
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
    fontSize: 5.5,
    fontWeight: '900',
    color: THEME.postmarkRed,
    letterSpacing: 0.4,
  },
  postmarkBottomText: {
    fontSize: 5,
    fontWeight: '900',
    color: THEME.postmarkRed,
    letterSpacing: 0.4,
  },
  crestCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(184, 115, 51, 0.12)',
    borderWidth: 1.5,
    borderColor: '#D8CBB5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  crestCircleCompleted: {
    backgroundColor: '#FF9500',
    borderColor: '#FFD700',
    borderWidth: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: '#FF9500',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  certificateSubtitleBadge: {
    backgroundColor: THEME.yellowWarm,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
    transform: [{ rotate: '-1deg' }],
  },
  certificateSubtitleText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: THEME.forestGreen,
    letterSpacing: 0.8,
  },
  badgeTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: -0.3,
    marginBottom: 5,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12.5,
    color: THEME.mutedText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  xpRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 9999,
    backgroundColor: '#FFF1E8',
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
  },
  xpRewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D42F13',
  },
  passportRewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 9999,
    backgroundColor: '#EAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(30, 58, 43, 0.20)',
  },
  passportRewardText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.forestGreen,
  },
  promptContainer: {
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 0.8,
    borderTopColor: THEME.borderWarm,
  },
  promptText: {
    fontSize: 11.5,
    color: THEME.mutedText,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});
