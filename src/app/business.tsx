import React, { useState, useEffect } from 'react';
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
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useBusiness, BusinessProduct } from '@/context/BusinessContext';
import { useBasket } from '@/context/BasketContext';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { AddProductModal } from '@/components/business/AddProductModal';
import { CreatePromotionModal } from '@/components/business/CreatePromotionModal';
import { CreateBusinessPostModal } from '@/components/business/CreateBusinessPostModal';
import { BusinessPostCard } from '@/components/business/BusinessPostCard';
import { CommentsBottomSheet } from '@/components/feed/CommentsBottomSheet';
import { BusinessOrderCard } from '@/components/business/BusinessOrderCard';
import { PromotionCard } from '@/components/business/PromotionCard';
import { BusinessNavBar, BusinessTab } from '@/components/business/BusinessNavBar';
import { EditPhotoModal } from '@/components/business/EditPhotoModal';
import { StoreWalletCard } from '@/components/business/StoreWalletCard';
import { CashOutModal } from '@/components/business/CashOutModal';
import { StoreGallerySection } from '@/components/business/StoreGallerySection';
import { StoreSubscriptionBanner } from '@/components/business/StoreSubscriptionBanner';
import { StoreSubscriptionModal } from '@/components/business/StoreSubscriptionModal';
import { MerchantPaywallGate } from '@/components/business/MerchantPaywallGate';
import { ESTABLISHMENTS } from '@/data/mockData';
import { SocialPost } from '@/data/socialFeedData';
import { IOSTokens } from '@/constants/theme';

export default function BusinessDashboardScreen() {
  const {
    profile,
    products,
    promotions,
    analytics,
    updateProfile,
    updateProfilePhoto,
    cashOutWallet,
    subscribeStore,
    cancelSubscription,
    addGalleryPhoto,
    deleteGalleryPhoto,
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
  const { posts, deletePost } = useSocialFeed();
  const params = useLocalSearchParams<{ tab?: string }>();

  // Mobile Bottom Navigation Tab: orders | menu | posts | promote | store
  // Defaults to 'store' (Store Profile) when opening the portal from settings/profile
  const resolveInitialTab = (): BusinessTab => {
    if (params.tab && ['orders', 'menu', 'posts', 'promote', 'store'].includes(params.tab)) {
      return params.tab as BusinessTab;
    }
    return 'store';
  };

  const [activeTab, setActiveTab] = useState<BusinessTab>(resolveInitialTab);

  useEffect(() => {
    if (params.tab && ['orders', 'menu', 'posts', 'promote', 'store'].includes(params.tab)) {
      setActiveTab(params.tab as BusinessTab);
    }
  }, [params.tab]);

  const [orderFilter, setOrderFilter] = useState<'received' | 'preparing' | 'ready' | 'completed'>('received');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BusinessProduct | null>(null);
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<SocialPost | null>(null);

  // Store photo editing & cashout modals
  const [isEditPhotoOpen, setIsEditPhotoOpen] = useState(false);
  const [editPhotoType, setEditPhotoType] = useState<'banner' | 'logo'>('banner');
  const [isCashOutOpen, setIsCashOutOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

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

  const displayedOrders = storeOrders.filter((order) => order.status === orderFilter);

  // Filter posts for this establishment (only view their own posts)
  const businessPosts = posts.filter((post) => {
    const matchesEstId =
      post.establishmentId === profile.id ||
      (post.establishmentId === 'chacha-kinalas' && profile.id === 'cha-chas-kinalas') ||
      (post.establishmentId === 'cha-chas-kinalas' && profile.id === 'chacha-kinalas');
    const matchesAuthorId =
      post.author.id === profile.id ||
      post.author.id === `biz_${profile.id.replace(/[^a-z0-9]/gi, '')}`;
    const matchesName =
      post.author.isBusiness &&
      post.author.name.toLowerCase().includes(profile.name.toLowerCase().split(' ')[0]);
    const matchesCreated = Boolean(
      post.establishmentName &&
        post.establishmentName.toLowerCase().includes(profile.name.toLowerCase().split(' ')[0])
    );
    return matchesEstId || matchesAuthorId || matchesName || matchesCreated;
  });

  const totalPostLikes = businessPosts.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const storeFollowersCount = profile.followersCount || 1420;
  const formattedFollowers =
    storeFollowersCount >= 1000
      ? `${(storeFollowersCount / 1000).toFixed(1)}k`
      : `${storeFollowersCount}`;

  const newOrdersCount = storeOrders.filter((o) => o.status === 'received').length;
  const inKitchenCount = storeOrders.filter((o) => o.status === 'preparing').length;
  const readyCount = storeOrders.filter((o) => o.status === 'ready').length;
  const completedCount = storeOrders.filter((o) => o.status === 'completed').length;

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
      case 'posts':
        return 'Store Posts';
      case 'promote':
        return 'Promote & Reach';
      case 'store':
        return 'Store Profile';
      default:
        return profile.name;
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
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
            {profile.subscription?.status !== 'active' ? (
              <MerchantPaywallGate
                icon="receipt-outline"
                title="Accept Real-Time Kitchen Orders"
                subtitle={`Unlock live customer pre-orders, kitchen queue management, and order preparation tickets for ${profile.name}.`}
                features={[
                  'Live incoming customer pre-order tickets',
                  'One-tap kitchen prep and ready status dispatch',
                  'Instant sales settlement directly into your store wallet',
                ]}
                ctaText="Unlock Kitchen Orders (₱499/mo)"
                onUpgradePress={() => setIsSubscriptionModalOpen(true)}
              />
            ) : (
              <>
                {/* Filter Segmented Control */}
                <View style={styles.filterSegmentContainer}>
                  {[
                    { id: 'received' as const, label: `New (${newOrdersCount})` },
                    { id: 'preparing' as const, label: `Kitchen (${inKitchenCount})` },
                    { id: 'ready' as const, label: `Ready (${readyCount})` },
                    { id: 'completed' as const, label: `Done (${completedCount})` },
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
              </>
            )}
          </View>
        )}

        {/* ================= TAB 2: MENU & PRODUCTS ================= */}
        {activeTab === 'menu' && (
          <View style={styles.tabContainer}>
            {/* Top Action Row */}
            <View style={styles.menuHeaderRow}>
              <View style={styles.headerTitlesCol}>
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
                accessibilityRole="button"
                accessibilityLabel="Add new dish to store menu"
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
                    {/* Entire Food Tab/Card is Pressable to open Edit Modal */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.productMainPressable,
                        pressed && styles.productPressed,
                      ]}
                      onPress={() => handleEditProductPress(prod)}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit dish details for ${prod.name}`}
                      accessibilityHint="Opens edit dish modal"
                    >
                      <Image source={{ uri: prod.image }} style={styles.productThumb} />

                      <View style={styles.productDetailsCol}>
                        <View style={styles.productTitleLine}>
                          <Text style={styles.productName} numberOfLines={1}>
                            {prod.name}
                          </Text>
                        </View>

                        <View style={styles.productSubRow}>
                          {prod.isSignature && (
                            <View style={styles.signatureBadge}>
                              <Ionicons name="sparkles" size={8} color="#FFFFFF" style={styles.signatureIcon} />
                              <Text style={styles.signatureBadgeText}>SIGNATURE</Text>
                            </View>
                          )}
                          {prod.bikolName ? (
                            <Text style={styles.productBikol} numberOfLines={1}>
                              {prod.bikolName}
                            </Text>
                          ) : null}
                        </View>

                        <Text style={styles.productMeta} numberOfLines={1}>
                          {prod.categoryLabel} · {prod.prepTime}
                        </Text>

                        <Text style={styles.productPrice}>₱{prod.price}</Text>
                      </View>
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
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${prod.name}`}
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

        {/* ================= TAB: SOCIAL POSTS ================= */}
        {activeTab === 'posts' && (
          <View style={styles.tabContainer}>
            {/* Top Action Row */}
            <View style={styles.menuHeaderRow}>
              <View style={styles.headerTitlesCol}>
                <Text style={styles.sectionHeading}>Store Posts</Text>
                <Text style={styles.sectionSubheading} numberOfLines={2}>
                  {businessPosts.length} broadcast{businessPosts.length === 1 ? '' : 's'} on Naga community feed
                </Text>
              </View>

              <Pressable
                onPress={() => setIsCreatePostOpen(true)}
                style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.pressed]}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Create new store post"
              >
                <Ionicons name="camera" size={15} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>New Post</Text>
              </Pressable>
            </View>

            {/* Merchant Social Profile Header Card */}
            <View style={styles.bizSocialHeaderCard}>
              <View style={styles.bizSocialProfileRow}>
                <Image source={{ uri: profile.heroImage }} style={styles.bizSocialAvatar} />
                <View style={styles.bizSocialMeta}>
                  <View style={styles.bizSocialNameRow}>
                    <Text style={styles.bizSocialName} numberOfLines={1}>
                      {profile.name}
                    </Text>
                    <Ionicons name="checkmark-circle" size={16} color="#34C759" style={{ marginLeft: 4 }} />
                  </View>
                  <Text style={styles.bizSocialHandle}>
                    @{profile.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                  </Text>
                </View>
              </View>

              {/* 3-Col Social Metrics Strip: Followers -> Foodie Likes -> Posts */}
              <View style={styles.bizSocialStatsRow}>
                <View style={styles.bizSocialStatItem}>
                  <Text style={styles.bizSocialStatNum}>{formattedFollowers}</Text>
                  <Text style={styles.bizSocialStatLabel}>Followers</Text>
                </View>
                <View style={styles.bizSocialStatDivider} />
                <View style={styles.bizSocialStatItem}>
                  <Text style={styles.bizSocialStatNum}>{totalPostLikes}</Text>
                  <Text style={styles.bizSocialStatLabel}>Foodie Likes</Text>
                </View>
                <View style={styles.bizSocialStatDivider} />
                <View style={styles.bizSocialStatItem}>
                  <Text style={styles.bizSocialStatNum}>{businessPosts.length}</Text>
                  <Text style={styles.bizSocialStatLabel}>Posts</Text>
                </View>
              </View>
            </View>

            {/* Posts Feed / List */}
            {businessPosts.length === 0 ? (
              <View style={styles.emptyPostsCard}>
                <View style={styles.emptyPostsIconCircle}>
                  <Ionicons name="images-outline" size={32} color="#D42F13" />
                </View>
                <Text style={styles.emptyPostsTitle}>No store posts yet</Text>
                <Text style={styles.emptyPostsSubtitle}>
                  Broadcast your daily specials, kitchen steaming pots, and secret seasonings directly to thousands of foodies across Naga City.
                </Text>
                <Pressable
                  onPress={() => setIsCreatePostOpen(true)}
                  style={({ pressed }) => [styles.createFirstPostBtn, pressed && styles.pressed]}
                >
                  <Ionicons name="add-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.createFirstPostBtnText}>Create Your First Post</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.businessPostsList}>
                {businessPosts.map((post) => (
                  <BusinessPostCard
                    key={post.id}
                    post={post}
                    onOpenComments={(p) => setSelectedPostForComments(p)}
                    onDeletePost={deletePost}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ================= TAB 3: PROMOTE & ADVERTISE ================= */}
        {activeTab === 'promote' && (
          <View style={styles.tabContainer}>
            {profile.subscription?.status !== 'active' ? (
              <MerchantPaywallGate
                icon="megaphone-outline"
                title="Promote Your Deals in Naga City"
                subtitle={`Broadcast sponsored promotions to the top of Discover feeds, attract nearby foodies, and boost ${profile.name}'s visibility with Pro placement.`}
                features={[
                  'Top-of-feed spotlight banners on Discover and Categories',
                  '3x algorithm boost in local foodie search and recommendations',
                  'Live promotion performance, counter redemptions, and view reach',
                ]}
                ctaText="Unlock Promotions (₱499/mo)"
                onUpgradePress={() => setIsSubscriptionModalOpen(true)}
              />
            ) : (
              <>
                {/* Header & Launch Button */}
                <View style={styles.menuHeaderRow}>
                  <View style={styles.headerTitlesCol}>
                    <Text style={styles.sectionHeading}>Promote in Naga</Text>
                    <Text style={styles.sectionSubheading} numberOfLines={2} ellipsizeMode="tail">
                      Broadcast deals to foodies across Naga City
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setIsCreatePromoOpen(true)}
                    style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.pressed]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Launch promotion"
                  >
                    <Ionicons name="megaphone" size={15} color="#FFFFFF" />
                    <Text style={styles.primaryActionBtnText}>Launch Promo</Text>
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
                {promotions.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <View style={styles.emptyIconBg}>
                      <Ionicons name="megaphone-outline" size={30} color="#8E8E93" />
                    </View>
                    <Text style={styles.emptyTitle}>No Active Campaigns</Text>
                    <Text style={styles.emptySub}>
                      Create your first promotional offer to attract hungry foodies across Naga City.
                    </Text>
                    <Pressable
                      onPress={() => setIsCreatePromoOpen(true)}
                      style={({ pressed }) => [
                        styles.primaryActionBtn,
                        { marginTop: 16 },
                        pressed && styles.pressed,
                      ]}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Launch promotion"
                    >
                      <Ionicons name="megaphone" size={15} color="#FFFFFF" />
                      <Text style={styles.primaryActionBtnText}>Launch Promo</Text>
                    </Pressable>
                  </View>
                ) : (
                  promotions.map((campaign) => (
                    <PromotionCard
                      key={campaign.id}
                      campaign={campaign}
                      onToggleActive={togglePromotionActive}
                      onDelete={deletePromotion}
                    />
                  ))
                )}
              </>
            )}
          </View>
        )}

        {/* ================= TAB 5: STORE PROFILE & WALLET ================= */}
        {activeTab === 'store' && (
          <View style={styles.tabContainer}>
            {/* Facebook-Style Profile Banner & Avatar Card */}
            <View style={styles.fbProfileCard}>
              {/* Cover Banner (16:9) */}
              <View style={styles.fbCoverWrapper}>
                <Image source={{ uri: profile.heroImage }} style={styles.fbCoverImage} />
                <View style={styles.fbCoverScrim} />

                {/* Edit Cover Photo Button (Camera / Pen) */}
                <Pressable
                  onPress={() => {
                    setEditPhotoType('banner');
                    setIsEditPhotoOpen(true);
                  }}
                  style={({ pressed }) => [styles.fbEditCoverBtn, pressed && styles.pressed]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Edit cover banner"
                >
                  <Ionicons name="camera" size={13} color="#FFFFFF" />
                  <Text style={styles.fbEditCoverBtnText}>Edit Cover</Text>
                </Pressable>
              </View>

              {/* Overlapping Profile Logo (Avatar) */}
              <View style={styles.fbAvatarRow}>
                <View style={styles.fbAvatarWrapper}>
                  <Image source={{ uri: profile.logoImage }} style={styles.fbAvatarImage} />
                  {/* Edit Logo Pen Button */}
                  <Pressable
                    onPress={() => {
                      setEditPhotoType('logo');
                      setIsEditPhotoOpen(true);
                    }}
                    style={({ pressed }) => [styles.fbEditLogoBtn, pressed && styles.pressed]}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel="Edit store profile logo"
                  >
                    <Ionicons name="pencil" size={13} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>

              {/* Brand Meta & Info */}
              <View style={styles.fbMetaContainer}>
                <View style={styles.fbNameLine}>
                  <Text style={styles.fbStoreName} numberOfLines={1}>
                    {profile.name}
                  </Text>
                  {profile.subscription?.status === 'active' ? (
                    <View style={styles.fbVerifiedBadge}>
                      <Ionicons name="checkmark-circle" size={18} color="#007DFE" />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setIsSubscriptionModalOpen(true)}
                      style={({ pressed }) => [styles.fbUnverifiedBadge, pressed && styles.pressed]}
                      hitSlop={6}
                      accessibilityRole="button"
                      accessibilityLabel="Store unverified. Tap to subscribe."
                    >
                      <Ionicons name="shield-outline" size={12} color="#8E8E93" />
                      <Text style={styles.fbUnverifiedText}>Unverified</Text>
                    </Pressable>
                  )}
                </View>

                <Text style={styles.fbTagline} numberOfLines={2}>
                  {profile.tagline || `${profile.typeLabel} in ${profile.neighborhood}`}
                </Text>

                <Text style={styles.fbSubtype}>
                  {profile.typeLabel} · {profile.neighborhood}
                </Text>

                {/* Rating & Social Metrics Strip */}
                <View style={styles.fbMetricsRow}>
                  <View style={styles.fbRatingBadge}>
                    <Ionicons name="star" size={12} color="#FF9500" />
                    <Text style={styles.fbRatingNum}>{profile.rating.toFixed(1)}</Text>
                    <Text style={styles.fbReviewsCount}>({profile.reviewCount} reviews)</Text>
                  </View>

                  <Text style={styles.fbDotSeparator}>·</Text>

                  <View style={styles.fbFollowersBadge}>
                    <Ionicons name="people" size={13} color="rgba(60, 60, 67, 0.7)" />
                    <Text style={styles.fbFollowersText}>
                      <Text style={{ fontWeight: '700', color: '#000000' }}>{formattedFollowers}</Text> Foodies
                    </Text>
                  </View>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.fbActionButtonsRow}>
                  <Pressable
                    onPress={handleOpenEditProfile}
                    style={({ pressed }) => [styles.fbEditDetailsBtn, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Edit store profile details"
                  >
                    <Ionicons name="pencil" size={14} color="#000000" />
                    <Text style={styles.fbEditDetailsText}>Edit Details</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push(`/establishment/${profile.id}` as any)}
                    style={({ pressed }) => [styles.fbViewPublicBtn, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="View public store page as customer"
                  >
                    <Ionicons name="eye-outline" size={15} color="#000000" />
                    <Text style={styles.fbViewPublicText}>View Public Page</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Naga Merchant Pro Subscription Banner */}
            <StoreSubscriptionBanner
              subscription={profile.subscription}
              onUpgradePress={() => setIsSubscriptionModalOpen(true)}
            />

            {/* Store Earnings Wallet & Cashout Section */}
            <StoreWalletCard
              wallet={profile.wallet}
              isSubscribed={profile.subscription?.status === 'active'}
              onOpenCashOut={() => setIsCashOutOpen(true)}
              onRequireSubscription={() => setIsSubscriptionModalOpen(true)}
            />

            {/* Today's Overview Metrics */}
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

            {/* Store Information Details & Operations Inset */}
            <Text style={styles.sectionDividerLabel}>STORE DETAILS &amp; OPERATIONS</Text>
            <View style={styles.insetGroup}>
              {/* Operating Hours with Live Toggle */}
              <View style={styles.storeDetailRow}>
                <View style={styles.storeDetailLeft}>
                  <View style={[styles.detailIconCircle, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="time" size={15} color="#2E7D32" />
                  </View>
                  <View>
                    <Text style={styles.storeDetailLabel}>Operating Schedule</Text>
                    <Text style={styles.storeDetailSub}>{profile.openingHours}</Text>
                  </View>
                </View>
                <View style={styles.detailRightCol}>
                  <Switch
                    value={profile.isOpenNow}
                    onValueChange={toggleOpenStatus}
                    trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#34C759' }}
                    thumbColor="#FFFFFF"
                  />
                  <Text
                    style={[
                      styles.switchStatusText,
                      profile.isOpenNow ? styles.openTextGreen : styles.openTextRed,
                    ]}
                  >
                    {profile.isOpenNow ? 'Open Now' : 'Closed'}
                  </Text>
                </View>
              </View>

              {/* Location & District with Map Shortcut */}
              <View style={styles.storeDetailRow}>
                <View style={styles.storeDetailLeft}>
                  <View style={[styles.detailIconCircle, { backgroundColor: '#FFEBEE' }]}>
                    <Ionicons name="location" size={15} color="#D42F13" />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.storeDetailLabel}>Address &amp; District</Text>
                    <Text style={styles.storeDetailSub} numberOfLines={2}>
                      {profile.address}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/map',
                      params: { selectedPlaceId: profile.id },
                    })
                  }
                  style={styles.detailActionBtn}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Locate store on interactive map"
                >
                  <Ionicons name="map-outline" size={13} color={IOSTokens.colors.tint} />
                  <Text style={styles.detailActionBtnText}>Map</Text>
                </Pressable>
              </View>

              {/* Contact Hotline */}
              <View style={styles.storeDetailRow}>
                <View style={styles.storeDetailLeft}>
                  <View style={[styles.detailIconCircle, { backgroundColor: '#EBF4FF' }]}>
                    <Ionicons name="call" size={15} color="#007DFE" />
                  </View>
                  <View>
                    <Text style={styles.storeDetailLabel}>Order Hotline &amp; Phone</Text>
                    <Text style={styles.storeDetailSub}>{profile.contactNumber}</Text>
                  </View>
                </View>
              </View>

              {/* About & Culinary Heritage Story */}
              <View style={[styles.storeDetailRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <View style={[styles.storeDetailLeft, { marginBottom: 6 }]}>
                  <View style={[styles.detailIconCircle, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="book" size={15} color="#FF9500" />
                  </View>
                  <Text style={styles.storeDetailLabel}>About &amp; Culinary Heritage</Text>
                </View>
                <Text style={styles.storeStoryText}>{profile.description}</Text>
              </View>

              {/* Features & Amenities Badges */}
              <View style={[styles.storeDetailRow, styles.rowLast, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={[styles.storeDetailLabel, { marginBottom: 8 }]}>Store Features &amp; Amenities</Text>
                <View style={styles.vibeChipsContainer}>
                  {profile.atmosphereTags.map((tag, idx) => (
                    <View key={idx} style={styles.vibeTagChip}>
                      <Text style={styles.vibeTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Business Photo Gallery Section (Replaces Old Switcher) */}
            <StoreGallerySection
              gallery={profile.gallery}
              storeName={profile.name}
              onAddPhoto={addGalleryPhoto}
              onDeletePhoto={deleteGalleryPhoto}
            />
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

      <CreateBusinessPostModal
        visible={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <CommentsBottomSheet
        post={selectedPostForComments}
        visible={!!selectedPostForComments}
        onClose={() => setSelectedPostForComments(null)}
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

              <Pressable
                onPress={handleSaveStoreProfile}
                style={({ pressed }) => [styles.modalBottomSaveBtn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Save Store Profile Details"
              >
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.modalBottomSaveBtnText}>Save Profile Changes</Text>
              </Pressable>
              <View style={{ height: 28 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Photo Modal (Cover or Logo) */}
      <EditPhotoModal
        visible={isEditPhotoOpen}
        type={editPhotoType}
        currentUrl={editPhotoType === 'banner' ? profile.heroImage : profile.logoImage}
        storeName={profile.name}
        onClose={() => setIsEditPhotoOpen(false)}
        onSave={(url) => updateProfilePhoto(editPhotoType, url)}
      />

      {/* Cash Out Modal */}
      <CashOutModal
        visible={isCashOutOpen}
        availableBalance={profile.wallet.balance}
        onClose={() => setIsCashOutOpen(false)}
        onConfirmCashOut={(amount, method, account, accountName) =>
          cashOutWallet(amount, method, account, accountName)
        }
      />

      {/* Naga Merchant Pro Subscription Modal */}
      <StoreSubscriptionModal
        visible={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSuccess={(plan, method) => subscribeStore(plan, method)}
        storeName={profile.name}
        currentPlan={profile.subscription?.plan}
      />
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
    width: '100%',
  },
  scrollContent: {
    width: '100%',
    padding: 16,
    paddingBottom: 130, // Generous padding ensures content is never covered by floating bottom navbar
  },
  tabContainer: {
    width: '100%',
    maxWidth: '100%',
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
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  headerTitlesCol: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    paddingRight: 6,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  sectionSubheading: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2,
    lineHeight: 16,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexShrink: 0,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(212, 47, 19, 0.25)',
      } as any,
      default: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  primaryActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
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
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  productMainPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 6,
  },
  productPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
    justifyContent: 'center',
  },
  productTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    flexShrink: 1,
  },
  productSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 3,
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  signatureIcon: {
    marginRight: 3,
  },
  signatureBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  productBikol: {
    fontSize: 12,
    color: IOSTokens.colors.tint,
    fontStyle: 'italic',
  },
  productMeta: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  productActionsCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
    minWidth: 64,
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 4,
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
  // Facebook-Style Profile Banner & Avatar
  fbProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  fbCoverWrapper: {
    width: '100%',
    height: 148,
    backgroundColor: '#E5E5EA',
    position: 'relative',
  },
  fbCoverImage: {
    width: '100%',
    height: '100%',
  },
  fbCoverScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  fbEditCoverBtn: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  fbEditCoverBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fbAvatarRow: {
    paddingHorizontal: 16,
    marginTop: -44,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  fbAvatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F2F2F7',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  fbAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
  },
  fbEditLogoBtn: {
    position: 'absolute',
    right: -2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007DFE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbMetaContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  fbNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  fbStoreName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  fbVerifiedBadge: {
    paddingTop: 1,
  },
  fbUnverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#D1D1D6',
  },
  fbUnverifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  fbTagline: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.85)',
    lineHeight: 18,
    marginBottom: 4,
  },
  fbSubtype: {
    fontSize: 12,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
    marginBottom: 8,
  },
  fbMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  fbRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#FFE082',
  },
  fbRatingNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B25E00',
  },
  fbReviewsCount: {
    fontSize: 11,
    color: '#8E8E93',
  },
  fbDotSeparator: {
    fontSize: 14,
    color: '#C7C7CC',
  },
  fbFollowersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  fbFollowersText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.7)',
  },
  fbActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  fbEditDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    borderRadius: 12,
  },
  fbEditDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  fbViewPublicBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    borderRadius: 12,
  },
  fbViewPublicText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },

  // Today Overview Metrics Grid
  storeStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
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
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  storeDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  storeDetailSub: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.7)',
    marginTop: 2,
  },
  detailRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  switchStatusText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  detailActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  storeStoryText: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(60, 60, 67, 0.8)',
    marginTop: 4,
  },
  vibeChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
  },
  vibeTagChip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  vibeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3C3C43',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheet: {
    width: '100%',
    height: '88%',
    maxHeight: '92%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    maxWidth: 600,
    elevation: 20,
    zIndex: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
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
    paddingBottom: 60,
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
  modalBottomSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(212, 47, 19, 0.25)',
      } as any,
      default: {
        elevation: 3,
      },
    }),
  },
  modalBottomSaveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bizSocialHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  bizSocialProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bizSocialAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E5E5EA',
  },
  bizSocialMeta: {
    flex: 1,
    marginLeft: 12,
  },
  bizSocialNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bizSocialName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  bizSocialHandle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  bizSocialStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EFEFF4',
  },
  bizSocialStatItem: {
    alignItems: 'center',
  },
  bizSocialStatNum: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  bizSocialStatLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  bizSocialStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EFEFF4',
  },
  emptyPostsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginTop: 6,
  },
  emptyPostsIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyPostsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  emptyPostsSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 14,
  },
  createFirstPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D42F13',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  createFirstPostBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  businessPostsList: {
    width: '100%',
  },
});
