import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import QRCode from 'react-native-qrcode-svg';
import { useBasket, PreOrder } from '@/context/BasketContext';
import { useAuth } from '@/context/AuthContext';

type PaymentMode = 'cash' | 'gcash' | 'maya';

export default function PaymentScreen() {
  const {
    items,
    getBasketCount,
    getBasketSubtotal,
    diningOption,
    pickupTimeSlot,
    specialInstructions,
    placePreOrder,
  } = useBasket();
  const { user } = useAuth();

  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [customerName, setCustomerName] = useState(user?.name || 'Maria Santos');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '0917 842 9102');
  const [isProcessing, setIsProcessing] = useState(false);

  // QR Code Modal for Payment
  const [showPaymentQrModal, setShowPaymentQrModal] = useState(false);

  // Success Modal
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PreOrder | null>(null);

  const subtotal = getBasketSubtotal();
  const fee = 0; // Free reservation
  const total = subtotal + fee;
  const basketCount = getBasketCount();

  const firstItem = items[0];
  const establishmentName = firstItem?.establishmentName || 'Partner Carinderia';
  const establishmentAddress = firstItem?.establishmentAddress || 'Naga City';

  const handleProcessPayment = () => {
    if (items.length === 0) {
      Alert.alert('Empty Basket', 'Your basket has no items. Please select a dish first.');
      router.replace('/basket');
      return;
    }

    if (!customerName.trim()) {
      Alert.alert('Name Required', 'Please enter your full name for the order pass.');
      return;
    }

    setIsProcessing(true);

    // Simulate instant secure payment gateway turnaround (600ms)
    setTimeout(() => {
      setIsProcessing(false);
      const refNumber =
        paymentMode !== 'cash'
          ? `${paymentMode.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`
          : undefined;

      const order = placePreOrder({
        method: paymentMode,
        refNumber,
      });

      if (order) {
        setConfirmedOrder(order);
        setSuccessModalVisible(true);
      }
    }, 600);
  };

  const handleFinishAndOpenPass = () => {
    setSuccessModalVisible(false);
    router.replace('/basket');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right', 'bottom']}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to Basket"
        >
          <Ionicons name="arrow-back" size={20} color="#111111" />
        </Pressable>
        <Text style={styles.navTitle}>Payment & Checkout</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 2 of 2</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        <View style={styles.mainContainer}>
          {/* Order Summary Overview Card */}
          <View style={styles.summaryHeroCard}>
            <View style={styles.summaryHeaderRow}>
              <View style={styles.estIconBox}>
                <Ionicons name="storefront" size={20} color="#D42F13" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.estNameText} numberOfLines={1}>
                  {establishmentName}
                </Text>
                <Text style={styles.estAddressText} numberOfLines={1}>
                  {establishmentAddress}
                </Text>
              </View>
            </View>

            <View style={styles.summaryMetaRow}>
              <View style={styles.metaChip}>
                <Ionicons
                  name={diningOption === 'takeout' ? 'bag-handle' : 'restaurant'}
                  size={12}
                  color="#111111"
                />
                <Text style={styles.metaChipText}>
                  {diningOption === 'takeout' ? 'Takeout Box' : 'Dine-In Pass'}
                </Text>
              </View>

              <View style={styles.metaChip}>
                <Ionicons name="time-outline" size={12} color="#111111" />
                <Text style={styles.metaChipText}>{pickupTimeSlot}</Text>
              </View>

              <View style={styles.metaChip}>
                <Ionicons name="cart-outline" size={12} color="#111111" />
                <Text style={styles.metaChipText}>{basketCount} items</Text>
              </View>
            </View>

            <View style={styles.totalHeroRow}>
              <Text style={styles.totalHeroLabel}>Total Amount Due:</Text>
              <Text style={styles.totalHeroValue}>₱{total}</Text>
            </View>
          </View>

          {/* Section: Select Payment Method */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Select Payment Method</Text>
          </View>

          {/* Option 1: Cash on Arrival / Pay at Counter */}
          <Pressable
            onPress={() => setPaymentMode('cash')}
            style={[
              styles.paymentOptionCard,
              paymentMode === 'cash' && styles.paymentOptionCardActive,
            ]}
          >
            <View style={styles.paymentRadioCol}>
              <View
                style={[
                  styles.radioButton,
                  paymentMode === 'cash' && styles.radioButtonActive,
                ]}
              >
                {paymentMode === 'cash' && <View style={styles.radioDot} />}
              </View>
            </View>
            <View style={[styles.methodIconBadge, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="cash-outline" size={22} color="#2E7D32" />
            </View>
            <View style={styles.methodDetails}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.methodTitle}>Cash on Arrival</Text>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>POPULAR</Text>
                </View>
              </View>
              <Text style={styles.methodSubtitle}>
                Pay when you arrive at the store. Exact change or cash accepted.
              </Text>
            </View>
          </Pressable>

          {/* Option 2: GCash */}
          <Pressable
            onPress={() => setPaymentMode('gcash')}
            style={[
              styles.paymentOptionCard,
              paymentMode === 'gcash' && styles.paymentOptionCardActive,
            ]}
          >
            <View style={styles.paymentRadioCol}>
              <View
                style={[
                  styles.radioButton,
                  paymentMode === 'gcash' && styles.radioButtonActive,
                ]}
              >
                {paymentMode === 'gcash' && <View style={styles.radioDot} />}
              </View>
            </View>
            <View style={[styles.methodIconBadge, { backgroundColor: '#EBF4FF' }]}>
              <ExpoImage
                source={require('../../assets/icons/gcash.svg')}
                style={{ width: 28, height: 24 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.methodDetails}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.methodTitle}>GCash</Text>
                <View style={[styles.popularBadge, { backgroundColor: '#EBF4FF' }]}>
                  <Text style={[styles.popularBadgeText, { color: '#007AFF' }]}>E-WALLET</Text>
                </View>
              </View>
              <Text style={styles.methodSubtitle}>
                Instant contactless payment via your GCash wallet.
              </Text>
            </View>
          </Pressable>

          {/* Option 3: Maya / QR Ph Universal Payment */}
          <Pressable
            onPress={() => {
              setPaymentMode('maya');
              setShowPaymentQrModal(true);
            }}
            style={[
              styles.paymentOptionCard,
              paymentMode === 'maya' && styles.paymentOptionCardActive,
            ]}
          >
            <View style={styles.paymentRadioCol}>
              <View
                style={[
                  styles.radioButton,
                  paymentMode === 'maya' && styles.radioButtonActive,
                ]}
              >
                {paymentMode === 'maya' && <View style={styles.radioDot} />}
              </View>
            </View>
            <View style={[styles.methodIconBadge, { backgroundColor: '#F0FDF4' }]}>
              <ExpoImage
                source={require('../../assets/icons/maya.svg')}
                style={{ width: 34, height: 16 }}
                contentFit="contain"
              />
            </View>
            <View style={styles.methodDetails}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.methodTitle}>Maya / QR Ph</Text>
                <View style={[styles.popularBadge, { backgroundColor: '#E0F2F1' }]}>
                  <Text style={[styles.popularBadgeText, { color: '#00897B' }]}>NATIONAL QR</Text>
                </View>
              </View>
              <Text style={styles.methodSubtitle}>
                Scan with Maya, GCash, BPI, BDO, UnionBank, or any BSP QR Ph banking app.
              </Text>
            </View>
          </Pressable>

          {/* QR Ph Live Generator when Maya is active */}
          {paymentMode === 'maya' && (
            <View style={styles.subFieldContainer}>
              <View style={styles.qrPhContainer}>
                <Pressable
                  onPress={() => setShowPaymentQrModal(true)}
                  style={({ pressed }) => [styles.qrPhCodeCard, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Enlarge Payment QR code"
                >
                  <QRCode
                    value={`00020101021226500010ph.qrph0115NAGAFOOD${total}520458125303608540${total}5802PH5912NAGA_EATS6004NAGA6304`}
                    size={96}
                    color="#111111"
                    backgroundColor="#FFFFFF"
                  />
                  <View style={styles.qrEnlargeHintRow}>
                    <Ionicons name="expand" size={11} color="#00897B" />
                    <Text style={styles.qrEnlargeHintText}>Tap to enlarge</Text>
                  </View>
                </Pressable>

                <View style={styles.qrPhDetailsCol}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <ExpoImage
                      source={require('../../assets/icons/qr-ph.svg')}
                      style={{ width: 56, height: 16 }}
                      contentFit="contain"
                    />
                    <ExpoImage
                      source={require('../../assets/icons/maya.svg')}
                      style={{ width: 38, height: 12 }}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.qrPhTitle}>QR Ph Universal Pass</Text>
                  <Text style={styles.qrPhDesc}>
                    Merchant: {establishmentName}{'\n'}
                    Pay: ₱{total}
                  </Text>
                  <Pressable
                    onPress={() => setShowPaymentQrModal(true)}
                    style={({ pressed }) => [styles.openQrModalBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="qr-code" size={13} color="#FFFFFF" />
                    <Text style={styles.openQrModalBtnText}>Show Payment QR</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* Customer Pass Contact Information */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Customer Details for Digital Pass</Text>
          </View>
          <View style={styles.customerDetailsCard}>
            <View style={styles.customerInputRow}>
              <Text style={styles.customerLabel}>Full Name</Text>
              <TextInput
                style={styles.customerInput}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Your full name"
                placeholderTextColor="#8E8E93"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.customerInputRow}>
              <Text style={styles.customerLabel}>Contact Number</Text>
              <TextInput
                style={styles.customerInput}
                value={customerPhone}
                onChangeText={setCustomerPhone}
                placeholder="09XX XXX XXXX"
                placeholderTextColor="#8E8E93"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Itemized Order Recap */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Order Summary</Text>
          </View>
          <View style={styles.billCard}>
            {items.map((it) => (
              <View key={it.id} style={styles.billItemRow}>
                <Text style={styles.billItemQty}>{it.quantity}×</Text>
                <Text style={styles.billItemName} numberOfLines={1}>
                  {it.foodName}
                </Text>
                <Text style={styles.billItemPrice}>₱{it.price * it.quantity}</Text>
              </View>
            ))}
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₱{subtotal}</Text>
            </View>
            <View style={styles.billRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.billLabel}>Reservation Service Fee</Text>
                <View style={styles.freePill}>
                  <Text style={styles.freePillText}>FREE PROMO</Text>
                </View>
              </View>
              <Text style={[styles.billValue, { color: '#34C759' }]}>₱0</Text>
            </View>
            <View style={styles.billDivider} />
            <View style={styles.billRowTotal}>
              <Text style={styles.totalLabel}>Total Payment</Text>
              <Text style={styles.totalValue}>₱{total}</Text>
            </View>
          </View>

          {/* Submit Action Button */}
          <Pressable
            onPress={handleProcessPayment}
            disabled={isProcessing}
            style={({ pressed }) => [
              styles.payBtn,
              isProcessing && { opacity: 0.7 },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.payBtnText}>
              {isProcessing
                ? 'Securing Pass...'
                : paymentMode === 'cash'
                ? `Confirm with Cash on Arrival (₱${total})`
                : paymentMode === 'gcash'
                ? `Pay with GCash · ₱${total}`
                : `Complete with Maya / QR Ph · ₱${total}`}
            </Text>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Universal QR Ph Payment Modal */}
      <Modal visible={showPaymentQrModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.qrPaymentModalCard}>
            <View style={styles.qrPaymentModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ExpoImage
                  source={require('../../assets/icons/qr-ph.svg')}
                  style={{ width: 76, height: 20 }}
                  contentFit="contain"
                />
                <ExpoImage
                  source={require('../../assets/icons/maya.svg')}
                  style={{ width: 48, height: 14 }}
                  contentFit="contain"
                />
              </View>
              <Pressable onPress={() => setShowPaymentQrModal(false)} hitSlop={10}>
                <Ionicons name="close-circle" size={26} color="#8E8E93" />
              </Pressable>
            </View>

            <Text style={styles.qrPaymentTitle}>Scan to Pay</Text>
            <Text style={styles.qrPaymentSub}>
              Present or scan with your banking or wallet app.
            </Text>

            <View style={styles.qrPaymentBigWrapper}>
              <QRCode
                value={`00020101021226500010ph.qrph0115NAGAFOOD${total}520458125303608540${total}5802PH5912NAGA_EATS6004NAGA6304`}
                size={190}
                color="#111111"
                backgroundColor="#FFFFFF"
              />
            </View>

            <View style={styles.qrPaymentAmountRow}>
              <Text style={styles.qrPaymentAmountLabel}>Total Amount:</Text>
              <Text style={styles.qrPaymentAmountValue}>₱{total}</Text>
            </View>

            <View style={styles.qrMerchantCard}>
              <Text style={styles.qrMerchantName} numberOfLines={1}>{establishmentName}</Text>
              <Text style={styles.qrMerchantLoc} numberOfLines={1}>{establishmentAddress}</Text>
            </View>

            <Pressable
              onPress={() => {
                setShowPaymentQrModal(false);
                handleProcessPayment();
              }}
              style={styles.qrModalConfirmBtn}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.qrModalConfirmText}>
                Confirm Paid via QR (₱{total})
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Payment / Pass Confirmation Success Modal */}
      <Modal visible={successModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSuccessCard}>
            <View style={styles.successIconBadge}>
              <Ionicons name="checkmark-circle" size={54} color="#34C759" />
            </View>
            <Text style={styles.successTitle}>Order Pass Confirmed!</Text>
            <Text style={styles.successDesc}>
              Your expedition order has been sent to{' '}
              <Text style={{ fontWeight: '700', color: '#111111' }}>
                {confirmedOrder?.establishmentName}
              </Text>
              .
            </Text>

            <View style={styles.orderSummaryPill}>
              <Text style={styles.orderSummaryPillLabel}>ORDER PASS NUMBER</Text>
              <Text style={styles.orderSummaryPillValue}>{confirmedOrder?.orderNumber}</Text>
              {confirmedOrder?.paymentRefNumber ? (
                <Text style={styles.orderRefText}>
                  Ref: {confirmedOrder.paymentRefNumber}
                </Text>
              ) : (
                <Text style={styles.orderRefText}>Payment: Cash upon Arrival</Text>
              )}
            </View>

            <Pressable
              onPress={handleFinishAndOpenPass}
              style={styles.modalDoneBtn}
            >
              <Text style={styles.modalDoneBtnText}>View My Digital Pass</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  stepBadge: {
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  // Summary Hero Card
  summaryHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  estIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  estAddressText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  summaryMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
  },
  totalHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  totalHeroLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
  },
  totalHeroValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D42F13',
    letterSpacing: -0.5,
  },

  sectionHeaderRow: {
    marginTop: 6,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Payment Options
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    marginBottom: 10,
    gap: 12,
  },
  paymentOptionCardActive: {
    borderColor: '#D42F13',
    backgroundColor: '#FFFBFB',
  },
  paymentRadioCol: {
    justifyContent: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonActive: {
    borderColor: '#D42F13',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D42F13',
  },
  methodIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  popularBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    lineHeight: 16,
  },

  subFieldContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: -4,
    marginBottom: 12,
  },
  subFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
  },
  subFieldNotice: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 6,
  },

  qrPhContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qrPhCodeCard: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  qrEnlargeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  qrEnlargeHintText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#00897B',
  },
  qrPhDetailsCol: {
    flex: 1,
  },
  qrPhTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00897B',
  },
  qrPhDesc: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
    lineHeight: 15,
  },
  openQrModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#00897B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  openQrModalBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // QR Modal Styles
  qrPaymentModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 16px 40px rgba(0,0,0,0.22)' } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  qrPaymentModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  qrPhHeaderBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qrPhHeaderBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#00897B',
    letterSpacing: 0.5,
  },
  qrPaymentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  qrPaymentSub: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 8,
  },
  qrPaymentBigWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0F2F1',
    marginVertical: 14,
  },
  qrPaymentAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  qrPaymentAmountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  qrPaymentAmountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D42F13',
  },
  qrMerchantCard: {
    width: '100%',
    backgroundColor: '#F9F9FB',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  qrMerchantName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  qrMerchantLoc: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 1,
  },
  qrModalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00897B',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
  },
  qrModalConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Customer Details
  customerDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
  },
  customerInputRow: {
    paddingVertical: 4,
  },
  customerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 2,
  },
  customerInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 6,
  },

  // Bill Card
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },
  billItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  billItemQty: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
    width: 22,
  },
  billItemName: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },
  billItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  billLabel: {
    fontSize: 13,
    color: '#666666',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  freePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  freePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2E7D32',
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D42F13',
  },

  // Action Button
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D42F13',
    paddingVertical: 16,
    borderRadius: 16,
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
  payBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
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
  orderRefText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '700',
    marginTop: 4,
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
});
