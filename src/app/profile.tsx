import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/common/Header';
import { NavBar } from '@/components/common/NavBar';
import { IOSTokens } from '@/constants/theme';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';

export default function ProfileScreen() {
  const { savedFoods, savedEstablishments } = useSaved();
  const { activePreOrders } = useBasket();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [spicePreference, setSpicePreference] = useState<'mild' | 'moderate' | 'fiery'>('fiery');

  const totalSaved = savedFoods.length + savedEstablishments.length;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your Naga Food account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => router.push('/') },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <Header showBack title="Profile" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* iOS Large Title */}
          <View style={styles.titleSection}>
            <Text style={styles.largeTitle}>Profile</Text>
          </View>

          {/* Profile Card Header */}
          <View style={styles.insetGroup}>
            <View style={styles.profileHeaderRow}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.avatarImage}
              />
              <View style={styles.profileMeta}>
                <Text style={styles.userName}>Maria Santos</Text>
                <Text style={styles.userHandle}>@maria_naga · Centro, Naga City</Text>

                <View style={styles.badgeRow}>
                  <View style={styles.guideBadge}>
                    <Ionicons name="ribbon-outline" size={12} color={IOSTokens.colors.tint} />
                    <Text style={styles.guideBadgeText}>Local Foodie Level 4</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsRow}>
              <Pressable
                onPress={() => router.push('/saved')}
                style={({ pressed }) => [styles.statBox, pressed && styles.pressed]}
              >
                <Text style={styles.statNumber}>{totalSaved}</Text>
                <Text style={styles.statLabel}>Saved Items</Text>
              </Pressable>

              <View style={styles.statDivider} />

              <Pressable
                onPress={() => router.push('/basket')}
                style={({ pressed }) => [styles.statBox, pressed && styles.pressed]}
              >
                <Text style={styles.statNumber}>{activePreOrders.length}</Text>
                <Text style={styles.statLabel}>Active Pre-Orders</Text>
              </Pressable>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Reviews Shared</Text>
              </View>
            </View>
          </View>

          {/* SECTION 1: Pre-Order & Contact Info */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Pre-Order Details</Text>
            <View style={styles.insetGroup}>
              <View style={styles.groupRow}>
                <Text style={styles.rowLabel}>Pickup Name</Text>
                <Text style={styles.rowValue}>Maria Santos</Text>
              </View>
              <View style={styles.groupRow}>
                <Text style={styles.rowLabel}>Phone Number</Text>
                <Text style={styles.rowValue}>+63 917 555 1928</Text>
              </View>
              <View style={[styles.groupRow, styles.groupRowLast]}>
                <Text style={styles.rowLabel}>Default Payment</Text>
                <Text style={styles.rowValueTint}>GCash / Cash on Pickup</Text>
              </View>
            </View>
          </View>

          {/* SECTION 2: Bicolano Taste Preferences */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Bicol Food Preferences</Text>
            <View style={styles.insetGroup}>
              <View style={styles.groupRow}>
                <Text style={styles.rowLabel}>Sili Tolerance</Text>
                <View style={styles.pillContainer}>
                  <Pressable
                    onPress={() => setSpicePreference('mild')}
                    style={[
                      styles.preferencePill,
                      spicePreference === 'mild' && styles.preferencePillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.preferencePillText,
                        spicePreference === 'mild' && styles.preferencePillTextActive,
                      ]}
                    >
                      Mild 🌶️
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSpicePreference('fiery')}
                    style={[
                      styles.preferencePill,
                      spicePreference === 'fiery' && styles.preferencePillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.preferencePillText,
                        spicePreference === 'fiery' && styles.preferencePillTextActive,
                      ]}
                    >
                      Fiery 🌶️🔥
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.groupRow}>
                <Text style={styles.rowLabel}>Go-To Kinalas Broth</Text>
                <Text style={styles.rowValue}>Extra Brain Gravy</Text>
              </View>
              <View style={[styles.groupRow, styles.groupRowLast]}>
                <Text style={styles.rowLabel}>Favorite Spot</Text>
                <Text style={styles.rowValue}>Cha Cha’s Kinalas</Text>
              </View>
            </View>
          </View>

          {/* SECTION 3: Settings & Notifications */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.insetGroup}>
              <View style={styles.groupRow}>
                <Text style={styles.rowLabel}>Pre-Order Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: IOSTokens.colors.fill, true: IOSTokens.colors.green }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.groupRow}>
                <Text style={styles.rowLabel}>Location Services</Text>
                <Text style={styles.rowValue}>Naga City (Active)</Text>
              </View>
              <View style={[styles.groupRow, styles.groupRowLast]}>
                <Text style={styles.rowLabel}>App Version</Text>
                <Text style={styles.rowValue}>v1.2.0 (Build 42)</Text>
              </View>
            </View>
          </View>

          {/* SECTION 4: Actions */}
          <View style={styles.sectionBlock}>
            <View style={styles.insetGroup}>
              <Pressable
                onPress={handleSignOut}
                style={({ pressed }) => [styles.signOutRow, pressed && styles.rowPressed]}
              >
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Translucent Bottom Navigation Bar */}
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: IOSTokens.colors.bg,
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
    paddingHorizontal: IOSTokens.spacing.margin,
  },
  titleSection: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  largeTitle: {
    ...IOSTokens.typography.largeTitle,
    color: IOSTokens.colors.label,
  },

  // Profile Card Header
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: IOSTokens.colors.fill,
  },
  profileMeta: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    ...IOSTokens.typography.headline,
    fontSize: 19,
    color: IOSTokens.colors.label,
  },
  userHandle: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  guideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOSTokens.colors.tintSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  guideBadgeText: {
    ...IOSTokens.typography.caption,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  statNumber: {
    ...IOSTokens.typography.headline,
    fontSize: 18,
    color: IOSTokens.colors.label,
  },
  statLabel: {
    ...IOSTokens.typography.caption,
    fontSize: 11,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: IOSTokens.colors.separator,
  },

  // Section Blocks & Group Rows
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...IOSTokens.typography.title2,
    fontSize: 18,
    lineHeight: 22,
    color: IOSTokens.colors.label,
    marginBottom: 8,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  groupRowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    ...IOSTokens.typography.body,
    fontSize: 16,
    color: IOSTokens.colors.label,
  },
  rowValue: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    color: IOSTokens.colors.labelSecondary,
  },
  rowValueTint: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    color: IOSTokens.colors.tint,
    fontWeight: '500',
  },

  // Pills
  pillContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  preferencePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: IOSTokens.colors.fill,
  },
  preferencePillActive: {
    backgroundColor: IOSTokens.colors.tintSoft,
  },
  preferencePillText: {
    ...IOSTokens.typography.caption,
    fontSize: 12,
    color: IOSTokens.colors.labelSecondary,
  },
  preferencePillTextActive: {
    color: IOSTokens.colors.tint,
    fontWeight: '600',
  },

  // Sign Out
  signOutRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  signOutText: {
    ...IOSTokens.typography.headline,
    fontSize: 16,
    color: IOSTokens.colors.red,
  },

  pressed: {
    opacity: 0.65,
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },
});
