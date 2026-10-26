import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { useBasket, PreOrder } from '@/context/BasketContext';
import { useQuest } from '@/context/QuestContext';
import { COLLECTIBLE_BADGES, EXPLORER_RANKS } from '@/data/gamification';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { PassportStampModal } from '@/components/gamification/PassportStampModal';
import { ActiveQuestLogWidget } from '@/components/gamification/ActiveQuestLogWidget';

type PassportTab = 'stamps' | 'badges' | 'passes';

export default function PassportScreen() {
  const {
    items,
    updateQuantity,
    placePreOrder,
    getBasketSubtotal,
  } = useBasket();

  const {
    currentRank,
    nextRank,
    xp,
    rankProgressPercent,
    tastingLog,
    unlockedBadgeIds,
  } = useQuest();

  const [activeTab, setActiveTab] = useState<PassportTab>('stamps');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PreOrder | null>(null);

  // New Tasting Stamp Modal state
  const [stampModalVisible, setStampModalVisible] = useState(false);
  const [selectedFoodForStamp, setSelectedFoodForStamp] = useState(FOOD_ITEMS[0]);
  const [selectedEstForStamp, setSelectedEstForStamp] = useState(ESTABLISHMENTS[0]);

  const subtotal = getBasketSubtotal();
  const fee = 0; // Free reservation
  const total = subtotal + fee;

  const handlePlaceOrder = () => {
    const newOrder = placePreOrder();
    if (newOrder) {
      setPlacedOrder(newOrder);
      setConfirmModalVisible(true);
    }
  };

  const openLogModal = () => {
    setSelectedFoodForStamp(FOOD_ITEMS[0]);
    setSelectedEstForStamp(ESTABLISHMENTS[0]);
    setStampModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Top Title & Header */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.headingSans}>
                Naga Food <Text style={styles.headingSerif}>passport</Text>
              </Text>
              {activeTab === 'stamps' && (
                <Pressable
                  onPress={openLogModal}
                  style={({ pressed }) => [styles.logDishBtn, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Ionicons name="add" size={15} color="#FFFFFF" />
                  <Text style={styles.logDishBtnText}>Log Dish</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.subheadText}>
              Your official culinary journal, tasting stamps, badges, and carinderia expedition passes.
            </Text>
          </View>

          {/* Explorer Level Summary Hero Card */}
          <View style={styles.rankHeroCard}>
            <View style={styles.rankHeroTop}>
              <View style={styles.rankIconBadge}>
                <Ionicons name="ribbon" size={20} color="#D42F13" />
              </View>
              <View style={styles.rankHeroTitles}>
                <Text style={styles.rankHeroLevel}>LEVEL {currentRank.level}</Text>
                <Text style={styles.rankHeroName}>{currentRank.title}</Text>
              </View>
              <View style={styles.xpTotalBox}>
                <Text style={styles.xpTotalNumber}>{xp}</Text>
                <Text style={styles.xpTotalLabel}>TOTAL XP</Text>
              </View>
            </View>

            <View style={styles.rankProgressSection}>
              <View style={styles.rankProgressBarTrack}>
                <View
                  style={[styles.rankProgressBarFill, { width: `${rankProgressPercent}%` }]}
                />
              </View>
              <View style={styles.rankProgressLabels}>
                <Text style={styles.rankProgressPercentText}>{rankProgressPercent}% Progress</Text>
                <Text style={styles.rankNextRankText}>
                  {nextRank ? `${nextRank.minXp - xp} XP to ${nextRank.title}` : 'Max Title Achieved'}
                </Text>
              </View>
            </View>
          </View>

          {/* Segmented Controls */}
          <View style={styles.segmentWrapper}>
            <View style={styles.segmentContainer}>
              <Pressable
                onPress={() => setActiveTab('stamps')}
                style={[
                  styles.segmentButton,
                  activeTab === 'stamps' && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'stamps' && styles.segmentTextActive,
                  ]}
                >
                  Tasting Log ({tastingLog.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('badges')}
                style={[
                  styles.segmentButton,
                  activeTab === 'badges' && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'badges' && styles.segmentTextActive,
                  ]}
                >
                  Badges ({unlockedBadgeIds.length})
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('passes')}
                style={[
                  styles.segmentButton,
                  activeTab === 'passes' && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTab === 'passes' && styles.segmentTextActive,
                  ]}
                >
                  Dine-In Passes ({items.length})
                </Text>
              </Pressable>
            </View>
          </View>

          {/* TAB 1: TASTING LOG & PASSPORT STAMPS */}
          {activeTab === 'stamps' && (
            <View style={styles.tabContent}>
              {tastingLog.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="book-outline" size={44} color="#8E8E93" />
                  <Text style={styles.emptyTitle}>Your Passport is Fresh</Text>
                  <Text style={styles.emptyDesc}>
                    Begin exploring Naga&apos;s carinderias, order authentic dishes, and stamp your
                    first bowl!
                  </Text>
                  <Pressable onPress={openLogModal} style={styles.emptyActionBtn}>
                    <Text style={styles.emptyActionBtnText}>Stamp First Tasting</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.stampsList}>
                  {tastingLog.map((entry) => (
                    <View key={entry.id} style={styles.stampCard}>
                      <View style={styles.stampCardHeader}>
                        {entry.image ? (
                          <Image source={{ uri: entry.image }} style={styles.stampThumb} />
                        ) : (
                          <View style={styles.stampThumbPlaceholder}>
                            <Ionicons name="restaurant" size={20} color="#D42F13" />
                          </View>
                        )}
                        <View style={styles.stampInfo}>
                          <View style={styles.stampBadgeOfficial}>
                            <Ionicons name="checkmark-circle" size={12} color="#D42F13" />
                            <Text style={styles.stampBadgeOfficialText}>VERIFIED TASTING</Text>
                          </View>
                          <Text style={styles.stampFoodName}>{entry.foodName}</Text>
                          <Text style={styles.stampEstName}>
                            at <Text style={{ fontWeight: '600' }}>{entry.establishmentName}</Text>
                          </Text>
                          <Text style={styles.stampDate}>{entry.date}</Text>
                        </View>
                      </View>

                      {/* Ratings Row */}
                      <View style={styles.stampRatingsRow}>
                        <View style={styles.ratingCol}>
                          <Text style={styles.ratingLabel}>Flavor</Text>
                          <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Ionicons
                                key={s}
                                name={s <= entry.rating ? 'star' : 'star-outline'}
                                size={13}
                                color="#FF9500"
                              />
                            ))}
                          </View>
                        </View>

                        <View style={styles.ratingCol}>
                          <Text style={styles.ratingLabel}>Heat</Text>
                          <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Ionicons
                                key={s}
                                name="flame"
                                size={14}
                                color={s <= entry.spiceRating ? '#D42F13' : '#E5E5EA'}
                              />
                            ))}
                          </View>
                        </View>
                      </View>

                      {/* Notes Box */}
                      {entry.notes && (
                        <View style={styles.stampNotesBox}>
                          <Text style={styles.stampNotesText}>
                            &ldquo;{entry.notes}&rdquo;
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* TAB 2: BADGES & EXPEDITIONS */}
          {activeTab === 'badges' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeading}>Collectible Badges</Text>
              <Text style={styles.sectionSubHeading}>
                Earn authentic Bikolano badges as you taste dishes across Naga City.
              </Text>

              <View style={styles.badgesGrid}>
                {COLLECTIBLE_BADGES.map((badge) => {
                  const isUnlocked = unlockedBadgeIds.includes(badge.id);

                  return (
                    <View
                      key={badge.id}
                      style={[styles.badgeTile, isUnlocked ? styles.badgeTileUnlocked : styles.badgeTileLocked]}
                    >
                      <View
                        style={[
                          styles.badgeIconCircle,
                          isUnlocked ? { backgroundColor: '#FFF0EE' } : { backgroundColor: '#E5E5EA' },
                        ]}
                      >
                        <Ionicons
                          name={badge.icon as any}
                          size={24}
                          color={isUnlocked ? badge.color : '#8E8E93'}
                        />
                      </View>

                      <Text style={[styles.badgeTileName, !isUnlocked && styles.badgeTextLocked]}>
                        {badge.name}
                      </Text>
                      <Text style={styles.badgeTileCriteria} numberOfLines={2}>
                        {badge.criteria}
                      </Text>

                      <View
                        style={[
                          styles.badgeRewardPill,
                          isUnlocked ? styles.badgeRewardPillUnlocked : styles.badgeRewardPillLocked,
                        ]}
                      >
                        <Text style={styles.badgeRewardPillText}>
                          {isUnlocked ? `Unlocked (+${badge.xpReward} XP)` : `+${badge.xpReward} XP`}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Active Daily Food Quests */}
              <View style={{ marginTop: 22, marginHorizontal: -16 }}>
                <ActiveQuestLogWidget />
              </View>

              {/* Ranks Ladder */}
              <Text style={[styles.sectionHeading, { marginTop: 8 }]}>Naga Explorer Titles</Text>
              <View style={styles.rankLadderCard}>
                {EXPLORER_RANKS.map((rank, idx) => {
                  const isCurrent = currentRank.level === rank.level;
                  const isPassed = currentRank.level > rank.level;

                  return (
                    <View
                      key={rank.level}
                      style={[
                        styles.rankLadderRow,
                        idx === EXPLORER_RANKS.length - 1 && styles.rankLadderRowLast,
                      ]}
                    >
                      <View
                        style={[
                          styles.rankDot,
                          isCurrent && styles.rankDotCurrent,
                          isPassed && styles.rankDotPassed,
                        ]}
                      >
                        {isPassed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                      </View>
                      <View style={styles.rankLadderInfo}>
                        <View style={styles.rankLadderHeader}>
                          <Text
                            style={[
                              styles.rankLadderTitle,
                              isCurrent && styles.rankLadderTitleCurrent,
                            ]}
                          >
                            Lvl {rank.level}: {rank.title}
                          </Text>
                          {isCurrent && (
                            <View style={styles.currentTitleBadge}>
                              <Text style={styles.currentTitleBadgeText}>CURRENT</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.rankLadderDesc}>{rank.description}</Text>
                        <Text style={styles.rankLadderXp}>{rank.minXp} XP required</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* TAB 3: DINE-IN PASSES (PRE-ORDERS) */}
          {activeTab === 'passes' && (
            <View style={styles.tabContent}>
              {items.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="ticket-outline" size={44} color="#8E8E93" />
                  <Text style={styles.emptyTitle}>No Active Dine-In Passes</Text>
                  <Text style={styles.emptyDesc}>
                    Pre-order a meal from any carinderia or bakery to skip waiting in line.
                  </Text>
                  <Pressable onPress={() => router.push('/')} style={styles.emptyActionBtn}>
                    <Text style={styles.emptyActionBtnText}>Explore Spots</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.ordersContent}>
                  {/* Establishment Info Header */}
                  <View style={styles.establishmentHeaderCard}>
                    <Ionicons name="storefront" size={18} color="#D42F13" />
                    <View style={styles.establishmentHeaderInfo}>
                      <Text style={styles.establishmentHeaderName}>
                        {items[0].establishmentName}
                      </Text>
                      <Text style={styles.establishmentHeaderAddress}>
                        {items[0].establishmentAddress}
                      </Text>
                    </View>
                  </View>

                  {/* Items List */}
                  <View style={styles.itemsCard}>
                    {items.map((item, index) => (
                      <View
                        key={`${item.foodId}-${index}`}
                        style={[
                          styles.itemRow,
                          index === items.length - 1 && styles.itemRowLast,
                        ]}
                      >
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{item.foodName}</Text>
                          <Text style={styles.itemPrice}>₱{item.price}</Text>
                        </View>
                        <View style={styles.quantityControls}>
                          <Pressable
                            onPress={() => updateQuantity(item.foodId, item.quantity - 1)}
                            style={styles.qtyBtn}
                          >
                            <Ionicons name="remove" size={16} color="#000000" />
                          </Pressable>
                          <Text style={styles.qtyText}>{item.quantity}</Text>
                          <Pressable
                            onPress={() => updateQuantity(item.foodId, item.quantity + 1)}
                            style={styles.qtyBtn}
                          >
                            <Ionicons name="add" size={16} color="#000000" />
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Order Summary & Place Reservation Button */}
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Total Due at Counter</Text>
                      <Text style={styles.summaryValue}>₱{total}</Text>
                    </View>
                    <Pressable
                      onPress={handlePlaceOrder}
                      style={({ pressed }) => [styles.placePassBtn, pressed && styles.pressed]}
                    >
                      <Text style={styles.placePassBtnText}>Confirm Dine-In Pass (₱{total})</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Nav */}
      <NavBar currentTab="basket" />

      {/* Passport Stamp Logger Modal */}
      <PassportStampModal
        visible={stampModalVisible}
        onClose={() => setStampModalVisible(false)}
        foodId={selectedFoodForStamp.id}
        foodName={selectedFoodForStamp.name}
        establishmentId={selectedEstForStamp.id}
        establishmentName={selectedEstForStamp.name}
        image={selectedFoodForStamp.image}
      />

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Ionicons name="checkmark-circle" size={48} color="#34C759" style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Pass Confirmed!</Text>
            <Text style={styles.modalDesc}>
              Your expedition order has been reserved at {placedOrder?.establishmentName}. Show your
              order ID <Text style={{ fontWeight: '700' }}>{placedOrder?.orderNumber}</Text> at the counter.
            </Text>
            <Pressable
              onPress={() => setConfirmModalVisible(false)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  // Title section
  titleSection: {
    paddingTop: Platform.OS === 'ios' ? 14 : 20,
    paddingBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: 'rgba(60, 60, 67, 0.65)',
    marginTop: 4,
    lineHeight: 18,
  },
  logDishBtn: {
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logDishBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 3,
  },

  // Rank Hero Card
  rankHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  rankHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankHeroTitles: {
    flex: 1,
  },
  rankHeroLevel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  rankHeroName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginTop: 1,
  },
  xpTotalBox: {
    alignItems: 'flex-end',
  },
  xpTotalNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D42F13',
  },
  xpTotalLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.4,
  },
  rankProgressSection: {
    marginTop: 2,
  },
  rankProgressBarTrack: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  rankProgressBarFill: {
    height: '100%',
    backgroundColor: '#D42F13',
    borderRadius: 3,
  },
  rankProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rankProgressPercentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  rankNextRankText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.60)',
  },

  // Segmented control
  segmentWrapper: {
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 9,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  segmentText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.60)',
  },
  segmentTextActive: {
    fontWeight: '600',
    color: '#000000',
  },

  tabContent: {
    marginBottom: 20,
  },

  // Empty state
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.65)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyActionBtn: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // Stamps List
  stampsList: {
    gap: 12,
  },
  stampCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  stampCardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  stampThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E5E5EA',
    marginRight: 12,
  },
  stampThumbPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stampInfo: {
    flex: 1,
  },
  stampBadgeOfficial: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  stampBadgeOfficialText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D42F13',
    marginLeft: 3,
    letterSpacing: 0.4,
  },
  stampFoodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  stampEstName: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.65)',
    marginTop: 1,
  },
  stampDate: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  stampRatingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9FB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  ratingCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.60)',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  stampNotesBox: {
    paddingHorizontal: 4,
  },
  stampNotesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'rgba(60, 60, 67, 0.85)',
    lineHeight: 16,
  },

  // Badges grid
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  sectionSubHeading: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  badgeTileUnlocked: {
    borderColor: 'rgba(212, 47, 19, 0.2)',
  },
  badgeTileLocked: {
    opacity: 0.6,
  },
  badgeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeTileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 3,
  },
  badgeTextLocked: {
    color: '#8E8E93',
  },
  badgeTileCriteria: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.60)',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 8,
  },
  badgeRewardPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeRewardPillUnlocked: {
    backgroundColor: '#FFF0EE',
  },
  badgeRewardPillLocked: {
    backgroundColor: '#F2F2F7',
  },
  badgeRewardPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Ranks ladder
  rankLadderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  rankLadderRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  rankLadderRowLast: {
    borderBottomWidth: 0,
  },
  rankDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    marginTop: 3,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankDotPassed: {
    backgroundColor: '#34C759',
  },
  rankDotCurrent: {
    backgroundColor: '#D42F13',
  },
  rankLadderInfo: {
    flex: 1,
  },
  rankLadderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankLadderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  rankLadderTitleCurrent: {
    color: '#D42F13',
    fontWeight: '700',
  },
  currentTitleBadge: {
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentTitleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D42F13',
  },
  rankLadderDesc: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
    marginTop: 1,
  },
  rankLadderXp: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 2,
  },

  // Passes & Orders
  ordersContent: {
    gap: 12,
  },
  establishmentHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  establishmentHeaderInfo: {
    marginLeft: 8,
  },
  establishmentHeaderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  establishmentHeaderAddress: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.60)',
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.70)',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D42F13',
  },
  placePassBtn: {
    backgroundColor: '#D42F13',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placePassBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.70)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  modalCloseBtn: {
    backgroundColor: '#1C1C1E',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
