import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFriends, LeaderboardEntry } from '@/context/FriendsContext';
import { UserAvatar } from '@/components/common/UserAvatar';
import { FoodieProfile } from '@/data/friendsData';

export default function FriendsScreen() {
  const {
    division,
    friends,
    leaderboard,
    currentUserEntry,
    nudgeFriend,
    toggleFollowFriend,
    addFriendByHandle,
    searchFoodies,
  } = useFriends();

  const [activeTab, setActiveTab] = useState<'league' | 'friends'>('league');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleNudge = (friend: FoodieProfile) => {
    const res = nudgeFriend(friend.id);
    if (res.alreadyNudged) {
      showToast(`Already sent a reminder to ${res.friendName} today! 👍`);
    } else if (res.success) {
      showToast(`🔥 "Tara Kain!" reminder sent to ${res.friendName}!`);
    }
  };

  const handleAddSubmit = () => {
    if (!searchQuery.trim()) {
      showToast('Enter a foodie handle to search');
      return;
    }
    const res = addFriendByHandle(searchQuery);
    showToast(res.message);
    if (res.success) {
      setSearchQuery('');
      setIsAddModalVisible(false);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFoodies(searchQuery);
  }, [searchQuery, searchFoodies]);

  // Rank decoration helper
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return {
        icon: 'trophy',
        color: '#D97706',
        bg: '#FEF3C7',
        label: '1st',
      };
    }
    if (rank === 2) {
      return {
        icon: 'medal',
        color: '#64748B',
        bg: '#F1F5F9',
        label: '2nd',
      };
    }
    if (rank === 3) {
      return {
        icon: 'ribbon',
        color: '#B45309',
        bg: '#FFEDD5',
        label: '3rd',
      };
    }
    return {
      icon: null,
      color: '#6E6E73',
      bg: '#F2F2F7',
      label: `${rank}`,
    };
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* 1. Header Navigation Bar */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Ionicons name="arrow-back" size={22} color="#1C1C1E" />
        </Pressable>

        <View style={styles.headerCenterCol}>
          <Text style={styles.headerTitle}>Foodie Hub</Text>
          <View style={styles.headerSubtitleRow}>
            <Ionicons name="trophy-outline" size={12} color="#D97706" />
            <Text style={styles.headerSubtitleText}>Naga Taste League</Text>
          </View>
        </View>

        <Pressable
          onPress={() => setIsAddModalVisible(true)}
          style={({ pressed }) => [styles.addFriendPill, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add new foodie friend"
        >
          <Ionicons name="person-add-outline" size={15} color="#D42F13" />
          <Text style={styles.addFriendPillText}>Add</Text>
        </Pressable>
      </View>

      {/* 2. Dual Segmented Tab Switcher */}
      <View style={styles.tabContainer}>
        <View style={styles.segmentedControl}>
          <Pressable
            onPress={() => setActiveTab('league')}
            style={[styles.segmentBtn, activeTab === 'league' && styles.segmentBtnActive]}
          >
            <Ionicons
              name={activeTab === 'league' ? 'trophy' : 'trophy-outline'}
              size={15}
              color={activeTab === 'league' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'league' && styles.segmentTextActive,
              ]}
            >
              Weekly League
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('friends')}
            style={[styles.segmentBtn, activeTab === 'friends' && styles.segmentBtnActive]}
          >
            <Ionicons
              name={activeTab === 'friends' ? 'people' : 'people-outline'}
              size={16}
              color={activeTab === 'friends' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'friends' && styles.segmentTextActive,
              ]}
            >
              Friends & Squad ({friends.length})
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'league' ? (
          /* ================= TAB 1: WEEKLY TASTE LEAGUE ================= */
          <View style={styles.tabContentBlock}>
            {/* Division Banner Card */}
            <View style={styles.divisionCard}>
              <View style={styles.divisionTopRow}>
                <View style={styles.divisionBadge}>
                  <Ionicons name="shield-checkmark" size={16} color={division.tierColor} />
                  <Text style={[styles.divisionBadgeText, { color: division.tierColor }]}>
                    {division.name.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.timerPill}>
                  <Ionicons name="time-outline" size={13} color="#6E6E73" />
                  <Text style={styles.timerPillText}>Resets in {division.endsIn}</Text>
                </View>
              </View>

              <Text style={styles.divisionTagline}>{division.tagline}</Text>

              {/* Status Zone Indicator - 3 Dedicated Spacious Boxes */}
              <View style={styles.zoneGrid}>
                {/* 1. Promotion Box */}
                <View style={styles.zoneCardPromo}>
                  <View style={styles.zoneCardHeader}>
                    <Ionicons name="arrow-up-circle" size={15} color="#15803D" />
                    <Text style={[styles.zoneCardNumber, { color: '#15803D' }]}>Top 3</Text>
                  </View>
                  <Text style={[styles.zoneCardLabel, { color: '#166534' }]}>Advance</Text>
                </View>

                {/* 2. Safe Zone Box */}
                <View style={styles.zoneCardSafe}>
                  <View style={styles.zoneCardHeader}>
                    <Ionicons name="shield-checkmark-outline" size={14} color="#0284C7" />
                    <Text style={[styles.zoneCardNumber, { color: '#0284C7' }]}>Ranks 4–6</Text>
                  </View>
                  <Text style={[styles.zoneCardLabel, { color: '#0369A1' }]}>Safe Zone</Text>
                </View>

                {/* 3. Relegation Box */}
                <View style={styles.zoneCardReleg}>
                  <View style={styles.zoneCardHeader}>
                    <Ionicons name="arrow-down-circle" size={15} color="#DC2626" />
                    <Text style={[styles.zoneCardNumber, { color: '#DC2626' }]}>Bottom 2</Text>
                  </View>
                  <Text style={[styles.zoneCardLabel, { color: '#991B1B' }]}>Relegate</Text>
                </View>
              </View>
            </View>

            {/* Quick Standing Callout for Current User */}
            <View style={styles.standingCallout}>
              <View style={styles.standingCalloutLeft}>
                <Text style={styles.standingCalloutRank}>
                  #{currentUserEntry.rankPosition}
                </Text>
                <View>
                  <Text style={styles.standingCalloutTitle}>Your Standing</Text>
                  <Text style={styles.standingCalloutSubtitle}>
                    {currentUserEntry.rankPosition <= division.promotionSpots
                      ? '🚀 In the Promotion Zone!'
                      : `${currentUserEntry.weeklyXp} XP · Keep tasting to climb!`}
                  </Text>
                </View>
              </View>
              <View style={styles.standingCalloutRight}>
                <Text style={styles.standingCalloutXp}>+{currentUserEntry.weeklyXp} XP</Text>
                <Text style={styles.standingCalloutDishes}>
                  {currentUserEntry.dishesTastedThisWeek} dishes
                </Text>
              </View>
            </View>

            {/* Leaderboard Table List */}
            <View style={styles.leaderboardSection}>
              <Text style={styles.sectionHeading}>Weekly Standings</Text>

              <View style={styles.leaderboardList}>
                {leaderboard.map((entry) => {
                  const rankInfo = getRankBadge(entry.rankPosition);
                  const isPromotion = entry.rankPosition <= division.promotionSpots;
                  const isRelegation =
                    entry.rankPosition > leaderboard.length - division.relegationSpots;

                  return (
                    <View
                      key={entry.id}
                      style={[
                        styles.leaderboardCard,
                        entry.isCurrentUser && styles.leaderboardCardCurrentUser,
                      ]}
                    >
                      {/* Left: Rank Badge */}
                      <View
                        style={[
                          styles.rankBadgeContainer,
                          { backgroundColor: rankInfo.bg },
                        ]}
                      >
                        {rankInfo.icon ? (
                          <Ionicons
                            name={rankInfo.icon as any}
                            size={16}
                            color={rankInfo.color}
                          />
                        ) : (
                          <Text style={[styles.rankNumberText, { color: rankInfo.color }]}>
                            {rankInfo.label}
                          </Text>
                        )}
                      </View>

                      {/* Avatar */}
                      <View style={styles.avatarWrapper}>
                        <UserAvatar uri={entry.avatar} size={42} />
                        {entry.streakCount >= 7 && (
                          <View style={styles.avatarFlameTag}>
                            <Ionicons name="flame" size={10} color="#FFFFFF" />
                          </View>
                        )}
                      </View>

                      {/* Middle: Name & Title */}
                      <View style={styles.profileTextCol}>
                        <View style={styles.nameRow}>
                          <Text
                            style={[
                              styles.profileName,
                              entry.isCurrentUser && styles.profileNameCurrentUser,
                            ]}
                            numberOfLines={1}
                          >
                            {entry.name}
                          </Text>
                          {entry.isCurrentUser && (
                            <View style={styles.youBadge}>
                              <Text style={styles.youBadgeText}>YOU</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.profileMetaRow}>
                          <Text style={styles.profileRankTitle}>{entry.rankTitle}</Text>
                          <Text style={styles.profileMetaDot}>•</Text>
                          <View style={styles.profileStreakRow}>
                            <Ionicons name="flame" size={12} color="#FF6A00" />
                            <Text style={styles.profileStreakText}>
                              {entry.streakCount}d
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Right: Score Column */}
                      <View style={styles.scoreCol}>
                        <Text style={styles.scoreXpText}>{entry.weeklyXp} XP</Text>
                        <Text style={styles.scoreDishesText}>
                          {entry.dishesTastedThisWeek} tasted
                        </Text>
                        {isPromotion && (
                          <View style={styles.statusIndicatorPromo}>
                            <Ionicons name="caret-up" size={10} color="#15803D" />
                            <Text style={styles.statusIndicatorPromoText}>Promo</Text>
                          </View>
                        )}
                        {isRelegation && (
                          <View style={styles.statusIndicatorReleg}>
                            <Ionicons name="caret-down" size={10} color="#DC2626" />
                            <Text style={styles.statusIndicatorRelegText}>Drop</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : (
          /* ================= TAB 2: MY FRIENDS & SQUAD ================= */
          <View style={styles.tabContentBlock}>
            {/* Friends Summary Strip */}
            <View style={styles.friendsSummaryCard}>
              <View style={styles.friendsSummaryCol}>
                <Text style={styles.friendsSummaryNumber}>{friends.length}</Text>
                <Text style={styles.friendsSummaryLabel}>Foodie Friends</Text>
              </View>
              <View style={styles.friendsSummaryDivider} />
              <View style={styles.friendsSummaryCol}>
                <Text style={styles.friendsSummaryNumber}>
                  {friends.reduce((acc, f) => acc + (f.streakCount > 0 ? 1 : 0), 0)}
                </Text>
                <Text style={styles.friendsSummaryLabel}>Active Streaks</Text>
              </View>
              <View style={styles.friendsSummaryDivider} />
              <View style={styles.friendsSummaryCol}>
                <Text style={styles.friendsSummaryNumber}>
                  {friends.reduce((acc, f) => acc + f.dishesTastedThisWeek, 0)}
                </Text>
                <Text style={styles.friendsSummaryLabel}>Group Tastings</Text>
              </View>
            </View>

            {/* Friend Habit & Streak Cards */}
            <View style={styles.friendsSection}>
              <Text style={styles.sectionHeading}>Squad Habit & Streaks</Text>

              {friends.map((friend) => (
                <View key={friend.id} style={styles.friendCard}>
                  <View style={styles.friendCardTopRow}>
                    <View style={styles.friendInfoRow}>
                      <View style={styles.avatarWrapper}>
                        <UserAvatar uri={friend.avatar} size={46} />
                        <View style={styles.onlineDot} />
                      </View>

                      <View style={styles.friendNameCol}>
                        <Text style={styles.friendName} numberOfLines={1}>
                          {friend.name}
                        </Text>
                        <Text style={styles.friendHandle}>{friend.handle}</Text>
                      </View>
                    </View>

                    {/* Streak Flame Pill */}
                    <View style={styles.friendStreakPill}>
                      <Ionicons name="flame" size={15} color="#FF6A00" />
                      <Text style={styles.friendStreakCount}>
                        {friend.streakCount} Day Streak
                      </Text>
                    </View>
                  </View>

                  {/* Recent Activity Dispatch */}
                  {friend.recentTasting && (
                    <View style={styles.recentActivityBox}>
                      <Ionicons name="restaurant-outline" size={14} color="#D42F13" />
                      <View style={styles.recentActivityTextCol}>
                        <Text style={styles.recentActivityDish} numberOfLines={1}>
                          {friend.recentTasting.foodName}
                        </Text>
                        <Text style={styles.recentActivityEst} numberOfLines={1}>
                          {friend.recentTasting.establishmentName} •{' '}
                          {friend.recentTasting.timeAgo}
                        </Text>
                      </View>
                      <View style={styles.recentXpBadge}>
                        <Text style={styles.recentXpText}>
                          +{friend.recentTasting.xpEarned} XP
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Bottom Action Row: Nudge Button */}
                  <View style={styles.friendActionRow}>
                    <Text style={styles.favoriteTag}>
                      Fave: {friend.favoriteDish || 'Kinalas'}
                    </Text>

                    <Pressable
                      onPress={() => handleNudge(friend)}
                      disabled={friend.nudgedToday}
                      style={({ pressed }) => [
                        styles.nudgeBtn,
                        friend.nudgedToday && styles.nudgeBtnDisabled,
                        pressed && styles.pressed,
                      ]}
                      hitSlop={6}
                    >
                      <Ionicons
                        name={friend.nudgedToday ? 'checkmark-circle' : 'flame'}
                        size={14}
                        color={friend.nudgedToday ? '#15803D' : '#FFFFFF'}
                      />
                      <Text
                        style={[
                          styles.nudgeBtnText,
                          friend.nudgedToday && styles.nudgeBtnTextDisabled,
                        ]}
                      >
                        {friend.nudgedToday ? 'Nudged' : 'Tara Kain! 🔥'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}

              {/* Add / Invite Card */}
              <Pressable
                onPress={() => setIsAddModalVisible(true)}
                style={({ pressed }) => [styles.inviteCard, pressed && styles.pressed]}
              >
                <View style={styles.inviteIconCircle}>
                  <Ionicons name="add" size={24} color="#D42F13" />
                </View>
                <View style={styles.inviteTextCol}>
                  <Text style={styles.inviteTitle}>Invite a Fellow Foodie</Text>
                  <Text style={styles.inviteSub}>
                    Compare streaks and conquer Bicolano trails together
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 3. Add Friend Bottom Sheet Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsAddModalVisible(false)}
          />

          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Foodie Friend</Text>
              <Pressable
                onPress={() => setIsAddModalVisible(false)}
                hitSlop={8}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#6E6E73" />
              </Pressable>
            </View>

            <Text style={styles.modalInstruction}>
              Search by handle or paste your friend's Naga foodie ID:
            </Text>

            {/* Search Input Box */}
            <View style={styles.modalInputRow}>
              <Ionicons name="search" size={18} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. @mariasantos or paolo"
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
                  <Ionicons name="close-circle" size={18} color="#C7C7CC" />
                </Pressable>
              )}
            </View>

            {/* Quick Add or Search Results */}
            {searchResults.length > 0 ? (
              <View style={styles.searchResultsContainer}>
                <Text style={styles.resultsHeader}>Matching Foodies</Text>
                {searchResults.slice(0, 3).map((item) => (
                  <View key={item.id} style={styles.searchResultRow}>
                    <UserAvatar uri={item.avatar} size={36} />
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>{item.name}</Text>
                      <Text style={styles.searchResultHandle}>{item.handle}</Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        toggleFollowFriend(item.id);
                        showToast(
                          item.isFriend
                            ? `Removed ${item.name}`
                            : `Added ${item.name} to Squad!`
                        );
                      }}
                      style={[
                        styles.searchActionBtn,
                        item.isFriend && styles.searchActionBtnFollowed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.searchActionText,
                          item.isFriend && styles.searchActionTextFollowed,
                        ]}
                      >
                        {item.isFriend ? 'Added ✓' : '+ Add'}
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.shareCodeBox}>
                <Text style={styles.shareCodeTitle}>Your Personal Foodie Link</Text>
                <View style={styles.shareCodePill}>
                  <Text style={styles.shareCodeText}>naga.food/u/{currentUserEntry.handle.replace('@', '')}</Text>
                  <Pressable
                    onPress={() => showToast('Foodie link copied to clipboard!')}
                    style={styles.copyBtn}
                  >
                    <Text style={styles.copyBtnText}>Copy</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <Pressable
              onPress={handleAddSubmit}
              style={({ pressed }) => [styles.modalSubmitBtn, pressed && styles.pressed]}
            >
              <Text style={styles.modalSubmitBtnText}>Search & Connect</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 4. Interactive Feedback Toast */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F6F3', // Warm linen
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAE4DE',
    backgroundColor: '#FFFFFF',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2F0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenterCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  headerSubtitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  addFriendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7CE',
  },
  addFriendPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },

  /* Tabs */
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAE4DE',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F0ECE6',
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  segmentTextActive: {
    color: '#1C1C1E',
    fontWeight: '700',
  },

  /* Scroll Content */
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContentBlock: {
    gap: 16,
  },

  /* Division Card */
  divisionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE4DE',
  },
  divisionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divisionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  divisionBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3EF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6E6E73',
  },
  divisionTagline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#48484A',
    marginBottom: 12,
  },
  zoneGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  zoneCardPromo: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneCardSafe: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneCardReleg: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  zoneCardNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  zoneCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },

  /* Standing Callout */
  standingCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F6',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FED7CE',
  },
  standingCalloutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  standingCalloutRank: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D42F13',
    minWidth: 36,
  },
  standingCalloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  standingCalloutSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 1,
  },
  standingCalloutRight: {
    alignItems: 'flex-end',
  },
  standingCalloutXp: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D42F13',
  },
  standingCalloutDishes: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6E6E73',
  },

  /* Leaderboard Section */
  leaderboardSection: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginLeft: 2,
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAE4DE',
  },
  leaderboardCardCurrentUser: {
    backgroundColor: '#FFFDFB',
    borderColor: '#D42F13',
    borderWidth: 1.5,
  },
  rankBadgeContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatarFlameTag: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF6A00',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileTextCol: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  profileNameCurrentUser: {
    color: '#D42F13',
  },
  youBadge: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  profileRankTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  profileMetaDot: {
    fontSize: 10,
    color: '#C7C7CC',
  },
  profileStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  profileStreakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6A00',
  },
  scoreCol: {
    alignItems: 'flex-end',
    minWidth: 64,
  },
  scoreXpText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  scoreDishesText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  statusIndicatorPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    marginTop: 2,
  },
  statusIndicatorPromoText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
  statusIndicatorReleg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    marginTop: 2,
  },
  statusIndicatorRelegText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* Friends Tab */
  friendsSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#EAE4DE',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  friendsSummaryCol: {
    alignItems: 'center',
  },
  friendsSummaryNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  friendsSummaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 2,
  },
  friendsSummaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#EAE4DE',
  },
  friendsSection: {
    gap: 10,
  },
  friendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAE4DE',
    gap: 10,
  },
  friendCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  friendNameCol: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  friendHandle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 1,
  },
  friendStreakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0C2',
  },
  friendStreakCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6A00',
  },
  recentActivityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF9F6',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  recentActivityTextCol: {
    flex: 1,
    minWidth: 0,
  },
  recentActivityDish: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  recentActivityEst: {
    fontSize: 11,
    color: '#6E6E73',
    marginTop: 1,
  },
  recentXpBadge: {
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recentXpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  friendActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F0ECE6',
  },
  favoriteTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  nudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D42F13',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  nudgeBtnDisabled: {
    backgroundColor: '#F1F5F1',
  },
  nudgeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nudgeBtnTextDisabled: {
    color: '#15803D',
  },

  /* Invite Card */
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#FED7CE',
    gap: 12,
  },
  inviteIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF2EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteTextCol: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  inviteSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    gap: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalInstruction: {
    fontSize: 13,
    color: '#6E6E73',
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F2EE',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  inputIcon: {
    marginRight: 8,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
  },
  searchResultsContainer: {
    gap: 8,
    marginTop: 4,
  },
  resultsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF9F6',
    borderRadius: 10,
    padding: 10,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 10,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  searchResultHandle: {
    fontSize: 11,
    color: '#8E8E93',
  },
  searchActionBtn: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  searchActionBtnFollowed: {
    backgroundColor: '#E8F5E9',
  },
  searchActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchActionTextFollowed: {
    color: '#15803D',
  },
  shareCodeBox: {
    backgroundColor: '#F8F6F3',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  shareCodeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E6E73',
  },
  shareCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EAE4DE',
  },
  shareCodeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  copyBtn: {
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  modalSubmitBtn: {
    backgroundColor: '#D42F13',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  modalSubmitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Toast Notification */
  toastContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.8,
  },
});
