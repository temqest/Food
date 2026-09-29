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
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { savedFoods, savedEstablishments } = useSaved();
  const { activePreOrders } = useBasket();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const totalSaved = savedFoods.length + savedEstablishments.length;

  const handleSpiceChange = (pref: 'mild' | 'moderate' | 'fiery') => {
    updateProfile({ spicePreference: pref });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of your Naga Food account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/welcome');
          },
        },
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
          {isAuthenticated && user ? (
            <View style={styles.insetGroup}>
              <View style={styles.profileHeaderRow}>
                <Image
                  source={{
                    uri: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                  }}
                  style={styles.avatarImage}
                />
                <View style={styles.profileMeta}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userHandle}>
                    {user.email || user.phone} · {user.location}
                  </Text>

                  <View style={styles.badgeRow}>
                    <View style={styles.guideBadge}>
                      <Ionicons name="ribbon-outline" size={12} color={IOSTokens.colors.tint} />
                      <Text style={styles.guideBadgeText}>{user.badge}</Text>
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
                  <Text style={styles.statNumber}>{user.reviewCount || 0}</Text>
                  <Text style={styles.statLabel}>Reviews Shared</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.insetGroup}>
              <View style={styles.guestCard}>
                <View style={styles.guestAvatar}>
                  <Ionicons name="person-outline" size={30} color={IOSTokens.colors.labelSecondary} />
                </View>
                <Text style={styles.guestTitle}>Guest Foodie</Text>
                <Text style={styles.guestSubtitle}>
                  Sign in or create an account to save favorite food stalls, calibrate your sili tolerance, and pre-order meals.
                </Text>

                <View style={styles.guestActionRow}>
                  <Pressable
                    onPress={() => router.push('/login')}
                    style={({ pressed }) => [styles.guestPrimaryBtn, pressed && styles.primaryPressed]}
                  >
                    <Text style={styles.guestPrimaryText}>Sign In</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push('/signup')}
                    style={({ pressed }) => [styles.guestSecondaryBtn, pressed && styles.rowPressed]}
                  >
                    <Text style={styles.guestSecondaryText}>Create Account</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* SECTION 1: Pre-Order & Contact Info */}
          {isAuthenticated && user && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Pre-Order Details</Text>
              <View style={styles.insetGroup}>
                <View style={styles.groupRow}>
                  <Text style={styles.rowLabel}>Pickup Name</Text>
                  <Text style={styles.rowValue}>{user.name}</Text>
                </View>
                <View style={styles.groupRow}>
                  <Text style={styles.rowLabel}>Phone Number</Text>
                  <Text style={styles.rowValue}>{user.phone}</Text>
                </View>
                <View style={[styles.groupRow, styles.groupRowLast]}>
                  <Text style={styles.rowLabel}>Default Payment</Text>
                  <Text style={styles.rowValueTint}>GCash / Cash on Pickup</Text>
                </View>
              </View>
            </View>
          )}

          {/* SECTION 2: Bicolano Taste Preferences */}
          {isAuthenticated && user && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Bicol Food Preferences</Text>
              <View style={styles.insetGroup}>
                <View style={styles.groupRow}>
                  <Text style={styles.rowLabel}>Sili Tolerance</Text>
                  <View style={styles.pillContainer}>
                    <Pressable
                      onPress={() => handleSpiceChange('mild')}
                      style={[
                        styles.preferencePill,
                        user.spicePreference === 'mild' && styles.preferencePillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.preferencePillText,
                          user.spicePreference === 'mild' && styles.preferencePillTextActive,
                        ]}
                      >
                        Mild 🌶️
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleSpiceChange('moderate')}
                      style={[
                        styles.preferencePill,
                        user.spicePreference === 'moderate' && styles.preferencePillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.preferencePillText,
                          user.spicePreference === 'moderate' && styles.preferencePillTextActive,
                        ]}
                      >
                        Spicy 🌶️
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleSpiceChange('fiery')}
                      style={[
                        styles.preferencePill,
                        user.spicePreference === 'fiery' && styles.preferencePillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.preferencePillText,
                          user.spicePreference === 'fiery' && styles.preferencePillTextActive,
                        ]}
                      >
                        Fiery 🔥
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.groupRow}>
                  <Text style={styles.rowLabel}>Preferred District</Text>
                  <Text style={styles.rowValue}>{user.favoriteDistrict || 'Centro'}</Text>
                </View>
                <View style={[styles.groupRow, styles.groupRowLast]}>
                  <Text style={styles.rowLabel}>Member Since</Text>
                  <Text style={styles.rowValue}>{user.memberSince || 'October 2025'}</Text>
                </View>
              </View>
            </View>
          )}

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
              {isAuthenticated ? (
                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => [styles.signOutRow, pressed && styles.rowPressed]}
                >
                  <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => router.push('/welcome')}
                  style={({ pressed }) => [styles.signOutRow, pressed && styles.rowPressed]}
                >
                  <Text style={[styles.signOutText, { color: IOSTokens.colors.tint }]}>
                    Welcome & Onboarding Overview
                  </Text>
                </Pressable>
              )}
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

  // Guest Card
  guestCard: {
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  guestAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: IOSTokens.colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  guestTitle: {
    ...IOSTokens.typography.headline,
    fontSize: 18,
    color: IOSTokens.colors.label,
    marginBottom: 6,
  },
  guestSubtitle: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  guestActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  guestPrimaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: IOSTokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestPrimaryText: {
    ...IOSTokens.typography.headline,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  guestSecondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: IOSTokens.colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestSecondaryText: {
    ...IOSTokens.typography.headline,
    fontSize: 15,
    color: IOSTokens.colors.label,
    fontWeight: '600',
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  pressed: {
    opacity: 0.65,
  },
  rowPressed: {
    backgroundColor: IOSTokens.colors.fill,
  },
});
