import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useBusiness } from '@/context/BusinessContext';
import { useAuth } from '@/context/AuthContext';

const BUSINESS_CATEGORIES = [
  { id: 'carinderia', label: 'Carinderia & Turo-Turo', icon: 'restaurant-outline' },
  { id: 'kinalas-station', label: 'Heritage Kinalas Station', icon: 'flame-outline' },
  { id: 'heritage-restaurant', label: 'Bicolano Heritage Dining', icon: 'ribbon-outline' },
  { id: 'bakery', label: 'Bakery & Kakanin', icon: 'cafe-outline' },
  { id: 'street-stall', label: 'Merienda & Street Stall', icon: 'bicycle-outline' },
  { id: 'specialty-cafe', label: 'Specialty Cafe & Sweets', icon: 'beer-outline' },
  { id: 'pasalubong', label: 'Pasalubong Center', icon: 'gift-outline' },
];

const NAGA_DISTRICTS = [
  'Centro',
  'Barlin St / Santa Cruz',
  'Peñafrancia',
  'Magsaysay Ave',
  'Bagumbayan',
  'Concepcion Pequeña',
  'Concepcion Grande',
  'Poro / San Felipe',
  'Triangulo',
  'Carolina / Uplands',
];

const ATMOSPHERE_OPTIONS = [
  'Casual Dining',
  'Open Air Kitchen',
  'Heritage Recipe',
  'Fast Service',
  'Air Conditioned',
  'Outdoor Seating',
  'GCash Accepted',
  'Cash Only',
  'Family Friendly',
  'Late Night',
  'Street Parking',
];

const DISH_CATEGORIES = [
  { id: 'soups-noodles', label: 'Soups & Noodles' },
  { id: 'main-dishes', label: 'Main Dishes (Ulam)' },
  { id: 'rice-meals', label: 'Rice Meals & Silog' },
  { id: 'snacks-merienda', label: 'Snacks & Merienda' },
  { id: 'desserts-beverages', label: 'Desserts & Drinks' },
];

// Curated high quality presets for quick photo selection
const PRESET_BANNERS = [
  { label: 'Kinalas Station', uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80' },
  { label: 'Carinderia & Pots', uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80' },
  { label: 'Heritage Dining', uri: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=900&q=80' },
  { label: 'Bakery & Oven', uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80' },
];

export default function BusinessRegisterScreen() {
  const { registerBusiness } = useBusiness();
  const { user, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 1: Establishment Info
  const [storeName, setStoreName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [tagline, setTagline] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(NAGA_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [openingHours, setOpeningHours] = useState('7:00 AM – 8:30 PM');
  const [description, setDescription] = useState('');

  // Step 2: Branding & Imagery
  const [heroImage, setHeroImage] = useState(PRESET_BANNERS[0].uri);
  const [logoImage, setLogoImage] = useState(PRESET_BANNERS[0].uri);
  const [selectedAtmosphere, setSelectedAtmosphere] = useState<string[]>([
    'Casual Dining',
    'Heritage Recipe',
    'GCash Accepted',
  ]);

  // Step 3: First Signature Dish
  const [dishName, setDishName] = useState('');
  const [dishBikolName, setDishBikolName] = useState('');
  const [dishCategory, setDishCategory] = useState(DISH_CATEGORIES[0]);
  const [dishPrice, setDishPrice] = useState('85');
  const [dishPrepTime, setDishPrepTime] = useState('5–10 mins');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState(PRESET_BANNERS[0].uri);

  // Step 4: Confirmation
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Image pickers
  const handlePickImage = async (target: 'hero' | 'logo' | 'dish') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Please allow gallery access to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        if (target === 'hero') setHeroImage(uri);
        else if (target === 'logo') setLogoImage(uri);
        else if (target === 'dish') setDishImage(uri);
      }
    } catch {
      Alert.alert('Upload Error', 'Could not access device photos.');
    }
  };

  const handleTakePhoto = async (target: 'hero' | 'logo' | 'dish') => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Please allow camera access to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const uri = result.assets[0].uri;
        if (target === 'hero') setHeroImage(uri);
        else if (target === 'logo') setLogoImage(uri);
        else if (target === 'dish') setDishImage(uri);
      }
    } catch {
      Alert.alert('Camera Error', 'Could not access device camera.');
    }
  };

  const toggleAtmosphere = (tag: string) => {
    setSelectedAtmosphere((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Step navigation validations
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!storeName.trim()) {
        Alert.alert('Validation Error', 'Please enter your food establishment name.');
        return;
      }
      if (!address.trim()) {
        Alert.alert('Validation Error', 'Please enter the street address in Naga City.');
        return;
      }
      if (!contactNumber.trim()) {
        Alert.alert('Validation Error', 'Please enter a contact phone or hotline.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!dishName.trim()) {
        Alert.alert('Validation Error', 'Please give your first signature dish a name.');
        return;
      }
      if (!dishPrice.trim() || isNaN(Number(dishPrice))) {
        Alert.alert('Validation Error', 'Please enter a valid price in ₱.');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleFinalSubmit = async () => {
    if (!agreedToTerms) {
      Alert.alert(
        'Confirmation Required',
        'Please confirm that this business is located in or serving Naga City.'
      );
      return;
    }

    if (!isAuthenticated || !user) {
      Alert.alert(
        'Sign In Required',
        'Please sign in or create an account before launching your business.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') },
        ]
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerBusiness({
        name: storeName.trim(),
        tagline: tagline.trim() || `Authentic ${selectedCategory.label} in ${selectedDistrict}`,
        type: selectedCategory.id,
        typeLabel: selectedCategory.label,
        description: description.trim() || `${storeName} proudly serves locals and visitors in ${selectedDistrict}, Naga City.`,
        address: address.trim(),
        neighborhood: selectedDistrict,
        contactNumber: contactNumber.trim(),
        openingHours: openingHours.trim(),
        heroImage,
        logoImage,
        atmosphereTags: selectedAtmosphere,
        initialProduct: {
          name: dishName.trim(),
          bikolName: dishBikolName.trim() || undefined,
          description: dishDescription.trim() || `Our star specialty, served hot and fresh.`,
          category: dishCategory.id,
          categoryLabel: dishCategory.label,
          price: Number(dishPrice) || 85,
          prepTime: dishPrepTime.trim() || '5–10 mins',
          image: dishImage,
          isSignature: true,
        },
      });

      if (res.success) {
        Alert.alert(
          '🎉 Store Registered!',
          `Welcome to the Naga Food Partner community! "${storeName}" is now registered in the database.`,
          [
            {
              text: 'Open Merchant Portal',
              onPress: () => router.replace('/business?tab=store'),
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', res.error || 'Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={handlePrevStep}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color="#111111" />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Register Food Business</Text>
            <Text style={styles.headerSubtitle}>Step {currentStep} of 4</Text>
          </View>
          <Pressable
            onPress={() => router.replace('/profile')}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Cancel onboarding"
          >
            <Ionicons name="close" size={22} color="#8E8E93" />
          </Pressable>
        </View>

        {/* Step Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(currentStep / 4) * 100}%` },
            ]}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: ESTABLISHMENT DETAILS */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Ionicons name="storefront" size={16} color="#D42F13" />
                </View>
                <Text style={styles.stepTitle}>Establishment Profile</Text>
                <Text style={styles.stepDesc}>
                  Tell Naga foodies who you are, what you specialize in, and where to find you.
                </Text>
              </View>

              {/* Business Name */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Business / Eatery Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Aling Bebang’s Kinalas & Sinanglay"
                  placeholderTextColor="#8E8E93"
                  value={storeName}
                  onChangeText={setStoreName}
                />
              </View>

              {/* Category Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Culinary Category <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.categoryGrid}>
                  {BUSINESS_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => setSelectedCategory(cat)}
                        style={[
                          styles.categoryPill,
                          isSelected && styles.categoryPillActive,
                        ]}
                      >
                        <Ionicons
                          name={cat.icon as any}
                          size={16}
                          color={isSelected ? '#FFFFFF' : '#111111'}
                        />
                        <Text
                          style={[
                            styles.categoryPillText,
                            isSelected && styles.categoryPillTextActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Tagline */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Store Tagline</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Authentic Barlin broth simmered since 1998"
                  placeholderTextColor="#8E8E93"
                  value={tagline}
                  onChangeText={setTagline}
                />
              </View>

              {/* District Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Naga District / Zone <Text style={styles.requiredStar}>*</Text>
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollList}
                >
                  {NAGA_DISTRICTS.map((dist) => {
                    const isSelected = selectedDistrict === dist;
                    return (
                      <Pressable
                        key={dist}
                        onPress={() => setSelectedDistrict(dist)}
                        style={[
                          styles.districtPill,
                          isSelected && styles.districtPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.districtPillText,
                            isSelected && styles.districtPillTextActive,
                          ]}
                        >
                          {dist}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Street Address */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Physical Address <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Barlin St. cor. Dimasalang St., Santa Cruz"
                  placeholderTextColor="#8E8E93"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              {/* Phone & Hours */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>
                    Hotline / Mobile <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0917 ••• ••••"
                    placeholderTextColor="#8E8E93"
                    keyboardType="phone-pad"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Opening Hours</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="7:00 AM – 8:30 PM"
                    placeholderTextColor="#8E8E93"
                    value={openingHours}
                    onChangeText={setOpeningHours}
                  />
                </View>
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>About Your Eatery</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Share your culinary heritage, secret family recipes, or what makes your dining experience special..."
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={3}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>
          )}

          {/* STEP 2: BRANDING & ATMOSPHERE */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Ionicons name="images" size={16} color="#D42F13" />
                </View>
                <Text style={styles.stepTitle}>Store Photos & Atmosphere</Text>
                <Text style={styles.stepDesc}>
                  Upload photos of your storefront and select the vibes Naga diners can expect.
                </Text>
              </View>

              {/* Cover Banner Preview */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Store Cover Banner</Text>
                <View style={styles.bannerPreviewBox}>
                  <Image source={{ uri: heroImage }} style={styles.bannerImage} />
                  <View style={styles.bannerOverlayActions}>
                    <Pressable
                      onPress={() => handlePickImage('hero')}
                      style={styles.bannerActionBtn}
                    >
                      <Ionicons name="images-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.bannerActionBtnText}>Gallery</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleTakePhoto('hero')}
                      style={styles.bannerActionBtn}
                    >
                      <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.bannerActionBtnText}>Take Photo</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Banner Presets */}
                <Text style={styles.presetLabel}>Or select an authentic Naga preset:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
                  {PRESET_BANNERS.map((p, i) => (
                    <Pressable
                      key={i}
                      onPress={() => setHeroImage(p.uri)}
                      style={[
                        styles.presetThumbWrap,
                        heroImage === p.uri && styles.presetThumbActive,
                      ]}
                    >
                      <Image source={{ uri: p.uri }} style={styles.presetThumb} />
                      <Text style={styles.presetThumbText}>{p.label}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Profile Logo Avatar */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Store Logo / Avatar</Text>
                <View style={styles.logoRow}>
                  <Image source={{ uri: logoImage }} style={styles.logoPreview} />
                  <View style={styles.logoBtnCol}>
                    <Pressable
                      onPress={() => handlePickImage('logo')}
                      style={styles.uploadSecondaryBtn}
                    >
                      <Ionicons name="image-outline" size={14} color="#111111" />
                      <Text style={styles.uploadSecondaryBtnText}>Upload Logo</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setLogoImage(heroImage)}
                      style={styles.linkActionBtn}
                    >
                      <Text style={styles.linkActionText}>Use Banner as Logo</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Atmosphere Tags */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Atmosphere & Highlights</Text>
                <View style={styles.tagWrap}>
                  {ATMOSPHERE_OPTIONS.map((tag) => {
                    const isSelected = selectedAtmosphere.includes(tag);
                    return (
                      <Pressable
                        key={tag}
                        onPress={() => toggleAtmosphere(tag)}
                        style={[styles.tagPill, isSelected && styles.tagPillActive]}
                      >
                        <Ionicons
                          name={isSelected ? 'checkmark' : 'add'}
                          size={14}
                          color={isSelected ? '#D42F13' : '#666666'}
                        />
                        <Text
                          style={[
                            styles.tagPillText,
                            isSelected && styles.tagPillTextActive,
                          ]}
                        >
                          {tag}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: FIRST SIGNATURE DISH */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Ionicons name="fast-food" size={16} color="#D42F13" />
                </View>
                <Text style={styles.stepTitle}>Your First Signature Dish</Text>
                <Text style={styles.stepDesc}>
                  Every Naga spot has a crowd-pleaser! Add your star dish so hungry diners can place pre-orders immediately.
                </Text>
              </View>

              {/* Dish Name */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>
                  Dish Name <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Special Marrow Beef Kinalas with Egg"
                  placeholderTextColor="#8E8E93"
                  value={dishName}
                  onChangeText={setDishName}
                />
              </View>

              {/* Bikol Dialect Name */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Bikol / Native Name (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Kinalas na may Itlog buda Utok"
                  placeholderTextColor="#8E8E93"
                  value={dishBikolName}
                  onChangeText={setDishBikolName}
                />
              </View>

              {/* Dish Category */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categoryGrid}>
                  {DISH_CATEGORIES.map((cat) => {
                    const isSelected = dishCategory.id === cat.id;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => setDishCategory(cat)}
                        style={[
                          styles.categoryPill,
                          isSelected && styles.categoryPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryPillText,
                            isSelected && styles.categoryPillTextActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Price & Prep Time */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>
                    Price (₱) <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="85"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                    value={dishPrice}
                    onChangeText={setDishPrice}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Prep Time</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="5–10 mins"
                    placeholderTextColor="#8E8E93"
                    value={dishPrepTime}
                    onChangeText={setDishPrepTime}
                  />
                </View>
              </View>

              {/* Dish Description */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Dish Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Rich savory bone broth, generous beef scrapings, and golden brown gravy..."
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={3}
                  value={dishDescription}
                  onChangeText={setDishDescription}
                />
              </View>

              {/* Dish Image */}
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Dish Photo</Text>
                <View style={styles.dishPhotoBox}>
                  <Image source={{ uri: dishImage }} style={styles.dishPhotoImage} />
                  <View style={styles.dishPhotoActions}>
                    <Pressable
                      onPress={() => handlePickImage('dish')}
                      style={styles.uploadSecondaryBtn}
                    >
                      <Ionicons name="images-outline" size={14} color="#111111" />
                      <Text style={styles.uploadSecondaryBtnText}>Gallery</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleTakePhoto('dish')}
                      style={styles.uploadSecondaryBtn}
                    >
                      <Ionicons name="camera-outline" size={14} color="#111111" />
                      <Text style={styles.uploadSecondaryBtnText}>Camera</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* STEP 4: REVIEW & LAUNCH */}
          {currentStep === 4 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Ionicons name="rocket" size={16} color="#D42F13" />
                </View>
                <Text style={styles.stepTitle}>Review &amp; Launch</Text>
                <Text style={styles.stepDesc}>
                  Your digital storefront is ready to hit the Naga Food community map and search.
                </Text>
              </View>

              {/* Storefront Card Preview */}
              <View style={styles.storePreviewCard}>
                <Image source={{ uri: heroImage }} style={styles.cardPreviewBanner} />
                <View style={styles.cardPreviewLogoWrap}>
                  <Image source={{ uri: logoImage }} style={styles.cardPreviewLogo} />
                </View>

                <View style={styles.cardPreviewBody}>
                  <View style={styles.cardPreviewHeader}>
                    <Text style={styles.cardPreviewTitle}>{storeName || 'Your Store'}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>READY</Text>
                    </View>
                  </View>

                  <Text style={styles.cardPreviewTagline}>
                    {tagline || `${selectedCategory.label} in ${selectedDistrict}`}
                  </Text>

                  <View style={styles.cardMetaRow}>
                    <Ionicons name="location-outline" size={13} color="#D42F13" />
                    <Text style={styles.cardMetaText}>{address}, {selectedDistrict}</Text>
                  </View>

                  <View style={styles.cardMetaRow}>
                    <Ionicons name="time-outline" size={13} color="#666666" />
                    <Text style={styles.cardMetaText}>{openingHours} · {contactNumber}</Text>
                  </View>

                  {/* Initial Dish Preview */}
                  <View style={styles.dishPreviewRow}>
                    <Image source={{ uri: dishImage }} style={styles.dishPreviewThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dishPreviewTitle}>{dishName}</Text>
                      <Text style={styles.dishPreviewSub}>
                        {dishCategory.label} · {dishPrepTime}
                      </Text>
                    </View>
                    <Text style={styles.dishPreviewPrice}>₱{dishPrice}</Text>
                  </View>
                </View>
              </View>

              {/* Terms Checkbox */}
              <Pressable
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                style={styles.termsRow}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
                  {agreedToTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I verify that this food establishment operates in Naga City / Camarines Sur and agree to accept Naga Food digital orders and customer visits.
                </Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Bottom Sticky Action Bar */}
        <View style={styles.bottomBar}>
          {currentStep < 4 ? (
            <Pressable
              onPress={handleNextStep}
              style={({ pressed }) => [styles.primaryNextBtn, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={styles.primaryNextBtnText}>
                Continue to Step {currentStep + 1}
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleFinalSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.primaryNextBtn,
                styles.launchBtn,
                pressed && styles.pressed,
                isSubmitting && { opacity: 0.7 },
              ]}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="rocket-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryNextBtnText}>Launch My Naga Food Store</Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  backBtn: {
    padding: 6,
  },
  closeBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#D42F13',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stepContainer: {
    gap: 16,
  },
  stepHeader: {
    marginBottom: 8,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDECE9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.3,
  },
  stepDesc: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    lineHeight: 20,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  requiredStar: {
    color: '#D42F13',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111111',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryPillActive: {
    backgroundColor: '#D42F13',
    borderColor: '#D42F13',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  horizontalScrollList: {
    gap: 8,
    paddingVertical: 4,
  },
  districtPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  districtPillActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  districtPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  districtPillTextActive: {
    color: '#FFFFFF',
  },
  bannerPreviewBox: {
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E5EA',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlayActions: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  bannerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bannerActionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 6,
  },
  presetThumbWrap: {
    marginRight: 10,
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  presetThumbActive: {
    borderColor: '#D42F13',
  },
  presetThumb: {
    width: 70,
    height: 50,
    borderRadius: 8,
  },
  presetThumbText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  logoPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
  },
  logoBtnCol: {
    flex: 1,
    gap: 6,
  },
  uploadSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  uploadSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111111',
  },
  linkActionBtn: {
    alignSelf: 'flex-start',
  },
  linkActionText: {
    fontSize: 12,
    color: '#D42F13',
    fontWeight: '600',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagPillActive: {
    backgroundColor: '#FDECE9',
    borderColor: '#D42F13',
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  tagPillTextActive: {
    color: '#D42F13',
    fontWeight: '700',
  },
  dishPhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dishPhotoImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
  },
  dishPhotoActions: {
    flex: 1,
    gap: 6,
  },
  storePreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPreviewBanner: {
    height: 120,
    width: '100%',
  },
  cardPreviewLogoWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginTop: -28,
    marginLeft: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardPreviewLogo: {
    width: '100%',
    height: '100%',
  },
  cardPreviewBody: {
    padding: 16,
    gap: 6,
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPreviewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cardPreviewTagline: {
    fontSize: 13,
    color: '#666666',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  cardMetaText: {
    fontSize: 12,
    color: '#555555',
  },
  dishPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9F9FB',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F0F3',
  },
  dishPreviewThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  dishPreviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
  },
  dishPreviewSub: {
    fontSize: 11,
    color: '#8E8E93',
  },
  dishPreviewPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D42F13',
  },
  termsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: '#D42F13',
    borderColor: '#D42F13',
  },
  termsText: {
    fontSize: 12,
    color: '#555555',
    flex: 1,
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  primaryNextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 14,
  },
  launchBtn: {
    backgroundColor: '#D42F13',
  },
  primaryNextBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
