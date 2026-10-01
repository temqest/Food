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
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { NavBar } from '@/components/common/NavBar';
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

  const primaryItem = items.length > 0 ? items[0] : null;

  const handlePlaceOrder = () => {
    const newOrder = placePreOrder();
    if (newOrder) {
      setPlacedOrder(newOrder);
      setConfirmModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Top Editorial Title & Header */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text style={styles.headingSans}>
                Your <Text style={styles.headingSerif}>basket</Text>
              </Text>
              {items.length > 0 && activeTabSection === 'current' && (
                <Pressable
                  onPress={clearBasket}
                  style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
                  hitSlop={8}
                >
                  <Text style={styles.clearBtnText}>Clear</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.subheadText}>
              Pre-order authentic dishes from local kitchens for immediate counter pickup.
            </Text>
          </View>

          {/* Segmented Control: Current Cart vs Active Orders */}
          <View style={styles.segmentWrapper}>
            <View style={styles.segmentContainer}>
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
                      size={36}
                      color="#8E8E93"
                    />
                  </View>
                  <Text style={styles.emptyTitle}>Your Basket is Empty</Text>
                  <Text style={styles.emptyDesc}>
                    Pre-order Bicol delicacies like Kinalas, Pinangat, or Toasted Siopao from local Naga food spots.
                  </Text>
                  <Pressable
                    onPress={() => router.push('/explore')}
                    style={({ pressed }) => [styles.emptyActionBtn, pressed && styles.primaryPressed]}
                  >
                    <Text style={styles.emptyActionText}>Browse Food Spots</Text>
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
                              size={20}
                              color="#000000"
                            />
                          </View>
                          <View style={styles.shopInfo}>
                            <Text style={styles.shopName}>{primaryItem.establishmentName}</Text>
                            <Text style={styles.shopAddress} numberOfLines={1}>
                              {primaryItem.establishmentAddress}
                            </Text>
                            <View style={styles.shopStatusBadge}>
                              <View style={styles.statusDot} />
                              <Text style={styles.statusBadgeText}>Open for Instant Pre-Order</Text>
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
                              size={14}
                              color={isSelected ? '#FFFFFF' : '#8E8E93'}
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

                              {/* Stepper (- qty +) */}
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
                                    size={15}
                                    color={item.quantity === 1 ? '#FF3B30' : '#000000'}
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
                                    size={15}
                                    color="#000000"
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
                        placeholder="Add notes for the kitchen (e.g. extra sili, broth on side)..."
                        placeholderTextColor="#8E8E93"
                        style={styles.instructionInput}
                        multiline
                        numberOfLines={2}
                      />
                    </View>
                  </View>

                  {/* Summary Block */}
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
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
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
                    accessibilityRole="button"
                    accessibilityLabel={`Place pre-order for ${total} pesos`}
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
                      size={36}
                      color="#8E8E93"
                    />
                  </View>
                  <Text style={styles.emptyTitle}>No Active Orders</Text>
                  <Text style={styles.emptyDesc}>
                    When you place a pre-order, you can track real-time kitchen preparation status and pickup windows right here.
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
                            size={15}
                            color="#8E8E93"
                          />
                          <Text style={styles.metaText}>
                            Pickup: {order.pickupTimeSlot}
                          </Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Ionicons
                            name="location-outline"
                            size={15}
                            color="#8E8E93"
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
                            size={13}
                            color="#111111"
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.directionsBtnText}>Directions</Text>
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
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="checkmark-circle" size={56} color="#34C759" />
            </View>

            <Text style={styles.modalTitle}>
              Pre-Order <Text style={styles.headingSerif}>confirmed</Text>
            </Text>
            <Text style={styles.modalOrderNum}>{placedOrder?.orderNumber}</Text>
            <Text style={styles.modalBody}>
              Your order has been sent to{' '}
              <Text style={{ fontWeight: '700', color: '#000000' }}>{placedOrder?.establishmentName}</Text>.
              It will be freshly prepared and ready for pickup at{' '}
              <Text style={{ fontWeight: '700', color: '#000000' }}>{placedOrder?.pickupTimeSlot}</Text>.
            </Text>

            <Pressable
              onPress={() => setConfirmModalVisible(false)}
              style={({ pressed }) => [styles.modalPrimaryBtn, pressed && styles.primaryPressed]}
            >
              <Text style={styles.modalPrimaryBtnText}>Track Order Progress</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <NavBar currentTab="basket" />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
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
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearBtnText: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#D42F13',
    fontWeight: '600',
  },

  // Segmented Control
  segmentWrapper: {
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 12,
    padding: 3,
    height: 40,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      } as any,
    }),
  },
  segmentText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  segmentTextActive: {
    color: '#000000',
    fontWeight: '700',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  emptyDesc: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
    marginBottom: 20,
  },
  emptyActionBtn: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActionText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // Section Blocks & Inset Group
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
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  shopAddress: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
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
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  statusBadgeText: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#34C759',
    fontWeight: '600',
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
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  slotPillSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  slotPillText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  slotPillTextSelected: {
    color: '#FFFFFF',
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
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
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
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  itemPrice: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#D42F13',
    marginTop: 2,
  },
  itemNote: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
    fontStyle: 'italic',
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 3,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    paddingHorizontal: 10,
  },

  // Input
  instructionInput: {
    fontFamily: sansFamily,
    fontSize: 14,
    padding: 14,
    color: '#000000',
    minHeight: 60,
  },

  // Summary Rows
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  summaryRowTotal: {
    borderBottomWidth: 0,
    paddingVertical: 14,
  },
  summaryLabel: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#6E6E73',
  },
  summaryValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  summaryValueFree: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#34C759',
  },
  totalLabel: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  totalValue: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },

  // Primary Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111111',
    marginTop: 4,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  // Active Orders List
  ordersListContainer: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumberText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  orderShopName: {
    fontFamily: sansFamily,
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginTop: 2,
  },
  orderStatusBadge: {
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  orderStatusText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Tracker
  trackerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  trackerStep: {
    alignItems: 'center',
    flex: 1,
  },
  trackerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C7C7CC',
    marginBottom: 4,
  },
  trackerDotActive: {
    backgroundColor: '#111111',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  trackerLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#E5E5EA',
    marginTop: -16,
  },
  trackerLineActive: {
    backgroundColor: '#111111',
  },
  trackerText: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
  },
  trackerTextActive: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },

  orderMetaBox: {
    backgroundColor: '#F2F2F7',
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
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#000000',
    flex: 1,
  },

  orderItemsSummary: {
    marginBottom: 12,
    gap: 4,
  },
  orderItemRowText: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#6E6E73',
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(60, 60, 67, 0.15)',
  },
  orderTotalText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  directionsBtnText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrapper: {
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: sansFamily,
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  modalOrderNum: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
    marginBottom: 12,
  },
  modalBody: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  modalPrimaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  pressed: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
