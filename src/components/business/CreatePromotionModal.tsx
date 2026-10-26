import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
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

interface DurationOption {
  days: number;
  label: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  estimatedReach: string;
  badge?: string;
}

const DURATION_OPTIONS: DurationOption[] = [
  {
    days: 1,
    label: '1 Day Flash Rush',
    tagline: 'Ideal for same-day flash lunch rush & peak merienda',
    price: 99,
    estimatedReach: '~1,500 foodies',
  },
  {
    days: 3,
    label: '3 Days Weekend Booster',
    tagline: 'Spotlight across Friday to Sunday dining rushes',
    price: 249,
    originalPrice: 297,
    estimatedReach: '~5,000 foodies',
    badge: 'POPULAR',
  },
  {
    days: 7,
    label: '7 Days Weekly Spotlight',
    tagline: 'Continuous top placement in feed and discovery map',
    price: 499,
    originalPrice: 693,
    estimatedReach: '~14,000 foodies',
    badge: 'BEST ROI',
  },
  {
    days: 14,
    label: '14 Days Fortnight Sprint',
    tagline: 'High-frequency impressions across Naga Centro & CBD',
    price: 899,
    originalPrice: 1386,
    estimatedReach: '~30,000 foodies',
  },
  {
    days: 30,
    label: '30 Days Monthly Anchor',
    tagline: 'Maximum city-wide visibility & branded carinderia badge',
    price: 1699,
    originalPrice: 2970,
    estimatedReach: '~70,000 foodies',
    badge: 'MAX VALUE',
  },
];

type PromoPaymentMode = 'gcash' | 'maya' | 'store_balance';

export const CreatePromotionModal: React.FC<CreatePromotionModalProps> = ({
  visible,
  onClose,
  onSave,
  products,
  establishmentId,
}) => {
  // Wizard Navigation Step
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Creative & Targeting State
  const [title, setTitle] = useState('Afternoon Merienda Rush: 15% Off Kinalas');
  const [description, setDescription] = useState(
    'Hot bowls of authentic Barlin kinalas served fresh with free extra brain gravy between 2:00 PM and 5:00 PM.'
  );
  const [badgeText, setBadgeText] = useState('15% OFF');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [targetDistrict, setTargetDistrict] = useState(DISTRICT_OPTIONS[0]);
  const [promoImage, setPromoImage] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.map((p) => p.id)
  );
  const [selectAllProducts, setSelectAllProducts] = useState(true);

  // Always reset to Step 1 and blank photo whenever modal opens
  useEffect(() => {
    if (visible) {
      setStep(1);
      setPromoImage(null);
    }
  }, [visible]);

  // Step 2: Duration, Pricing & Payment State
  const [selectedDurationDays, setSelectedDurationDays] = useState<number>(3);
  const [paymentMode, setPaymentMode] = useState<PromoPaymentMode>('gcash');
  const [contactPhone, setContactPhone] = useState('0917 555 8291');
  const [activateNow, setActivateNow] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedPaymentRef, setConfirmedPaymentRef] = useState('');

  // Selected duration details
  const selectedDuration =
    DURATION_OPTIONS.find((d) => d.days === selectedDurationDays) || DURATION_OPTIONS[1];
  const campaignCost = selectedDuration.price;

  // Multi-Product Selection Helpers
  const handleToggleProduct = (prodId: string) => {
    let next: string[];
    if (selectedProductIds.includes(prodId)) {
      next = selectedProductIds.filter((id) => id !== prodId);
    } else {
      next = [...selectedProductIds, prodId];
    }
    setSelectedProductIds(next);
    setSelectAllProducts(next.length === products.length);
  };

  const handleToggleSelectAll = () => {
    if (selectAllProducts) {
      setSelectedProductIds([]);
      setSelectAllProducts(false);
    } else {
      setSelectedProductIds(products.map((p) => p.id));
      setSelectAllProducts(true);
    }
  };

  // Image Picker Logic (Matches Add Menu / Post Media Picker: no forced cropping)
  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPromoImage(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error launching gallery:', err);
      Alert.alert(
        'Upload Error',
        'Could not access photo library. Please check your device permissions.'
      );
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access in device settings to snap a promo banner photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPromoImage(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error launching camera:', err);
      Alert.alert('Camera Error', 'Could not access device camera.');
    }
  };

  // Wizard Step Validation
  const handleProceedToStep2 = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a promotion title or headline.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please provide a short description for foodies.');
      return;
    }
    if (selectedProductIds.length === 0 && !selectAllProducts) {
      Alert.alert(
        'Target Dishes Required',
        'Please select at least one menu item or choose "All Menu Items".'
      );
      return;
    }

    setStep(2);
  };

  // Final Payment & Publish Execution
  const handleConfirmAndPay = () => {
    if (paymentMode !== 'store_balance' && !contactPhone.trim()) {
      Alert.alert('Contact Required', 'Please provide a mobile contact number.');
      return;
    }

    setIsProcessing(true);

    // Simulate instant payment turnaround (600ms) matching basket checkout
    setTimeout(() => {
      setIsProcessing(false);

      const refNumber =
        paymentMode === 'gcash'
          ? `GCASH-${Math.floor(10000000 + Math.random() * 90000000)}`
          : paymentMode === 'maya'
          ? `QRPH-${Math.floor(10000000 + Math.random() * 90000000)}`
          : `STORE-BAL-${Date.now().toString().slice(-6)}`;

      setConfirmedPaymentRef(refNumber);

      const targetedProducts = products.filter((p) => selectedProductIds.includes(p.id));
      const targetedNames = targetedProducts.map((p) => p.name);

      onSave({
        establishmentId,
        title: title.trim(),
        description: description.trim(),
        badgeText: badgeText.trim() || 'SPECIAL DEAL',
        discountPercent: discountPercent ? parseInt(discountPercent, 10) : undefined,
        targetDistrict,
        featuredFoodId: targetedProducts[0]?.foodId,
        featuredFoodName:
          selectAllProducts || targetedProducts.length === products.length
            ? 'All Menu Items'
            : targetedNames.join(', '),
        featuredProductIds: selectedProductIds,
        featuredProductNames: targetedNames,
        image: promoImage || undefined,
        active: activateNow,
        budgetTier: `${selectedDuration.label} (₱${campaignCost})`,
        durationDays: selectedDurationDays,
        cost: campaignCost,
        paymentMode,
        paymentRef: refNumber,
      });

      setShowSuccessModal(true);
    }, 600);
  };

  const handleFinish = () => {
    setShowSuccessModal(false);
    setStep(1);
    setPromoImage(null);
    onClose();
  };

  const handleModalClose = () => {
    setStep(1);
    setPromoImage(null);
    onClose();
  };

  const targetedProducts = products.filter((p) => selectedProductIds.includes(p.id));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleModalClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleModalClose} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            {step === 1 ? (
              <Pressable
                onPress={handleModalClose}
                style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setStep(1)}
                style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Ionicons name="arrow-back" size={18} color="#111111" />
                <Text style={styles.backBtnText}>Creative</Text>
              </Pressable>
            )}

            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>
                {step === 1 ? 'Launch Promotion' : 'Budget & Checkout'}
              </Text>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>Step {step} of 2</Text>
              </View>
            </View>

            {step === 1 ? (
              <Pressable
                onPress={handleProceedToStep2}
                style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
                hitSlop={8}
              >
                <Text style={styles.nextText}>Budget ›</Text>
              </Pressable>
            ) : (
              <View style={{ width: 44 }} />
            )}
          </View>

          {/* STEP 1: CREATIVE & MENU TARGETING */}
          {step === 1 && (
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
            >
              {/* Live Customer Preview Card */}
              <Text style={styles.groupHeader}>CUSTOMER DISCOVERY PREVIEW</Text>
              <View style={styles.previewCard}>
                {/* Banner Image Preview */}
                {!!promoImage && (
                  <View style={styles.previewImageContainer}>
                    <ExpoImage
                      source={{ uri: promoImage }}
                      style={styles.previewImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <View style={styles.previewImageOverlayBadge}>
                      <Text style={styles.previewBadgeText}>{badgeText || 'SPECIAL'}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.previewTopRow}>
                  {!promoImage && (
                    <View style={styles.previewBadge}>
                      <Text style={styles.previewBadgeText}>{badgeText || 'SPECIAL'}</Text>
                    </View>
                  )}
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
                    <Text style={styles.previewDishText} numberOfLines={1}>
                      {selectAllProducts || targetedProducts.length === products.length
                        ? 'All Menu Items'
                        : `${targetedProducts.length} Items Selected`}
                    </Text>
                  </View>
                  <View style={styles.previewActionBtn}>
                    <Text style={styles.previewActionText}>Pre-Order Deal ›</Text>
                  </View>
                </View>
              </View>

              {/* Banner Image Upload & Controls */}
              <Text style={styles.groupHeader}>PROMOTION BANNER IMAGE</Text>
              <View style={styles.imageSectionCard}>
                {promoImage ? (
                  <View style={styles.imageFilledRow}>
                    <ExpoImage
                      source={{ uri: promoImage }}
                      style={styles.imageThumb}
                      contentFit="cover"
                    />
                    <View style={styles.imageActionCols}>
                      <Text style={styles.imageTitle}>Banner Uploaded</Text>
                      <Text style={styles.imageSubtitle}>Displays at 16:9 atop foodie discovery</Text>
                      <View style={styles.imageBtnRow}>
                        <Pressable
                          onPress={handlePickFromGallery}
                          style={({ pressed }) => [styles.imageSubBtn, pressed && styles.pressed]}
                        >
                          <Ionicons name="images-outline" size={14} color="#111111" />
                          <Text style={styles.imageSubBtnText}>Change</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setPromoImage(null)}
                          style={({ pressed }) => [styles.imageSubBtnDanger, pressed && styles.pressed]}
                        >
                          <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                          <Text style={styles.imageSubBtnDangerText}>Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.imageEmptyContainer}>
                    <View style={styles.emptyIconCircle}>
                      <Ionicons name="image-outline" size={24} color="#D42F13" />
                    </View>
                    <Text style={styles.emptyImageTitle}>Add High-Quality Promo Photo</Text>
                    <Text style={styles.emptyImageDesc}>
                      Promotions with appetizing photos get up to 3× higher tap-through rates.
                    </Text>
                    <View style={styles.emptyBtnRow}>
                      <Pressable
                        onPress={handlePickFromGallery}
                        style={({ pressed }) => [styles.pickPhotoBtn, pressed && styles.pressed]}
                      >
                        <Ionicons name="images" size={15} color="#FFFFFF" />
                        <Text style={styles.pickPhotoBtnText}>Choose from Gallery</Text>
                      </Pressable>
                      <Pressable
                        onPress={handleTakePhoto}
                        style={({ pressed }) => [styles.cameraBtn, pressed && styles.pressed]}
                      >
                        <Ionicons name="camera" size={15} color="#111111" />
                        <Text style={styles.cameraBtnText}>Take Photo</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>

              {/* Campaign Copy */}
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

              {/* Quick Badge Presets */}
              <Text style={styles.groupHeader}>OFFER BADGE</Text>
              <View style={styles.badgePresetsWrap}>
                {PRESET_BADGES.map((b) => {
                  const isSelected = badgeText === b;
                  return (
                    <Pressable
                      key={b}
                      onPress={() => setBadgeText(b)}
                      style={[styles.badgeChip, isSelected && styles.badgeChipActive]}
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

              {/* Target Naga District */}
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

              {/* Target Multiple Menu Items */}
              <View style={styles.sectionHeaderBetween}>
                <Text style={styles.groupHeaderInline}>TARGET MENU ITEMS</Text>
                <Pressable
                  onPress={handleToggleSelectAll}
                  style={({ pressed }) => [styles.selectAllBtn, pressed && styles.pressed]}
                >
                  <Ionicons
                    name={selectAllProducts ? 'checkbox' : 'square-outline'}
                    size={16}
                    color="#D42F13"
                  />
                  <Text style={styles.selectAllText}>
                    {selectAllProducts ? 'All Items Selected' : 'Select All'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.insetGroup}>
                {products.map((prod, idx) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  const isLast = idx === products.length - 1;
                  return (
                    <Pressable
                      key={prod.id}
                      onPress={() => handleToggleProduct(prod.id)}
                      style={[styles.productCheckRow, isLast && styles.inputRowLast]}
                    >
                      <View style={styles.checkboxCol}>
                        <Ionicons
                          name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                          size={22}
                          color={isChecked ? '#D42F13' : '#C7C7CC'}
                        />
                      </View>
                      <ExpoImage
                        source={{ uri: prod.image }}
                        style={styles.productThumb}
                        contentFit="cover"
                      />
                      <View style={styles.productInfoCol}>
                        <Text
                          style={[
                            styles.productCheckTitle,
                            isChecked && styles.productCheckTitleActive,
                          ]}
                          numberOfLines={1}
                        >
                          {prod.name}
                        </Text>
                        <View style={styles.productMetaLine}>
                          <Text style={styles.productCheckCategory}>
                            {prod.categoryLabel}
                          </Text>
                          <Text style={styles.productCheckDot}>·</Text>
                          <Text style={styles.productCheckPrice}>₱{prod.price}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Bottom Next Button */}
              <Pressable
                onPress={handleProceedToStep2}
                style={({ pressed }) => [styles.primaryStepBtn, pressed && styles.pressed]}
              >
                <Text style={styles.primaryStepBtnText}>Continue to Duration & Budget</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}

          {/* STEP 2: DURATION, PRICING & PAYMENT CHECKOUT */}
          {step === 2 && (
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
            >
              {/* Campaign Mini Overview Card */}
              <View style={styles.summaryMiniCard}>
                <View style={styles.summaryMiniHeader}>
                  <View style={styles.summaryMiniBadge}>
                    <Text style={styles.summaryMiniBadgeText}>{badgeText}</Text>
                  </View>
                  <Text style={styles.summaryMiniDistrict} numberOfLines={1}>
                    {targetDistrict}
                  </Text>
                </View>
                <Text style={styles.summaryMiniTitle} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.summaryMiniTargetDishes} numberOfLines={1}>
                  {selectAllProducts || targetedProducts.length === products.length
                    ? 'Spotlight on: All Menu Items'
                    : `Targeting: ${targetedProducts.map((p) => p.name).join(', ')}`}
                </Text>
              </View>

              {/* Duration & Reach Selector */}
              <Text style={styles.groupHeader}>SELECT CAMPAIGN DURATION & REACH</Text>
              <View style={styles.durationOptionsContainer}>
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedDurationDays === opt.days;
                  return (
                    <Pressable
                      key={opt.days}
                      onPress={() => setSelectedDurationDays(opt.days)}
                      style={[
                        styles.durationCard,
                        isSelected && styles.durationCardActive,
                      ]}
                    >
                      <View style={styles.durationRadioCol}>
                        <View
                          style={[
                            styles.radioButton,
                            isSelected && styles.radioButtonActive,
                          ]}
                        >
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                      </View>

                      <View style={styles.durationBodyCol}>
                        <View style={styles.durationTopLine}>
                          <Text style={styles.durationTitle}>{opt.label}</Text>
                          {opt.badge && (
                            <View style={styles.durationBadge}>
                              <Text style={styles.durationBadgeText}>{opt.badge}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.durationTagline}>{opt.tagline}</Text>
                        <View style={styles.reachRow}>
                          <Ionicons name="people" size={13} color="#D42F13" />
                          <Text style={styles.reachText}>Estimated Reach: {opt.estimatedReach}</Text>
                        </View>
                      </View>

                      <View style={styles.durationPriceCol}>
                        <Text style={styles.durationPriceText}>₱{opt.price}</Text>
                        {opt.originalPrice && (
                          <Text style={styles.durationOriginalPrice}>₱{opt.originalPrice}</Text>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Itemized Cost Breakdown */}
              <Text style={styles.groupHeader}>PRICING BREAKDOWN</Text>
              <View style={styles.billCard}>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>
                    {selectedDuration.label} ({selectedDuration.days} Day Run)
                  </Text>
                  <Text style={styles.billValue}>₱{campaignCost}</Text>
                </View>
                <View style={styles.billRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.billLabel}>Multi-Dish Promotion Spotlight</Text>
                    <View style={styles.freePill}>
                      <Text style={styles.freePillText}>INCLUDED</Text>
                    </View>
                  </View>
                  <Text style={[styles.billValue, { color: '#34C759' }]}>₱0</Text>
                </View>
                <View style={styles.billRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.billLabel}>Carinderia Partner Discount</Text>
                    <View style={styles.freePill}>
                      <Text style={styles.freePillText}>WAIVED</Text>
                    </View>
                  </View>
                  <Text style={[styles.billValue, { color: '#34C759' }]}>₱0</Text>
                </View>

                <View style={styles.billDivider} />

                <View style={styles.billTotalRow}>
                  <Text style={styles.billTotalLabel}>Total Promotion Cost:</Text>
                  <Text style={styles.billTotalValue}>₱{campaignCost}</Text>
                </View>
              </View>

              {/* Payment Method Selector (Basket Checkout Pattern) */}
              <Text style={styles.groupHeader}>SELECT PAYMENT METHOD</Text>

              {/* GCash */}
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
                    source={require('../../../assets/icons/gcash.svg')}
                    style={{ width: 28, height: 24 }}
                    contentFit="contain"
                  />
                </View>
                <View style={styles.methodDetails}>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodTitle}>GCash</Text>
                    <View style={[styles.popularBadge, { backgroundColor: '#EBF4FF', flexShrink: 0 }]}>
                      <Text style={[styles.popularBadgeText, { color: '#007AFF' }]}>
                        INSTANT E-WALLET
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.methodSubtitle}>
                    Direct payment deduction via GCash mobile account.
                  </Text>
                </View>
              </Pressable>

              {/* Maya / QR Ph Universal */}
              <Pressable
                onPress={() => {
                  setPaymentMode('maya');
                  setShowQrModal(true);
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
                    source={require('../../../assets/icons/maya.svg')}
                    style={{ width: 34, height: 16 }}
                    contentFit="contain"
                  />
                </View>
                <View style={styles.methodDetails}>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodTitle}>Maya / QR Ph</Text>
                    <View style={[styles.popularBadge, { backgroundColor: '#E0F2F1', flexShrink: 0 }]}>
                      <Text style={[styles.popularBadgeText, { color: '#00897B' }]}>
                        NATIONAL QR
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.methodSubtitle}>
                    Scan with Maya, BPI, BDO, UnionBank, or BSP-compliant banking apps.
                  </Text>
                </View>
              </Pressable>

              {/* QR Ph Live Generator when Maya is active */}
              {paymentMode === 'maya' && (
                <View style={styles.subFieldContainer}>
                  <View style={styles.qrPhContainer}>
                    <Pressable
                      onPress={() => setShowQrModal(true)}
                      style={({ pressed }) => [styles.qrPhCodeCard, pressed && styles.pressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Enlarge Payment QR code"
                    >
                      <QRCode
                        value={`00020101021226500010ph.qrph0115NAGAPROMO${campaignCost}520458125303608540${campaignCost}5802PH5916NAGA_PROMOTIONS6004NAGA6304`}
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
                          source={require('../../../assets/icons/qr-ph.svg')}
                          style={{ width: 56, height: 16 }}
                          contentFit="contain"
                        />
                        <ExpoImage
                          source={require('../../../assets/icons/maya.svg')}
                          style={{ width: 38, height: 12 }}
                          contentFit="contain"
                        />
                      </View>
                      <Text style={styles.qrPhTitle}>QR Ph Campaign Pass</Text>
                      <Text style={styles.qrPhDesc}>
                        Target: {selectedDuration.label}{'\n'}
                        Amount: ₱{campaignCost}
                      </Text>
                      <Pressable
                        onPress={() => setShowQrModal(true)}
                        style={({ pressed }) => [styles.openQrModalBtn, pressed && styles.pressed]}
                      >
                        <Ionicons name="qr-code" size={13} color="#FFFFFF" />
                        <Text style={styles.openQrModalBtnText}>View Full Screen QR</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}

              {/* Store Payouts Deduction */}
              <Pressable
                onPress={() => setPaymentMode('store_balance')}
                style={[
                  styles.paymentOptionCard,
                  paymentMode === 'store_balance' && styles.paymentOptionCardActive,
                ]}
              >
                <View style={styles.paymentRadioCol}>
                  <View
                    style={[
                      styles.radioButton,
                      paymentMode === 'store_balance' && styles.radioButtonActive,
                    ]}
                  >
                    {paymentMode === 'store_balance' && <View style={styles.radioDot} />}
                  </View>
                </View>
                <View style={[styles.methodIconBadge, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="wallet-outline" size={22} color="#E65100" />
                </View>
                <View style={styles.methodDetails}>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodTitle}>Deduct from Balance</Text>
                    <View style={[styles.popularBadge, { backgroundColor: '#FFF3E0', flexShrink: 0 }]}>
                      <Text style={[styles.popularBadgeText, { color: '#E65100' }]}>
                        NO CARDS NEEDED
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.methodSubtitle}>
                    Conveniently subtracted from your upcoming weekly carinderia payout.
                  </Text>
                </View>
              </Pressable>

              {/* Business Account Phone Field */}
              <Text style={styles.groupHeader}>BUSINESS CONTACT VERIFICATION</Text>
              <View style={styles.insetGroup}>
                <View style={[styles.inputRow, styles.inputRowLast]}>
                  <Text style={styles.rowLabel}>Merchant Phone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    placeholder="09XX XXX XXXX"
                    placeholderTextColor="rgba(60, 60, 67, 0.3)"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Immediate Activation Toggle */}
              <Text style={styles.groupHeader}>ACTIVATION STATUS</Text>
              <View style={styles.insetGroup}>
                <View style={[styles.toggleRow, styles.inputRowLast]}>
                  <View style={styles.toggleLeft}>
                    <Text style={styles.toggleTitle}>Go Live Immediately</Text>
                    <Text style={styles.toggleSubtitle}>
                      Broadcast promotional banner as soon as payment clears
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

              {/* Checkout / Pay CTA Button */}
              <Pressable
                onPress={handleConfirmAndPay}
                disabled={isProcessing}
                style={({ pressed }) => [
                  styles.primaryPayBtn,
                  isProcessing && { opacity: 0.7 },
                  pressed && styles.pressed,
                ]}
              >
                {isProcessing ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.primaryPayBtnText}>Verifying Payment & Launching...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                    <Text style={styles.primaryPayBtnText}>
                      {paymentMode === 'store_balance'
                        ? `Charge ₱${campaignCost} & Publish Promo`
                        : paymentMode === 'gcash'
                        ? `Pay ₱${campaignCost} via GCash & Publish`
                        : `Complete ₱${campaignCost} via Maya & Publish`}
                    </Text>
                  </View>
                )}
              </Pressable>

              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}
        </View>
      </View>

      {/* Enlarged QR Ph Modal */}
      <Modal visible={showQrModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.qrPaymentModalCard}>
            <View style={styles.qrPaymentModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ExpoImage
                  source={require('../../../assets/icons/qr-ph.svg')}
                  style={{ width: 76, height: 20 }}
                  contentFit="contain"
                />
                <ExpoImage
                  source={require('../../../assets/icons/maya.svg')}
                  style={{ width: 48, height: 14 }}
                  contentFit="contain"
                />
              </View>
              <Pressable onPress={() => setShowQrModal(false)} hitSlop={10}>
                <Ionicons name="close-circle" size={26} color="#8E8E93" />
              </Pressable>
            </View>

            <Text style={styles.qrPaymentTitle}>Scan to Pay Promotion</Text>
            <Text style={styles.qrPaymentSub}>
              Present or scan with your banking or wallet app to activate.
            </Text>

            <View style={styles.qrPaymentBigWrapper}>
              <QRCode
                value={`00020101021226500010ph.qrph0115NAGAPROMO${campaignCost}520458125303608540${campaignCost}5802PH5916NAGA_PROMOTIONS6004NAGA6304`}
                size={190}
                color="#111111"
                backgroundColor="#FFFFFF"
              />
            </View>

            <View style={styles.qrPaymentAmountRow}>
              <Text style={styles.qrPaymentAmountLabel}>Campaign Total:</Text>
              <Text style={styles.qrPaymentAmountValue}>₱{campaignCost}</Text>
            </View>

            <View style={styles.qrMerchantCard}>
              <Text style={styles.qrMerchantName} numberOfLines={1}>{title}</Text>
              <Text style={styles.qrMerchantLoc} numberOfLines={1}>
                {selectedDuration.label} · {targetDistrict}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setShowQrModal(false);
                handleConfirmAndPay();
              }}
              style={styles.qrModalConfirmBtn}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.qrModalConfirmText}>
                Confirm Paid via QR (₱{campaignCost})
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Confirmation Success Modal */}
      <Modal visible={showSuccessModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSuccessCard}>
            <View style={styles.successIconBadge}>
              <Ionicons name="megaphone" size={48} color="#D42F13" />
            </View>
            <Text style={styles.successTitle}>Promotion Published!</Text>
            <Text style={styles.successDesc}>
              Your promotion is now broadcast to foodies in{' '}
              <Text style={{ fontWeight: '700', color: '#111111' }}>{targetDistrict}</Text>.
            </Text>

            <View style={styles.orderSummaryPill}>
              <Text style={styles.orderSummaryPillLabel}>TRANSACTION REFERENCE</Text>
              <Text style={styles.orderSummaryPillValue}>{confirmedPaymentRef}</Text>
              <Text style={styles.orderRefText}>
                {selectedDuration.label} · ₱{campaignCost} Paid via {paymentMode.toUpperCase()}
              </Text>
            </View>

            <Pressable onPress={handleFinish} style={styles.modalDoneBtn}>
              <Text style={styles.modalDoneBtnText}>Go to Business Dashboard</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    width: '100%',
    height: '92%',
    maxHeight: '94%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    maxWidth: 600,
    elevation: 20,
    zIndex: 10,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  stepBadge: {
    backgroundColor: '#FFF0EE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D42F13',
  },
  headerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D42F13',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Preview Card
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  previewImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#E5E5EA',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewImageOverlayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(212, 47, 19, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 3,
  },
  previewDesc: {
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(60, 60, 67, 0.7)',
    marginBottom: 10,
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
    flex: 1,
  },
  previewDishText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
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

  // Image Section Card
  imageSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  imageFilledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imageThumb: {
    width: 80,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  imageActionCols: {
    flex: 1,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  imageSubtitle: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
    marginBottom: 6,
  },
  imageBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  imageSubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  imageSubBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
  },
  imageSubBtnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  imageSubBtnDangerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF3B30',
  },

  imageEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyImageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 3,
  },
  emptyImageDesc: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    lineHeight: 16,
  },
  emptyBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pickPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D42F13',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pickPhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cameraBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
  },

  // Groups and Inputs
  groupHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.4,
    marginBottom: 6,
    marginTop: 14,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  groupHeaderInline: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  selectAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D42F13',
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
    fontSize: 15,
    color: '#000000',
    width: 140,
  },
  rowLabelTop: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    textAlign: 'right',
    padding: 0,
  },
  textAreaRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 19,
    minHeight: 56,
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
    fontSize: 15,
    color: '#000000',
  },
  districtLabelActive: {
    fontWeight: '700',
    color: '#D42F13',
  },

  // Multiple Product Checkbox List
  productCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
    gap: 12,
  },
  checkboxCol: {
    justifyContent: 'center',
  },
  productThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  productInfoCol: {
    flex: 1,
  },
  productCheckTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  productCheckTitleActive: {
    color: '#D42F13',
    fontWeight: '700',
  },
  productMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  productCheckCategory: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  productCheckDot: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.4)',
  },
  productCheckPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },

  // Toggle Row
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
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
  },

  primaryStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D42F13',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
  },
  primaryStepBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // STEP 2 STYLES
  summaryMiniCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 8,
  },
  summaryMiniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryMiniBadge: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  summaryMiniBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryMiniDistrict: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D42F13',
  },
  summaryMiniTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  summaryMiniTargetDishes: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.7)',
  },

  durationOptionsContainer: {
    gap: 8,
    marginBottom: 8,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    gap: 10,
  },
  durationCardActive: {
    borderColor: '#D42F13',
    backgroundColor: '#FFFBFB',
  },
  durationRadioCol: {
    justifyContent: 'center',
  },
  durationBodyCol: {
    flex: 1,
  },
  durationTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  durationBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  durationBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  durationTagline: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 1,
  },
  reachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  reachText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
  },
  durationPriceCol: {
    alignItems: 'flex-end',
  },
  durationPriceText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
  },
  durationOriginalPrice: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.4)',
    textDecorationLine: 'line-through',
  },

  // Bill Card
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    fontWeight: '800',
    color: '#2E7D32',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 8,
  },
  billTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
  },
  billTotalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D42F13',
    letterSpacing: -0.5,
  },

  // Payment Options
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    marginBottom: 8,
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
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodDetails: {
    flex: 1,
    minWidth: 0,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    rowGap: 4,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    flexShrink: 1,
  },
  popularBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
    alignSelf: 'center',
  },
  popularBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  methodSubtitle: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
    lineHeight: 15,
  },

  subFieldContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: -4,
    marginBottom: 10,
  },
  qrPhContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qrPhCodeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 6,
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
    fontWeight: '600',
    color: '#00897B',
  },
  qrPhDetailsCol: {
    flex: 1,
  },
  qrPhTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  qrPhDesc: {
    fontSize: 11,
    color: '#666666',
    marginVertical: 4,
    lineHeight: 15,
  },
  openQrModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#00897B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  openQrModalBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  primaryPayBtn: {
    backgroundColor: '#D42F13',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  primaryPayBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  bottomSpacer: {
    height: 40,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  // Modals Overlay and Success
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrPaymentModalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  qrPaymentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  qrPaymentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
  },
  qrPaymentSub: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrPaymentBigWrapper: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },
  qrPaymentAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  qrPaymentAmountLabel: {
    fontSize: 14,
    color: '#666666',
  },
  qrPaymentAmountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D42F13',
  },
  qrMerchantCard: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrMerchantName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  qrMerchantLoc: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  qrModalConfirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00897B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  qrModalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  modalSuccessCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
  },
  orderSummaryPill: {
    width: '100%',
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 18,
  },
  orderSummaryPillLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  orderSummaryPillValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#D42F13',
    marginTop: 4,
    marginBottom: 4,
  },
  orderRefText: {
    fontSize: 11,
    color: '#666666',
  },
  modalDoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D42F13',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
  },
  modalDoneBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
