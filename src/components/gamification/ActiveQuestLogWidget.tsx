import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';
import { QuestItem } from '@/data/gamification';

export const ActiveQuestLogWidget: React.FC = () => {
  const { dailyQuests, completedQuestIds, claimQuestReward } = useQuest();
  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  const completedCount = dailyQuests.filter((q) => completedQuestIds.includes(q.id)).length;

  const handleQuestAction = (quest: QuestItem) => {
    if (completedQuestIds.includes(quest.id)) return;

    const result = claimQuestReward(quest.id);
    if (result.xpAwarded > 0) {
      setJustClaimedId(quest.id);
      setTimeout(() => setJustClaimedId(null), 3000);
    }
  };

  const handleOpenDish = (dishId?: string) => {
    if (dishId) {
      router.push({
        pathname: '/food/[id]',
        params: { id: dishId },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Widget Header with Progress Counter */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.flameCircle}>
            <Ionicons name="flame" size={15} color="#D42F13" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Daily Food Quests</Text>
            <Text style={styles.sectionSubtitle}>Explore Naga’s food corridors for bonus XP</Text>
          </View>
        </View>

        <View style={styles.progressPill}>
          <Ionicons name="checkmark-circle" size={12} color="#34C759" />
          <Text style={styles.progressPillText}>
            {completedCount}/{dailyQuests.length} Done
          </Text>
        </View>
      </View>

      {/* Horizontal Swipeable Quest Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {dailyQuests.map((quest) => {
          const isCompleted = completedQuestIds.includes(quest.id);
          const wasJustClaimed = justClaimedId === quest.id;

          return (
            <View
              key={quest.id}
              style={[
                styles.questCard,
                isCompleted && styles.questCardCompleted,
              ]}
            >
              {/* Top Row: District & XP Reward */}
              <View style={styles.cardTopRow}>
                <View style={styles.districtBadge}>
                  <Ionicons name="location-sharp" size={11} color="#D42F13" />
                  <Text style={styles.districtBadgeText}>{quest.district}</Text>
                </View>

                <View style={[styles.xpBadge, isCompleted && styles.xpBadgeCompleted]}>
                  <Ionicons
                    name={isCompleted ? 'checkmark' : 'flash'}
                    size={11}
                    color={isCompleted ? '#34C759' : '#FF9500'}
                  />
                  <Text
                    style={[styles.xpBadgeText, isCompleted && styles.xpBadgeTextCompleted]}
                  >
                    +{quest.xpReward} XP
                  </Text>
                </View>
              </View>

              {/* Title & Prompt */}
              <Text style={styles.questTitle} numberOfLines={1}>
                {quest.title}
              </Text>
              <Text style={styles.questPrompt} numberOfLines={2}>
                {quest.prompt}
              </Text>

              {/* Time Context */}
              {quest.timeContext && (
                <View style={styles.timeContextRow}>
                  <Ionicons name="time-outline" size={11} color="#8E8E93" />
                  <Text style={styles.timeContextText} numberOfLines={1}>
                    {quest.timeContext}
                  </Text>
                </View>
              )}

              {/* Action Button */}
              <View style={styles.actionRow}>
                {isCompleted ? (
                  <View style={styles.completedBtn}>
                    <Ionicons name="checkmark-done" size={14} color="#34C759" />
                    <Text style={styles.completedBtnText}>
                      {wasJustClaimed ? 'XP Claimed!' : 'Completed'}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => handleQuestAction(quest)}
                    style={({ pressed }) => [styles.claimBtn, pressed && styles.pressed]}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={`Claim quest: ${quest.title}`}
                  >
                    <Text style={styles.claimBtnText}>{quest.actionText}</Text>
                    <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                  </Pressable>
                )}

                {quest.targetDish && (
                  <Pressable
                    onPress={() => handleOpenDish(quest.targetDish)}
                    hitSlop={8}
                    style={styles.dishInfoLink}
                  >
                    <Ionicons name="information-circle-outline" size={16} color="#8E8E93" />
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#8E8E93',
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  progressPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
  },
  cardsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  questCard: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'space-between',
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
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  questCardCompleted: {
    backgroundColor: '#F9F9FB',
    borderColor: '#E1E1E6',
    opacity: 0.85,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  districtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  districtBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  xpBadgeCompleted: {
    backgroundColor: '#E8F8EE',
  },
  xpBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF9500',
  },
  xpBadgeTextCompleted: {
    color: '#34C759',
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  questPrompt: {
    fontSize: 12,
    color: '#3C3C43',
    lineHeight: 16,
    marginBottom: 8,
  },
  timeContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  timeContextText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  claimBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    marginRight: 6,
  },
  claimBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8EE',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
    marginRight: 6,
  },
  completedBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
  },
  dishInfoLink: {
    padding: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});
