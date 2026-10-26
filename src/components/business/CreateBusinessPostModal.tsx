import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { useBusiness, BusinessProduct } from '@/context/BusinessContext';
import { IOSTokens } from '@/constants/theme';

interface CreateBusinessPostModalProps {
  visible: boolean;
  onClose: () => void;
}

type BusinessPostCategory = 'fresh_batch' | 'daily_special' | 'announcement' | 'dish_spotlight';

const CATEGORY_PILLS: { id: BusinessPostCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'fresh_batch', label: 'Fresh Batch', icon: 'flame' },
  { id: 'daily_special', label: 'Daily Special', icon: 'restaurant' },
  { id: 'dish_spotlight', label: 'Dish Spotlight', icon: 'star' },
  { id: 'announcement', label: 'Announcement', icon: 'megaphone' },
];

const QUICK_TAGS = [
  '#FreshBatch',
  '#NagaEats',
  '#DailySpecial',
  '#TaraKain',
  '#BestKinalas',
  '#CentroNaga',
];

export const CreateBusinessPostModal: React.FC<CreateBusinessPostModalProps> = ({
  visible,
  onClose,
}) => {
  const { createPost } = useSocialFeed();
  const { profile, products } = useBusiness();

  const [category, setCategory] = useState<BusinessPostCategory>('fresh_batch');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [photoAspectRatio, setPhotoAspectRatio] = useState<number | undefined>(undefined);
  const [caption, setCaption] = useState('');
  const [selectedDish, setSelectedDish] = useState<BusinessProduct | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#NagaEats', '#FreshBatch']);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedPhoto(asset.uri);
        if (asset.width && asset.height) {
          setPhotoAspectRatio(asset.width / asset.height);
        } else if (asset.uri) {
          Image.getSize(
            asset.uri,
            (w, h) => {
              if (w > 0 && h > 0) setPhotoAspectRatio(w / h);
            },
            () => {}
          );
        }
      }
    } catch (err) {
      console.warn('Error launching image library:', err);
      Alert.alert(
        'Upload Error',
        'Could not access photo library. Please check your device permissions.'
      );
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access in device settings to take a photo of your food.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedPhoto(asset.uri);
        if (asset.width && asset.height) {
          setPhotoAspectRatio(asset.width / asset.height);
        } else if (asset.uri) {
          Image.getSize(
            asset.uri,
            (w, h) => {
              if (w > 0 && h > 0) setPhotoAspectRatio(w / h);
            },
            () => {}
          );
        }
      }
    } catch (err) {
      console.warn('Error launching camera:', err);
      Alert.alert(
        'Camera Error',
        'Could not open camera. Please check your device permissions.'
      );
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectDish = (prod: BusinessProduct) => {
    if (selectedDish?.id === prod.id) {
      setSelectedDish(null);
    } else {
      setSelectedDish(prod);
      // Auto-set photo if not already selected
      if (!selectedPhoto && prod.image) {
        setSelectedPhoto(prod.image);
      }
    }
  };

  const handleClose = () => {
    setSelectedPhoto('');
    setPhotoAspectRatio(undefined);
    setCaption('');
    setSelectedDish(null);
    setCategory('fresh_batch');
    setSelectedTags(['#NagaEats', '#FreshBatch']);
    onClose();
  };

  const handleSubmit = () => {
    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please share an update or details for your foodies.');
      return;
    }

    const postPhoto = selectedPhoto || selectedDish?.image || profile.heroImage;

    const mappedPostType =
      category === 'announcement'
        ? 'business_announcement'
        : category === 'dish_spotlight'
        ? 'dish_spotlight'
        : 'business_announcement';

    createPost({
      authorType: 'business',
      establishmentId: profile.id,
      establishmentName: profile.name,
      authorAvatar: profile.heroImage,
      authorHandle: `@${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      postType: mappedPostType,
      caption: caption.trim(),
      image: postPhoto,
      aspectRatio: photoAspectRatio,
      foodId: selectedDish?.foodId,
      foodName: selectedDish?.name,
      foodPrice: selectedDish ? `₱${selectedDish.price}` : undefined,
      district: `${profile.neighborhood}, Naga City`,
      tags: selectedTags,
    });

    Alert.alert('Post Published!', 'Your update is now live on the Naga Social Feed.');
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Backdrop Pressable to dismiss */}
        <Pressable style={styles.backdrop} onPress={handleClose} />

        {/* Bounded Bottom Sheet */}
        <View style={styles.sheetContainer}>
          {/* Grab Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>New Store Post</Text>
              <Text style={styles.headerSubtitle}>Broadcast an update to Naga foodies</Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={styles.closeBtn}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close post modal"
            >
              <Ionicons name="close" size={20} color="#8E8E93" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Business Identity Banner */}
            <View style={styles.bizIdentityRow}>
              <Image source={{ uri: profile.heroImage }} style={styles.bizAvatar} />
              <View style={styles.bizMetaCol}>
                <View style={styles.bizNameRow}>
                  <Text style={styles.bizName} numberOfLines={1}>{profile.name}</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" style={styles.verifiedIcon} />
                </View>
                <Text style={styles.bizBadgeText}>Posting as Verified Local Eatery</Text>
              </View>
            </View>

            {/* Post Category Pills */}
            <Text style={styles.fieldLabel}>POST TYPE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORY_PILLS.map((pill) => {
                const isActive = category === pill.id;
                return (
                  <Pressable
                    key={pill.id}
                    onPress={() => setCategory(pill.id)}
                    style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  >
                    <Ionicons
                      name={pill.icon}
                      size={15}
                      color={isActive ? '#FFFFFF' : '#1C1C1E'}
                    />
                    <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                      {pill.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Photo Selection Area */}
            <Text style={styles.fieldLabel}>FOOD OR STORE PHOTO</Text>
            {selectedPhoto ? (
              <View style={styles.photoPreviewCard}>
                <Image source={{ uri: selectedPhoto }} style={styles.photoPreviewImage} />
                <View style={styles.photoPreviewActions}>
                  <Pressable onPress={pickImage} style={styles.photoActionBtn}>
                    <Ionicons name="images-outline" size={15} color="#1C1C1E" />
                    <Text style={styles.photoActionText}>Change</Text>
                  </Pressable>
                  <Pressable onPress={takePhoto} style={styles.photoActionBtn}>
                    <Ionicons name="camera-outline" size={15} color="#1C1C1E" />
                    <Text style={styles.photoActionText}>Retake</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setSelectedPhoto('');
                      setPhotoAspectRatio(undefined);
                    }}
                    style={[styles.photoActionBtn, styles.photoActionBtnDanger]}
                  >
                    <Ionicons name="trash-outline" size={15} color="#D42F13" />
                    <Text style={styles.photoActionTextDanger}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.photoUploadCard}>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="camera-outline" size={28} color="#D42F13" />
                </View>
                <Text style={styles.uploadTitle}>Showcase your delicious food</Text>
                <Text style={styles.uploadSubtitle}>
                  Take a fresh picture of today’s simmering pots or pick from your gallery
                </Text>

                <View style={styles.uploadBtnRow}>
                  <Pressable
                    onPress={pickImage}
                    style={({ pressed }) => [styles.uploadPrimaryBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="images" size={18} color="#FFFFFF" />
                    <Text style={styles.uploadPrimaryBtnText}>Choose from Gallery</Text>
                  </Pressable>

                  <Pressable
                    onPress={takePhoto}
                    style={({ pressed }) => [styles.uploadSecondaryBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="camera" size={18} color="#1C1C1E" />
                    <Text style={styles.uploadSecondaryBtnText}>Take Photo</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Caption Input */}
            <Text style={styles.fieldLabel}>WHAT&apos;S HAPPENING AT YOUR STORE?</Text>
            <View style={styles.captionInputWrapper}>
              <TextInput
                style={styles.captionInput}
                placeholder="e.g., Fresh broth simmering since 4 AM! Rich beef brain gravy and tender puto ready for morning foodies. Drop by before lunch! 🍲"
                placeholderTextColor="#8E8E93"
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={400}
              />
              <Text style={styles.charCount}>{caption.length} / 400</Text>
            </View>

            {/* Tag a Dish from Store Menu */}
            {products.length > 0 && (
              <>
                <View style={styles.dishSectionHeader}>
                  <Text style={styles.fieldLabel}>FEATURE A DISH (OPTIONAL)</Text>
                  {selectedDish && (
                    <Pressable onPress={() => setSelectedDish(null)}>
                      <Text style={styles.clearDishText}>Clear tag</Text>
                    </Pressable>
                  )}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dishScroll}>
                  {products.map((prod) => {
                    const isSelected = selectedDish?.id === prod.id;
                    return (
                      <Pressable
                        key={prod.id}
                        onPress={() => handleSelectDish(prod)}
                        style={[styles.dishChip, isSelected && styles.dishChipSelected]}
                      >
                        <Image source={{ uri: prod.image }} style={styles.dishChipThumb} />
                        <View style={styles.dishChipInfo}>
                          <Text style={[styles.dishChipName, isSelected && styles.dishChipNameSelected]} numberOfLines={1}>
                            {prod.name}
                          </Text>
                          <Text style={[styles.dishChipPrice, isSelected && styles.dishChipPriceSelected]}>
                            ₱{prod.price}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={styles.dishCheck} />
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {/* Quick Hashtags */}
            <Text style={styles.fieldLabel}>QUICK HASHTAGS</Text>
            <View style={styles.tagsRow}>
              {QUICK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Pressable
                    key={tag}
                    onPress={() => handleToggleTag(tag)}
                    style={[styles.tagPill, isSelected && styles.tagPillActive]}
                  >
                    <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Sticky Bottom Action */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Publish store post"
            >
              <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Publish to Naga Feed</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    width: '100%',
    height: '88%',
    maxHeight: '92%',
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
      },
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  bizIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    marginBottom: 16,
  },
  bizAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E5EA',
  },
  bizMetaCol: {
    flex: 1,
    marginLeft: 12,
  },
  bizNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bizName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    flexShrink: 1,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  bizBadgeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 8,
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: '#1C1C1E',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  photoPreviewCard: {
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },
  photoPreviewImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5EA',
  },
  photoPreviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFF4',
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  photoActionBtnDanger: {
    // red action
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  photoActionTextDanger: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D42F13',
  },
  photoUploadCard: {
    backgroundColor: '#FFF8F6',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#F8B4A6',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFE9E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  uploadBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  uploadPrimaryBtn: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D42F13',
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 8,
  },
  uploadPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  uploadSecondaryBtn: {
    flex: 0.85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 6,
  },
  uploadSecondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.2,
  },
  captionInputWrapper: {
    backgroundColor: '#F9F9FB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 14,
    marginBottom: 14,
  },
  captionInput: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    minHeight: 88,
  },
  charCount: {
    fontSize: 11,
    color: '#C7C7CC',
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  dishSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 8,
  },
  clearDishText: {
    fontSize: 12,
    color: '#D42F13',
    fontWeight: '600',
  },
  dishScroll: {
    marginBottom: 16,
  },
  dishChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 8,
    paddingRight: 12,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dishChipSelected: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  dishChipThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
  },
  dishChipInfo: {
    marginLeft: 8,
  },
  dishChipName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    maxWidth: 130,
  },
  dishChipNameSelected: {
    color: '#FFFFFF',
  },
  dishChipPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
    marginTop: 2,
  },
  dishChipPriceSelected: {
    color: '#FFB3A7',
  },
  dishCheck: {
    marginLeft: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagPill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  tagPillActive: {
    backgroundColor: '#FFE9E4',
    borderWidth: 1,
    borderColor: '#F8B4A6',
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tagPillTextActive: {
    color: '#D42F13',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D42F13',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(212, 47, 19, 0.3)',
      } as any,
      default: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
