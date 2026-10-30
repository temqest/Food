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
import { useAuth } from '@/context/AuthContext';
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';
import { UserAvatar } from '@/components/common/UserAvatar';
import { getDiceBearAvatar } from '@/utils/dicebearAvatar';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUGGESTED_PEOPLE = [
  '@mariasantos',
  '@paoloeats',
  '@bicolcrawlers',
  '@chachaskinalas',
  '@bobmarlinnaga',
];

const DEFAULT_POST_FALLBACK =
  'https://images.unsplash.com/photo-1594998893017-3f7a3d6f0e2c?auto=format&fit=crop&w=900&q=80';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose }) => {
  const { createPost } = useSocialFeed();
  const { user } = useAuth();

  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [photoAspectRatio, setPhotoAspectRatio] = useState<number | undefined>(undefined);
  const [caption, setCaption] = useState('');
  const [taggedPlace, setTaggedPlace] = useState<string | null>(null);
  const [taggedFood, setTaggedFood] = useState<string | null>(null);
  const [taggedPerson, setTaggedPerson] = useState<string | null>(null);

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
          'Please allow camera access in device settings to take a photo of your food trip.'
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

  const handleClose = () => {
    setSelectedPhoto('');
    setPhotoAspectRatio(undefined);
    setCaption('');
    setTaggedPlace(null);
    setTaggedFood(null);
    setTaggedPerson(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please share what you enjoyed about this food trip.');
      return;
    }

    const matchedEst = ESTABLISHMENTS.find(
      (e) => e.name.toLowerCase() === (taggedPlace || '').toLowerCase()
    );

    const matchedFood = FOOD_ITEMS.find(
      (f) => f.name.toLowerCase() === (taggedFood || '').toLowerCase()
    );

    // Image priority: user's custom photo -> matched dish photo -> fallback
    const postImage = selectedPhoto || matchedFood?.image || DEFAULT_POST_FALLBACK;

    createPost({
      authorType: 'user',
      caption: caption.trim(),
      image: postImage,
      aspectRatio: selectedPhoto ? photoAspectRatio : undefined,
      establishmentId: matchedEst?.id,
      establishmentName: taggedPlace || undefined,
      foodId: matchedFood?.id,
      foodName: taggedFood || undefined,
      foodPrice: matchedFood?.priceRange ? matchedFood.priceRange.split('â€“')[0].trim() : undefined,
      district: matchedEst ? `${matchedEst.neighborhood}, Naga City` : 'Naga City',
      tags: [
        '#NagaFood',
        ...(taggedFood ? [`#${taggedFood.replace(/[^a-zA-Z0-9]/g, '')}`] : []),
        ...(taggedPerson ? [taggedPerson] : ['#TasteOfBicol']),
      ],
    });

    handleClose();
  };

  const authorName = user?.name || 'Local Foodie';
  const authorAvatar = user?.avatar || getDiceBearAvatar(authorName);

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
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
              hitSlop={8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>

            <Text style={styles.headerTitle}>Create Post</Text>

            <Pressable
              onPress={handleSubmit}
              disabled={!caption.trim()}
              style={({ pressed }) => [
                styles.headerBtn,
                !caption.trim() && styles.btnDisabled,
                pressed && styles.pressed,
              ]}
              hitSlop={8}
            >
              <Text style={[styles.postBtnText, !caption.trim() && styles.postBtnTextDisabled]}>
                Post
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          >
            {/* Author Profile Bar */}
            <View style={styles.authorRow}>
              <UserAvatar uri={authorAvatar} style={styles.authorAvatar} />
              <View style={styles.authorInfoCol}>
                <Text style={styles.authorName}>{authorName}</Text>
                <View style={styles.audienceBadge}>
                  <Ionicons name="earth" size={11} color="#8E8E93" style={{ marginRight: 4 }} />
                  <Text style={styles.audienceBadgeText}>Naga City Food Community</Text>
                </View>
              </View>
            </View>

            {/* Caption Text Input */}
            <TextInput
              style={styles.captionInput}
              multiline
              placeholder="What did you eat today? Share your dish review, flavor discovery, or street food cravings in Naga City..."
              placeholderTextColor="#8E8E93"
              value={caption}
              onChangeText={setCaption}
              textAlignVertical="top"
              autoFocus
            />

            {/* Photo Section (Preview or Upload Box) */}
            <View style={styles.photoSection}>
              {selectedPhoto ? (
                <View style={styles.previewCard}>
                  <View
                    style={[
                      styles.previewImageWrapper,
                      {
                        aspectRatio: photoAspectRatio
                          ? Math.min(Math.max(photoAspectRatio, 0.8), 1.91)
                          : 4 / 3,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: selectedPhoto }}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.previewActionsBar}>
                    <Pressable
                      onPress={pickImage}
                      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                    >
                      <Ionicons name="images-outline" size={15} color="#000000" />
                      <Text style={styles.actionButtonText}>Change</Text>
                    </Pressable>
                    <Pressable
                      onPress={takePhoto}
                      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                    >
                      <Ionicons name="camera-outline" size={15} color="#000000" />
                      <Text style={styles.actionButtonText}>Take Photo</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setSelectedPhoto('');
                        setPhotoAspectRatio(undefined);
                      }}
                      style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                      accessibilityLabel="Remove photo"
                    >
                      <Ionicons name="trash-outline" size={15} color="#FF3B30" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.uploadBox}>
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="camera-outline" size={30} color="#D42F13" />
                  </View>
                  <Text style={styles.uploadBoxTitle}>Add Food Photo</Text>
                  <Text style={styles.uploadBoxSubtitle}>
                    Share your food trip with photos from your gallery or snap a live shot
                  </Text>

                  {/* Vertically stacked spacious buttons so text fits gracefully without cramping */}
                  <View style={styles.uploadButtonsCol}>
                    <Pressable
                      onPress={pickImage}
                      style={({ pressed }) => [styles.uploadPrimaryBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="images" size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.uploadPrimaryBtnText}>Choose from Gallery</Text>
                    </Pressable>

                    <Pressable
                      onPress={takePhoto}
                      style={({ pressed }) => [styles.uploadSecondaryBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="camera" size={17} color="#D42F13" style={{ marginRight: 8 }} />
                      <Text style={styles.uploadSecondaryBtnText}>Take Photo with Camera</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            {/* Tag Section 1: Tag Food / Dish */}
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleLeft}>
                <Ionicons name="restaurant-outline" size={16} color="#D42F13" />
                <Text style={styles.sectionTitle}>TAG FOOD / DISH</Text>
              </View>
              {taggedFood && (
                <Pressable
                  onPress={() => setTaggedFood(null)}
                  style={styles.activeTagPill}
                  hitSlop={6}
                >
                  <Text style={styles.activeTagText} numberOfLines={1}>
                    {taggedFood}
                  </Text>
                  <Ionicons name="close-circle" size={14} color="#D42F13" />
                </Pressable>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagChipsRow}
            >
              {FOOD_ITEMS.slice(0, 8).map((food) => {
                const isSelected = taggedFood === food.name;
                return (
                  <Pressable
                    key={food.id}
                    onPress={() => setTaggedFood(isSelected ? null : food.name)}
                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                  >
                    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextActive]}>
                      {food.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            {/* Tag Section 2: Tag Eatery / Location */}
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleLeft}>
                <Ionicons name="location-outline" size={16} color="#D42F13" />
                <Text style={styles.sectionTitle}>TAG EATERY / SPOT</Text>
              </View>
              {taggedPlace && (
                <Pressable
                  onPress={() => setTaggedPlace(null)}
                  style={styles.activeTagPill}
                  hitSlop={6}
                >
                  <Text style={styles.activeTagText} numberOfLines={1}>
                    {taggedPlace}
                  </Text>
                  <Ionicons name="close-circle" size={14} color="#D42F13" />
                </Pressable>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagChipsRow}
            >
              {ESTABLISHMENTS.slice(0, 8).map((est) => {
                const isSelected = taggedPlace === est.name;
                return (
                  <Pressable
                    key={est.id}
                    onPress={() => setTaggedPlace(isSelected ? null : est.name)}
                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                  >
                    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextActive]}>
                      {est.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.divider} />

            {/* Tag Section 3: Tag Foodies */}
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleLeft}>
                <Ionicons name="people-outline" size={16} color="#D42F13" />
                <Text style={styles.sectionTitle}>TAG FOODIES</Text>
              </View>
              {taggedPerson && (
                <Pressable
                  onPress={() => setTaggedPerson(null)}
                  style={styles.activeTagPill}
                  hitSlop={6}
                >
                  <Text style={styles.activeTagText} numberOfLines={1}>
                    {taggedPerson}
                  </Text>
                  <Ionicons name="close-circle" size={14} color="#D42F13" />
                </Pressable>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagChipsRow}
            >
              {SUGGESTED_PEOPLE.map((handle) => {
                const isSelected = taggedPerson === handle;
                return (
                  <Pressable
                    key={handle}
                    onPress={() => setTaggedPerson(isSelected ? null : handle)}
                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                  >
                    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextActive]}>
                      {handle}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={{ height: 48 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    width: '100%',
    height: '92%',
    maxHeight: '94%',
    maxWidth: 600,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    elevation: 20,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
    backgroundColor: '#FFFFFF',
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cancelBtnText: {
    fontSize: 16,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  postBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  postBtnTextDisabled: {
    color: '#C7C7CC',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  formScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  authorInfoCol: {
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  audienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  audienceBadgeText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  captionInput: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
    minHeight: 85,
    marginBottom: 14,
    padding: 0,
  },
  photoSection: {
    marginBottom: 16,
  },
  previewCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.12)',
  },
  previewImageWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(60, 60, 67, 0.15)',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF1F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8FA',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 47, 19, 0.25)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212, 47, 19, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  uploadBoxSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.65)',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
    maxWidth: 290,
  },
  uploadButtonsCol: {
    width: '100%',
    gap: 8,
  },
  uploadPrimaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uploadSecondaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IOSTokens.colors.tint,
    paddingVertical: 11,
    borderRadius: 12,
  },
  uploadSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.5,
  },
  activeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 47, 19, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    maxWidth: '55%',
  },
  activeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },
  tagChipsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.1)',
  },
  tagChipActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  tagChipTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60, 60, 67, 0.15)',
    marginVertical: 12,
  },
  pressed: {
    opacity: 0.75,
  },
});
