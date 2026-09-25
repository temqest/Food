import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/common/Header';
import { NavBar } from '@/components/common/NavBar';
import { IOSTokens } from '@/constants/theme';
import { useBasket, PreOrder } from '@/context/BasketContext';

const PICKUP_TIME_SLOTS = [
  'ASAP (15–20 mins)',
  'Today, 12:30 PM',
  'Today, 1:00 PM',
  'Today, 5:30 PM',
  'Today, 6:00 PM',
];

export default function BasketScreen() {
  const {
    items,
    activePreOrders,
    pickupTimeSlot,
    setPickupTimeSlot,
    specialInstructions,
    setSpecialInstructions,
    updateQuantity,
    clearBasket,
    placePreOrder,
    getBasketSubtotal,
    activeTabSection,
    setActiveTabSection,
  } = useBasket();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PreOrder | null>(null);

  const subtotal = getBasketSubtotal();
  const fee = 0; // Free pre-ordering
  const total = subtotal + fee;

  // Primary shop info from cart items
  const primaryItem = items.length > 0 ? items[0] : null;

  const handlePlaceOrder = () => {
    const newOrder = placePreOrder();
    if (newOrder) {
      setPlacedOrder(newOrder);
      setConfirmModalVisible(true);
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Basket & Pre-Orders"
        rightAction={
          items.length > 0 && activeTabSection === 'current' ? (
            <Pressable
              onPress={clearBasket}
              style={({ pressed }) => [styles.headerClearBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Text style={styles.headerClearText}>Clear</Text>
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* iOS Large Title */}
          <View style={styles.titleSection}>
            <Text style={styles.largeTitle}>Pre-Orders</Text>
          </View>

          {/* Segmented Control: Current Basket vs Active Orders */}
          <View style={styles.segmentedWrapper}>
            <View style={styles.segmentedControl}>
              <Pressable
                onPress={() => setActiveTabSection('current')}
                style={[
                  styles.segmentButton,
                  activeTabSection === 'current' && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTabSection === 'current' && styles.segmentTextActive,
                  ]}
                >
                  Current Cart {items.length > 0 ? `(${items.length})` : ''}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTabSection('history')}
                style={[
                  styles.segmentButton,
                  activeTabSection === 'history' && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    activeTabSection === 'history' && styles.segmentTextActive,
                  ]}
                >
                  Active Orders {activePreOrders.length > 0 ? `(${activePreOrders.length})` : ''}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* TAB 1: CURRENT BASKET */}
          {activeTabSection === 'current' && (
            <>
              {items.length === 0 ? (
                /* Empty Basket State */
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons
                      name="bag-handle-outline"
                      size={44}
                      color={IOSTokens.colors.labelSecondary}
                    />
                  </View>
                  <Text style={styles.emptyTitle}>Your Basket is Empty</Text>
                  <Text style={styles.emptySubtext}>
                    Pre-order Bikol delicacies like Kinalas or Toasted Siopao from local Naga spots for instant pickup.
                  </Text>
                  <Pressable
                    onPress={() => router.push('/explore')}
                    style={({ pressed }) => [styles.exploreButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.exploreButtonText}>Browse Food Spots</Text>
                  </Pressable>
                </View>
              ) : (
                /* Cart Items List & Pre-order Details */
                <>
                  {/* Shop Details Inset Group */}
                  {primaryItem && (
                    <View style={styles.sectionBlock}>
                      <Text style={styles.sectionTitle}>Pick-up Location</Text>
                      <View style={styles.insetGroup}>
                        <View style={styles.shopRow}>
                          <View style={styles.shopIconBox}>
                            <Ionicons
                              name="storefront-outline"
                              size={22}
                              color={IOSTokens.colors.tint}
                            />
                          </View>
                          <View style={styles.shopInfo}>
                            <Text style={styles.shopName}>{primaryItem.establishmentName}</Text>
                            <Text style={styles.shopAddress} numberOfLines={1}>
                              {primaryItem.establishmentAddress}
                            </Text>
                            <View style={styles.shopStatusBadge}>
                              <View style={styles.statusDot} />
                              <Text style={styles.statusBadgeText}>Open for Pre-Order</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Pickup Time Window Selection */}
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Pickup Time Window</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.slotsScrollContent}
                    >
                      {PICKUP_TIME_SLOTS.map((slot) => {
                        const isSelected = pickupTimeSlot === slot;
                        return (
                          <Pressable
                            key={slot}
                            onPress={() => setPickupTimeSlot(slot)}
                            style={({ pressed }) => [
                              styles.slotPill,
                              isSelected && styles.slotPillSelected,
                              pressed && styles.pressed,
                            ]}
                          >
                            <Ionicons
                              name={isSelected ? 'time' : 'time-outline'}
                              size={15}
                              color={isSelected ? '#FFFFFF' : IOSTokens.colors.labelSecondary}
                              style={{ marginRight: 6 }}
                            />
                            <Text
                              style={[
                                styles.slotPillText,
                                isSelected && styles.slotPillTextSelected,
                              ]}
                            >
                              {slot}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Order Items Group */}
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Your Items</Text>
                    <View style={styles.insetGroup}>
                      {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                          <View key={item.id} style={styles.itemRow}>
                            <Image
                              source={{ uri: item.image }}
                              style={styles.itemThumb}
                              resizeMode="cover"
                            />

                            <View style={[styles.itemContent, isLast && styles.itemContentLast]}>
                              <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={1}>
                                  {item.foodName}
                                </Text>
                                <Text style={styles.itemPrice}>₱{item.price * item.quantity}</Text>
                                {item.selectedNote && (
                                  <Text style={styles.itemNote} numberOfLines={1}>
                                    Note: {item.selectedNote}
                                  </Text>
                                )}
                              </View>

                              {/* iOS Stepper (- qty +) */}
                              <View style={styles.stepperContainer}>
                                <Pressable
                                  onPress={() => updateQuantity(item.id, -1)}
                                  style={({ pressed }) => [
                                    styles.stepperButton,
                                    pressed && styles.pressed,
                                  ]}
                                  hitSlop={8}
                                  accessibilityLabel="Decrease quantity"
                                >
                                  <Ionicons
                                    name={item.quantity === 1 ? 'trash-outline' : 'remove-outline'}
                                    size={16}
                                    color={
                                      item.quantity === 1
                                        ? IOSTokens.colors.red
                                        : IOSTokens.colors.label
                                    }
                                  />
                                </Pressable>

                                <Text style={styles.stepperValue}>{item.quantity}</Text>

                                <Pressable
                                  onPress={() => updateQuantity(item.id, 1)}
                                  style={({ pressed }) => [
                                    styles.stepperButton,
                                    pressed && styles.pressed,
                                  ]}
                                  hitSlop={8}
                                  accessibilityLabel="Increase quantity"
                                >
                                  <Ionicons
                                    name="add-outline"
                                    size={16}
                                    color={IOSTokens.colors.label}
                                  />
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Special Instructions Input */}
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Special Instructions</Text>
                    <View style={styles.insetGroup}>
                      <TextInput
                        value={specialInstructions}
                        onChangeText={setSpecialInstructions}
                        placeholder="Add notes for kitchen (e.g., extra chili, broth on side)"
                        placeholderTextColor={IOSTokens.colors.labelTertiary}
                        style={styles.instructionInput}
                        multiline
                        numberOfLines={2}
                      />
                    </View>
                  </View>

                  {/* Payment & Order Summary */}
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.insetGroup}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>₱{subtotal}</Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Pre-Order Service Fee</Text>
                        <Text style={styles.summaryValueFree}>FREE</Text>
                      </View>
                      <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₱{total}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Place Pre-Order Primary Action */}
                  <Pressable
                    onPress={handlePlaceOrder}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.primaryButtonText}>
                      Place Pre-Order • ₱{total}
                    </Text>
                  </Pressable>
                </>
              )}
            </>
          )}

          {/* TAB 2: ACTIVE ORDERS / HISTORY */}
          {activeTabSection === 'history' && (
            <>
              {activePreOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons
                      name="receipt-outline"
                      size={44}
                      color={IOSTokens.colors.labelSecondary}
                    />
                  </View>
                  <Text style={styles.emptyTitle}>No Active Orders</Text>
                  <Text style={styles.emptySubtext}>
                    When you place a pre-order, you can track real-time kitchen status and pickup windows right here.
                  </Text>
                </View>
              ) : (
                <View style={styles.ordersListContainer}>
                  {activePreOrders.map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                      {/* Ticket Header */}
                      <View style={styles.orderCardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
                          <Text style={styles.orderShopName}>{order.establishmentName}</Text>
                        </View>
                        <View style={styles.orderStatusBadge}>
                          <Text style={styles.orderStatusText}>
                            {order.status === 'received'
                              ? 'Received'
                              : order.status === 'preparing'
                              ? 'Preparing'
                              : order.status === 'ready'
                              ? 'Ready for Pickup'
                              : 'Completed'}
                          </Text>
                        </View>
                      </View>

                      {/* Status Stepper Tracker */}
                      <View style={styles.trackerContainer}>
                        <View style={styles.trackerStep}>
                          <View
                            style={[
                              styles.trackerDot,
                              styles.trackerDotActive,
                            ]}
                          />
                          <Text style={styles.trackerTextActive}>Received</Text>
                        </View>
                        <View
                          style={[
                            styles.trackerLine,
                            (order.status === 'preparing' || order.status === 'ready') &&
                              styles.trackerLineActive,
                          ]}
                        />
                        <View style={styles.trackerStep}>
                          <View
                            style={[
                              styles.trackerDot,
                              (order.status === 'preparing' || order.status === 'ready') &&
                                styles.trackerDotActive,
                            ]}
                          />
                          <Text
                            style={
                              order.status === 'preparing' || order.status === 'ready'
                                ? styles.trackerTextActive
                                : styles.trackerText
                            }
                          >
                            Preparing
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.trackerLine,
                            order.status === 'ready' && styles.trackerLineActive,
                          ]}
                        />
                        <View style={styles.trackerStep}>
                          <View
                            style={[
                              styles.trackerDot,
                              order.status === 'ready' && styles.trackerDotActive,
                            ]}
                          />
                          <Text
                            style={
                              order.status === 'ready'
                                ? styles.trackerTextActive
                                : styles.trackerText
                            }
                          >
                            Ready
                          </Text>
                        </View>
                      </View>

                      {/* Details Box */}
                      <View style={styles.orderMetaBox}>
                        <View style={styles.metaRow}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={IOSTokens.colors.labelSecondary}
                          />
                          <Text style={styles.metaText}>
                            Pickup: {order.pickupTimeSlot}
                          </Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color={IOSTokens.colors.labelSecondary}
                          />
                          <Text style={styles.metaText} numberOfLines={1}>
                            {order.establishmentAddress}
                          </Text>
                        </View>
                      </View>

                      {/* Item Summary */}
                      <View style={styles.orderItemsSummary}>
                        {order.items.map((it) => (
                          <Text key={it.id} style={styles.orderItemRowText}>
                            {it.quantity}x {it.foodName} (₱{it.price * it.quantity})
                          </Text>
                        ))}
                      </View>

                      {/* Card Footer */}
                      <View style={styles.orderFooter}>
                        <Text style={styles.orderTotalText}>Total: ₱{order.total}</Text>
                        <Pressable
                          onPress={() => router.push('/map')}
                          style={({ pressed }) => [
                            styles.directionsBtn,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Ionicons
                            name="navigate"
                            size={14}
                            color={IOSTokens.colors.tint}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.directionsBtnText}>Get Directions</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="checkmark-circle" size={60} color={IOSTokens.colors.green} />
            </View>

            <Text style={styles.modalTitle}>Pre-Order Confirmed!</Text>
            <Text style={styles.modalOrderNum}>{placedOrder?.orderNumber}</Text>
            <Text style={styles.modalBody}>
              Your pre-order has been sent to{' '}
              <Text style={{ fontWeight: '600' }}>{placedOrder?.establishmentName}</Text>.
              It will be freshly prepared and ready for pickup at{' '}
              <Text style={{ fontWeight: '600' }}>{placedOrder?.pickupTimeSlot}</Text>.
            </Text>

            <Pressable
              onPress={() => setConfirmModalVisible(false)}
              style={({ pressed }) => [styles.modalPrimaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.modalPrimaryBtnText}>Track Order Progress</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Translucent Tab Bar */}
      <NavBar currentTab="basket" />
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
  headerClearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerClearText: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    color: IOSTokens.colors.tint,
  },
  titleSection: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  largeTitle: {
    ...IOSTokens.typography.largeTitle,
    color: IOSTokens.colors.label,
  },

  // Segmented Control
  segmentedWrapper: {
    marginBottom: 20,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: IOSTokens.colors.fill,
    borderRadius: 9,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },
  segmentButtonActive: {
    backgroundColor: IOSTokens.colors.surface,
  },
  segmentText: {
    ...IOSTokens.typography.subhead,
    fontSize: 13,
    fontWeight: '500',
    color: IOSTokens.colors.labelSecondary,
  },
  segmentTextActive: {
    color: IOSTokens.colors.label,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: IOSTokens.colors.fill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    ...IOSTokens.typography.headline,
    fontSize: 20,
    color: IOSTokens.colors.label,
    marginBottom: 8,
  },
  emptySubtext: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: IOSTokens.colors.tint,
  },
  exploreButtonText: {
    ...IOSTokens.typography.headline,
    fontSize: 15,
    color: '#FFFFFF',
  },

  // Sections & Groups
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...IOSTokens.typography.title2,
    fontSize: 18,
    lineHeight: 22,
    color: IOSTokens.colors.label,
    marginBottom: 10,
  },
  insetGroup: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    overflow: 'hidden',
  },

  // Shop Info Row
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  shopIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: IOSTokens.colors.tintSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  shopAddress: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
  },
  shopStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: IOSTokens.colors.green,
    marginRight: 6,
  },
  statusBadgeText: {
    ...IOSTokens.typography.caption,
    color: IOSTokens.colors.green,
    fontWeight: '500',
  },

  // Pickup Slots
  slotsScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: IOSTokens.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.12)',
  },
  slotPillSelected: {
    backgroundColor: IOSTokens.colors.tint,
    borderColor: IOSTokens.colors.tint,
  },
  slotPillText: {
    ...IOSTokens.typography.subhead,
    fontSize: 14,
    color: IOSTokens.colors.label,
  },
  slotPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Cart Item Row
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 76,
  },
  itemThumb: {
    width: 56,
    height: 56,
    borderRadius: IOSTokens.shape.thumb,
    backgroundColor: IOSTokens.colors.fill,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
    paddingBottom: 12,
  },
  itemContentLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    ...IOSTokens.typography.headline,
    fontSize: 16,
    color: IOSTokens.colors.label,
  },
  itemPrice: {
    ...IOSTokens.typography.subhead,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
    marginTop: 2,
  },
  itemNote: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.labelSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOSTokens.colors.fill,
    borderRadius: 8,
    padding: 3,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: IOSTokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...IOSTokens.typography.headline,
    fontSize: 15,
    color: IOSTokens.colors.label,
    paddingHorizontal: 10,
  },

  // Input
  instructionInput: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    padding: 14,
    color: IOSTokens.colors.label,
    minHeight: 60,
  },

  // Summary Rows
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingVertical: 14,
  },
  summaryLabel: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    color: IOSTokens.colors.label,
  },
  summaryValue: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    color: IOSTokens.colors.labelSecondary,
  },
  summaryValueFree: {
    ...IOSTokens.typography.headline,
    fontSize: 15,
    color: IOSTokens.colors.green,
  },
  totalLabel: {
    ...IOSTokens.typography.headline,
    fontSize: 17,
    color: IOSTokens.colors.label,
  },
  totalValue: {
    ...IOSTokens.typography.headline,
    fontSize: 18,
    color: IOSTokens.colors.tint,
  },

  // Primary Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    backgroundColor: IOSTokens.colors.tint,
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },

  // Active Orders List
  ordersListContainer: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.card,
    padding: 16,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumberText: {
    ...IOSTokens.typography.footnote,
    fontWeight: '600',
    color: IOSTokens.colors.labelSecondary,
  },
  orderShopName: {
    ...IOSTokens.typography.headline,
    fontSize: 18,
    color: IOSTokens.colors.label,
    marginTop: 2,
  },
  orderStatusBadge: {
    backgroundColor: IOSTokens.colors.tintSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatusText: {
    ...IOSTokens.typography.caption,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },

  // Tracker
  trackerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOSTokens.colors.separator,
  },
  trackerStep: {
    alignItems: 'center',
    flex: 1,
  },
  trackerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: IOSTokens.colors.labelTertiary,
    marginBottom: 4,
  },
  trackerDotActive: {
    backgroundColor: IOSTokens.colors.tint,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  trackerLine: {
    height: 2,
    flex: 1,
    backgroundColor: IOSTokens.colors.labelTertiary,
    marginTop: -16,
  },
  trackerLineActive: {
    backgroundColor: IOSTokens.colors.tint,
  },
  trackerText: {
    ...IOSTokens.typography.caption,
    fontSize: 11,
    color: IOSTokens.colors.labelSecondary,
  },
  trackerTextActive: {
    ...IOSTokens.typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: IOSTokens.colors.label,
  },

  orderMetaBox: {
    backgroundColor: IOSTokens.colors.fill,
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...IOSTokens.typography.footnote,
    color: IOSTokens.colors.label,
    flex: 1,
  },

  orderItemsSummary: {
    marginBottom: 12,
    gap: 4,
  },
  orderItemRowText: {
    ...IOSTokens.typography.subhead,
    fontSize: 14,
    color: IOSTokens.colors.labelSecondary,
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: IOSTokens.colors.separator,
  },
  orderTotalText: {
    ...IOSTokens.typography.headline,
    color: IOSTokens.colors.label,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: IOSTokens.colors.tintSoft,
  },
  directionsBtnText: {
    ...IOSTokens.typography.subhead,
    fontSize: 13,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: IOSTokens.colors.surface,
    borderRadius: IOSTokens.shape.sheet,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrapper: {
    marginBottom: 12,
  },
  modalTitle: {
    ...IOSTokens.typography.title2,
    color: IOSTokens.colors.label,
    marginBottom: 4,
  },
  modalOrderNum: {
    ...IOSTokens.typography.subhead,
    color: IOSTokens.colors.labelSecondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalBody: {
    ...IOSTokens.typography.body,
    fontSize: 15,
    color: IOSTokens.colors.label,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalPrimaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: IOSTokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    ...IOSTokens.typography.headline,
    fontSize: 16,
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.65,
  },
});
