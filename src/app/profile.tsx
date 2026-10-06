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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';
import { useAuth } from '@/context/AuthContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
];

export default function ProfileScreen() {
  const { savedFoods, savedEstablishments } = useSaved();
  const { activePreOrders } = useBasket();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  // Settings Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // Edit Profile Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLocation, setEditLocation] = useState(user?.location || 'Centro, Naga City');
  const [editAvatar, setEditAvatar] = useState(
    user?.avatar || AVATAR_PRESETS[0]
  );
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const totalSaved = savedFoods.length + savedEstablishments.length;

  const handleOpenEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditPhone(user.phone);
      setEditLocation(user.location);
      setEditAvatar(user.avatar || AVATAR_PRESETS[0]);
    }
    setSaveSuccessMessage(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      location: editLocation.trim(),
      avatar: editAvatar,
    });

    setSaveSuccessMessage('Profile details updated successfully!');
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSaveSuccessMessage(null);
    }, 800);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear App Cache',
      'This will clear temporary saved images and cached offline data. Your account and favorites will remain safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cache Cleared', 'Freed up 24.8 MB of local cached files.');
          },
        },
      ]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Naga Foodie Help & Support',
      'Need assistance with your orders or account?\n\n📧 Email: support@nagafood.ph\n📞 Hotline: +63 (054) 881-3000\n⏰ Hours: 8:00 AM – 10:00 PM Daily',
      [{ text: 'Close', style: 'default' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy & Data Policy',
      'Naga Food respects your data privacy. Your contact details and pre-order history are only shared with partner food establishments when an order is submitted.',
      [{ text: 'Understood', style: 'default' }]
    );
  };

  const handleCheckUpdates = () => {
    Alert.alert('Up to Date', 'You are running the latest version of Naga Food (v1.2.0 Build 42).');
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
              Manage your pre-orders, profile details, security, and app preferences.
            </Text>
          </View>

          {/* Profile Card Header */}
          {isAuthenticated && user ? (
            <View style={styles.insetGroup}>
              <View style={styles.profileHeaderRow}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri: user.avatar || AVATAR_PRESETS[0],
                    }}
                    style={styles.avatarImage}
                  />
                  <Pressable
                    onPress={handleOpenEdit}
                    style={({ pressed }) => [styles.avatarEditBadge, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Edit profile photo"
                  >
                    <Ionicons name="camera" size={12} color="#FFFFFF" />
                  </Pressable>
                </View>

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

                <Pressable
                  onPress={handleOpenEdit}
                  style={({ pressed }) => [styles.headerEditButton, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Edit profile"
                >
                  <Ionicons name="pencil" size={14} color="#111111" />
                  <Text style={styles.headerEditText}>Edit</Text>
                </Pressable>
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
                  Sign in or create an account to save favorite food stalls, manage orders, and edit account settings.
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

          {/* SECTION 0: Business & Merchant Portal */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Business &amp; Merchant Center</Text>
            <View style={styles.insetGroup}>
              <Pressable
                onPress={() => router.push('/business')}
                style={({ pressed }) => [styles.groupRow, styles.groupRowLast, pressed && styles.rowPressed]}
                accessibilityRole="button"
                accessibilityLabel="Open Business & Merchant Portal"
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(212, 47, 19, 0.12)' }]}>
                    <Ionicons name="storefront" size={17} color="#D42F13" />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.rowLabel}>Merchant Portal</Text>
                      <View style={{ backgroundColor: '#D42F13', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: '#FFFFFF' }}>PARTNER</Text>
                      </View>
                    </View>
                    <Text style={styles.rowSubLabel}>Manage products, orders &amp; advertise in Naga</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </Pressable>
            </View>
          </View>

          {/* SECTION 1: Account & Security */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Account & Security</Text>
            <View style={styles.insetGroup}>
              {isAuthenticated && (
                <Pressable
                  onPress={handleOpenEdit}
                  style={({ pressed }) => [styles.groupRow, pressed && styles.rowPressed]}
                >
                  <View style={styles.rowLeft}>
                    <View style={[styles.rowIconCircle, { backgroundColor: '#F2F2F7' }]}>
                      <Ionicons name="person" size={17} color="#111111" />
                    </View>
                    <View>
                      <Text style={styles.rowLabel}>Edit Profile Information</Text>
                      <Text style={styles.rowSubLabel}>Name, phone, email & location</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                </Pressable>
              )}

              <Pressable
                onPress={() => router.push('/forgot-password')}
                style={({ pressed }) => [styles.groupRow, pressed && styles.rowPressed]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(212, 47, 19, 0.10)' }]}>
                    <Ionicons name="key-outline" size={17} color="#D42F13" />
                  </View>
                  <View>
                    <Text style={styles.rowLabel}>Password & Recovery</Text>
                    <Text style={styles.rowSubLabel}>Reset or change login password</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </Pressable>

              {isAuthenticated && user && (
                <View style={[styles.groupRow, styles.groupRowLast]}>
                  <View style={styles.rowLeft}>
                    <View style={[styles.rowIconCircle, { backgroundColor: '#E8F5E9' }]}>
                      <Ionicons name="wallet-outline" size={17} color="#2E7D32" />
                    </View>
                    <View>
                      <Text style={styles.rowLabel}>Default Payment</Text>
                      <Text style={styles.rowSubLabel}>GCash / Cash on Pickup</Text>
                    </View>
                  </View>
                  <Text style={styles.rowValueTint}>Active</Text>
                </View>
              )}
            </View>
          </View>

          {/* SECTION 2: App Preferences */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.insetGroup}>
              <View style={styles.groupRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="notifications-outline" size={17} color="#1976D2" />
                  </View>
                  <Text style={styles.rowLabel}>Pre-Order Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#111111' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.groupRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="chatbox-ellipses-outline" size={17} color="#E65100" />
                  </View>
                  <Text style={styles.rowLabel}>SMS Order Tracking Alerts</Text>
                </View>
                <Switch
                  value={smsAlertsEnabled}
                  onValueChange={setSmsAlertsEnabled}
                  trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#111111' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.groupRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#F3E5F5' }]}>
                    <Ionicons name="hardware-chip-outline" size={17} color="#7B1FA2" />
                  </View>
                  <Text style={styles.rowLabel}>Haptic Feedback</Text>
                </View>
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#111111' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.groupRow, styles.groupRowLast]}>
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#EFEBE9' }]}>
                    <Ionicons name="location-outline" size={17} color="#5D4037" />
                  </View>
                  <View style={styles.rowTextCol}>
                    <Text style={styles.rowLabel}>Location Services</Text>
                    <Text style={styles.rowSubLabel}>GPS enabled for Naga City</Text>
                  </View>
                </View>
                <View style={styles.statusBadgeGreen}>
                  <View style={styles.greenDot} />
                  <Text style={styles.statusBadgeGreenText}>Active</Text>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 3: Support & System */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Support & About</Text>
            <View style={styles.insetGroup}>
              <Pressable
                onPress={handleHelpSupport}
                style={({ pressed }) => [styles.groupRow, pressed && styles.rowPressed]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#F2F2F7' }]}>
                    <Ionicons name="help-buoy-outline" size={17} color="#111111" />
                  </View>
                  <Text style={styles.rowLabel}>Help & Customer Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </Pressable>

              <Pressable
                onPress={handlePrivacyPolicy}
                style={({ pressed }) => [styles.groupRow, pressed && styles.rowPressed]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#F2F2F7' }]}>
                    <Ionicons name="shield-checkmark-outline" size={17} color="#111111" />
                  </View>
                  <Text style={styles.rowLabel}>Privacy Policy & Terms</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </Pressable>

              <Pressable
                onPress={handleClearCache}
                style={({ pressed }) => [styles.groupRow, pressed && styles.rowPressed]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#FFEBEE' }]}>
                    <Ionicons name="trash-outline" size={17} color="#C62828" />
                  </View>
                  <Text style={styles.rowLabel}>Clear Local Cache</Text>
                </View>
                <Text style={styles.rowValue}>24.8 MB</Text>
              </Pressable>

              <Pressable
                onPress={handleCheckUpdates}
                style={({ pressed }) => [styles.groupRow, styles.groupRowLast, pressed && styles.rowPressed]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.rowIconCircle, { backgroundColor: '#F2F2F7' }]}>
                    <Ionicons name="information-circle-outline" size={17} color="#111111" />
                  </View>
                  <Text style={styles.rowLabel}>App Version</Text>
                </View>
                <Text style={styles.rowValue}>v1.2.0 (Build 42)</Text>
              </Pressable>
            </View>
          </View>

          {/* SECTION 4: Sign Out / Auth Actions */}
          <View style={styles.sectionBlock}>
            <View style={styles.insetGroup}>
              {isAuthenticated ? (
                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => [styles.signOutRow, pressed && styles.rowPressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Sign out"
                >
                  <Ionicons name="log-out-outline" size={18} color="#FF3B30" style={{ marginRight: 6 }} />
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

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => setIsEditModalOpen(false)}
                style={({ pressed }) => [styles.modalCloseBtn, pressed && styles.pressed]}
              >
                <Ionicons name="close" size={22} color="#111111" />
              </Pressable>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={styles.modalSaveBtn}
                accessibilityRole="button"
              >
                <Text style={styles.modalSaveText}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollBody}>
              {/* Success Notification */}
              {saveSuccessMessage && (
                <View style={styles.successBanner}>
                  <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                  <Text style={styles.successBannerText}>{saveSuccessMessage}</Text>
                </View>
              )}

              {/* Avatar Picker */}
              <Text style={styles.inputSectionTitle}>Choose Avatar</Text>
              <View style={styles.avatarPickerRow}>
                {AVATAR_PRESETS.map((uri, idx) => {
                  const isSelected = editAvatar === uri;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setEditAvatar(uri)}
                      style={[
                        styles.avatarOptionWrapper,
                        isSelected && styles.avatarOptionSelected,
                      ]}
                    >
                      <Image source={{ uri }} style={styles.avatarOptionImage} />
                      {isSelected && (
                        <View style={styles.avatarCheckBadge}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Input Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="e.g. Maria Santos"
                  placeholderTextColor="#8E8E93"
                  style={styles.inputField}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="name@domain.com"
                  placeholderTextColor="#8E8E93"
                  style={styles.inputField}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="+63 9XX XXX XXXX"
                  placeholderTextColor="#8E8E93"
                  style={styles.inputField}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Neighborhood / District</Text>
                <TextInput
                  value={editLocation}
                  onChangeText={setEditLocation}
                  placeholder="e.g. Centro, Naga City"
                  placeholderTextColor="#8E8E93"
                  style={styles.inputField}
                />
              </View>

              <TouchableOpacity
                onPress={handleSaveProfile}
                style={styles.modalPrimaryActionBtn}
                activeOpacity={0.85}
              >
                <Text style={styles.modalPrimaryActionText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
  avatarWrapper: {
    position: 'relative',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F2F7',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
  headerEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  headerEditText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
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
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  groupRowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  rowTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  rowIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowLabel: {
    fontFamily: sansFamily,
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
    flexShrink: 1,
  },
  rowSubLabel: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
    flexShrink: 1,
  },
  rowValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    flexShrink: 0,
    textAlign: 'right',
    marginLeft: 8,
  },
  rowValueTint: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    flexShrink: 0,
    textAlign: 'right',
    marginLeft: 8,
  },
  statusBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
    flexShrink: 0,
    marginLeft: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  statusBadgeGreenText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },

  // Sign Out
  signOutRow: {
    flexDirection: 'row',
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

  // Edit Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitle: {
    fontFamily: sansFamily,
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  modalSaveBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  modalSaveText: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#D42F13',
  },
  modalScrollBody: {
    padding: 20,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    gap: 8,
    marginBottom: 16,
  },
  successBannerText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  inputSectionTitle: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  avatarPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOptionWrapper: {
    position: 'relative',
    borderRadius: 32,
    padding: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#111111',
  },
  avatarOptionImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#6E6E73',
    marginBottom: 6,
  },
  inputField: {
    fontFamily: sansFamily,
    fontSize: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#000000',
  },
  modalPrimaryActionBtn: {
    backgroundColor: '#111111',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  modalPrimaryActionText: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
