import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
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

  const targetedDishes =
    campaign.featuredProductNames && campaign.featuredProductNames.length > 0
      ? campaign.featuredProductNames.join(', ')
      : campaign.featuredFoodName || 'All Menu Items';

  return (
    <View style={styles.cardContainer}>
      {/* Optional Promotion Banner Image */}
      {!!campaign.image && (
        <View style={styles.imageBannerContainer}>
          <ExpoImage
            source={{ uri: campaign.image }}
            style={styles.imageBanner}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.imageOverlayBadge}>
            <Text style={styles.badgeText}>{campaign.badgeText}</Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={styles.headerRow}>
        {!campaign.image && (
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{campaign.badgeText}</Text>
          </View>
        )}

        {campaign.cost !== undefined && campaign.cost > 0 && (
          <View style={styles.costBadge}>
            <Ionicons name="card-outline" size={11} color="#007AFF" />
            <Text style={styles.costBadgeText}>
              ₱{campaign.cost} · {campaign.durationDays ? `${campaign.durationDays}d` : 'Paid'}
              {campaign.paymentMode ? ` (${campaign.paymentMode.toUpperCase()})` : ''}
            </Text>
          </View>
        )}

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

      {/* Targeted Dishes Pill */}
      <View style={styles.dishesRow}>
        <Ionicons name="restaurant" size={12} color="#D42F13" />
        <Text style={styles.dishesLabel}>Targeted Dishes:</Text>
        <Text style={styles.dishesValue} numberOfLines={1}>
          {targetedDishes}
        </Text>
      </View>

      {/* Target District & Tier */}
      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Ionicons name="location-sharp" size={12} color="#D42F13" />
          <Text style={styles.metaPillText} numberOfLines={1}>{campaign.targetDistrict}</Text>
        </View>
        <Text style={styles.tierText} numberOfLines={1}>{campaign.budgetTier}</Text>
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
    overflow: 'hidden',
  },
  imageBannerContainer: {
    position: 'relative',
    width: '100%',
    height: 128,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E5E5EA',
  },
  imageBanner: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(212, 47, 19, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  badgeWrap: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
  },
  costBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  dishesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9F9FB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.08)',
  },
  dishesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
  },
  dishesValue: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.75)',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
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
    gap: 8,
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
    flexShrink: 1,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#D42F13',
  },
  tierText: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.5)',
    flexShrink: 0,
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
