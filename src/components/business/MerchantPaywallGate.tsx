import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOSTokens } from '@/constants/theme';

interface MerchantPaywallGateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  accentColor?: string;
  features: string[];
  onUpgradePress: () => void;
  ctaText?: string;
}

export const MerchantPaywallGate: React.FC<MerchantPaywallGateProps> = ({
  icon,
  title,
  subtitle,
  accentColor = IOSTokens.colors.tint,
  features,
  onUpgradePress,
  ctaText = 'Subscribe to Unlock (₱499/mo)',
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Icon with lock overlay */}
      <View style={styles.iconCircleWrapper}>
        <View style={[styles.mainIconCircle, { backgroundColor: `${accentColor}15` }]}>
          <Ionicons name={icon} size={30} color={accentColor} />
        </View>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
        </View>
      </View>

      {/* Pill header */}
      <View style={styles.proRequiredPill}>
        <Text style={styles.proRequiredText}>MERCHANT PRO REQUIRED</Text>
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.gateTitle}>{title}</Text>
      <Text style={styles.gateSubtitle}>{subtitle}</Text>

      {/* Feature Checklist */}
      <View style={styles.featuresContainer}>
        {features.map((feature, idx) => (
          <View key={idx} style={styles.featureRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={13} color="#2E7D32" />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Action Button */}
      <Pressable
        onPress={onUpgradePress}
        style={({ pressed }) => [styles.upgradeBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={ctaText}
      >
        <Ionicons name="shield-checkmark" size={17} color="#FFFFFF" />
        <Text style={styles.upgradeBtnText}>{ctaText}</Text>
      </Pressable>

      <Text style={styles.guaranteeText}>
        Includes verified store checkmark, store wallet, and 3x algorithm boost
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginVertical: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
      } as any,
      default: {
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
    }),
  },
  iconCircleWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  mainIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#D42F13',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  proRequiredPill: {
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  proRequiredText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  gateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  gateSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.75)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: 320,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
  },
  upgradeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(212, 47, 19, 0.25)',
      } as any,
    }),
  },
  upgradeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  guaranteeText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    marginTop: 10,
  },
  pressed: {
    opacity: 0.75,
  },
});
