import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuest } from '@/context/QuestContext';
import { StreakTrophy } from '@/data/gamification';

interface DayHabitNode {
  dayName: string;
  dayShort: string;
  isPast: boolean;
  isToday: boolean;
  isFuture: boolean;
  completed: boolean;
}

export default function StreakScreen() {
  const {
    streakCount,
    streakFreezeCount,
    todayCheckInDone,
    checkInToday,
    reminderTime,
    setReminderTime,
    useSiliShield,
    currentRank,
    nextRank,
    rankProgressPercent,
    xp,
    trophies,
  } = useQuest();

  // Selected Trophy for Details Modal
  const [selectedTrophy, setSelectedTrophy] = useState<StreakTrophy | null>(null);

  // Sili Shield Tooltip Modal
  const [isShieldModalVisible, setIsShieldModalVisible] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // 7 days of the week starting from Monday to Sunday
  const weekNodes: DayHabitNode[] = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentJsDay = new Date().getDay();
    // Normalize so Monday is index 0, Sunday is index 6
    const todayIndex = currentJsDay === 0 ? 6 : currentJsDay - 1;

    return dayNames.map((name, idx) => {
      const isToday = idx === todayIndex;
      const isPast = idx < todayIndex;
      const isFuture = idx > todayIndex;
      const completed = isPast ? true : isToday ? todayCheckInDone : false;

      return {
        dayName: name,
        dayShort: name[0],
        isPast,
        isToday,
        isFuture,
        completed,
      };
    });
  }, [todayCheckInDone]);

  const handleCheckIn = () => {
    if (todayCheckInDone) {
      showToast('Streak already protected for today! 🔥');
      return;
    }

    const { xpAwarded, newStreak } = checkInToday();
    showToast(`🔥 Day ${newStreak} logged! +${xpAwarded} XP awarded!`);
  };

  const handleSetReminder = (time: '11:45 AM' | '3:45 PM' | '6:30 PM' | 'off') => {
    setReminderTime(time);
    if (time === 'off') {
      showToast('Mealtime reminders muted.');
    } else {
      showToast(`Reminder set for ${time}! 🔔`);
    }
  };

  const handleUseShield = () => {
    if (streakFreezeCount <= 0) {
      Alert.alert(
        'No Sili Shields Available',
        'Earn extra shields by reaching higher foodie levels or maintaining 7-day streaks!'
      );
      return;
    }
    const success = useSiliShield();
    if (success) {
      setIsShieldModalVisible(false);
      showToast('🛡️ 1 Sili Shield equipped! Your streak is safe.');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* 1. Header Bar */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#1C1C1E" />
        </Pressable>

        <Text style={styles.headerTitle}>Tasting Streak</Text>

        {/* Sili Shield Counter Pill */}
        <Pressable
          onPress={() => setIsShieldModalVisible(true)}
          style={({ pressed }) => [styles.shieldPill, pressed && styles.pressed]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Sili Shields: ${streakFreezeCount} available`}
        >
          <Ionicons name="shield-checkmark" size={15} color="#FF6A00" />
          <Text style={styles.shieldPillText}>{streakFreezeCount} Shields</Text>
        </Pressable>
      </View>

      {/* Floating Success Toast */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Unified Hero Flame & Habit Calendar Card (Compact, Duolingo Style) */}
        <View style={styles.unifiedHeroCard}>
          {/* Flame Icon & Big Streak Number */}
          <View style={styles.heroFlameRow}>
            <View style={styles.flameCircle}>
              <Ionicons name="flame" size={38} color="#FF5500" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.streakCountRow}>
                <Text style={styles.heroStreakNumber}>{streakCount}</Text>
                <Text style={styles.heroStreakLabel}>DAY STREAK</Text>
              </View>
              <Text style={styles.heroStatusText}>
                {todayCheckInDone
                  ? "You're on fire today! Streak locked in."
                  : 'Keep the flame burning before midnight.'}
              </Text>
            </View>
          </View>

          {/* 7-Day Consistency Week Strip */}
          <View style={styles.calendarDivider} />

          <View style={styles.calendarHeaderRow}>
            <View style={styles.calendarTitleCol}>
              <Text style={styles.calendarTitle}>This Week’s Consistency</Text>
            </View>
            <View style={styles.calendarFlameBadge}>
              <Ionicons name="flame" size={13} color="#FF6A00" />
              <Text style={styles.calendarFlameText}>{streakCount}d Active</Text>
            </View>
          </View>

          <View style={styles.weekCalendarRow}>
            {weekNodes.map((node, index) => (
              <View key={index} style={styles.dayCol}>
                <Text
                  style={[
                    styles.dayColHeader,
                    node.isToday && styles.dayColHeaderToday,
                  ]}
                >
                  {node.dayShort}
                </Text>

                <View
                  style={[
                    styles.dayCircle,
                    node.completed && styles.dayCircleCompleted,
                    node.isToday && !node.completed && styles.dayCircleTodayPending,
                    node.isFuture && styles.dayCircleFuture,
                  ]}
                >
                  {node.completed ? (
                    <Ionicons name="flame" size={16} color="#FFFFFF" />
                  ) : node.isToday ? (
                    <Ionicons name="hourglass-outline" size={15} color="#FF8800" />
                  ) : (
                    <View style={styles.futureDot} />
                  )}
                </View>

                <Text
                  style={[
                    styles.dayLabelBottom,
                    node.isToday && styles.dayLabelBottomToday,
                  ]}
                >
                  {node.isToday ? 'Today' : node.dayName}
                </Text>
              </View>
            ))}
          </View>

          {/* Integrated Action Button */}
          {todayCheckInDone ? (
            <View style={styles.checkedInRow}>
              <Ionicons name="checkmark-circle" size={18} color="#34C759" />
              <Text style={styles.checkedInText}>Streak safely protected for today (+30 XP earned)</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleCheckIn}
              style={({ pressed }) => [styles.checkInBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Check in for today"
            >
              <Ionicons name="flame" size={18} color="#FFFFFF" />
              <Text style={styles.checkInBtnText}>Check In for Today (+30 XP)</Text>
            </Pressable>
          )}
        </View>

        {/* 3. Explorer Level HUD Card */}
        <View style={styles.compactCard}>
          <View style={styles.levelHeaderRow}>
            <View style={styles.levelIconCircle}>
              <Ionicons name="restaurant-outline" size={18} color="#D42F13" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.levelTitleRow}>
                <Text style={styles.levelTitle}>
                  Level {currentRank.level} • {currentRank.title}
                </Text>
                <Text style={styles.xpText}>{xp} XP</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${rankProgressPercent}%` }]} />
              </View>
              <Text style={styles.levelNextSub}>
                {nextRank
                  ? `${rankProgressPercent}% to Level ${nextRank.level}: ${nextRank.title} (${nextRank.minXp} XP)`
                  : 'Max Rank Achieved!'}
              </Text>
            </View>
          </View>
        </View>

        {/* 4. Streak Trophies (Compact Horizontal Carousel) */}
        <View style={styles.compactCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Streak Trophies</Text>
            <Ionicons name="trophy" size={16} color="#FFB800" />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trophiesScrollRow}
          >
            {trophies.map((trophy) => {
              const isUnlocked = trophy.unlocked || streakCount >= trophy.daysRequired;
              const progressPct = Math.min(100, Math.round((streakCount / trophy.daysRequired) * 100));

              return (
                <Pressable
                  key={trophy.id}
                  onPress={() => setSelectedTrophy(trophy)}
                  style={({ pressed }) => [
                    styles.trophyPillCard,
                    isUnlocked ? styles.trophyPillCardUnlocked : styles.trophyPillCardLocked,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${trophy.title}: ${isUnlocked ? 'Unlocked' : 'Locked'}`}
                >
                  <View
                    style={[
                      styles.trophyMiniCircle,
                      { backgroundColor: isUnlocked ? `${trophy.color}20` : '#E5E5EA' },
                    ]}
                  >
                    <Ionicons
                      name={isUnlocked ? 'trophy' : 'lock-closed'}
                      size={20}
                      color={isUnlocked ? trophy.color : '#8E8E93'}
                    />
                  </View>

                  <Text style={styles.trophyPillTitle} numberOfLines={1}>
                    {trophy.title}
                  </Text>
                  <Text style={styles.trophyPillSub}>{trophy.daysRequired}d streak</Text>

                  {isUnlocked ? (
                    <View style={styles.claimedPill}>
                      <Ionicons name="checkmark-circle" size={11} color="#34C759" />
                      <Text style={styles.claimedText}>Unlocked</Text>
                    </View>
                  ) : (
                    <View style={styles.miniProgressTrack}>
                      <View style={[styles.miniProgressFill, { width: `${progressPct}%` }]} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 5. Mealtime Habit Nudges (Compact 1-Row Selector) */}
        <View style={styles.compactCard}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Mealtime Habit Reminders</Text>
            <Ionicons name="notifications-outline" size={16} color="#FF6A00" />
          </View>
          <Text style={styles.nudgeSubtext}>
            Get a smart reminder to eat & explore during Naga's peak food hours:
          </Text>

          <View style={styles.reminderChipsRow}>
            {[
              { id: '11:45 AM', label: '☀️ Lunch', time: '11:45 AM' },
              { id: '3:45 PM', label: '☕ Merienda', time: '3:45 PM' },
              { id: '6:30 PM', label: '🌙 Dinner', time: '6:30 PM' },
              { id: 'off', label: '🔕 Off', time: 'Off' },
            ].map((opt) => {
              const isSelected = reminderTime === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() =>
                    handleSetReminder(opt.id as '11:45 AM' | '3:45 PM' | '6:30 PM' | 'off')
                  }
                  style={({ pressed }) => [
                    styles.reminderChip,
                    isSelected && styles.reminderChipSelected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.reminderChipText,
                      isSelected && styles.reminderChipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.reminderChipTime,
                      isSelected && styles.reminderChipTimeSelected,
                    ]}
                  >
                    {opt.time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Sili Shield (Streak Freeze) Modal */}
      <Modal
        visible={isShieldModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsShieldModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalShieldIcon}>
              <Ionicons name="shield-checkmark" size={32} color="#FF6A00" />
            </View>
            <Text style={styles.modalTitle}>Sili Shields (Streak Freezes)</Text>
            <Text style={styles.modalDesc}>
              A Sili Shield protects your streak! If you ever miss logging on a busy day, 1 shield
              automatically consumes itself to keep your streak burning.
            </Text>

            <View style={styles.modalStatusRow}>
              <Text style={styles.modalStatusLabel}>Available Shields:</Text>
              <Text style={styles.modalStatusCount}>{streakFreezeCount} Shields</Text>
            </View>

            <View style={styles.modalButtonsRow}>
              <Pressable
                onPress={() => setIsShieldModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelBtnText}>Close</Text>
              </Pressable>
              <Pressable onPress={handleUseShield} style={styles.modalActionBtn}>
                <Text style={styles.modalActionBtnText}>Equip Shield</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Trophy Details Modal */}
      <Modal
        visible={!!selectedTrophy}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTrophy(null)}
      >
        <View style={styles.modalOverlay}>
          {selectedTrophy && (
            <View style={styles.modalCard}>
              <View
                style={[
                  styles.modalTrophyIconCircle,
                  { backgroundColor: `${selectedTrophy.color}25` },
                ]}
              >
                <Ionicons
                  name={selectedTrophy.icon as any}
                  size={36}
                  color={selectedTrophy.color}
                />
              </View>

              <Text style={styles.modalTitle}>{selectedTrophy.title}</Text>
              <View
                style={[
                  styles.trophyTierBadge,
                  { backgroundColor: `${selectedTrophy.color}15` },
                ]}
              >
                <Text style={[styles.trophyTierBadgeText, { color: selectedTrophy.color }]}>
                  {selectedTrophy.badgeTag}
                </Text>
              </View>

              <Text style={styles.modalDesc}>{selectedTrophy.description}</Text>

              <View style={styles.trophyRequirementRow}>
                <Text style={styles.trophyReqLabel}>Criteria:</Text>
                <Text style={styles.trophyReqValue}>
                  {selectedTrophy.daysRequired} Days Streak
                </Text>
              </View>

              <View style={styles.trophyRequirementRow}>
                <Text style={styles.trophyReqLabel}>Reward:</Text>
                <Text style={styles.trophyReqValue}>+{selectedTrophy.xpReward} XP</Text>
              </View>

              <View style={styles.trophyRequirementRow}>
                <Text style={styles.trophyReqLabel}>Status:</Text>
                <Text
                  style={[
                    styles.trophyReqValue,
                    {
                      color:
                        selectedTrophy.unlocked || streakCount >= selectedTrophy.daysRequired
                          ? '#34C759'
                          : '#FF9500',
                    },
                  ]}
                >
                  {selectedTrophy.unlocked || streakCount >= selectedTrophy.daysRequired
                    ? '🏆 Claimed'
                    : `In Progress (${streakCount}/${selectedTrophy.daysRequired}d)`}
                </Text>
              </View>

              <Pressable
                onPress={() => setSelectedTrophy(null)}
                style={styles.modalClosePrimaryBtn}
              >
                <Text style={styles.modalClosePrimaryBtnText}>Got It</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFD1B3',
    gap: 4,
  },
  shieldPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6A00',
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 60 : 70,
    left: 20,
    right: 20,
    zIndex: 999,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },

  // Unified Hero Flame & Habit Calendar Card
  unifiedHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE0CC',
    shadowColor: '#FF6A00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroFlameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flameCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD1B3',
  },
  streakCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  heroStreakNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FF5500',
    lineHeight: 38,
  },
  heroStreakLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: 1,
  },
  heroStatusText: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
    lineHeight: 16,
  },
  calendarDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 14,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  calendarFlameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
    flexShrink: 0,
  },
  calendarFlameText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6A00',
  },
  weekCalendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayColHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  dayColHeaderToday: {
    color: '#FF6A00',
    fontWeight: '800',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayCircleCompleted: {
    backgroundColor: '#FF6A00',
  },
  dayCircleTodayPending: {
    backgroundColor: '#FFF5ED',
    borderColor: '#FF6A00',
    borderStyle: 'dashed',
  },
  dayCircleFuture: {
    backgroundColor: '#F2F2F7',
  },
  futureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#C7C7CC',
  },
  dayLabelBottom: {
    fontSize: 10,
    color: '#8E8E93',
  },
  dayLabelBottomToday: {
    color: '#FF6A00',
    fontWeight: '700',
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5500',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  checkInBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8ED',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  checkedInText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#285C30',
  },

  // Compact Card Base
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },

  // Level HUD
  levelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9500',
    borderRadius: 4,
  },
  levelNextSub: {
    fontSize: 11,
    color: '#8E8E93',
  },

  // Trophies Section
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  trophiesScrollRow: {
    gap: 8,
    paddingVertical: 2,
  },
  trophyPillCard: {
    width: 115,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  trophyPillCardUnlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFD700',
  },
  trophyPillCardLocked: {
    backgroundColor: '#F9F9FB',
    borderColor: '#E5E5EA',
  },
  trophyMiniCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  trophyPillTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 2,
  },
  trophyPillSub: {
    fontSize: 10,
    color: '#8E8E93',
    marginBottom: 6,
  },
  claimedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  claimedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#34C759',
  },
  miniProgressTrack: {
    width: '80%',
    height: 3,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#FF6A00',
    borderRadius: 2,
  },

  // Nudge Reminders (1-Row Strip)
  nudgeSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 10,
  },
  reminderChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  reminderChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  reminderChipSelected: {
    backgroundColor: '#FFF0E6',
    borderColor: '#FF6A00',
  },
  reminderChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
    marginBottom: 2,
  },
  reminderChipTextSelected: {
    color: '#FF6A00',
  },
  reminderChipTime: {
    fontSize: 9,
    color: '#8E8E93',
  },
  reminderChipTimeSelected: {
    color: '#FF6A00',
    fontWeight: '600',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalShieldIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalTrophyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 4,
  },
  trophyTierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  trophyTierBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalDesc: {
    fontSize: 12,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    marginBottom: 14,
  },
  modalStatusLabel: {
    fontSize: 12,
    color: '#636366',
  },
  modalStatusCount: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF6A00',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
  },
  modalActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trophyRequirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  trophyReqLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  trophyReqValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  modalClosePrimaryBtn: {
    width: '100%',
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
  },
  modalClosePrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.8,
  },
});
