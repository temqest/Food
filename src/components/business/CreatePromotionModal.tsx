import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BusinessProduct, PromotionCampaign } from '@/context/BusinessContext';

interface CreatePromotionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    campaign: Omit<PromotionCampaign, 'id' | 'impressions' | 'clicks' | 'ordersDriven' | 'startDate'>
  ) => void;
  products: BusinessProduct[];
  establishmentId: string;
}

const DISTRICT_OPTIONS = [
  'Centro & Barlin District',
  'Magsaysay Ave Culinary Strip',
  'Peñafrancia & Basilica Area',
  'Triangulo / Naga CBD II',
  'All Naga City Foodies',
];

const PRESET_BADGES = [
  '15% OFF',
  '20% OFF',
  'FLASH MERIENDA',
  'FREE EXTRA GRAVY',
  'NEW DISH SPOTLIGHT',
  'BUY 2 GET PUTO',
];

export const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({
  visible,
  onClose,
  onSave,
  products,
  establishmentId,
}) => {
  const [title, setTitle] = useState('Afternoon Merienda Rush: 15% Off Kinalas');
  const [description, setDescription] = useState(
    'Hot bowls of authentic Barlin kinalas served fresh with free extra brain gravy between 2:00 PM and 5:00 PM.'
  );
  const [badgeText, setBadgeText] = useState('15% OFF');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [targetDistrict, setTargetDistrict] = useState(DISTRICT_OPTIONS[0]);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [activateNow, setActivateNow] = useState(true);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a promotion title or headline.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please provide a short description for foodies.');
      return;
    }

    onSave({
      establishmentId,
      title: title.trim(),
      description: description.trim(),
      badgeText: badgeText.trim() || 'SPECIAL DEAL',
      discountPercent: discountPercent ? parseInt(discountPercent, 10) : undefined,
      targetDistrict,
      featuredFoodId: selectedProduct?.foodId,
      featuredFoodName: selectedProduct?.name,
      active: activateNow,
      budgetTier: 'Community Spotlight (Free Partner Tier)',
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Text style={styles.headerTitle}>Launch Promotion</Text>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Text style={styles.doneText}>Publish</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          >
            {/* Live Customer Preview Card */}
            <Text style={styles.groupHeader}>CUSTOMER DISCOVERY PREVIEW</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewTopRow}>
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>{badgeText || 'SPECIAL'}</Text>
                </View>
                <View style={styles.previewTargetBadge}>
                  <Ionicons name="location-sharp" size={11} color="#D42F13" />
                  <Text style={styles.previewTargetText}>{targetDistrict}</Text>
                </View>
              </View>

              <Text style={styles.previewTitle}>{title || 'Your Promotion Title'}</Text>
              <Text style={styles.previewDesc}>
                {description || 'Your promotional copy seen by customers...'}
              </Text>

              <View style={styles.previewFooter}>
                <View style={styles.previewDishPill}>
                  <Ionicons name="restaurant" size={12} color="#000000" />
                  <Text style={styles.previewDishText}>
                    Featured: {selectedProduct?.name || 'All Menu Items'}
                  </Text>
                </View>
                <View style={styles.previewActionBtn}>
                  <Text style={styles.previewActionText}>Pre-Order Deal ›</Text>
                </View>
              </View>
            </View>

            {/* Inset Group 1: Promo Copy */}
            <Text style={styles.groupHeader}>CAMPAIGN DETAILS</Text>
            <View style={styles.insetGroup}>
              <View style={styles.inputRow}>
                <Text style={styles.rowLabel}>Campaign Headline</Text>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Afternoon Merienda 15% Off"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.rowLabel}>Discount (%)</Text>
                <TextInput
                  style={styles.textInput}
                  value={discountPercent}
                  onChangeText={setDiscountPercent}
                  keyboardType="numeric"
                  placeholder="15"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                />
              </View>

              <View style={[styles.textAreaRow, styles.inputRowLast]}>
                <Text style={styles.rowLabelTop}>Marketing Pitch for Foodies</Text>
                <TextInput
                  style={styles.textArea}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholder="Tell foodies why they shouldn't miss this offer today..."
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                />
              </View>
            </View>

            {/* Inset Group 2: Quick Badge Presets */}
            <Text style={styles.groupHeader}>OFFER BADGE</Text>
            <View style={styles.badgePresetsWrap}>
              {PRESET_BADGES.map((b) => {
                const isSelected = badgeText === b;
                return (
                  <Pressable
                    key={b}
                    onPress={() => setBadgeText(b)}
                    style={[
                      styles.badgeChip,
                      isSelected && styles.badgeChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeChipText,
                        isSelected && styles.badgeChipTextActive,
                      ]}
                    >
                      {b}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Inset Group 3: Target District in Naga */}
            <Text style={styles.groupHeader}>TARGET NAGA DISTRICT</Text>
            <View style={styles.insetGroup}>
              {DISTRICT_OPTIONS.map((district, idx) => {
                const isSelected = targetDistrict === district;
                const isLast = idx === DISTRICT_OPTIONS.length - 1;
                return (
                  <Pressable
                    key={district}
                    onPress={() => setTargetDistrict(district)}
                    style={[styles.districtRow, isLast && styles.inputRowLast]}
                  >
                    <Text
                      style={[
                        styles.districtLabel,
                        isSelected && styles.districtLabelActive,
                      ]}
                    >
                      {district}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={19} color="#D42F13" />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* Inset Group 4: Featured Product Link */}
            {products.length > 0 && (
              <>
                <Text style={styles.groupHeader}>FEATURED MENU ITEM</Text>
                <View style={styles.insetGroup}>
                  {products.map((prod, idx) => {
                    const isSelected = selectedProductId === prod.id;
                    const isLast = idx === products.length - 1;
                    return (
                      <Pressable
                        key={prod.id}
                        onPress={() => setSelectedProductId(prod.id)}
                        style={[styles.districtRow, isLast && styles.inputRowLast]}
                      >
                        <View style={styles.productLinkLeft}>
                          <Text
                            style={[
                              styles.productName,
                              isSelected && styles.productNameActive,
                            ]}
                          >
                            {prod.name}
                          </Text>
                          <Text style={styles.productPrice}>₱{prod.price}</Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark" size={19} color="#D42F13" />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* Inset Group 5: Active Status */}
            <Text style={styles.groupHeader}>ACTIVATION</Text>
            <View style={styles.insetGroup}>
              <View style={[styles.toggleRow, styles.inputRowLast]}>
                <View style={styles.toggleLeft}>
                  <Text style={styles.toggleTitle}>Publish Immediately</Text>
                  <Text style={styles.toggleSubtitle}>
                    Show banner to foodies browsing Naga Food right now
                  </Text>
                </View>
                <Switch
                  value={activateNow}
                  onValueChange={setActivateNow}
                  trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#D42F13' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
      } as any,
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.2)',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  cancelText: {
    fontSize: 17,
    color: '#8E8E93',
  },
  doneText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#D42F13',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.2)',
    marginBottom: 8,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewBadge: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  previewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  previewTargetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 47, 19, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  previewTargetText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#D42F13',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  previewDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.7)',
    marginBottom: 12,
  },
  previewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
  },
  previewDishPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewDishText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    maxWidth: 160,
  },
  previewActionBtn: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  previewActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  groupHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.08,
    marginBottom: 6,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  badgePresetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  badgeChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  badgeChipActive: {
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    borderColor: '#D42F13',
  },
  badgeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.8)',
  },
  badgeChipTextActive: {
    color: '#D42F13',
  },
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  inputRowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 16,
    color: '#000000',
    width: 140,
  },
  rowLabelTop: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    textAlign: 'right',
    padding: 0,
  },
  textAreaRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 20,
    minHeight: 60,
    padding: 0,
  },
  districtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  districtLabel: {
    fontSize: 16,
    color: '#000000',
  },
  districtLabelActive: {
    fontWeight: '600',
    color: '#D42F13',
  },
  productLinkLeft: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 2,
  },
  productNameActive: {
    fontWeight: '600',
    color: '#D42F13',
  },
  productPrice: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleLeft: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  bottomSpacer: {
    height: 40,
  },
  pressed: {
    opacity: 0.6,
  },
});
