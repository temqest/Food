import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import QRCode from 'react-native-qrcode-svg';
import { IOSTokens } from '@/constants/theme';

interface StoreSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (plan: 'monthly' | 'annual', method: 'gcash' | 'maya' | 'bank' | 'card') => void;
  currentPlan?: 'monthly' | 'annual' | 'none';
  storeName: string;
}

type PaymentMethod = 'gcash' | 'maya' | 'bank';

interface PlanOption {
  id: 'monthly' | 'annual';
  name: string;
  tagline: string;
  price: number;
  period: string;
  badge?: string;
  savings?: string;
}

const PLANS: PlanOption[] = [
  {
    id: 'monthly',
    name: 'Monthly Partner Pass',
    tagline: 'Flexible, pay-as-you-grow for local carinderias',
    price: 499,
    period: '/ month',
  },
  {
    id: 'annual',
    name: 'Annual Pro Partner',
    tagline: 'Best value for established Naga food businesses',
    price: 4999,
    period: '/ year',
    badge: 'SAVE 20%',
    savings: '2 Months Free (Save ₱989)',
  },
];

export const StoreSubscriptionModal: React.FC<StoreSubscriptionModalProps> = ({
  visible,
  onClose,
  onSuccess,
  currentPlan = 'none',
  storeName,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const activePlanObj = PLANS.find((p) => p.id === selectedPlan) || PLANS[0];

  const handleConfirmSubscription = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onSuccess(selectedPlan, paymentMethod);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.headerBtn} hitSlop={10}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Naga Merchant Pro</Text>
              <Text style={styles.modalSubtitle} numberOfLines={1}>
                {storeName}
              </Text>
            </View>
            <View style={{ width: 50 }} />
          </View>

          {isSuccess ? (
            /* Celebration / Success Screen */
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.successScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-circle" size={54} color="#007DFE" />
                </View>

                <Text style={styles.successHeading}>Welcome to Merchant Pro!</Text>
                <Text style={styles.successSub}>
                  Your store subscription is now active. All capabilities have been fully unlocked across the entire app.
                </Text>

                <View style={styles.successCard}>
                  <View style={styles.successRow}>
                    <Text style={styles.successRowLabel}>SUBSCRIPTION PLAN</Text>
                    <Text style={styles.successRowVal}>{activePlanObj.name}</Text>
                  </View>
                  <View style={styles.successDivider} />
                  <View style={styles.successRow}>
                    <Text style={styles.successRowLabel}>PAYMENT METHOD</Text>
                    <Text style={styles.successRowVal}>{paymentMethod.toUpperCase()}</Text>
                  </View>
                  <View style={styles.successDivider} />
                  <View style={styles.successRow}>
                    <Text style={styles.successRowLabel}>VERIFIED BADGE</Text>
                    <View style={styles.activeCheckRow}>
                      <Ionicons name="checkmark-circle" size={15} color="#007DFE" />
                      <Text style={styles.activeCheckText}>Activated</Text>
                    </View>
                  </View>
                  <View style={styles.successDivider} />
                  <View style={styles.unlockedBlock}>
                    <Text style={styles.successRowLabel}>UNLOCKED CAPABILITIES</Text>
                    <View style={styles.unlockedChipsContainer}>
                      <View style={styles.unlockedChip}>
                        <Ionicons name="checkmark-circle" size={13} color="#2E7D32" />
                        <Text style={styles.unlockedChipText}>Kitchen Orders</Text>
                      </View>
                      <View style={styles.unlockedChip}>
                        <Ionicons name="checkmark-circle" size={13} color="#2E7D32" />
                        <Text style={styles.unlockedChipText}>Store Wallet</Text>
                      </View>
                      <View style={styles.unlockedChip}>
                        <Ionicons name="checkmark-circle" size={13} color="#2E7D32" />
                        <Text style={styles.unlockedChipText}>Promotions</Text>
                      </View>
                      <View style={styles.unlockedChip}>
                        <Ionicons name="checkmark-circle" size={13} color="#2E7D32" />
                        <Text style={styles.unlockedChipText}>3x Feed Boost</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={handleFinish}
                  style={({ pressed }) => [styles.continueBtn, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel="Go to Merchant Dashboard"
                >
                  <Text style={styles.continueBtnText}>Go to Dashboard</Text>
                  <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
                </Pressable>
              </View>
            </ScrollView>
          ) : (
            /* Plan Selection & Checkout Body */
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Value Proposition Hero Strip */}
              <View style={styles.heroStrip}>
                <View style={styles.heroBadge}>
                  <Ionicons name="shield-checkmark" size={13} color="#D42F13" />
                  <Text style={styles.heroBadgeText}>OFFICIAL NAGA EATERY PARTNER</Text>
                </View>
                <Text style={styles.heroTitle}>Unlock Full Business Capabilities</Text>
                <Text style={styles.heroDescription}>
                  Connect directly with Naga City foodies. Accept kitchen orders, build trust with the verified checkmark, cash out earnings daily, and boost discovery.
                </Text>
              </View>

              {/* Step 1: Select Plan */}
              <Text style={styles.sectionHeader}>SELECT SUBSCRIPTION PLAN</Text>
              <View style={styles.plansContainer}>
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <Pressable
                      key={plan.id}
                      onPress={() => setSelectedPlan(plan.id)}
                      style={[styles.planCard, isSelected && styles.planCardActive]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View style={styles.planCardTop}>
                        <View style={styles.planTitleCol}>
                          <View style={styles.planNameRow}>
                            <Text style={styles.planName}>{plan.name}</Text>
                            {plan.badge && (
                              <View style={styles.savingsBadge}>
                                <Text style={styles.savingsBadgeText}>{plan.badge}</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.planTagline}>{plan.tagline}</Text>
                        </View>

                        <View style={styles.radioCircle}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                      </View>

                      <View style={styles.planPriceRow}>
                        <Text style={styles.currencySymbol}>₱</Text>
                        <Text style={styles.planPriceNumber}>{plan.price.toLocaleString()}</Text>
                        <Text style={styles.planPeriod}>{plan.period}</Text>
                      </View>

                      {plan.savings && (
                        <View style={styles.savingsNoteRow}>
                          <Ionicons name="pricetag" size={12} color="#D42F13" />
                          <Text style={styles.savingsNoteText}>{plan.savings}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* 5 Core Capabilities Checklist */}
              <Text style={styles.sectionHeader}>EVERYTHING INCLUDED WITH PRO</Text>
              <View style={styles.perksCard}>
                <View style={styles.perkRow}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#EBF4FF' }]}>
                    <Ionicons name="checkmark-circle" size={16} color="#007DFE" />
                  </View>
                  <View style={styles.perkInfoCol}>
                    <Text style={styles.perkName}>Verified Partner Badge</Text>
                    <Text style={styles.perkDesc}>
                      Blue checkmark displayed prominently on all menus, search cards, and customer pages.
                    </Text>
                  </View>
                </View>

                <View style={styles.perkDivider} />

                <View style={styles.perkRow}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="receipt" size={16} color="#2E7D32" />
                  </View>
                  <View style={styles.perkInfoCol}>
                    <Text style={styles.perkName}>Accept Live Customer Orders</Text>
                    <Text style={styles.perkDesc}>
                      Real-time dine-in passes, pre-orders, and takeout kitchen dispatch with QR voucher scanner.
                    </Text>
                  </View>
                </View>

                <View style={styles.perkDivider} />

                <View style={styles.perkRow}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="wallet" size={16} color="#E65100" />
                  </View>
                  <View style={styles.perkInfoCol}>
                    <Text style={styles.perkName}>Automated Store Wallet &amp; Payouts</Text>
                    <Text style={styles.perkDesc}>
                      Daily order settlements with fast cash out to GCash, Maya, and local Philippine banks.
                    </Text>
                  </View>
                </View>

                <View style={styles.perkDivider} />

                <View style={styles.perkRow}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#FCE4EC' }]}>
                    <Ionicons name="megaphone" size={16} color="#C2185B" />
                  </View>
                  <View style={styles.perkInfoCol}>
                    <Text style={styles.perkName}>Sponsored Foodie Promotions</Text>
                    <Text style={styles.perkDesc}>
                      Launch flash sales, lunch specials, and targeted marketing reach across Naga districts.
                    </Text>
                  </View>
                </View>

                <View style={styles.perkDivider} />

                <View style={styles.perkRow}>
                  <View style={[styles.perkIconBox, { backgroundColor: '#EDE7F6' }]}>
                    <Ionicons name="trending-up" size={16} color="#512DA8" />
                  </View>
                  <View style={styles.perkInfoCol}>
                    <Text style={styles.perkName}>3x Algorithmic Discovery Boost</Text>
                    <Text style={styles.perkDesc}>
                      Priority ranking in Search, Naga Food Quest stops, and the community discovery feed.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Step 2: Payment Method */}
              <Text style={styles.sectionHeader}>PAYMENT METHOD</Text>
              <View style={styles.paymentMethodsContainer}>
                {/* GCash */}
                <Pressable
                  onPress={() => setPaymentMethod('gcash')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'gcash' && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.paymentLeft}>
                    <View style={styles.brandIconWrapper}>
                      <ExpoImage
                        source={require('../../../assets/icons/gcash.svg')}
                        style={styles.brandSvgIcon}
                        contentFit="contain"
                      />
                    </View>
                    <View>
                      <Text style={styles.paymentTitle}>GCash</Text>
                      <Text style={styles.paymentSubtitle}>Instant e-wallet deduction</Text>
                    </View>
                  </View>

                  <View style={styles.radioCircle}>
                    {paymentMethod === 'gcash' && <View style={styles.radioInner} />}
                  </View>
                </Pressable>

                {/* Maya / QR Ph */}
                <Pressable
                  onPress={() => setPaymentMethod('maya')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'maya' && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.paymentLeft}>
                    <View style={styles.brandIconWrapper}>
                      <ExpoImage
                        source={require('../../../assets/icons/maya.svg')}
                        style={styles.brandSvgIcon}
                        contentFit="contain"
                      />
                    </View>
                    <View>
                      <View style={styles.mayaNameRow}>
                        <Text style={styles.paymentTitle}>Maya / QR Ph</Text>
                        <ExpoImage
                          source={require('../../../assets/icons/qr-ph.svg')}
                          style={styles.qrPhBadge}
                          contentFit="contain"
                        />
                      </View>
                      <Text style={styles.paymentSubtitle}>Scan QR code with any Philippine banking app</Text>
                    </View>
                  </View>

                  <View style={styles.radioCircle}>
                    {paymentMethod === 'maya' && <View style={styles.radioInner} />}
                  </View>
                </Pressable>

                {/* Bank / Card */}
                <Pressable
                  onPress={() => setPaymentMethod('bank')}
                  style={[
                    styles.paymentOptionCard,
                    paymentMethod === 'bank' && styles.paymentOptionActive,
                  ]}
                >
                  <View style={styles.paymentLeft}>
                    <View style={[styles.brandIconWrapper, { backgroundColor: '#F3E5F5' }]}>
                      <Ionicons name="card-outline" size={20} color="#7B1FA2" />
                    </View>
                    <View>
                      <Text style={styles.paymentTitle}>Debit / Credit Card &amp; Bank</Text>
                      <Text style={styles.paymentSubtitle}>Visa, Mastercard, BPI, BDO InstaPay</Text>
                    </View>
                  </View>

                  <View style={styles.radioCircle}>
                    {paymentMethod === 'bank' && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              </View>

              {/* If Maya selected, show QR Ph preview shortcut */}
              {paymentMethod === 'maya' && (
                <Pressable
                  onPress={() => setShowQrModal(true)}
                  style={styles.qrPreviewCard}
                >
                  <Ionicons name="qr-code-outline" size={20} color="#000000" />
                  <Text style={styles.qrPreviewText}>
                    Tap to view scannable universal QR Ph code
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#8E8E93" />
                </Pressable>
              )}

              {/* Order Summary & Pricing Breakdown */}
              <Text style={styles.sectionHeader}>PAYMENT SUMMARY</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{activePlanObj.name}</Text>
                  <Text style={styles.summaryVal}>₱{activePlanObj.price.toLocaleString()}.00</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>12% VAT</Text>
                  <Text style={[styles.summaryVal, styles.waivedText]}>Waived (₱0.00)</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Merchant Verification Fee</Text>
                  <Text style={[styles.summaryVal, styles.waivedText]}>Free (₱0.00)</Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.totalRow}>
                  <View>
                    <Text style={styles.totalLabel}>TOTAL DUE TODAY</Text>
                    <Text style={styles.totalPeriodSub}>Renews automatically · Cancel anytime</Text>
                  </View>
                  <Text style={styles.totalPrice}>₱{activePlanObj.price.toLocaleString()}.00</Text>
                </View>
              </View>

              {/* Subscribe Action Button */}
              <Pressable
                onPress={handleConfirmSubscription}
                disabled={isProcessing}
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && styles.pressed,
                  isProcessing && styles.btnDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Confirm and Pay for Naga Merchant Pro"
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>
                      Pay ₱{activePlanObj.price.toLocaleString()} &amp; Unlock Store
                    </Text>
                  </>
                )}
              </Pressable>

              <Text style={styles.disclaimerText}>
                By subscribing, you agree to Naga Food Finder Merchant Partner Terms. You can cancel auto-renewal anytime in your store profile.
              </Text>
              <View style={{ height: 28 }} />
            </ScrollView>
          )}
        </View>
      </View>

      {/* Enlarged QR Ph Modal for Maya / Bank Payments */}
      {showQrModal && (
        <Modal visible={true} transparent={true} animationType="fade" onRequestClose={() => setShowQrModal(false)}>
          <View style={styles.qrModalOverlay}>
            <View style={styles.qrModalCard}>
              <View style={styles.qrModalHeader}>
                <Text style={styles.qrModalTitle}>Merchant Pro QR Ph</Text>
                <Pressable onPress={() => setShowQrModal(false)} hitSlop={10}>
                  <Ionicons name="close" size={22} color="#000000" />
                </Pressable>
              </View>

              <Text style={styles.qrModalSub}>
                Scan using GCash, Maya, BDO, BPI, or any QR Ph compliant app.
              </Text>

              <View style={styles.qrContainer}>
                <QRCode
                  value={`QRPH:NAGA-PARTNER:SUB:${selectedPlan}:${activePlanObj.price}`}
                  size={180}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />
              </View>

              <Text style={styles.qrAmountText}>₱{activePlanObj.price.toLocaleString()}.00</Text>
              <Text style={styles.qrRefText}>REF: NAGA-PRO-{Date.now().toString().slice(-6)}</Text>

              <Pressable
                onPress={() => setShowQrModal(false)}
                style={styles.closeQrBtn}
              >
                <Text style={styles.closeQrBtnText}>I Have Completed the Payment</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
    height: '90%',
    maxHeight: '94%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    maxWidth: 600,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
      } as any,
      default: {
        elevation: 20,
      },
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
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
  },
  modalSubtitle: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  modalBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  heroStrip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF2EE',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  heroDescription: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.75)',
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.1,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  plansContainer: {
    gap: 10,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#EFEFF4',
  },
  planCardActive: {
    borderColor: '#D42F13',
    backgroundColor: '#FFFBFB',
  },
  planCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  planTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  savingsBadge: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  savingsBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  planTagline: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.65)',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D42F13',
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  planPriceNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginRight: 4,
  },
  planPeriod: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  savingsNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  savingsNoteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  perksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  perkIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  perkInfoCol: {
    flex: 1,
  },
  perkName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  perkDesc: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.7)',
    lineHeight: 16,
  },
  perkDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 10,
  },
  paymentMethodsContainer: {
    gap: 8,
    marginBottom: 10,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#EFEFF4',
  },
  paymentOptionActive: {
    borderColor: '#D42F13',
    backgroundColor: '#FFFBFB',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  brandIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSvgIcon: {
    width: 28,
    height: 28,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  paymentSubtitle: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  mayaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrPhBadge: {
    width: 38,
    height: 16,
  },
  qrPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  qrPreviewText: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.75)',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  waivedText: {
    color: '#2E7D32',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EFEFF4',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.3,
  },
  totalPeriodSub: {
    fontSize: 10,
    color: 'rgba(60, 60, 67, 0.55)',
    marginTop: 1,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D42F13',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(212, 47, 19, 0.3)',
      } as any,
    }),
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  disclaimerText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.55)',
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 8,
  },
  /* Success Styles */
  successContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successIconCircle: {
    marginBottom: 12,
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 6,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.75)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 320,
  },
  successCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  successScrollContent: {
    paddingBottom: 40,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  successRowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.2,
  },
  successRowVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    flexShrink: 1,
    textAlign: 'right',
  },
  activeCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeCheckText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#007DFE',
  },
  unlockedBlock: {
    marginTop: 2,
  },
  unlockedChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  unlockedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  unlockedChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  successDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 10,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* QR Modal */
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrModalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  qrModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  qrModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
  },
  qrModalSub: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.65)',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginBottom: 12,
  },
  qrAmountText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
  },
  qrRefText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 16,
    marginTop: 2,
  },
  closeQrBtn: {
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeQrBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
