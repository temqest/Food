import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';

interface ExplorerStatusBarProps {
  district: string;
  onDistrictPress?: () => void;
}

export const ExplorerStatusBar: React.FC<ExplorerStatusBarProps> = ({
  district,
  onDistrictPress,
}) => {
  const { currentRank, nextRank, xp, rankProgressPercent, unlockedBadges } = useQuest();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.push('/basket')} // Opens Passport
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Explorer Level ${currentRank.level}: ${currentRank.title}. Progress: ${rankProgressPercent}%`}
      >
        {/* Top line: Level badge + Title & District */}
        <View style={styles.topRow}>
          <View style={styles.rankBadge}>
            <Ionicons name="flame" size={14} color="#D42F13" />
            <Text style={styles.rankBadgeText}>LVL {currentRank.level}</Text>
          </View>

          <View style={styles.titleInfo}>
            <Text style={styles.rankTitle} numberOfLines={1}>
              {currentRank.title}
            </Text>
            <Text style={styles.subText}>
              Naga Explorer · {district}
            </Text>
          </View>

          <View style={styles.badgesSummary}>
            <View style={styles.stampPill}>
              <Ionicons name="ribbon" size={12} color="#D42F13" />
              <Text style={styles.stampCount}>{unlockedBadges.length} Badges</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#8E8E93" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Progress Bar for XP */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${rankProgressPercent}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressXpText}>
              {xp} XP
            </Text>
            <Text style={styles.progressNextText}>
              {nextRank ? `${nextRank.minXp - xp} XP to ${nextRank.title}` : 'Max Level'}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
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
  cardPressed: {
    opacity: 0.88,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
    marginLeft: 3,
    letterSpacing: 0.5,
  },
  titleInfo: {
    flex: 1,
  },
  rankTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  subText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
    marginTop: 1,
  },
  badgesSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stampPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stampCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 4,
  },
  progressSection: {
    marginTop: 2,
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D42F13',
    borderRadius: 2.5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  progressXpText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D42F13',
  },
  progressNextText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.50)',
  },
});
