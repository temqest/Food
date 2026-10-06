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
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBusiness, BusinessProduct } from '@/context/BusinessContext';
import { useBasket } from '@/context/BasketContext';
import { AddProductModal } from '@/components/business/AddProductModal';
import { CreatePromotionModal } from '@/components/business/CreatePromotionModal';
import { BusinessOrderCard } from '@/components/business/BusinessOrderCard';
import { PromotionCard } from '@/components/business/PromotionCard';
import { BusinessNavBar, BusinessTab } from '@/components/business/BusinessNavBar';
import { ESTABLISHMENTS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';

export default function BusinessDashboardScreen() {
  const {
    profile,
    products,
    promotions,
    analytics,
    updateProfile,
    toggleOpenStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    createPromotion,
    togglePromotionActive,
    deletePromotion,
    switchEstablishment,
  } = useBusiness();

  const { activePreOrders, updateOrderStatus, cancelOrder } = useBasket();

  // Mobile Bottom Navigation Tab: orders | menu | promote | store
  const [activeTab, setActiveTab] = useState<BusinessTab>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'received' | 'preparing' | 'ready'>('all');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BusinessProduct | null>(null);
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Edit store profile state
  const [editStoreName, setEditStoreName] = useState(profile.name);
  const [editAddress, setEditAddress] = useState(profile.address);
  const [editContact, setEditContact] = useState(profile.contactNumber);
  const [editHours, setEditHours] = useState(profile.openingHours);
  const [editDesc, setEditDesc] = useState(profile.description);

  // Filter orders for this establishment
  const storeOrders = activePreOrders.filter(
    (o) => o.establishmentId === profile.id || o.establishmentName.includes(profile.name.split(' ')[0])
  );

  const displayedOrders = storeOrders.filter((order) => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const newOrdersCount = storeOrders.filter((o) => o.status === 'received').length;
  const inKitchenCount = storeOrders.filter((o) => o.status === 'preparing').length;
  const readyCount = storeOrders.filter((o) => o.status === 'ready').length;

  const handleEditProductPress = (prod: BusinessProduct) => {
    setEditingProduct(prod);
    setIsAddProductOpen(true);
  };

  const handleDeleteProductPress = (prod: BusinessProduct) => {
    Alert.alert(
      'Remove Dish',
      `Are you sure you want to remove "${prod.name}" from your store menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteProduct(prod.id),
        },
      ]
    );
  };

  const handleOpenEditProfile = () => {
    setEditStoreName(profile.name);
    setEditAddress(profile.address);
    setEditContact(profile.contactNumber);
    setEditHours(profile.openingHours);
    setEditDesc(profile.description);
    setIsEditProfileOpen(true);
  };

  const handleSaveStoreProfile = () => {
    if (!editStoreName.trim()) {
      Alert.alert('Store Name', 'Please provide a store name.');
      return;
    }
    updateProfile({
      name: editStoreName.trim(),
      address: editAddress.trim(),
      contactNumber: editContact.trim(),
      openingHours: editHours.trim(),
      description: editDesc.trim(),
    });
    setIsEditProfileOpen(false);
    Alert.alert('Saved', 'Store details updated successfully.');
  };

  // Header Title mapping
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'orders':
        return 'Kitchen Orders';
      case 'menu':
        return 'Store Menu';
      case 'promote':
        return 'Promote & Reach';
      case 'store':
        return 'Store Profile';
      default:
        return profile.name;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Sleek Native iOS Mobile App Header */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.exitBtn, pressed && styles.pressed]}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Back to customer foodie view"
        >
          <Ionicons name="chevron-back" size={20} color="#000000" />
          <Text style={styles.exitBtnText}>Exit</Text>
        </Pressable>

        <View style={styles.headerCenterCol}>
          <Text style={styles.headerScreenTitle} numberOfLines={1}>
            {getHeaderTitle()}
          </Text>
          <Text style={styles.headerStoreSubhead} numberOfLines={1}>
            {profile.name}
          </Text>
        </View>

        <Pressable
          onPress={toggleOpenStatus}
          style={[
            styles.openStatusPill,
            profile.isOpenNow ? styles.openPillGreen : styles.openPillRed,
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Toggle store open status"
        >
          <View
            style={[
              styles.statusDot,
              profile.isOpenNow ? styles.statusDotGreen : styles.statusDotRed,
            ]}
          />
          <Text
            style={[
              styles.openStatusText,
              profile.isOpenNow ? styles.openTextGreen : styles.openTextRed,
            ]}
          >
            {profile.isOpenNow ? 'Open' : 'Closed'}
          </Text>
        </Pressable>
      </View>

      {/* Main Scroll Content Area */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= TAB 1: ORDERS ================= */}
        {activeTab === 'orders' && (
          <View style={styles.tabContainer}>
            {/* Filter Segmented Control */}
            <View style={styles.filterSegmentContainer}>
              {[
                { id: 'all' as const, label: `All (${storeOrders.length})` },
                { id: 'received' as const, label: `New (${newOrdersCount})` },
                { id: 'preparing' as const, label: `Kitchen (${inKitchenCount})` },
                { id: 'ready' as const, label: `Ready (${readyCount})` },
              ].map((f) => {
                const isActive = orderFilter === f.id;
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => setOrderFilter(f.id)}
                    style={[
                      styles.filterSegmentBtn,
                      isActive && styles.filterSegmentBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterSegmentText,
                        isActive && styles.filterSegmentTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Orders Queue */}
            {displayedOrders.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconBg}>
                  <Ionicons name="receipt-outline" size={32} color="#8E8E93" />
                </View>
                <Text style={styles.emptyTitle}>No Orders in this View</Text>
                <Text style={styles.emptySub}>
                  When customers pre-order from {profile.name}, tickets appear here for kitchen prep.
                </Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {displayedOrders.map((order) => (
                  <BusinessOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    onCancelOrder={cancelOrder}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ================= TAB 2: MENU & PRODUCTS ================= */}
        {activeTab === 'menu' && (
          <View style={styles.tabContainer}>
            {/* Top Action Row */}
            <View style={styles.menuHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Dishes Offered</Text>
                <Text style={styles.sectionSubheading}>
                  {products.length} item{products.length === 1 ? '' : 's'} on your counter menu
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Add Dish</Text>
              </Pressable>
            </View>

            {/* Inset Group List */}
            <View style={styles.insetGroup}>
              {products.map((prod, index) => {
                const isLast = index === products.length - 1;
                return (
                  <View
                    key={prod.id}
                    style={[styles.productRow, isLast && styles.rowLast]}
                  >
                    <Image source={{ uri: prod.image }} style={styles.productThumb} />

                    <Pressable
                      style={styles.productDetailsCol}
                      onPress={() => handleEditProductPress(prod)}
                    >
                      <View style={styles.productTitleLine}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {prod.name}
                        </Text>
                        {prod.isSignature && (
                          <View style={styles.signatureBadge}>
                            <Text style={styles.signatureBadgeText}>SIGNATURE</Text>
                          </View>
                        )}
                      </View>

                      {prod.bikolName ? (
                        <Text style={styles.productBikol} numberOfLines={1}>
                          {prod.bikolName}
                        </Text>
                      ) : null}

                      <Text style={styles.productMeta} numberOfLines={1}>
                        {prod.categoryLabel} · {prod.prepTime}
                      </Text>

                      <Text style={styles.productPrice}>₱{prod.price}</Text>
                    </Pressable>

                    <View style={styles.productActionsCol}>
                      <Switch
                        value={prod.inStock}
                        onValueChange={() => toggleProductStock(prod.id)}
                        trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#34C759' }}
                        thumbColor="#FFFFFF"
                      />
                      <Text
                        style={[
                          styles.stockBadgeText,
                          prod.inStock ? styles.stockGreen : styles.stockRed,
                        ]}
                      >
                        {prod.inStock ? 'In Stock' : 'Sold Out'}
                      </Text>

                      <Pressable
                        onPress={() => handleDeleteProductPress(prod)}
                        style={({ pressed }) => [styles.trashBtn, pressed && styles.pressed]}
                        hitSlop={8}
                      >
                        <Ionicons name="trash-outline" size={14} color="#8E8E93" />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ================= TAB 3: PROMOTE & ADVERTISE ================= */}
        {activeTab === 'promote' && (
          <View style={styles.tabContainer}>
            {/* Header & Launch Button */}
            <View style={styles.menuHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Promote in Naga</Text>
                <Text style={styles.sectionSubheading}>
                  Broadcast special deals to foodies browsing Naga Food
                </Text>
              </View>

              <Pressable
                onPress={() => setIsCreatePromoOpen(true)}
                style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Ionicons name="megaphone" size={15} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>Launch Ad</Text>
              </Pressable>
            </View>

            {/* Audience Info Card */}
            <View style={styles.promoAudienceCard}>
              <View style={styles.promoAudienceIcon}>
                <Ionicons name="people" size={20} color="#D42F13" />
              </View>
              <View style={styles.promoAudienceTextCol}>
                <Text style={styles.promoAudienceTitle}>Direct Reach Across Naga City</Text>
                <Text style={styles.promoAudienceDesc}>
                  Active promotions appear at the top of the Discover &amp; Categories feeds. Foodies can tap and order immediately for counter pickup.
                </Text>
              </View>
            </View>

            {/* Active Campaigns List */}
            <Text style={styles.sectionDividerLabel}>YOUR CAMPAIGNS ({promotions.length})</Text>
            {promotions.map((campaign) => (
              <PromotionCard
                key={campaign.id}
                campaign={campaign}
                onToggleActive={togglePromotionActive}
                onDelete={deletePromotion}
              />
            ))}
          </View>
        )}

        {/* ================= TAB 4: STORE & ANALYTICS ================= */}
        {activeTab === 'store' && (
          <View style={styles.tabContainer}>
            {/* Store Hero Card */}
            <View style={styles.storeHeroCard}>
              <Image source={{ uri: profile.heroImage }} style={styles.storeHeroImage} />
              <View style={styles.storeHeroContent}>
                <View style={styles.storeHeroTitleRow}>
                  <Text style={styles.storeHeroTitle}>{profile.name}</Text>
                  <Pressable
                    onPress={handleOpenEditProfile}
                    style={({ pressed }) => [styles.editProfilePill, pressed && styles.pressed]}
                    hitSlop={8}
                  >
                    <Ionicons name="pencil" size={13} color="#000000" />
                    <Text style={styles.editProfilePillText}>Edit</Text>
                  </Pressable>
                </View>
                <Text style={styles.storeHeroSub}>
                  {profile.typeLabel} · {profile.neighborhood}
                </Text>
                <Text style={styles.storeHeroDesc}>{profile.description}</Text>
              </View>
            </View>

            {/* Today's Metrics (Clean 2x2 Grid) */}
            <Text style={styles.sectionDividerLabel}>TODAY&apos;S OVERVIEW</Text>
            <View style={styles.storeStatsGrid}>
              <View style={styles.storeStatTile}>
                <Text style={styles.storeStatNumber}>₱{analytics.todayGrossSales.toLocaleString()}</Text>
                <Text style={styles.storeStatLabel}>Gross Sales Today</Text>
              </View>
              <View style={styles.storeStatTile}>
                <Text style={styles.storeStatNumber}>{storeOrders.length}</Text>
                <Text style={styles.storeStatLabel}>Pre-Orders Handled</Text>
              </View>
              <View style={styles.storeStatTile}>
                <Text style={styles.storeStatNumber}>{analytics.weeklyCustomerReach.toLocaleString()}</Text>
                <Text style={styles.storeStatLabel}>Foodie Views</Text>
              </View>
              <View style={styles.storeStatTile}>
                <Text style={styles.storeStatNumber}>{analytics.profileSaves}</Text>
                <Text style={styles.storeStatLabel}>Customer Bookmarks</Text>
              </View>
            </View>

            {/* Store Information Details Inset */}
            <Text style={styles.sectionDividerLabel}>STORE DETAILS</Text>
            <View style={styles.insetGroup}>
              <View style={styles.storeDetailRow}>
                <View style={styles.storeDetailLeft}>
                  <Ionicons name="time-outline" size={17} color="#2E7D32" />
                  <Text style={styles.storeDetailLabel}>Operating Hours</Text>
                </View>
                <Text style={styles.storeDetailValue}>{profile.openingHours}</Text>
              </View>

              <View style={styles.storeDetailRow}>
                <View style={styles.storeDetailLeft}>
                  <Ionicons name="location-outline" size={17} color="#D42F13" />
                  <Text style={styles.storeDetailLabel}>Address</Text>
                </View>
                <Text style={styles.storeDetailValue} numberOfLines={2}>
                  {profile.address}
                </Text>
              </View>

              <View style={[styles.storeDetailRow, styles.rowLast]}>
                <View style={styles.storeDetailLeft}>
                  <Ionicons name="call-outline" size={17} color="#1976D2" />
                  <Text style={styles.storeDetailLabel}>Contact Hotline</Text>
                </View>
                <Text style={styles.storeDetailValue}>{profile.contactNumber}</Text>
              </View>
            </View>

            {/* Switch Managed Establishment */}
            <Text style={styles.sectionDividerLabel}>SWITCH ACTIVE RESTAURANT / STALL</Text>
            <View style={styles.insetGroup}>
              {ESTABLISHMENTS.map((est, idx) => {
                const isSelected = est.id === profile.id;
                const isLast = idx === ESTABLISHMENTS.length - 1;
                return (
                  <Pressable
                    key={est.id}
                    onPress={() => switchEstablishment(est.id)}
                    style={[styles.switchRow, isLast && styles.rowLast]}
                  >
                    <Image source={{ uri: est.heroImage }} style={styles.switchThumb} />
                    <View style={styles.switchMeta}>
                      <Text
                        style={[
                          styles.switchName,
                          isSelected && styles.switchNameActive,
                        ]}
                      >
                        {est.name}
                      </Text>
                      <Text style={styles.switchSub}>{est.typeLabel} · {est.neighborhood}</Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color="#D42F13" />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Signature Mobile Bottom Navigation Bar */}
      <BusinessNavBar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        ordersBadgeCount={newOrdersCount}
      />

      {/* Modals */}
      <AddProductModal
        visible={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        onSave={(newProd) => {
          if (editingProduct) {
            updateProduct(editingProduct.id, newProd);
          } else {
            addProduct(newProd);
          }
        }}
        editingProduct={editingProduct}
      />

      <CreatePromotionModal
        visible={isCreatePromoOpen}
        onClose={() => setIsCreatePromoOpen(false)}
        onSave={createPromotion}
        products={products}
        establishmentId={profile.id}
      />

      {/* Edit Store Profile Modal */}
      <Modal
        visible={isEditProfileOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditProfileOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsEditProfileOpen(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => setIsEditProfileOpen(false)}
                style={styles.modalHeaderBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.modalTitle}>Edit Business Info</Text>
              <Pressable
                onPress={handleSaveStoreProfile}
                style={styles.modalHeaderBtn}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalContent}
              keyboardDismissMode="on-drag"
            >
              <Text style={styles.modalSectionLabel}>BUSINESS DETAILS</Text>
              <View style={styles.modalInsetGroup}>
                <View style={styles.modalInputRow}>
                  <Text style={styles.modalLabel}>Store Name</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={editStoreName}
                    onChangeText={setEditStoreName}
                  />
                </View>

                <View style={styles.modalInputRow}>
                  <Text style={styles.modalLabel}>Address</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={editAddress}
                    onChangeText={setEditAddress}
                  />
                </View>

                <View style={styles.modalInputRow}>
                  <Text style={styles.modalLabel}>Hotline / Phone</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={editContact}
                    onChangeText={setEditContact}
                  />
                </View>

                <View style={[styles.modalInputRow, styles.rowLast]}>
                  <Text style={styles.modalLabel}>Operating Hours</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={editHours}
                    onChangeText={setEditHours}
                  />
                </View>
              </View>

              <Text style={styles.modalSectionLabel}>STORY &amp; DESCRIPTION</Text>
              <View style={styles.modalInsetGroup}>
                <View style={styles.modalTextAreaRow}>
                  <TextInput
                    style={styles.modalTextArea}
                    value={editDesc}
                    onChangeText={setEditDesc}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.2)',
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingRight: 8,
  },
  exitBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  headerCenterCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerScreenTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  headerStoreSubhead: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  openStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openPillGreen: {
    backgroundColor: '#E8F5E9',
  },
  openPillRed: {
    backgroundColor: '#FFEBEE',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotGreen: {
    backgroundColor: '#2E7D32',
  },
  statusDotRed: {
    backgroundColor: '#C62828',
  },
  openStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  openTextGreen: {
    color: '#2E7D32',
  },
  openTextRed: {
    color: '#C62828',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 130, // Generous padding ensures content is never covered by floating bottom navbar
  },
  tabContainer: {
    gap: 12,
  },
  filterSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 10,
    padding: 3,
    marginBottom: 4,
  },
  filterSegmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  filterSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      },
    }),
  },
  filterSegmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.7)',
  },
  filterSegmentTextActive: {
    fontWeight: '700',
    color: '#000000',
  },
  ordersList: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 36,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  emptyIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  sectionSubheading: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  productThumb: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  productDetailsCol: {
    flex: 1,
    paddingRight: 8,
  },
  productTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  signatureBadge: {
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  signatureBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productBikol: {
    fontSize: 12,
    color: IOSTokens.colors.tint,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  productMeta: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  productActionsCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockGreen: {
    color: '#2E7D32',
  },
  stockRed: {
    color: '#C62828',
  },
  trashBtn: {
    padding: 4,
    marginTop: 2,
  },
  promoAudienceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(212, 47, 19, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.2)',
  },
  promoAudienceIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoAudienceTextCol: {
    flex: 1,
  },
  promoAudienceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 3,
  },
  promoAudienceDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(60, 60, 67, 0.8)',
  },
  sectionDividerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.08,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  storeHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  storeHeroImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#F2F2F7',
  },
  storeHeroContent: {
    padding: 14,
  },
  storeHeroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  storeHeroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editProfilePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  storeHeroSub: {
    fontSize: 13,
    color: IOSTokens.colors.tint,
    fontWeight: '500',
    marginBottom: 6,
  },
  storeHeroDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(60, 60, 67, 0.7)',
  },
  storeStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  storeStatTile: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  storeStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  storeStatLabel: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  storeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  storeDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  storeDetailValue: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.7)',
    maxWidth: 180,
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  switchThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginRight: 10,
  },
  switchMeta: {
    flex: 1,
  },
  switchName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  switchNameActive: {
    color: IOSTokens.colors.tint,
  },
  switchSub: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  pressed: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalSheet: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        maxWidth: 550,
        width: '100%',
        alignSelf: 'center',
      } as any,
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.2)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeaderBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },
  modalBody: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.08,
    marginBottom: 6,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  modalInsetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  modalLabel: {
    fontSize: 15,
    color: '#000000',
    width: 120,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    textAlign: 'right',
    padding: 0,
  },
  modalTextAreaRow: {
    padding: 14,
  },
  modalTextArea: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    minHeight: 70,
    padding: 0,
  },
});
