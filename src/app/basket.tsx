import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  Platform,
  Alert,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
import { useBasket, PreOrder, BasketItem } from '@/context/BasketContext';
import { IOSTokens } from '@/constants/theme';
import QRCode from 'react-native-qrcode-svg';

const PICKUP_TIME_SLOTS = [
  'ASAP (15–20 mins)',
  'In 30 mins',
  'In 45 mins',
  'In 1 hour',
];

export default function BasketScreen() {
  const {
    items,
    activePreOrders,
    diningOption,
    setDiningOption,
    pickupTimeSlot,
    setPickupTimeSlot,
    specialInstructions,
    setSpecialInstructions,
    updateQuantity,
    updateItemNote,
    removeFromBasket,
    clearBasket,
    placePreOrder,
    advanceOrderStatusDemo,
    cancelOrder,
    getBasketCount,
    getBasketSubtotal,
    activeTabSection,
    setActiveTabSection,
  } = useBasket();

  // Active tab state: 'cart' | 'passes'
  const activeTab = activeTabSection === 'current' ? 'cart' : 'passes';
  const setActiveTab = (tab: 'cart' | 'passes') => {
    setActiveTabSection(tab === 'cart' ? 'current' : 'history');
  };

  // Modals
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PreOrder | null>(null);
  const [enlargedQrPass, setEnlargedQrPass] = useState<PreOrder | null>(null);

  // Note Edit Modal state
  const [editingItem, setEditingItem] = useState<BasketItem | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const subtotal = getBasketSubtotal();
  const fee = 0; // Free reservation
  const total = subtotal + fee;
  const basketCount = getBasketCount();

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    const newOrder = placePreOrder();
    if (newOrder) {
      setConfirmedOrder(newOrder);
      setConfirmModalVisible(true);
    }
  };

  const handleClearBasketPrompt = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Clear all items from your basket?')) {
        clearBasket();
      }
    } else {
      Alert.alert(
        'Clear Basket',
        'Are you sure you want to remove all items from your basket?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: clearBasket },
        ]
      );
    }
  };

  const handleOpenNoteModal = (item: BasketItem) => {
    setEditingItem(item);
    setNoteInput(item.selectedNote || '');
  };

  const handleSaveNote = () => {
    if (editingItem) {
      updateItemNote(editingItem.id, noteInput.trim());
      setEditingItem(null);
    }
  };

  const handleCallEstablishment = (phone = '+63548813000') => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Unable to Call', `Please dial ${phone} directly.`);
    });
  };

  const handleCancelOrderPrompt = (orderId: string) => {
    const doCancel = () => {
      cancelOrder(orderId);
      Alert.alert('Order Cancelled', 'Your pre-order pass has been cancelled.');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Cancel this active pre-order pass?')) {
        doCancel();
      }
    } else {
      Alert.alert(
        'Cancel Order Pass',
        'Are you sure you want to cancel this pre-order? The kitchen will be notified.',
        [
          { text: 'Keep Pass', style: 'cancel' },
          { text: 'Yes, Cancel', style: 'destructive', onPress: doCancel },
        ]
      );
    }
  };

  // Group items by establishment
  const establishmentId = items[0]?.establishmentId;
  const establishmentName = items[0]?.establishmentName;
  const establishmentAddress = items[0]?.establishmentAddress;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Header Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.headingSans}>
                Food <Text style={styles.headingSerif}>basket</Text>
              </Text>
              {activeTab === 'cart' && items.length > 0 && (
                <Pressable
                  onPress={handleClearBasketPrompt}
                  style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={14} color="#8E8E93" />
                  <Text style={styles.clearBtnText}>Clear</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.subheadText}>
              Pre-order meals, skip carinderia lines, and track live dining passes.
            </Text>
          </View>

          {/* Segmented Switcher */}
          <View style={styles.segmentWrapper}>
            <View style={styles.segmentContainer}>
              <Pressable
                onPress={() => setActiveTab('cart')}
                style={[
                  styles.segmentTab,
                  activeTab === 'cart' && styles.segmentTabActive,
                ]}
              >
                <View style={styles.tabLabelRow}>
                  <Ionicons
                    name="cart"
                    size={16}
                    color={activeTab === 'cart' ? '#1C1C1E' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.segmentLabel,
                      activeTab === 'cart' && styles.segmentLabelActive,
                    ]}
                  >
                    Cart ({basketCount})
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab('passes')}
                style={[
                  styles.segmentTab,
                  activeTab === 'passes' && styles.segmentTabActive,
                ]}
              >
                <View style={styles.tabLabelRow}>
                  <Ionicons
                    name="ticket"
                    size={16}
                    color={activeTab === 'passes' ? '#1C1C1E' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.segmentLabel,
                      activeTab === 'passes' && styles.segmentLabelActive,
                    ]}
                  >
                    Passes ({activePreOrders.length})
                  </Text>
                  {activePreOrders.length > 0 && (
                    <View style={styles.liveOrderDot} />
                  )}
                </View>
              </Pressable>
            </View>
          </View>

          {/* ======================================================== */}
          {/* TAB 1: CART & PRE-ORDER CHECKOUT                         */}
          {/* ======================================================== */}
          {activeTab === 'cart' && (
            <View style={styles.tabContent}>
              {items.length === 0 ? (
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="bag-handle-outline" size={38} color="#D42F13" />
                  </View>
                  <Text style={styles.emptyTitle}>Your Basket is Empty</Text>
                  <Text style={styles.emptyDesc}>
                    Craving authentic Naga dishes? Explore local carinderias and bakeries, pick your favorites, and reserve an expedition pass.
                  </Text>
                  <View style={styles.emptyActionsRow}>
                    <Pressable
                      onPress={() => router.push('/search')}
                      style={({ pressed }) => [styles.emptyPrimaryBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="search" size={16} color="#FFFFFF" />
                      <Text style={styles.emptyPrimaryText} numberOfLines={1}>Search Dishes</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => router.push('/map')}
                      style={({ pressed }) => [styles.emptySecondaryBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="map-outline" size={16} color="#111111" />
                      <Text style={styles.emptySecondaryText} numberOfLines={1}>View Map</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.cartContent}>
                  {/* Establishment Header */}
                  <View style={styles.establishmentHeaderCard}>
                    <View style={styles.estIconBox}>
                      <Ionicons name="storefront" size={20} color="#D42F13" />
                    </View>
                    <View style={styles.estInfoBlock}>
                      <View style={styles.estBadgeRow}>
                        <Text style={styles.estBadgeText}>PARTNER CARINDERIA</Text>
                        <Ionicons name="checkmark-circle" size={13} color="#34C759" />
                      </View>
                      <Text style={styles.estNameText} numberOfLines={1}>
                        {establishmentName}
                      </Text>
                      <Text style={styles.estAddressText} numberOfLines={1}>
                        {establishmentAddress}
                      </Text>
                    </View>
                    {establishmentId && (
                      <Pressable
                        onPress={() => router.push(`/establishment/${establishmentId}` as any)}
                        style={({ pressed }) => [styles.addMoreBtn, pressed && styles.pressed]}
                        hitSlop={8}
                      >
                        <Ionicons name="add" size={15} color="#D42F13" />
                        <Text style={styles.addMoreText}>Add</Text>
                      </Pressable>
                    )}
                  </View>

                  {/* Items List */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>Order Items ({basketCount})</Text>
                  </View>

                  <View style={styles.itemsCard}>
                    {items.map((item, index) => {
                      const isLast = index === items.length - 1;
                      return (
                        <View
                          key={item.id}
                          style={[styles.itemRow, isLast && styles.itemRowLast]}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={styles.itemThumb}
                          />

                          <View style={styles.itemDetails}>
                            <Text style={styles.itemName} numberOfLines={2}>
                              {item.foodName}
                            </Text>
                            <Text style={styles.itemPrice}>₱{item.price}</Text>

                            {/* Cooking Note / Customization */}
                            {item.selectedNote ? (
                              <Pressable
                                onPress={() => handleOpenNoteModal(item)}
                                style={({ pressed }) => [styles.noteChip, pressed && styles.pressed]}
                              >
                                <Ionicons name="pencil" size={10} color="#8E8E93" />
                                <Text style={styles.noteChipText} numberOfLines={1}>
                                  &ldquo;{item.selectedNote}&rdquo;
                                </Text>
                              </Pressable>
                            ) : (
                              <Pressable
                                onPress={() => handleOpenNoteModal(item)}
                                style={({ pressed }) => [styles.addNoteChip, pressed && styles.pressed]}
                              >
                                <Ionicons name="add" size={11} color="#D42F13" />
                                <Text style={styles.addNoteChipText}>Add cooking note</Text>
                              </Pressable>
                            )}
                          </View>

                          {/* Quantity Stepper */}
                          <View style={styles.stepperContainer}>
                            <Pressable
                              onPress={() => updateQuantity(item.id, -1)}
                              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed]}
                              hitSlop={6}
                              accessibilityLabel="Decrease quantity"
                            >
                              <Ionicons
                                name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                                size={15}
                                color={item.quantity === 1 ? '#D42F13' : '#111111'}
                              />
                            </Pressable>

                            <Text style={styles.stepperCount}>{item.quantity}</Text>

                            <Pressable
                              onPress={() => updateQuantity(item.id, 1)}
                              style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed]}
                              hitSlop={6}
                              accessibilityLabel="Increase quantity"
                            >
                              <Ionicons name="add" size={15} color="#111111" />
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* Dining Option Selector */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>Dining Option</Text>
                  </View>
                  <View style={styles.optionRow}>
                    <Pressable
                      onPress={() => setDiningOption('dine_in')}
                      style={[
                        styles.optionCard,
                        diningOption === 'dine_in' && styles.optionCardActive,
                      ]}
                    >
                      <View style={styles.optionIconCircle}>
                        <Ionicons
                          name="restaurant"
                          size={18}
                          color={diningOption === 'dine_in' ? '#D42F13' : '#8E8E93'}
                        />
                      </View>
                      <View style={styles.optionTextCol}>
                        <Text
                          style={[
                            styles.optionTitle,
                            diningOption === 'dine_in' && styles.optionTitleActive,
                          ]}
                          numberOfLines={1}
                        >
                          Dine-In Pass
                        </Text>
                        <Text style={styles.optionSub} numberOfLines={1}>
                          Table meal, skip counter wait
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.optionIndicator,
                          diningOption === 'dine_in'
                            ? styles.optionIndicatorActive
                            : styles.optionIndicatorInactive,
                        ]}
                      >
                        {diningOption === 'dine_in' && (
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        )}
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={() => setDiningOption('takeout')}
                      style={[
                        styles.optionCard,
                        diningOption === 'takeout' && styles.optionCardActive,
                      ]}
                    >
                      <View style={styles.optionIconCircle}>
                        <Ionicons
                          name="bag-handle"
                          size={18}
                          color={diningOption === 'takeout' ? '#D42F13' : '#8E8E93'}
                        />
                      </View>
                      <View style={styles.optionTextCol}>
                        <Text
                          style={[
                            styles.optionTitle,
                            diningOption === 'takeout' && styles.optionTitleActive,
                          ]}
                          numberOfLines={1}
                        >
                          Takeout Box
                        </Text>
                        <Text style={styles.optionSub} numberOfLines={1}>
                          Packed hot for pickup
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.optionIndicator,
                          diningOption === 'takeout'
                            ? styles.optionIndicatorActive
                            : styles.optionIndicatorInactive,
                        ]}
                      >
                        {diningOption === 'takeout' && (
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        )}
                      </View>
                    </Pressable>
                  </View>

                  {/* Pickup Time Slots */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>Estimated Pickup Time</Text>
                  </View>
                  <View style={styles.slotPillRow}>
                    {PICKUP_TIME_SLOTS.map((slot) => {
                      const isSelected = pickupTimeSlot === slot;
                      return (
                        <Pressable
                          key={slot}
                          onPress={() => setPickupTimeSlot(slot)}
                          style={[
                            styles.slotPill,
                            isSelected && styles.slotPillActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotPillText,
                              isSelected && styles.slotPillTextActive,
                            ]}
                          >
                            {slot}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  {/* Special Cooking Instructions Box */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>Kitchen Instructions (Optional)</Text>
                  </View>
                  <View style={styles.instructionCard}>
                    <Ionicons name="chatbox-ellipses-outline" size={18} color="#8E8E93" style={{ marginTop: 2 }} />
                    <TextInput
                      style={styles.instructionInput}
                      placeholder="e.g. Extra spicy, separate broth, less oil, extra calamansi..."
                      placeholderTextColor="#8E8E93"
                      value={specialInstructions}
                      onChangeText={setSpecialInstructions}
                      multiline
                      maxLength={140}
                    />
                  </View>

                  {/* Bill Breakdown & Total */}
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionLabel}>Payment Summary</Text>
                  </View>
                  <View style={styles.billCard}>
                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>Item Subtotal</Text>
                      <Text style={styles.billValue}>₱{subtotal}</Text>
                    </View>
                    <View style={styles.billRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={styles.billLabel}>Reservation Service Fee</Text>
                        <View style={styles.freePill}>
                          <Text style={styles.freePillText}>FREE</Text>
                        </View>
                      </View>
                      <Text style={[styles.billValue, { color: '#34C759' }]}>₱0</Text>
                    </View>
                    <View style={styles.billDivider} />
                    <View style={styles.billRowTotal}>
                      <Text style={styles.totalLabel}>Total Due at Counter</Text>
                      <Text style={styles.totalValue}>₱{total}</Text>
                    </View>
                    <View style={styles.paymentMethodNotice}>
                      <Ionicons name="card-outline" size={14} color="#666666" />
                      <Text style={styles.paymentNoticeText}>
                        Pay directly upon counter pickup · Cash, GCash, or Maya
                      </Text>
                    </View>
                  </View>

                  {/* Action CTA Button */}
                  <Pressable
                    onPress={() => router.push('/payment')}
                    style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel={`Proceed to payment for ₱${total}`}
                  >
                    <Text style={styles.confirmBtnText}>
                      Proceed to Payment (₱{total})
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ACTIVE PASSES & LIVE ORDER TRACKER                */}
          {/* ======================================================== */}
          {activeTab === 'passes' && (
            <View style={styles.tabContent}>
              {activePreOrders.length === 0 ? (
                <View style={styles.emptyCard}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="ticket-outline" size={38} color="#007AFF" />
                  </View>
                  <Text style={styles.emptyTitle}>No Active Dine-In Passes</Text>
                  <Text style={styles.emptyDesc}>
                    When you reserve dishes from any local carinderia or store, your digital passes and live kitchen status tracker appear here.
                  </Text>
                  <Pressable
                    onPress={() => setActiveTab('cart')}
                    style={({ pressed }) => [styles.emptyPrimaryBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.emptyPrimaryText}>View Food Basket</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.ordersContent}>
                  {activePreOrders.map((order) => {
                    const isReceived = order.status === 'received';
                    const isPreparing = order.status === 'preparing';
                    const isReady = order.status === 'ready';
                    const isCompleted = order.status === 'completed';

                    return (
                      <View key={order.id} style={styles.passTicketCard}>
                        {/* Ticket Header */}
                        <View style={styles.ticketTopHeader}>
                          <View>
                            <View style={styles.orderNumberRow}>
                              <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
                              <View
                                style={[
                                  styles.statusBadge,
                                  isReceived && styles.statusBadgeReceived,
                                  isPreparing && styles.statusBadgePreparing,
                                  isReady && styles.statusBadgeReady,
                                  isCompleted && styles.statusBadgeCompleted,
                                ]}
                              >
                                <Ionicons
                                  name={
                                    isReady
                                      ? 'checkmark-circle'
                                      : isPreparing
                                      ? 'flame'
                                      : isReceived
                                      ? 'time'
                                      : 'checkbox'
                                  }
                                  size={12}
                                  color={
                                    isReady
                                      ? '#2E7D32'
                                      : isPreparing
                                      ? '#1976D2'
                                      : isReceived
                                      ? '#E65100'
                                      : '#666666'
                                  }
                                />
                                <Text
                                  style={[
                                    styles.statusBadgeText,
                                    isReady && styles.statusTextReady,
                                    isPreparing && styles.statusTextPreparing,
                                    isReceived && styles.statusTextReceived,
                                    isCompleted && styles.statusTextCompleted,
                                  ]}
                                >
                                  {isReady
                                    ? 'READY FOR PICKUP'
                                    : isPreparing
                                    ? 'IN KITCHEN'
                                    : isReceived
                                    ? 'ORDER RECEIVED'
                                    : 'COMPLETED'}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.ticketEstName}>{order.establishmentName}</Text>
                            <Text style={styles.ticketEstAddress}>{order.establishmentAddress}</Text>
                          </View>
                        </View>

                        {/* 4-Step Progress Tracker */}
                        <View style={styles.trackerWrapper}>
                          <View style={styles.trackerTrack}>
                            {/* Step 1: Received */}
                            <View style={styles.trackerStep}>
                              <View
                                style={[
                                  styles.stepCircle,
                                  (isReceived || isPreparing || isReady || isCompleted) && styles.stepCircleActive,
                                ]}
                              >
                                <Ionicons name="receipt" size={13} color="#FFFFFF" />
                              </View>
                              <Text style={styles.stepLabel}>Received</Text>
                            </View>

                            <View
                              style={[
                                styles.stepLine,
                                (isPreparing || isReady || isCompleted) && styles.stepLineActive,
                              ]}
                            />

                            {/* Step 2: Preparing */}
                            <View style={styles.trackerStep}>
                              <View
                                style={[
                                  styles.stepCircle,
                                  (isPreparing || isReady || isCompleted) && styles.stepCircleActive,
                                ]}
                              >
                                <Ionicons name="flame" size={13} color="#FFFFFF" />
                              </View>
                              <Text style={styles.stepLabel}>Cooking</Text>
                            </View>

                            <View
                              style={[
                                styles.stepLine,
                                (isReady || isCompleted) && styles.stepLineActive,
                              ]}
                            />

                            {/* Step 3: Ready */}
                            <View style={styles.trackerStep}>
                              <View
                                style={[
                                  styles.stepCircle,
                                  (isReady || isCompleted) && styles.stepCircleGreen,
                                ]}
                              >
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                              </View>
                              <Text style={styles.stepLabel}>Ready</Text>
                            </View>

                            <View
                              style={[
                                styles.stepLine,
                                isCompleted && styles.stepLineActive,
                              ]}
                            />

                            {/* Step 4: Picked up */}
                            <View style={styles.trackerStep}>
                              <View
                                style={[
                                  styles.stepCircle,
                                  isCompleted ? styles.stepCircleActive : styles.stepCirclePending,
                                ]}
                              >
                                <Ionicons name="happy" size={13} color={isCompleted ? '#FFFFFF' : '#8E8E93'} />
                              </View>
                              <Text style={styles.stepLabel}>Served</Text>
                            </View>
                          </View>

                          {/* Live Alert Banner */}
                          <View
                            style={[
                              styles.etaBanner,
                              isReady && styles.etaBannerReady,
                            ]}
                          >
                            <Ionicons
                              name={isReady ? 'notifications' : 'time-outline'}
                              size={16}
                              color={isReady ? '#2E7D32' : '#007AFF'}
                            />
                            <Text
                              style={[
                                styles.etaBannerText,
                                isReady && styles.etaBannerTextReady,
                              ]}
                            >
                              {isReady
                                ? 'Your meal is ready! Present this digital pass at the counter.'
                                : isPreparing
                                ? `Freshly cooking · Approx ${order.estimatedMinutesRemaining} mins remaining`
                                : `Order received · Target: ${order.pickupTimeSlot}`}
                            </Text>
                          </View>
                        </View>

                        {/* Perforated Ticket Notches & Divider */}
                        <View style={styles.perforatedRow}>
                          <View style={styles.leftNotch} />
                          <View style={styles.dashedLine} />
                          <View style={styles.rightNotch} />
                        </View>

                        {/* Ticket Lower Section: Digital Pass & QR Voucher */}
                        <View style={styles.ticketBottomBody}>
                          <View style={styles.qrPassCard}>
                            <Pressable
                              onPress={() => setEnlargedQrPass(order)}
                              style={({ pressed }) => [
                                styles.qrCodeWrapper,
                                pressed && styles.pressed,
                              ]}
                              hitSlop={6}
                            >
                              <View style={styles.qrCodeContainer}>
                                <QRCode
                                  value={`PINOYPASS:${order.id}:${order.orderNumber}:${order.establishmentName}:${order.total}`}
                                  size={68}
                                  color="#111111"
                                  backgroundColor="#FFFFFF"
                                />
                              </View>
                              <Text style={styles.qrTapToEnlarge}>Tap to enlarge</Text>
                            </Pressable>
                            <View style={styles.qrInstructions}>
                              <Text style={styles.qrPassTitle}>OFFICIAL PASS</Text>
                              <Text style={styles.qrPassCode}>{order.orderNumber}</Text>
                              <View style={styles.diningTypeChip}>
                                <Ionicons
                                  name={order.diningOption === 'takeout' ? 'bag-handle' : 'restaurant'}
                                  size={11}
                                  color="#444444"
                                />
                                <Text style={styles.diningTypeChipText}>
                                  {order.diningOption === 'takeout' ? 'Takeout Box' : 'Dine-In Pass'}
                                </Text>
                              </View>

                              {/* Payment Status Chip */}
                              <View
                                style={[
                                  styles.diningTypeChip,
                                  order.paymentStatus === 'paid'
                                    ? { backgroundColor: '#E8F5E9' }
                                    : { backgroundColor: '#FFF3E0' },
                                ]}
                              >
                                <Ionicons
                                  name={order.paymentStatus === 'paid' ? 'checkmark-circle' : 'cash-outline'}
                                  size={11}
                                  color={order.paymentStatus === 'paid' ? '#2E7D32' : '#E65100'}
                                />
                                <Text
                                  style={[
                                    styles.diningTypeChipText,
                                    {
                                      color: order.paymentStatus === 'paid' ? '#2E7D32' : '#E65100',
                                      fontWeight: '700',
                                    },
                                  ]}
                                >
                                  {order.paymentStatus === 'paid'
                                    ? `PAID · ${order.paymentMethod === 'gcash' ? 'GCASH' : 'MAYA / QR PH'}`
                                    : 'CASH ON ARRIVAL'}
                                </Text>
                              </View>
                              {order.paymentRefNumber ? (
                                <Text style={[styles.qrHint, { fontSize: 10, color: '#2E7D32' }]}>
                                  Ref: {order.paymentRefNumber}
                                </Text>
                              ) : null}
                              <Text style={styles.qrHint}>Show at counter upon arrival</Text>
                            </View>
                          </View>

                          {/* Ordered Items Preview */}
                          <View style={styles.orderItemsBreakdown}>
                            <Text style={styles.orderSummaryTitle}>Ordered Dishes:</Text>
                            {order.items.map((it) => (
                              <View key={it.id} style={styles.orderSummaryRow}>
                                <Text style={styles.orderSummaryQty}>{it.quantity}×</Text>
                                <Text style={styles.orderSummaryName} numberOfLines={1}>
                                  {it.foodName}
                                </Text>
                                <Text style={styles.orderSummaryPrice}>₱{it.price * it.quantity}</Text>
                              </View>
                            ))}
                            {order.specialInstructions ? (
                              <Text style={styles.orderSpecialNotes}>
                                Note: &ldquo;{order.specialInstructions}&rdquo;
                              </Text>
                            ) : null}
                            <View style={styles.orderTotalRow}>
                              <Text style={styles.orderTotalLabel}>
                                {order.paymentStatus === 'paid' ? 'Total Paid' : 'Total at Counter (Cash)'}
                              </Text>
                              <Text style={styles.orderTotalValue}>₱{order.total}</Text>
                            </View>
                          </View>

                          {/* Quick Actions Row */}
                          <View style={styles.ticketActionRow}>
                            <Pressable
                              onPress={() => handleCallEstablishment()}
                              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                            >
                              <Ionicons name="call-outline" size={15} color="#111111" />
                              <Text style={styles.actionButtonText}>Call Counter</Text>
                            </Pressable>

                            <Pressable
                              onPress={() => router.push('/map')}
                              style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                            >
                              <Ionicons name="navigate-outline" size={15} color="#111111" />
                              <Text style={styles.actionButtonText}>Directions</Text>
                            </Pressable>

                            {isReceived && (
                              <Pressable
                                onPress={() => handleCancelOrderPrompt(order.id)}
                                style={({ pressed }) => [styles.cancelOrderBtn, pressed && styles.pressed]}
                              >
                                <Ionicons name="close-circle-outline" size={15} color="#D42F13" />
                                <Text style={styles.cancelOrderText}>Cancel</Text>
                              </Pressable>
                            )}
                          </View>

                          {/* Demo Interactive Advance Pill */}
                          <Pressable
                            onPress={() => advanceOrderStatusDemo(order.id)}
                            style={({ pressed }) => [styles.demoAdvanceBtn, pressed && styles.pressed]}
                          >
                            <Ionicons name="flash" size={13} color="#FF9500" />
                            <Text style={styles.demoAdvanceText}>
                              Simulate Kitchen Progress (Tap to advance)
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Discreet Tasting Passport Banner */}
          <View style={styles.passportShortcutCard}>
            <View style={styles.passportShortcutLeft}>
              <View style={styles.passportShortcutIconCircle}>
                <Ionicons name="ribbon-outline" size={18} color="#D42F13" />
              </View>
              <View style={styles.passportShortcutTextCol}>
                <Text style={styles.passportShortcutTitle} numberOfLines={1}>
                  Culinary Passport & Badges
                </Text>
                <Text style={styles.passportShortcutDesc} numberOfLines={1}>
                  Track your tasting stamps and Bikolano explorer ranks
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [styles.passportShortcutBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Text style={styles.passportShortcutBtnText}>View in Profile</Text>
              <Ionicons name="chevron-forward" size={14} color="#D42F13" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Nav */}
      <NavBar currentTab="basket" />

      {/* Note Editing Modal */}
      <Modal visible={!!editingItem} animationType="fade" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Special Cooking Note</Text>
              <Pressable onPress={() => setEditingItem(null)} hitSlop={8}>
                <Ionicons name="close" size={22} color="#8E8E93" />
              </Pressable>
            </View>
            <Text style={styles.modalSubTitle}>{editingItem?.foodName}</Text>

            <TextInput
              style={styles.modalNoteInput}
              placeholder="e.g. Extra chili paste, broth on the side, well done..."
              placeholderTextColor="#8E8E93"
              value={noteInput}
              onChangeText={setNoteInput}
              multiline
              autoFocus
              maxLength={100}
            />

            <View style={styles.modalBtnRow}>
              <Pressable
                onPress={() => setEditingItem(null)}
                style={styles.modalSecondaryBtn}
              >
                <Text style={styles.modalSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveNote}
                style={styles.modalPrimaryBtn}
              >
                <Text style={styles.modalPrimaryText}>Save Note</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Order Confirmed Celebration Modal */}
      <Modal visible={confirmModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSuccessCard}>
            <View style={styles.successIconBadge}>
              <Ionicons name="checkmark-circle" size={54} color="#34C759" />
            </View>
            <Text style={styles.successTitle}>Pre-Order Pass Confirmed!</Text>
            <Text style={styles.successDesc}>
              Your expedition order has been received at{' '}
              <Text style={{ fontWeight: '700', color: '#111111' }}>
                {confirmedOrder?.establishmentName}
              </Text>
              . Show your order ID at the counter when you arrive.
            </Text>

            <View style={styles.orderSummaryPill}>
              <Text style={styles.orderSummaryPillLabel}>ORDER NUMBER</Text>
              <Text style={styles.orderSummaryPillValue}>{confirmedOrder?.orderNumber}</Text>
            </View>

            <Pressable
              onPress={() => {
                setConfirmModalVisible(false);
                setActiveTab('passes');
              }}
              style={styles.modalDoneBtn}
            >
              <Text style={styles.modalDoneBtnText}>View My Digital Pass</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Enlarged QR Code Modal for Counter Scanner */}
      <Modal visible={!!enlargedQrPass} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.enlargedQrCard}>
            <View style={styles.enlargedQrHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.enlargedQrTitle}>Digital Counter Pass</Text>
                <Text style={styles.enlargedQrSubtitle} numberOfLines={1}>
                  {enlargedQrPass?.establishmentName}
                </Text>
              </View>
              <Pressable
                onPress={() => setEnlargedQrPass(null)}
                style={styles.enlargedQrCloseBtn}
                hitSlop={10}
              >
                <Ionicons name="close" size={20} color="#111111" />
              </Pressable>
            </View>

            <View style={styles.enlargedQrCodeBox}>
              {enlargedQrPass && (
                <QRCode
                  value={`PINOYPASS:${enlargedQrPass.id}:${enlargedQrPass.orderNumber}:${enlargedQrPass.establishmentName}:${enlargedQrPass.total}`}
                  size={190}
                  color="#111111"
                  backgroundColor="#FFFFFF"
                />
              )}
            </View>

            <View style={styles.enlargedQrOrderInfo}>
              <Text style={styles.enlargedQrOrderNum}>{enlargedQrPass?.orderNumber}</Text>
              <Text style={styles.enlargedQrMeta}>
                {enlargedQrPass?.diningOption === 'takeout' ? 'Takeout Box' : 'Dine-In Pass'} ·{' '}
                {enlargedQrPass?.pickupTimeSlot}
              </Text>
              <Text style={styles.enlargedQrHint}>
                Present this QR code directly to the vendor staff or counter scanner.
              </Text>
            </View>

            <Pressable
              onPress={() => setEnlargedQrPass(null)}
              style={styles.enlargedQrDoneBtn}
            >
              <Text style={styles.enlargedQrDoneBtnText}>Done</Text>
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
    paddingBottom: 110,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  // Title section
  titleSection: {
    paddingTop: Platform.OS === 'ios' ? 14 : 20,
    paddingBottom: 12,
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
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#D42F13',
  },
  subheadText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 19,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },

  // Segmented Switcher
  segmentWrapper: {
    marginBottom: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 14,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.08)' } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  tabLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  segmentLabelActive: {
    color: '#1C1C1E',
    fontWeight: '700',
  },
  liveOrderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D42F13',
  },

  tabContent: {
    marginBottom: 16,
  },

  // Empty State
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    textAlign: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  emptyActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  emptyPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D42F13',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  emptyPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptySecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  emptySecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },

  // Cart Content
  cartContent: {
    gap: 12,
  },
  establishmentHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  estIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estInfoBlock: {
    flex: 1,
  },
  estBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  estBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  estNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  estAddressText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 1,
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF0EE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  addMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
  },

  sectionHeaderRow: {
    marginTop: 6,
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Items Card
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    gap: 12,
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D42F13',
    marginTop: 2,
  },
  noteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
    maxWidth: 200,
  },
  noteChipText: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },
  addNoteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  addNoteChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D42F13',
  },

  // Steppers
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 3,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    paddingHorizontal: 10,
  },

  // Dining Option Cards
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  optionCard: {
    flex: 1,
    minHeight: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  optionCardActive: {
    borderColor: '#D42F13',
    backgroundColor: '#FFFBFB',
  },
  optionIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666666',
  },
  optionTitleActive: {
    color: '#D42F13',
  },
  optionSub: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  optionIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndicatorActive: {
    backgroundColor: '#D42F13',
  },
  optionIndicatorInactive: {
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    backgroundColor: 'transparent',
  },

  // Pickup Slots
  slotPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  slotPillActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  slotPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  slotPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Instruction Card
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  instructionInput: {
    flex: 1,
    fontSize: 13,
    color: '#111111',
    lineHeight: 18,
    minHeight: 44,
  },

  // Bill Card
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: '#666666',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  freePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 10,
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D42F13',
  },
  paymentMethodNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 10,
  },
  paymentNoticeText: {
    fontSize: 11,
    color: '#666666',
    flex: 1,
  },

  // Confirm CTA
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D42F13',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 8,
    ...Platform.select({
      web: { boxShadow: '0 6px 18px rgba(212, 47, 19, 0.35)' } as any,
      default: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ========================================================
  // Passes Styles
  // ========================================================
  ordersContent: {
    gap: 16,
  },
  passTicketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  ticketTopHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  orderNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderNumberText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeReceived: { backgroundColor: '#FFF3E0' },
  statusBadgePreparing: { backgroundColor: '#E3F2FD' },
  statusBadgeReady: { backgroundColor: '#E8F5E9' },
  statusBadgeCompleted: { backgroundColor: '#F2F2F7' },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextReceived: { color: '#E65100' },
  statusTextPreparing: { color: '#1976D2' },
  statusTextReady: { color: '#2E7D32' },
  statusTextCompleted: { color: '#666666' },

  ticketEstName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  ticketEstAddress: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },

  // 4-Step Progress Tracker
  trackerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  trackerTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  trackerStep: {
    alignItems: 'center',
    width: 52,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
  },
  stepCircleGreen: {
    backgroundColor: '#34C759',
  },
  stepCirclePending: {
    backgroundColor: '#E5E5EA',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    marginTop: 4,
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E5EA',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  stepLineActive: {
    backgroundColor: '#007AFF',
  },

  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F6FF',
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  etaBannerReady: {
    backgroundColor: '#E8F5E9',
  },
  etaBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
  },
  etaBannerTextReady: {
    color: '#2E7D32',
    fontWeight: '700',
  },

  // Perforated Divider
  perforatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    position: 'relative',
    marginVertical: -2,
  },
  leftNotch: {
    width: 14,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#E5E5EA',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  rightNotch: {
    width: 14,
    height: 24,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#E5E5EA',
  },

  // Ticket Bottom Body
  ticketBottomBody: {
    padding: 16,
    paddingTop: 10,
    gap: 12,
  },
  qrPassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  qrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeContainer: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  qrTapToEnlarge: {
    fontSize: 9,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 4,
  },
  qrInstructions: {
    flex: 1,
  },
  qrPassTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.8,
  },
  qrPassCode: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  diningTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  diningTypeChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#444444',
  },
  qrHint: {
    fontSize: 11,
    color: '#666666',
  },

  orderItemsBreakdown: {
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  orderSummaryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  orderSummaryQty: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
    width: 24,
  },
  orderSummaryName: {
    flex: 1,
    fontSize: 13,
    color: '#111111',
  },
  orderSummaryPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  orderSpecialNotes: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#666666',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  orderTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  orderTotalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D42F13',
  },

  ticketActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  cancelOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FFF0EE',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  cancelOrderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
  },

  demoAdvanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 2,
  },
  demoAdvanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B78103',
  },

  // Passport Shortcut Card
  passportShortcutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: 8,
    gap: 10,
  },
  passportShortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  passportShortcutIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  passportShortcutTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  passportShortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  passportShortcutDesc: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  passportShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FFF5F4',
    borderRadius: 8,
  },
  passportShortcutBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      web: { boxShadow: '0 12px 32px rgba(0,0,0,0.18)' } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  modalSubTitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 12,
  },
  modalNoteInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111111',
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalSecondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  modalPrimaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#D42F13',
    alignItems: 'center',
  },
  modalPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Celebration Modal
  modalSuccessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    textAlign: 'center',
  },
  successIconBadge: {
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  orderSummaryPill: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  orderSummaryPillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  orderSummaryPillValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D42F13',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  modalDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1C1C1E',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
  },
  modalDoneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Enlarged QR Pass Modal
  enlargedQrCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  enlargedQrHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  enlargedQrTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111111',
  },
  enlargedQrSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  enlargedQrCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedQrCodeBox: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginVertical: 8,
  },
  enlargedQrOrderInfo: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  enlargedQrOrderNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  enlargedQrMeta: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    fontWeight: '600',
  },
  enlargedQrHint: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 15,
  },
  enlargedQrDoneBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedQrDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
