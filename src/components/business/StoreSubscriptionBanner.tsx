import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StoreSubscription } from '@/context/BusinessContext';
import { IOSTokens } from '@/constants/theme';

interface StoreSubscriptionBannerProps {
  subscription: StoreSubscription;
  onUpgradePress: () => void;
}

export const StoreSubscriptionBanner: React.FC<StoreSubscriptionBannerProps> = ({
  subscription,
  onUpgradePress,
}) => {
  const isSubscribed = subscription.status === 'active';

  if (isSubscribed) {
    return (
      <Pressable
        onPress={onUpgradePress}
        style={({ pressed }) => [styles.subscribedCompactBanner, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Manage Naga Merchant Pro subscription"
      >
        <View style={styles.compactLeft}>
          <View style={styles.compactIconBox}>
            <Ionicons name="shield-checkmark" size={17} color="#007DFE" />
          </View>
          <View style={styles.compactTextCol}>
            <View style={styles.compactTitleRow}>
              <Text style={styles.compactTitle}>Naga Merchant Pro</Text>
              <View style={styles.compactActivePill}>
                <Text style={styles.compactActivePillText}>ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.compactSub} numberOfLines={1}>
              All Pro Capabilities Unlocked
            </Text>
          </View>
        </View>

        <View style={styles.compactRight}>
          <Text style={styles.compactManageText}>Manage</Text>
          <Ionicons name="chevron-forward" size={14} color="#007DFE" />
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.bannerContainer}>
      {/* Top Header Strip */}
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={styles.upgradePill}>
            <Ionicons name="shield-checkmark" size={12} color="#D42F13" />
            <Text style={styles.upgradePillText}>PARTNER SUBSCRIPTION</Text>
          </View>
        </View>

        <Text style={styles.priceTag}>₱499/mo</Text>
      </View>

      {/* Main Title & Subtitle */}
      <Text style={styles.mainTitle}>Upgrade to Naga Merchant Pro</Text>
      <Text style={styles.mainSub}>
        Unlock your store&apos;s full capabilities to grow your local Naga food business. Unpaid stores cannot accept customer orders or withdraw from store wallet.
      </Text>

      {/* 5 Key Capability Bullets */}
      <View style={styles.perksList}>
        <View style={styles.perkItem}>
          <View style={styles.checkIconBox}>
            <Ionicons name="checkmark" size={13} color="#2E7D32" />
          </View>
          <Text style={styles.perkText}>
            <Text style={styles.perkBold}>Verified Blue Checkmark</Text> displayed on menus, search, and store cards
          </Text>
        </View>

        <View style={styles.perkItem}>
          <View style={styles.checkIconBox}>
            <Ionicons name="checkmark" size={13} color="#2E7D32" />
          </View>
          <Text style={styles.perkText}>
            <Text style={styles.perkBold}>Accept Live Kitchen Orders</Text> for dine-in passes and takeout orders
          </Text>
        </View>

        <View style={styles.perkItem}>
          <View style={styles.checkIconBox}>
            <Ionicons name="checkmark" size={13} color="#2E7D32" />
          </View>
          <Text style={styles.perkText}>
            <Text style={styles.perkBold}>Store Earnings Wallet</Text> with daily automated settlements &amp; cashout
          </Text>
        </View>

        <View style={styles.perkItem}>
          <View style={styles.checkIconBox}>
            <Ionicons name="checkmark" size={13} color="#2E7D32" />
          </View>
          <Text style={styles.perkText}>
            <Text style={styles.perkBold}>Launch Sponsored Promotions</Text> targeting thousands of Naga foodies
          </Text>
        </View>

        <View style={styles.perkItem}>
          <View style={styles.checkIconBox}>
            <Ionicons name="checkmark" size={13} color="#2E7D32" />
          </View>
          <Text style={styles.perkText}>
            <Text style={styles.perkBold}>3x Algorithmic Boost</Text> in search ranking, trail stops &amp; foodie feed
          </Text>
        </View>
      </View>

      {/* Action CTA Button */}
      <Pressable
        onPress={onUpgradePress}
        style={({ pressed }) => [styles.upgradeBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Upgrade to Naga Merchant Pro subscription"
      >
        <Text style={styles.upgradeBtnText}>Subscribe Now to Unlock Full App</Text>
        <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FCE8E6',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(212, 47, 19, 0.08)',
      } as any,
      default: {
        elevation: 3,
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  subscribedCompactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E1EAFD',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 125, 254, 0.06)',
      } as any,
      default: {
        elevation: 2,
        shadowColor: '#007DFE',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
    }),
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  compactIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTextCol: {
    flex: 1,
  },
  compactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  compactActivePill: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  compactActivePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#007DFE',
    letterSpacing: 0.4,
  },
  compactSub: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.65)',
    marginTop: 1,
  },
  compactRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  compactManageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007DFE',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  upgradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  upgradePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.4,
  },
  priceTag: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D42F13',
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  manageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  mainSub: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.75)',
    lineHeight: 18,
    marginBottom: 12,
  },
  perksList: {
    gap: 7,
    marginBottom: 14,
    backgroundColor: '#FAF9F8',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkIconBox: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  perkText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.85)',
    lineHeight: 17,
  },
  perkBold: {
    fontWeight: '700',
    color: '#000000',
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(212, 47, 19, 0.25)',
      } as any,
    }),
  },
  upgradeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
