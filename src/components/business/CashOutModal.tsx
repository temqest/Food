import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { IOSTokens } from '@/constants/theme';

interface CashOutModalProps {
  visible: boolean;
  availableBalance: number;
  onClose: () => void;
  onConfirmCashOut: (
    amount: number,
    method: 'gcash' | 'maya' | 'bank',
    account: string,
    accountName: string
  ) => boolean;
}

type PayoutChannel = 'gcash' | 'maya' | 'bank';

export const CashOutModal: React.FC<CashOutModalProps> = ({
  visible,
  availableBalance,
  onClose,
  onConfirmCashOut,
}) => {
  const [amountStr, setAmountStr] = useState('2500');
  const [selectedChannel, setSelectedChannel] = useState<PayoutChannel>('gcash');
  const [accountNumber, setAccountNumber] = useState('0917 555 8291');
  const [accountName, setAccountName] = useState('Cha Cha Eatery');
  const [selectedBank, setSelectedBank] = useState<'BDO' | 'BPI' | 'Landbank'>('BDO');

  const parsedAmount = parseFloat(amountStr) || 0;
  const isOverBalance = parsedAmount > availableBalance;
  const isBelowMin = parsedAmount < 100;
  const isValidAmount = parsedAmount >= 100 && parsedAmount <= availableBalance;

  const quickAmounts = [1000, 2500, 5000, availableBalance];

  const handleChannelSelect = (channel: PayoutChannel) => {
    setSelectedChannel(channel);
    if (channel === 'gcash') {
      setAccountNumber('0917 555 8291');
    } else if (channel === 'maya') {
      setAccountNumber('0918 555 3942');
    } else {
      setAccountNumber('0048 2910 5821');
    }
  };

  const handleConfirm = () => {
    if (!isValidAmount) {
      if (isOverBalance) {
        Alert.alert('Amount Exceeds Balance', `Maximum available is ₱${availableBalance.toLocaleString()}.`);
      } else {
        Alert.alert('Minimum Payout', 'The minimum cashout amount is ₱100.');
      }
      return;
    }

    if (!accountNumber.trim()) {
      Alert.alert('Missing Account', 'Please provide your account or mobile number.');
      return;
    }

    const channelDisplay =
      selectedChannel === 'bank' ? `${selectedBank} (${accountNumber})` : accountNumber;

    const success = onConfirmCashOut(
      parsedAmount,
      selectedChannel,
      channelDisplay,
      accountName.trim() || 'Store Account'
    );

    if (success) {
      Alert.alert(
        'Payout Initiated!',
        `₱${parsedAmount.toLocaleString()} has been sent to your ${selectedChannel.toUpperCase()} (${accountNumber}). Funds should reflect within 5 minutes.`,
        [{ text: 'Awesome', onPress: onClose }]
      );
    } else {
      Alert.alert('Error', 'Unable to process payout. Please check your balance.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.headerBtn} hitSlop={8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Cash Out Earnings</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Available Balance Reminder */}
            <View style={styles.availableBox}>
              <Text style={styles.availableLabel}>AVAILABLE BALANCE</Text>
              <Text style={styles.availableAmount}>
                ₱{availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>

            {/* Amount Input */}
            <Text style={styles.sectionTitle}>CASHOUT AMOUNT</Text>
            <View style={[styles.amountInputCard, isOverBalance && styles.amountCardError]}>
              <Text style={styles.amountPrefix}>₱</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={amountStr}
                onChangeText={(val) => setAmountStr(val.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                placeholderTextColor="rgba(60, 60, 67, 0.4)"
              />
            </View>

            {isOverBalance ? (
              <Text style={styles.errorText}>Amount exceeds available balance</Text>
            ) : isBelowMin ? (
              <Text style={styles.infoHintText}>Minimum payout amount is ₱100.00</Text>
            ) : null}

            {/* Quick Chips */}
            <View style={styles.chipsRow}>
              {quickAmounts.map((amt, idx) => {
                const isSelected = parsedAmount === amt;
                const isMax = idx === quickAmounts.length - 1;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => setAmountStr(amt.toString())}
                    style={[styles.quickChip, isSelected && styles.quickChipActive]}
                  >
                    <Text style={[styles.quickChipText, isSelected && styles.quickChipTextActive]}>
                      {isMax ? 'Max All' : `₱${amt.toLocaleString()}`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Payout Channel Selection */}
            <Text style={styles.sectionTitle}>RECEIVING ACCOUNT</Text>
            <View style={styles.channelGrid}>
              {/* GCash */}
              <Pressable
                onPress={() => handleChannelSelect('gcash')}
                style={[
                  styles.channelCard,
                  selectedChannel === 'gcash' && styles.channelCardActive,
                ]}
              >
                <View style={[styles.channelIconCircle, { backgroundColor: '#EBF4FF' }]}>
                  <ExpoImage
                    source={require('../../../assets/icons/gcash.svg')}
                    style={{ width: 26, height: 22 }}
                    contentFit="contain"
                  />
                </View>
                <View style={styles.channelMeta}>
                  <Text style={styles.channelTitle}>GCash E-Wallet</Text>
                  <Text style={styles.channelSubtitle}>Instant 24/7 Transfer</Text>
                </View>
                {selectedChannel === 'gcash' && (
                  <Ionicons name="checkmark-circle" size={20} color={IOSTokens.colors.tint} />
                )}
              </Pressable>

              {/* Maya */}
              <Pressable
                onPress={() => handleChannelSelect('maya')}
                style={[
                  styles.channelCard,
                  selectedChannel === 'maya' && styles.channelCardActive,
                ]}
              >
                <View style={[styles.channelIconCircle, { backgroundColor: '#F0FDF4' }]}>
                  <ExpoImage
                    source={require('../../../assets/icons/maya.svg')}
                    style={{ width: 30, height: 16 }}
                    contentFit="contain"
                  />
                </View>
                <View style={styles.channelMeta}>
                  <Text style={styles.channelTitle}>Maya Wallet</Text>
                  <Text style={styles.channelSubtitle}>Instant Settlement</Text>
                </View>
                {selectedChannel === 'maya' && (
                  <Ionicons name="checkmark-circle" size={20} color={IOSTokens.colors.tint} />
                )}
              </Pressable>

              {/* Bank Transfer */}
              <Pressable
                onPress={() => handleChannelSelect('bank')}
                style={[
                  styles.channelCard,
                  selectedChannel === 'bank' && styles.channelCardActive,
                ]}
              >
                <View style={[styles.channelIconCircle, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="business-outline" size={18} color="#6A1B9A" />
                </View>
                <View style={styles.channelMeta}>
                  <Text style={styles.channelTitle}>Philippine Bank Transfer</Text>
                  <Text style={styles.channelSubtitle}>BDO, BPI, Landbank via InstaPay</Text>
                </View>
                {selectedChannel === 'bank' && (
                  <Ionicons name="checkmark-circle" size={20} color={IOSTokens.colors.tint} />
                )}
              </Pressable>
            </View>

            {/* Channel-Specific Form Fields */}
            <View style={styles.accountFormCard}>
              {selectedChannel === 'bank' && (
                <View style={styles.bankPickerRow}>
                  {(['BDO', 'BPI', 'Landbank'] as const).map((b) => (
                    <Pressable
                      key={b}
                      onPress={() => setSelectedBank(b)}
                      style={[styles.bankChoicePill, selectedBank === b && styles.bankChoiceActive]}
                    >
                      <Text
                        style={[
                          styles.bankChoiceText,
                          selectedBank === b && styles.bankChoiceTextActive,
                        ]}
                      >
                        {b}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <View style={styles.formInputRow}>
                <Text style={styles.formLabel}>
                  {selectedChannel === 'bank' ? 'Account Number' : 'Mobile Number'}
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder={selectedChannel === 'bank' ? '0048 2910 5821' : '0917 ••• ••••'}
                  placeholderTextColor="rgba(60, 60, 67, 0.4)"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.formInputRow, styles.formInputRowLast]}>
                <Text style={styles.formLabel}>Account Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="Registered Owner / Store Name"
                  placeholderTextColor="rgba(60, 60, 67, 0.4)"
                />
              </View>
            </View>

            {/* Fee & Arrival Summary */}
            <Text style={styles.sectionTitle}>SETTLEMENT SUMMARY</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gross Withdrawal</Text>
                <Text style={styles.summaryValue}>₱{parsedAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Transfer Fee</Text>
                <Text style={styles.freeFeeText}>₱0.00 (Promo Free)</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Arrival</Text>
                <Text style={styles.summaryValue}>Instant (within 5 mins)</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Net Payout Total</Text>
                <Text style={styles.summaryTotalAmount}>₱{parsedAmount.toLocaleString()}</Text>
              </View>
            </View>

            {/* Confirm CTA */}
            <Pressable
              onPress={handleConfirm}
              disabled={!isValidAmount}
              style={({ pressed }) => [
                styles.confirmBtn,
                !isValidAmount && styles.confirmBtnDisabled,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Confirm and submit payout"
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.confirmBtnText}>
                Confirm Cashout of ₱{parsedAmount.toLocaleString()}
              </Text>
            </Pressable>
            <View style={{ height: 28 }} />
          </ScrollView>
        </View>
      </View>
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
    height: '88%',
    maxHeight: '92%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    maxWidth: 600,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  modalBody: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    paddingBottom: 60,
  },
  availableBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  availableLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  availableAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#34C759',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.08,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  amountInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  amountCardError: {
    borderColor: '#FF3B30',
  },
  amountPrefix: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  infoHintText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  quickChipActive: {
    backgroundColor: IOSTokens.colors.tint,
    borderColor: IOSTokens.colors.tint,
  },
  quickChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  quickChipTextActive: {
    color: '#FFFFFF',
  },
  channelGrid: {
    gap: 8,
    marginBottom: 12,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  channelCardActive: {
    borderColor: IOSTokens.colors.tint,
    backgroundColor: '#FFF8F6',
  },
  channelIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  channelMeta: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  channelSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  accountFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  bankPickerRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    backgroundColor: '#F9F9FB',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  bankChoicePill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  bankChoiceActive: {
    backgroundColor: '#6A1B9A',
    borderColor: '#6A1B9A',
  },
  bankChoiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  bankChoiceTextActive: {
    color: '#FFFFFF',
  },
  formInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  formInputRowLast: {
    borderBottomWidth: 0,
  },
  formLabel: {
    fontSize: 14,
    color: '#000000',
    width: 125,
  },
  formInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    textAlign: 'right',
    padding: 0,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.7)',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  freeFeeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34C759',
  },
  summaryDivider: {
    height: 0.5,
    backgroundColor: 'rgba(60, 60, 67, 0.15)',
    marginVertical: 6,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#34C759',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(52, 199, 89, 0.35)',
      } as any,
    }),
  },
  confirmBtnDisabled: {
    backgroundColor: '#A2A2A7',
    ...Platform.select({
      web: {
        boxShadow: 'none',
      } as any,
    }),
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
