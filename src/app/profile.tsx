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
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
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
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Editorial Title */}
          <View style={styles.titleSection}>
            <Text style={styles.headingSans}>
              Foodie <Text style={styles.headingSerif}>profile</Text>
            </Text>
            <Text style={styles.subheadText}>
              Personalize your sili heat tolerance, favorite district, and account details.
            </Text>
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
                      <Ionicons name="ribbon" size={12} color="#D42F13" />
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
                  <Text style={styles.statLabel}>Active Orders</Text>
                </Pressable>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{user.reviewCount || 12}</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.insetGroup}>
              <View style={styles.guestCard}>
                <View style={styles.guestAvatar}>
                  <Ionicons name="person-outline" size={30} color="#8E8E93" />
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
                        Spicy 🌶️🌶️
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
                  trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#111111' }}
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
                  accessibilityRole="button"
                  accessibilityLabel="Sign out"
                >
                  <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => router.push('/welcome')}
                  style={({ pressed }) => [styles.signOutRow, pressed && styles.rowPressed]}
                >
                  <Text style={[styles.signOutText, { color: '#000000' }]}>
                    Welcome & App Overview
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <NavBar />
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
    paddingBottom: 95,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 16,
  },
  titleSection: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  headingSans: {
    fontFamily: sansFamily,
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
  },
  headingSerif: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 34,
    fontWeight: '400',
    color: '#000000',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 20,
  },

  // Profile Card Header
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F2F7',
  },
  profileMeta: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  userHandle: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  guideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  guideBadgeText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
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
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  statLabel: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: 'rgba(60, 60, 67, 0.15)',
  },

  // Section Blocks & Group Rows
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  groupRowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  rowValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
  },
  rowValueTint: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#D42F13',
    fontWeight: '600',
  },

  // Sili Preference Pills
  pillContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  preferencePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  preferencePillActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  preferencePillText: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#6E6E73',
    fontWeight: '600',
  },
  preferencePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Sign Out
  signOutRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  signOutText: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#FF3B30',
    fontWeight: '600',
  },

  // Guest Card
  guestCard: {
    padding: 24,
    alignItems: 'center',
  },
  guestAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  guestTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  guestSubtitle: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  guestActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  guestPrimaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestPrimaryText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  guestSecondaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestSecondaryText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#000000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});
