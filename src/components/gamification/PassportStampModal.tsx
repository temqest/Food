import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Platform,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImageSourcePropType } from 'react-native';
import { useQuest } from '@/context/QuestContext';

interface PassportStampModalProps {
  visible: boolean;
  onClose: () => void;
  foodId: string;
  foodName: string;
  establishmentId: string;
  establishmentName: string;
  image?: string | ImageSourcePropType;
}

export const PassportStampModal: React.FC<PassportStampModalProps> = ({
  visible,
  onClose,
  foodId,
  foodName,
  establishmentId,
  establishmentName,
  image,
}) => {
  const { logTasting } = useQuest();
  const [rating, setRating] = useState<number>(5);
  const [photoUri, setPhotoUri] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleClose = () => {
    setPhotoUri('');
    setNotes('');
    setRating(5);
    onClose();
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Needed',
          'Please allow camera access in device settings to take a photo of your food and verify your tasting.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error launching camera:', err);
      Alert.alert('Camera Error', 'Could not open camera. Please check your device permissions.');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Gallery Permission Needed',
          'Please allow photo library access in device settings to select a photo of your food.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error launching image library:', err);
      Alert.alert('Upload Error', 'Could not access photo library. Please check your device permissions.');
    }
  };

  const handleSubmit = () => {
    if (!photoUri) {
      Alert.alert(
        'Tasting Photo Required',
        `Please take a photo of your ${foodName} at ${establishmentName} or choose one from your gallery to authenticate your visit and claim your passport stamp.`
      );
      return;
    }

    const result = logTasting({
      foodId,
      foodName,
      establishmentId,
      establishmentName,
      rating,
      notes: notes.trim() || 'Delicious authentic taste!',
      image: photoUri,
    });

    handleClose();

    if (result.newBadgeAwarded) {
      Alert.alert(
        '🎉 Badge Unlocked!',
        `You earned the "${result.newBadgeAwarded.name}" badge and +${result.newBadgeAwarded.xpReward} XP! Check your Passport.`
      );
    } else {
      Alert.alert('Stamp Added!', 'Dish verified with photo and logged in your Naga Food Passport (+60 XP)!');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Full-bleed darkened backdrop covering 100% of the screen all the way up */}
        <Pressable
          style={styles.backdrop}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss stamp modal"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
          pointerEvents="box-none"
        >
          <View style={styles.sheet}>
            {/* Grab Handle */}
            <View style={styles.handleBar}>
              <View style={styles.handle} />
            </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.stampIcon}>
              <Ionicons name="ribbon" size={20} color="#D42F13" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.sheetTitle}>Stamp Your Passport</Text>
              <Text style={styles.sheetSubtitle} numberOfLines={1}>
                Log tasting at {establishmentName}
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              hitSlop={10}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Ionicons name="close" size={22} color="#8E8E93" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Dish info badge */}
            <View style={styles.dishPillRow}>
              <View style={styles.dishPill}>
                <Ionicons name="restaurant-outline" size={14} color="#D42F13" style={{ marginRight: 6 }} />
                <Text style={styles.dishPillName}>{foodName}</Text>
              </View>
              <View style={styles.xpPill}>
                <Ionicons name="sparkles" size={12} color="#D97706" style={{ marginRight: 4 }} />
                <Text style={styles.xpPillText}>+60 XP</Text>
              </View>
            </View>

            {/* Flavor Rating */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Flavor Rating</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starPressable}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={`Rate ${star} star`}
                  >
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={28}
                      color="#FF9500"
                    />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Dish Proof Photo (REQUIRED) - Replaced Bicolano Heat Level */}
            <View style={styles.fieldSection}>
              <View style={styles.photoHeaderRow}>
                <Text style={styles.fieldLabel}>Proof of Tasting Photo</Text>
                <View style={photoUri ? styles.verifiedBadge : styles.requiredBadge}>
                  <Ionicons
                    name={photoUri ? 'checkmark-circle' : 'alert-circle'}
                    size={13}
                    color={photoUri ? '#2E7D32' : '#D42F13'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={photoUri ? styles.verifiedBadgeText : styles.requiredBadgeText}>
                    {photoUri ? 'PHOTO VERIFIED' : 'REQUIRED'}
                  </Text>
                </View>
              </View>

              <Text style={styles.photoSubtitle}>
                Snap a photo of your dish or bowl to prove your visit and claim your official stamp.
              </Text>

              {photoUri ? (
                <View style={styles.photoPreviewCard}>
                  <Image source={{ uri: photoUri }} style={styles.photoPreviewImage} />
                  <View style={styles.photoOverlayBadge}>
                    <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.photoOverlayText}>Tasting Authenticated</Text>
                  </View>

                  <View style={styles.previewActionsRow}>
                    <Pressable
                      onPress={takePhoto}
                      style={({ pressed }) => [styles.photoActionBtn, pressed && styles.btnPressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Retake tasting photo"
                    >
                      <Ionicons name="camera-outline" size={15} color="#1C1C1E" style={{ marginRight: 4 }} />
                      <Text style={styles.photoActionText}>Retake</Text>
                    </Pressable>

                    <Pressable
                      onPress={pickImage}
                      style={({ pressed }) => [styles.photoActionBtn, pressed && styles.btnPressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Change photo from gallery"
                    >
                      <Ionicons name="images-outline" size={15} color="#1C1C1E" style={{ marginRight: 4 }} />
                      <Text style={styles.photoActionText}>Gallery</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setPhotoUri('')}
                      style={({ pressed }) => [styles.photoActionBtn, styles.photoActionBtnDanger, pressed && styles.btnPressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Remove photo"
                    >
                      <Ionicons name="trash-outline" size={15} color="#D42F13" style={{ marginRight: 4 }} />
                      <Text style={styles.photoActionTextDanger}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.photoUploadCard}>
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="camera" size={24} color="#D42F13" />
                  </View>
                  <Text style={styles.uploadCardTitle}>Add Dish Photo to Stamp</Text>
                  <Text style={styles.uploadCardSubtitle}>
                    Take a fresh picture of your food or select from your camera roll
                  </Text>

                  <View style={styles.uploadBtnRow}>
                    <Pressable
                      onPress={takePhoto}
                      style={({ pressed }) => [styles.takePhotoBtn, pressed && styles.btnPressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Take photo with camera"
                    >
                      <Ionicons name="camera" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.takePhotoBtnText}>Take Photo</Text>
                    </Pressable>

                    <Pressable
                      onPress={pickImage}
                      style={({ pressed }) => [styles.chooseGalleryBtn, pressed && styles.btnPressed]}
                      accessibilityRole="button"
                      accessibilityLabel="Choose from gallery"
                    >
                      <Ionicons name="images-outline" size={16} color="#1C1C1E" style={{ marginRight: 6 }} />
                      <Text
                        style={styles.chooseGalleryBtnText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.85}
                      >
                        From Gallery
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            {/* Tasting Notes */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>Explorer Field Notes (Optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g. Rich simmered broth with tender beef, paired with calamansi and sili..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={3}
                style={styles.textInput}
              />
            </View>

            {/* Submit Action */}
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                !photoUri && styles.submitBtnPending,
                pressed && styles.submitBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Stamp passport"
            >
              <Ionicons
                name={photoUri ? 'checkmark-circle' : 'camera-outline'}
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.submitBtnText}>
                {photoUri ? 'Stamp Passport & Claim +60 XP' : 'Take Photo to Stamp (+60 XP)'}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  keyboardAvoid: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  handleBar: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  stampIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.60)',
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
  },
  scrollBody: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 38 : 24,
  },
  dishPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dishPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.15)',
  },
  dishPillName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D42F13',
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  fieldSection: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.85)',
    letterSpacing: -0.1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  starPressable: {
    padding: 2,
  },

  // Photo Section Styles
  photoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  requiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
  },
  requiredBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.25)',
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.2,
  },
  photoSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.65)',
    lineHeight: 16,
    marginBottom: 10,
  },
  photoUploadCard: {
    backgroundColor: '#FAF9F9',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D42F13',
    padding: 16,
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 47, 19, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  uploadCardSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.65)',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  uploadBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  takePhotoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D42F13',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  takePhotoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  chooseGalleryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  chooseGalleryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.1,
  },

  // Photo Preview Card
  photoPreviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  photoPreviewImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  photoOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  photoOverlayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
  },
  photoActionBtnDanger: {
    backgroundColor: '#FFF2F2',
  },
  photoActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  photoActionTextDanger: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
  },

  textInput: {
    backgroundColor: '#F8F8FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
    fontSize: 14,
    color: '#000000',
    minHeight: 70,
    textAlignVertical: 'top',
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitBtnPending: {
    backgroundColor: '#E65100',
  },
  submitBtnPressed: {
    opacity: 0.88,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  btnPressed: {
    opacity: 0.75,
  },
});
