import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PromotionCampaign } from '@/context/BusinessContext';

interface PromotionCardProps {
  campaign: PromotionCampaign;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  campaign,
  onToggleActive,
  onDelete,
}) => {
  const ctr =
    campaign.impressions > 0
      ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1)
      : '0.0';

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>{campaign.badgeText}</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.statusLabel}>
            {campaign.active ? 'Active' : 'Paused'}
          </Text>
          <Switch
            value={campaign.active}
            onValueChange={() => onToggleActive(campaign.id)}
            trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Title & Description */}
      <Text style={styles.campaignTitle}>{campaign.title}</Text>
      <Text style={styles.campaignDesc}>{campaign.description}</Text>

      {/* Target District & Tier */}
      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="location-sharp" size={12} color="#D42F13" />
          <Text style={styles.metaPillText}>{campaign.targetDistrict}</Text>
        </View>
        <Text style={styles.tierText}>{campaign.budgetTier}</Text>
      </View>

      {/* Analytics Grid (2x2 Mobile Grid) */}
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticBox}>
          <Text style={styles.analyticVal}>{campaign.impressions.toLocaleString()}</Text>
          <Text style={styles.analyticLbl}>Foodie Views</Text>
        </View>

        <View style={styles.analyticBox}>
          <Text style={styles.analyticVal}>{campaign.clicks.toLocaleString()}</Text>
          <Text style={styles.analyticLbl}>Menu Clicks</Text>
        </View>

        <View style={styles.analyticBox}>
          <Text style={[styles.analyticVal, { color: '#D42F13' }]}>
            {campaign.ordersDriven}
          </Text>
          <Text style={styles.analyticLbl}>Orders Placed</Text>
        </View>

        <View style={styles.analyticBox}>
          <Text style={styles.analyticVal}>{ctr}%</Text>
          <Text style={styles.analyticLbl}>CTR</Text>
        </View>
      </View>

      {/* Footer / Delete */}
      <View style={styles.footerRow}>
        <Text style={styles.dateText}>{campaign.startDate}</Text>
        <Pressable
          onPress={() => onDelete(campaign.id)}
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={14} color="#FF3B30" />
          <Text style={styles.deleteBtnText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeWrap: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  campaignDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.7)',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 47, 19, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#D42F13',
  },
  tierText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.5)',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  analyticBox: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  analyticVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  analyticLbl: {
    fontSize: 10,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.4)',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF3B30',
  },
  pressed: {
    opacity: 0.6,
  },
});
