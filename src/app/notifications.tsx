import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useNotifications, NotificationType, NotificationItem } from '@/context/NotificationContext';

type FilterTab = 'all' | NotificationType;

interface FilterOption {
  key: FilterTab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: 'All', icon: 'layers-outline' },
  { key: 'order', label: 'Orders', icon: 'fast-food-outline' },
  { key: 'streak', label: 'Streaks', icon: 'flame-outline' },
  { key: 'achievement', label: 'Trophies', icon: 'trophy-outline' },
  { key: 'community', label: 'Social', icon: 'chatbubbles-outline' },
  { key: 'special', label: 'Specials', icon: 'pricetag-outline' },
];

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  // Counts per filter
  const filterCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: notifications.length,
      order: 0,
      streak: 0,
      achievement: 0,
      community: 0,
      special: 0,
    };
    notifications.forEach((n) => {
      if (counts[n.type] !== undefined) {
        counts[n.type]++;
      }
    });
    return counts;
  }, [notifications]);

  // Handle tap on notification
  const handleNotificationPress = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (item.actionUrl) {
      router.push(item.actionUrl as any);
    }
  };

  // Mark all read with feedback
  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      showToast('All notifications are already read');
      return;
    }
    markAllAsRead();
    showToast('All marked as read');
  };

  // Clear all with confirmation
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to dismiss all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAll();
            showToast('Notifications cleared');
          },
        },
      ]
    );
  };

  // Delete single notification
  const handleDeleteItem = (id: string, e: any) => {
    e.stopPropagation();
    deleteNotification(id);
    showToast('Notification dismissed');
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

        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadCountBadge}>
              <Text style={styles.unreadCountBadgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>

        {/* Top-right Actions: Mark All Read */}
        <Pressable
          onPress={handleMarkAllRead}
          style={({ pressed }) => [styles.markAllBtn, pressed && styles.pressed]}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Mark all as read"
        >
          <Ionicons name="checkmark-done" size={17} color="#007AFF" />
          <Text style={styles.markAllBtnText}>Read All</Text>
        </Pressable>
      </View>

      {/* 2. Horizontal Filter Strip */}
      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTER_OPTIONS.map((tab) => {
            const isActive = activeFilter === tab.key;
            const count = filterCounts[tab.key];
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={tab.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#636366'}
                  style={styles.filterChipIcon}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View
                    style={[
                      styles.filterBadge,
                      isActive && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        isActive && styles.filterBadgeTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Notification List or Empty State */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifications.length > 0 ? (
          <>
            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeaderText}>
                {activeFilter === 'all'
                  ? 'Recent Updates'
                  : `${FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label || 'Updates'}`}
              </Text>
              {notifications.length > 0 && (
                <Pressable
                  onPress={handleClearAll}
                  style={({ pressed }) => [pressed && styles.pressed]}
                  hitSlop={6}
                >
                  <Text style={styles.clearAllText}>Clear All</Text>
                </Pressable>
              )}
            </View>

            {filteredNotifications.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleNotificationPress(item)}
                style={({ pressed }) => [
                  styles.notifCard,
                  !item.read && styles.notifCardUnread,
                  pressed && styles.cardPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.message}. ${item.timestamp}`}
              >
                {/* Left Colored Icon Container */}
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: item.iconBgColor },
                  ]}
                >
                  <Ionicons
                    name={item.iconName as any}
                    size={22}
                    color={item.iconColor}
                  />
                  {!item.read && <View style={styles.unreadDot} />}
                </View>

                {/* Main Content */}
                <View style={styles.cardContent}>
                  <View style={styles.cardTopRow}>
                    <Text
                      style={[
                        styles.cardTitle,
                        !item.read && styles.cardTitleUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.cardTimestamp}>{item.timestamp}</Text>
                  </View>

                  <Text style={styles.cardMessage} numberOfLines={3}>
                    {item.message}
                  </Text>

                  {/* Bottom Action Row (if has actionUrl) */}
                  <View style={styles.cardBottomRow}>
                    {item.actionLabel ? (
                      <View style={styles.actionPill}>
                        <Text style={styles.actionPillText}>
                          {item.actionLabel}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={12}
                          color="#007AFF"
                        />
                      </View>
                    ) : (
                      <View />
                    )}

                    {/* Delete Item Button */}
                    <Pressable
                      onPress={(e) => handleDeleteItem(item.id, e)}
                      style={({ pressed }) => [
                        styles.deleteItemBtn,
                        pressed && styles.pressed,
                      ]}
                      hitSlop={8}
                      accessibilityLabel="Dismiss notification"
                    >
                      <Ionicons
                        name="close-outline"
                        size={17}
                        color="#8E8E93"
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color="#8E8E93"
              />
            </View>
            <Text style={styles.emptyTitle}>You're All Caught Up!</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'all'
                ? 'No notifications right now. Keep exploring dishes and trails in Naga!'
                : `No ${FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label.toLowerCase()} notifications found.`}
            </Text>

            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [
                styles.emptyActionBtn,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="compass-outline" size={17} color="#FFFFFF" />
              <Text style={styles.emptyActionBtnText}>Explore Flavor Codex</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Toast Alert */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  /* Header Bar */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F2F2F7',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  unreadCountBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadCountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  markAllBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },

  /* Filter Bar */
  filterBarContainer: {
    paddingBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  filterChipActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  filterChipIcon: {
    marginRight: 5,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    marginLeft: 6,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#636366',
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* List & Content */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },

  /* Notification Card */
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  notifCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0, 122, 255, 0.25)',
    borderLeftWidth: 3.5,
    borderLeftColor: '#007AFF',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#3A3A3C',
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: {
    fontWeight: '700',
    color: '#000000',
  },
  cardTimestamp: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
    flexShrink: 0,
  },
  cardMessage: {
    fontSize: 13,
    color: '#636366',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  deleteItemBtn: {
    padding: 4,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF6A00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#FF6A00',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emptyActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Toast */
  toast: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.92)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
