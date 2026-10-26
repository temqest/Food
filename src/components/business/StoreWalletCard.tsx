import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { StoreWallet, PayoutRecord } from '@/context/BusinessContext';
import { IOSTokens } from '@/constants/theme';

interface StoreWalletCardProps {
  wallet: StoreWallet;
  onOpenCashOut: () => void;
  isSubscribed?: boolean;
  onRequireSubscription?: () => void;
}

export const StoreWalletCard: React.FC<StoreWalletCardProps> = ({
  wallet,
  onOpenCashOut,
  isSubscribed = true,
  onRequireSubscription,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const handleCashOutPress = () => {
    if (!isSubscribed && onRequireSubscription) {
      onRequireSubscription();
    } else {
      onOpenCashOut();
    }
  };

  const getMethodBadge = (method: PayoutRecord['method']) => {
    switch (method) {
      case 'gcash':
        return { label: 'GCash', color: '#007DFE', bg: '#EBF4FF' };
      case 'maya':
        return { label: 'Maya', color: '#00BE71', bg: '#F0FDF4' };
      case 'bank':
        return { label: 'Bank', color: '#6A1B9A', bg: '#F3E5F5' };
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Cohesive Header */}
      <View style={styles.walletHeader}>
        <View style={styles.walletTitleRow}>
          <View style={styles.walletIconCircle}>
            <Ionicons name="wallet-outline" size={17} color={IOSTokens.colors.tint} />
          </View>
          <View>
            <Text style={styles.walletHeaderTitle}>Store Earnings Wallet</Text>
            <Text style={styles.walletHeaderSub}>Order Settlements &amp; Balance</Text>
          </View>
        </View>

        <View style={[styles.settlementPill, !isSubscribed && styles.settlementPillLocked]}>
          <Text style={[styles.settlementPillText, !isSubscribed && styles.settlementPillTextLocked]}>
            {isSubscribed ? 'Settled Daily' : 'Pro Required'}
          </Text>
        </View>
      </View>

      {/* Main Balance Display */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>AVAILABLE FOR CASHOUT</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.currencySymbol}>₱</Text>
          <Text style={styles.balanceAmount}>
            {isSubscribed
              ? wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : '0'}
          </Text>
        </View>
      </View>

      {/* 3-Col Metrics Strip */}
      <View style={styles.metricsStrip}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Today&apos;s Revenue</Text>
          <Text style={[styles.metricValue, styles.revenueText]}>
            +₱{isSubscribed ? wallet.todayEarnings.toLocaleString() : '0'}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Pending Clearing</Text>
          <Text style={styles.metricValue}>
            ₱{isSubscribed ? wallet.pendingBalance.toLocaleString() : '0'}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Lifetime Withdrawn</Text>
          <Text style={styles.metricValue}>
            ₱{isSubscribed ? wallet.lifetimePaid.toLocaleString() : '0'}
          </Text>
        </View>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={handleCashOutPress}
          style={({ pressed }) => [
            styles.cashOutBtn,
            !isSubscribed && styles.cashOutBtnLocked,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={isSubscribed ? 'Cash out available store balance' : 'Unlock cash out'}
        >
          <Ionicons
            name={isSubscribed ? 'arrow-up-circle' : 'lock-closed'}
            size={17}
            color="#FFFFFF"
          />
          <Text style={styles.cashOutBtnText}>
            {isSubscribed ? 'Cash Out Funds' : 'Unlock Cash Out'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowHistory((prev) => !prev)}
          style={({ pressed }) => [styles.historyToggleBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Toggle payout history"
        >
          <Ionicons
            name={showHistory ? 'chevron-up' : 'receipt-outline'}
            size={15}
            color="#000000"
          />
          <Text style={styles.historyToggleText}>
            {showHistory ? 'Hide Records' : 'Payout Records'}
          </Text>
        </Pressable>
      </View>

      {/* Collapsible Payout History */}
      {showHistory && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyHeading}>RECENT SETTLEMENTS &amp; PAYOUTS</Text>
          {!isSubscribed || wallet.payoutHistory.length === 0 ? (
            <Text style={styles.emptyHistoryText}>No payouts requested yet.</Text>
          ) : (
            wallet.payoutHistory.slice(0, 4).map((p) => {
              const badge = getMethodBadge(p.method);
              return (
                <View key={p.id} style={styles.historyRow}>
                  <View style={[styles.historyMethodIcon, { backgroundColor: badge.bg }]}>
                    {p.method === 'gcash' ? (
                      <ExpoImage
                        source={require('../../../assets/icons/gcash.svg')}
                        style={{ width: 18, height: 16 }}
                        contentFit="contain"
                      />
                    ) : p.method === 'maya' ? (
                      <ExpoImage
                        source={require('../../../assets/icons/maya.svg')}
                        style={{ width: 20, height: 11 }}
                        contentFit="contain"
                      />
                    ) : (
                      <Ionicons name="business-outline" size={14} color="#6A1B9A" />
                    )}
                  </View>
                  <View style={styles.historyDetailsCol}>
                    <View style={styles.historyLine1}>
                      <Text style={styles.historyMethodName}>
                        {badge.label} Payout · {p.account}
                      </Text>
                      <Text style={styles.historyAmount}>-₱{p.amount.toLocaleString()}</Text>
                    </View>
                    <View style={styles.historyLine2}>
                      <Text style={styles.historyDate}>{p.date}</Text>
                      <View style={styles.historyStatusPill}>
                        <Ionicons name="checkmark-circle" size={11} color="#2E7D32" />
                        <Text style={styles.historyStatusText}>Settled</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
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
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  walletTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  walletHeaderSub: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  settlementPill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  settlementPillLocked: {
    backgroundColor: '#FFF2EE',
  },
  settlementPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.7)',
  },
  settlementPillTextLocked: {
    color: '#D42F13',
    fontWeight: '700',
  },
  balanceSection: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginRight: 3,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.1)',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 3,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  revenueText: {
    color: '#2E7D32',
  },
  metricDivider: {
    width: 0.5,
    height: 22,
    backgroundColor: 'rgba(60, 60, 67, 0.15)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cashOutBtn: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(212, 47, 19, 0.25)',
      } as any,
    }),
  },
  cashOutBtnLocked: {
    backgroundColor: '#8E8E93',
  },
  cashOutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F2F2F7',
    paddingVertical: 12,
    borderRadius: 12,
  },
  historyToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  historyContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
  },
  historyHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  emptyHistoryText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    paddingVertical: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.08)',
  },
  historyMethodIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyDetailsCol: {
    flex: 1,
  },
  historyLine1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  historyMethodName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },
  historyLine2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyDate: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  historyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  historyStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  pressed: {
    opacity: 0.7,
  },
});
