import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { QuestItem } from '@/data/gamification';
import { useQuest } from '@/context/QuestContext';

interface QuestCardProps {
  quest: QuestItem;
  onPressDish?: (dishId: string) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onPressDish }) => {
  const { completedQuestIds, completeQuest } = useQuest();
  const isDone = completedQuestIds.includes(quest.id);

  const handleAction = () => {
    if (isDone) return;
    if (quest.targetDish) {
      router.push({
        pathname: '/food/[id]',
        params: { id: quest.targetDish },
      });
    } else {
      completeQuest(quest.id);
    }
  };

  return (
    <View style={[styles.card, isDone && styles.cardCompleted]}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={styles.questTypeBadge}>
            <Ionicons name="sparkles" size={11} color="#D42F13" />
            <Text style={styles.questTypeBadgeText}>NAGA FOOD QUEST</Text>
          </View>
          <Text style={styles.districtText}>· {quest.district}</Text>
        </View>

        <View style={styles.xpRewardBadge}>
          <Text style={styles.xpRewardText}>+{quest.xpReward} XP</Text>
        </View>
      </View>

      <Text style={styles.questTitle}>{quest.title}</Text>
      <Text style={styles.questPrompt}>{quest.prompt}</Text>

      {quest.timeContext && (
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={12} color="#8E8E93" />
          <Text style={styles.timeText}>{quest.timeContext}</Text>
        </View>
      )}

      <View style={styles.footerRow}>
        {isDone ? (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.completedText}>Quest Completed</Text>
          </View>
        ) : (
          <Pressable
            onPress={handleAction}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Start quest: ${quest.title}`}
          >
            <Text style={styles.actionButtonText}>
              {quest.targetDish ? 'Find Dish & Complete ›' : 'Claim Reward ›'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
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
  cardCompleted: {
    backgroundColor: '#F9F9FB',
    borderColor: '#E5E5EA',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  questTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
    marginLeft: 3,
    letterSpacing: 0.4,
  },
  districtText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
    marginLeft: 6,
    fontWeight: '500',
  },
  xpRewardBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  xpRewardText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  questTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  questPrompt: {
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(60, 60, 67, 0.75)',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F2F2F7',
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionButtonPressed: {
    opacity: 0.85,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 4,
  },
});
