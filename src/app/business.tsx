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
import { ESTABLISHMENTS } from '@/data/mockData';

type BusinessTab = 'overview' | 'products' | 'orders' | 'promote' | 'settings';

export default function BusinessDashboardScreen() {
  const {
    profile,
    products,
    promotions,
    activePromotion,
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

  const [activeTab, setActiveTab] = useState<BusinessTab>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');

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

  // Filter orders for this establishment or generic test orders
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
      'Remove Product',
      `Are you sure you want to remove "${prod.name}" from your store offerings?`,
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

  return (
    <SafeAreaView style={styles.screen}>
      {/* Top Merchant App Bar */}
      <View style={styles.topHeader}>
        <View style={styles.storeMetaCol}>
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName} numberOfLines={1}>
              {profile.name}
            </Text>
            <View style={styles.verifiedPartnerBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#D42F13" />
            </View>
          </View>
          <Text style={styles.storeTypeSubhead} numberOfLines={1}>
            {profile.typeLabel} · {profile.neighborhood}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
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

          <Pressable
            onPress={() => router.push('/')}
            style={({ pressed }) => [styles.exitBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Switch to Foodie Customer Mode"
          >
            <Ionicons name="eye-outline" size={16} color="#000000" />
            <Text style={styles.exitBtnText}>Foodie View</Text>
          </Pressable>
        </View>
      </View>

      {/* iOS Segmented Navigation Bar */}
      <View style={styles.navBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navBarScroll}
        >
          <Pressable
            onPress={() => setActiveTab('overview')}
            style={[styles.tabItem, activeTab === 'overview' && styles.tabItemActive]}
          >
            <Ionicons
              name={activeTab === 'overview' ? 'grid' : 'grid-outline'}
              size={15}
              color={activeTab === 'overview' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'overview' && styles.tabItemTextActive,
              ]}
            >
              Dashboard
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('products')}
            style={[styles.tabItem, activeTab === 'products' && styles.tabItemActive]}
          >
            <Ionicons
              name={activeTab === 'products' ? 'restaurant' : 'restaurant-outline'}
              size={15}
              color={activeTab === 'products' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'products' && styles.tabItemTextActive,
              ]}
            >
              Products ({products.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('orders')}
            style={[styles.tabItem, activeTab === 'orders' && styles.tabItemActive]}
          >
            <Ionicons
              name={activeTab === 'orders' ? 'receipt' : 'receipt-outline'}
              size={15}
              color={activeTab === 'orders' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'orders' && styles.tabItemTextActive,
              ]}
            >
              Orders
            </Text>
            {newOrdersCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{newOrdersCount}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('promote')}
            style={[styles.tabItem, activeTab === 'promote' && styles.tabItemActive]}
          >
            <Ionicons
              name={activeTab === 'promote' ? 'megaphone' : 'megaphone-outline'}
              size={15}
              color={activeTab === 'promote' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'promote' && styles.tabItemTextActive,
              ]}
            >
              Advertise & Reach
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('settings')}
            style={[styles.tabItem, activeTab === 'settings' && styles.tabItemActive]}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'storefront' : 'storefront-outline'}
              size={15}
              color={activeTab === 'settings' ? '#D42F13' : '#8E8E93'}
            />
            <Text
              style={[
                styles.tabItemText,
                activeTab === 'settings' && styles.tabItemTextActive,
              ]}
            >
              Store Info
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <View style={styles.tabContainer}>
            {/* Today's Sales & Metrics Grid */}
            <Text style={styles.sectionHeader}>TODAY&apos;S PERFORMANCE</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconCircle}>
                  <Ionicons name="wallet-outline" size={17} color="#D42F13" />
                </View>
                <Text style={styles.statNumber}>₱{analytics.todayGrossSales.toLocaleString()}</Text>
                <Text style={styles.statTitle}>Gross Sales</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="receipt-outline" size={17} color="#1976D2" />
                </View>
                <Text style={styles.statNumber}>{storeOrders.length}</Text>
                <Text style={styles.statTitle}>Orders Handled</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="people-outline" size={17} color="#2E7D32" />
                </View>
                <Text style={styles.statNumber}>{analytics.weeklyCustomerReach.toLocaleString()}</Text>
                <Text style={styles.statTitle}>Naga Foodie Views</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconCircle, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="bookmark-outline" size={17} color="#E65100" />
                </View>
                <Text style={styles.statNumber}>{analytics.profileSaves}</Text>
                <Text style={styles.statTitle}>Foodie Saves</Text>
              </View>
            </View>

            {/* Quick Action Shortcuts */}
            <Text style={styles.sectionHeader}>QUICK SHORTCUTS</Text>
            <View style={styles.shortcutsRow}>
              <Pressable
                onPress={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                style={({ pressed }) => [styles.shortcutBtn, pressed && styles.pressed]}
              >
                <View style={styles.shortcutIconBg}>
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.shortcutLabel}>Add Dish</Text>
              </Pressable>

              <Pressable
                onPress={() => setIsCreatePromoOpen(true)}
                style={({ pressed }) => [styles.shortcutBtn, pressed && styles.pressed]}
              >
                <View style={[styles.shortcutIconBg, { backgroundColor: '#1976D2' }]}>
                  <Ionicons name="megaphone" size={17} color="#FFFFFF" />
                </View>
                <Text style={styles.shortcutLabel}>Launch Ad</Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('orders')}
                style={({ pressed }) => [styles.shortcutBtn, pressed && styles.pressed]}
              >
                <View style={[styles.shortcutIconBg, { backgroundColor: '#2E7D32' }]}>
                  <Ionicons name="flame" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.shortcutLabel}>Kitchen Queue</Text>
              </Pressable>

              <Pressable
                onPress={handleOpenEditProfile}
                style={({ pressed }) => [styles.shortcutBtn, pressed && styles.pressed]}
              >
                <View style={[styles.shortcutIconBg, { backgroundColor: '#616161' }]}>
                  <Ionicons name="time" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.shortcutLabel}>Store Hours</Text>
              </Pressable>
            </View>

            {/* Active Promotion Broadcast Widget */}
            {activePromotion && (
              <>
                <Text style={styles.sectionHeader}>LIVE PROMOTION IN NAGA DISCOVERY FEED</Text>
                <View style={styles.livePromoCard}>
                  <View style={styles.livePromoTop}>
                    <View style={styles.livePromoBadge}>
                      <Ionicons name="radio" size={12} color="#FFFFFF" />
                      <Text style={styles.livePromoBadgeText}>BROADCASTING NOW</Text>
                    </View>
                    <Text style={styles.livePromoDistrict}>{activePromotion.targetDistrict}</Text>
                  </View>
                  <Text style={styles.livePromoTitle}>{activePromotion.title}</Text>
                  <Text style={styles.livePromoDesc}>{activePromotion.description}</Text>

                  <View style={styles.livePromoStats}>
                    <View style={styles.promoStatItem}>
                      <Text style={styles.promoStatNum}>{activePromotion.impressions.toLocaleString()}</Text>
                      <Text style={styles.promoStatLbl}>Foodies Reached</Text>
                    </View>
                    <View style={styles.promoStatItem}>
                      <Text style={styles.promoStatNum}>{activePromotion.clicks.toLocaleString()}</Text>
                      <Text style={styles.promoStatLbl}>Menu Clicks</Text>
                    </View>
                    <View style={styles.promoStatItem}>
                      <Text style={[styles.promoStatNum, { color: '#D42F13' }]}>
                        {activePromotion.ordersDriven}
                      </Text>
                      <Text style={styles.promoStatLbl}>Orders Driven</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            {/* Rush Hours Distribution */}
            <Text style={styles.sectionHeader}>PEAK RUSH HOURS IN NAGA</Text>
            <View style={styles.insetCard}>
              <View style={styles.rushHoursRow}>
                {analytics.popularHours.map((h, i) => (
                  <View key={i} style={styles.rushHourCol}>
                    <View style={styles.rushBarContainer}>
                      <View
                        style={[
                          styles.rushBarFill,
                          {
                            height: `${h.percentage}%`,
                            backgroundColor:
                              h.level === 'High'
                                ? '#D42F13'
                                : h.level === 'Medium'
                                ? '#FF9500'
                                : '#C7C7CC',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.rushHourLabel}>{h.hour}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.rushHourHint}>
                Highest kitchen traffic: 12 PM (Lunch) &amp; 3 PM to 6 PM (Afternoon Merienda)
              </Text>
            </View>

            {/* Pending Orders Alert */}
            {newOrdersCount > 0 && (
              <Pressable
                onPress={() => setActiveTab('orders')}
                style={({ pressed }) => [styles.pendingAlertCard, pressed && styles.pressed]}
              >
                <View style={styles.pendingAlertLeft}>
                  <Ionicons name="notifications-circle" size={24} color="#D42F13" />
                  <View>
                    <Text style={styles.pendingAlertTitle}>
                      {newOrdersCount} New Pre-Order{newOrdersCount > 1 ? 's' : ''} Waiting!
                    </Text>
                    <Text style={styles.pendingAlertSubtitle}>Tap to open kitchen queue and start preparing</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#D42F13" />
              </Pressable>
            )}
          </View>
        )}

        {/* ================= TAB 2: PRODUCTS ================= */}
        {activeTab === 'products' && (
          <View style={styles.tabContainer}>
            <View style={styles.tabActionHeader}>
              <View>
                <Text style={styles.tabMainTitle}>Menu &amp; Products</Text>
                <Text style={styles.tabMainSubtitle}>
                  Manage dishes, prices, signature items, and stock availability.
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                style={({ pressed }) => [styles.addBtnHeader, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Ionicons name="add" size={17} color="#FFFFFF" />
                <Text style={styles.addBtnHeaderText}>Add Dish</Text>
              </Pressable>
            </View>

            {/* Inset Group List */}
            <View style={styles.productsInsetGroup}>
              {products.map((prod, index) => {
                const isLast = index === products.length - 1;
                return (
                  <View
                    key={prod.id}
                    style={[styles.productRow, isLast && styles.productRowLast]}
                  >
                    <Image source={{ uri: prod.image }} style={styles.productThumb} />

                    <Pressable
                      style={styles.productInfoCol}
                      onPress={() => handleEditProductPress(prod)}
                    >
                      <View style={styles.productTitleRow}>
                        <Text style={styles.productNameText} numberOfLines={1}>
                          {prod.name}
                        </Text>
                        {prod.isSignature && (
                          <View style={styles.signatureBadge}>
                            <Text style={styles.signatureBadgeText}>SIGNATURE</Text>
                          </View>
                        )}
                      </View>

                      {prod.bikolName ? (
                        <Text style={styles.productBikolText} numberOfLines={1}>
                          {prod.bikolName}
                        </Text>
                      ) : null}

                      <Text style={styles.productMetaText}>
                        {prod.categoryLabel} · {prod.prepTime}
                      </Text>

                      <Text style={styles.productPriceText}>₱{prod.price}</Text>
                    </Pressable>

                    <View style={styles.productControlsCol}>
                      <Switch
                        value={prod.inStock}
                        onValueChange={() => toggleProductStock(prod.id)}
                        trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#34C759' }}
                        thumbColor="#FFFFFF"
                      />
                      <Text
                        style={[
                          styles.stockStatusLabel,
                          prod.inStock ? styles.stockGreen : styles.stockRed,
                        ]}
                      >
                        {prod.inStock ? 'In Stock' : 'Sold Out'}
                      </Text>

                      <Pressable
                        onPress={() => handleDeleteProductPress(prod)}
                        style={({ pressed }) => [styles.trashIconBtn, pressed && styles.pressed]}
                        hitSlop={8}
                      >
                        <Ionicons name="trash-outline" size={15} color="#8E8E93" />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ================= TAB 3: ORDERS ================= */}
        {activeTab === 'orders' && (
          <View style={styles.tabContainer}>
            <View style={styles.tabActionHeader}>
              <View>
                <Text style={styles.tabMainTitle}>Live Kitchen Orders</Text>
                <Text style={styles.tabMainSubtitle}>
                  Receive pre-orders and advance order status for customer counter pickups.
                </Text>
              </View>
            </View>

            {/* Order Filter Tabs */}
            <View style={styles.orderFilterRow}>
              {[
                { id: 'all', label: `All (${storeOrders.length})` },
                { id: 'received', label: `New (${newOrdersCount})` },
                { id: 'preparing', label: `Cooking (${inKitchenCount})` },
                { id: 'ready', label: `Ready (${readyCount})` },
              ].map((filter) => (
                <Pressable
                  key={filter.id}
                  onPress={() => setOrderFilter(filter.id)}
                  style={[
                    styles.orderFilterPill,
                    orderFilter === filter.id && styles.orderFilterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.orderFilterText,
                      orderFilter === filter.id && styles.orderFilterTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {displayedOrders.length === 0 ? (
              <View style={styles.emptyOrdersCard}>
                <Ionicons name="restaurant-outline" size={36} color="#8E8E93" />
                <Text style={styles.emptyOrdersTitle}>No active tickets in this view</Text>
                <Text style={styles.emptyOrdersSub}>
                  When foodies place pre-orders through Naga Food, tickets appear here instantly.
                </Text>
              </View>
            ) : (
              displayedOrders.map((order) => (
                <BusinessOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  onCancelOrder={cancelOrder}
                />
              ))
            )}
          </View>
        )}

        {/* ================= TAB 4: PROMOTE & ADVERTISE ================= */}
        {activeTab === 'promote' && (
          <View style={styles.tabContainer}>
            <View style={styles.tabActionHeader}>
              <View>
                <Text style={styles.tabMainTitle}>Advertise &amp; Reach</Text>
                <Text style={styles.tabMainSubtitle}>
                  Reach hungry Naga foodies with flash deals and featured spotlights.
                </Text>
              </View>

              <Pressable
                onPress={() => setIsCreatePromoOpen(true)}
                style={({ pressed }) => [styles.addBtnHeader, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Ionicons name="megaphone" size={15} color="#FFFFFF" />
                <Text style={styles.addBtnHeaderText}>Launch Ad</Text>
              </Pressable>
            </View>

            {/* Reach Audience Explainer Card */}
            <View style={styles.reachHeroCard}>
              <View style={styles.reachHeroIconWrap}>
                <Ionicons name="location" size={24} color="#D42F13" />
              </View>
              <View style={styles.reachHeroTextCol}>
                <Text style={styles.reachHeroHeading}>How Advertising Works on Naga Food</Text>
                <Text style={styles.reachHeroDesc}>
                  Your active promotional campaigns are broadcast directly onto the Home &amp; Categories
                  feed for users within Naga City, allowing foodies to tap and pre-order immediately.
                </Text>
              </View>
            </View>

            {/* Campaigns List */}
            <Text style={styles.sectionHeader}>CAMPAIGNS ({promotions.length})</Text>
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

        {/* ================= TAB 5: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <View style={styles.tabContainer}>
            <View style={styles.tabActionHeader}>
              <View>
                <Text style={styles.tabMainTitle}>Store &amp; Business Profile</Text>
                <Text style={styles.tabMainSubtitle}>
                  Operating hours, contact hotline, location, and establishment info.
                </Text>
              </View>

              <Pressable
                onPress={handleOpenEditProfile}
                style={({ pressed }) => [styles.editStoreBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Ionicons name="pencil" size={14} color="#111111" />
                <Text style={styles.editStoreBtnText}>Edit Details</Text>
              </Pressable>
            </View>

            {/* Store Profile Card */}
            <View style={styles.storeProfileCard}>
              <Image source={{ uri: profile.heroImage }} style={styles.storeHeroImg} />
              <View style={styles.storeCardBody}>
                <Text style={styles.storeCardTitle}>{profile.name}</Text>
                <Text style={styles.storeCardType}>
                  {profile.typeLabel} · {profile.neighborhood}
                </Text>
                <Text style={styles.storeCardDesc}>{profile.description}</Text>

                <View style={styles.storeInfoDivider} />

                <View style={styles.storeMetaRow}>
                  <Ionicons name="location-outline" size={16} color="#D42F13" />
                  <Text style={styles.storeMetaText}>{profile.address}</Text>
                </View>

                <View style={styles.storeMetaRow}>
                  <Ionicons name="time-outline" size={16} color="#2E7D32" />
                  <Text style={styles.storeMetaText}>{profile.openingHours}</Text>
                </View>

                <View style={styles.storeMetaRow}>
                  <Ionicons name="call-outline" size={16} color="#1976D2" />
                  <Text style={styles.storeMetaText}>{profile.contactNumber}</Text>
                </View>
              </View>
            </View>

            {/* Switch Active Establishment */}
            <Text style={styles.sectionHeader}>SWITCH MANAGED RESTAURANT / STALL</Text>
            <View style={styles.insetCard}>
              {ESTABLISHMENTS.map((est, idx) => {
                const isSelected = est.id === profile.id;
                const isLast = idx === ESTABLISHMENTS.length - 1;
                return (
                  <Pressable
                    key={est.id}
                    onPress={() => switchEstablishment(est.id)}
                    style={[styles.switchEstRow, isLast && styles.switchEstRowLast]}
                  >
                    <Image source={{ uri: est.heroImage }} style={styles.switchEstThumb} />
                    <View style={styles.switchEstMeta}>
                      <Text
                        style={[
                          styles.switchEstName,
                          isSelected && styles.switchEstNameActive,
                        ]}
                      >
                        {est.name}
                      </Text>
                      <Text style={styles.switchEstSub}>{est.typeLabel} · {est.neighborhood}</Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color="#D42F13" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

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
              <Text style={styles.groupHeader}>BUSINESS DETAILS</Text>
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

                <View style={[styles.modalInputRow, styles.inputRowLast]}>
                  <Text style={styles.modalLabel}>Operating Hours</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    value={editHours}
                    onChangeText={setEditHours}
                  />
                </View>
              </View>

              <Text style={styles.groupHeader}>STORY &amp; DESCRIPTION</Text>
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
  storeMetaCol: {
    flex: 1,
    paddingRight: 10,
  },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  verifiedPartnerBadge: {
    paddingTop: 1,
  },
  storeTypeSubhead: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
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
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  navBarWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  navBarScroll: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
  },
  tabItemActive: {
    backgroundColor: '#1C1C1E',
  },
  tabItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.8)',
  },
  tabItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#D42F13',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabContainer: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.08,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  shortcutBtn: {
    alignItems: 'center',
    width: '23%',
  },
  shortcutIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D42F13',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  livePromoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.3)',
    marginBottom: 10,
  },
  livePromoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  livePromoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  livePromoBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  livePromoDistrict: {
    fontSize: 11,
    fontWeight: '500',
    color: '#D42F13',
  },
  livePromoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  livePromoDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.7)',
    marginBottom: 12,
  },
  livePromoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingVertical: 8,
  },
  promoStatItem: {
    alignItems: 'center',
  },
  promoStatNum: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  promoStatLbl: {
    fontSize: 10,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  insetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  rushHoursRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 100,
    marginBottom: 12,
  },
  rushHourCol: {
    alignItems: 'center',
    width: 36,
  },
  rushBarContainer: {
    width: 14,
    height: 75,
    backgroundColor: '#F2F2F7',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  rushBarFill: {
    width: '100%',
    borderRadius: 7,
  },
  rushHourLabel: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  rushHourHint: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
  },
  pendingAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
  },
  pendingAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pendingAlertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  pendingAlertSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  tabActionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tabMainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  tabMainSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2,
    maxWidth: 240,
  },
  addBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D42F13',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  productsInsetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  productRowLast: {
    borderBottomWidth: 0,
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  productInfoCol: {
    flex: 1,
    paddingRight: 10,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  productNameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  signatureBadge: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  signatureBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productBikolText: {
    fontSize: 12,
    color: '#D42F13',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  productMetaText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 4,
  },
  productPriceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  productControlsCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  stockStatusLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockGreen: {
    color: '#2E7D32',
  },
  stockRed: {
    color: '#C62828',
  },
  trashIconBtn: {
    padding: 4,
    marginTop: 4,
  },
  orderFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  orderFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  orderFilterPillActive: {
    backgroundColor: '#1C1C1E',
  },
  orderFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.8)',
  },
  orderFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyOrdersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  emptyOrdersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  emptyOrdersSub: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    maxWidth: 260,
  },
  reachHeroCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(212, 47, 19, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.18)',
  },
  reachHeroIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reachHeroTextCol: {
    flex: 1,
  },
  reachHeroHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  reachHeroDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(60, 60, 67, 0.8)',
  },
  editStoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.2)',
  },
  editStoreBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  storeProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  storeHeroImg: {
    width: '100%',
    height: 140,
    backgroundColor: '#F2F2F7',
  },
  storeCardBody: {
    padding: 16,
  },
  storeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  storeCardType: {
    fontSize: 13,
    color: '#D42F13',
    fontWeight: '500',
    marginBottom: 8,
  },
  storeCardDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.7)',
    marginBottom: 12,
  },
  storeInfoDivider: {
    height: 0.5,
    backgroundColor: 'rgba(60, 60, 67, 0.15)',
    marginBottom: 12,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  storeMetaText: {
    fontSize: 13,
    color: '#000000',
    flex: 1,
  },
  switchEstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  switchEstRowLast: {
    borderBottomWidth: 0,
  },
  switchEstThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    marginRight: 12,
  },
  switchEstMeta: {
    flex: 1,
  },
  switchEstName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  switchEstNameActive: {
    color: '#D42F13',
  },
  switchEstSub: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  bottomSpacer: {
    height: 60,
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
        maxWidth: 600,
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
    fontSize: 17,
    color: '#8E8E93',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  modalSaveText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#D42F13',
  },
  modalBody: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },
  groupHeader: {
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
  inputRowLast: {
    borderBottomWidth: 0,
  },
  modalLabel: {
    fontSize: 16,
    color: '#000000',
    width: 130,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    textAlign: 'right',
    padding: 0,
  },
  modalTextAreaRow: {
    padding: 16,
  },
  modalTextArea: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 20,
    minHeight: 80,
    padding: 0,
  },
});
