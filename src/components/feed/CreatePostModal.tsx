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
import { ESTABLISHMENTS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUGGESTED_PEOPLE = [
  '@bicolcrawlers',
  '@mariasantos',
  '@paoloeats',
  '@chachaskinalas',
  '@bobmarlinnaga',
];

const DEFAULT_POST_FALLBACK =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80';

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose }) => {
  const { createPost } = useSocialFeed();

  // Step 1: Select Media / Upload Photo -> Step 2: Add Caption & Tag Places/People
  const [step, setStep] = useState<'media' | 'details'>('media');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [taggedPlace, setTaggedPlace] = useState<string | null>(ESTABLISHMENTS[0].name);
  const [taggedPerson, setTaggedPerson] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhoto(result.assets[0].uri);
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
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhoto(result.assets[0].uri);
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
    setStep('media');
    setSelectedPhoto('');
    setCaption('');
    setTaggedPerson(null);
    onClose();
  };

  const handleNext = () => {
    if (!selectedPhoto) {
      Alert.alert('Photo Required', 'Please select or capture a photo of your food trip first.');
      return;
    }
    setStep('details');
  };

  const handleSubmit = () => {
    if (!caption.trim()) {
      Alert.alert('Caption Required', 'Please write a caption for your post.');
      return;
    }

    const matchedEst = ESTABLISHMENTS.find(
      (e) => e.name.toLowerCase() === (taggedPlace || '').toLowerCase()
    );

    createPost({
      authorType: 'user',
      caption: caption.trim(),
      image: selectedPhoto || DEFAULT_POST_FALLBACK,
      establishmentId: matchedEst?.id,
      establishmentName: taggedPlace || undefined,
      district: matchedEst ? `${matchedEst.neighborhood}, Naga City` : 'Naga City',
      tags: taggedPerson ? ['#NagaFood', taggedPerson] : ['#NagaFood', '#TasteOfBicol'],
    });

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
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheetContainer}>
          {/* STEP 1: UPLOAD / SELECT PICTURE (Instagram-style) */}
          {step === 'media' && (
            <View style={styles.stepContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.headerBtn} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#1C1C1E" />
                </Pressable>
                <Text style={styles.headerTitle}>New Post</Text>
                <Pressable
                  onPress={handleNext}
                  disabled={!selectedPhoto}
                  style={({ pressed }) => [
                    styles.headerBtn,
                    !selectedPhoto && styles.btnDisabled,
                    pressed && styles.pressed,
                  ]}
                  hitSlop={10}
                >
                  <Text style={[styles.nextBtnText, !selectedPhoto && styles.nextBtnTextDisabled]}>
                    Next
                  </Text>
                </Pressable>
              </View>

              <ScrollView
                style={styles.scrollBody}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Photo Preview or Upload Prompt */}
                {selectedPhoto ? (
                  <View style={styles.previewCard}>
                    <View style={styles.mediaPreviewContainer}>
                      <Image source={{ uri: selectedPhoto }} style={styles.largePreview} resizeMode="cover" />
                    </View>
                    <View style={styles.previewActionsBar}>
                      <Pressable
                        onPress={pickImage}
                        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                      >
                        <Ionicons name="images-outline" size={16} color="#000000" />
                        <Text style={styles.actionButtonText}>Change Photo</Text>
                      </Pressable>
                      <Pressable
                        onPress={takePhoto}
                        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                      >
                        <Ionicons name="camera-outline" size={16} color="#000000" />
                        <Text style={styles.actionButtonText}>Take Photo</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setSelectedPhoto('')}
                        style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                        accessibilityLabel="Remove photo"
                      >
                        <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadBox}>
                    <View style={styles.uploadIconCircle}>
                      <Ionicons name="camera-outline" size={36} color="#D42F13" />
                    </View>
                    <Text style={styles.uploadBoxTitle}>Share Your Naga Food Trip</Text>
                    <Text style={styles.uploadBoxSubtitle}>
                      Upload a photo of your dish from your camera roll or take a fresh shot right now
                    </Text>

                    <View style={styles.uploadButtonsRow}>
                      <Pressable
                        onPress={pickImage}
                        style={({ pressed }) => [styles.uploadPrimaryBtn, pressed && styles.pressed]}
                      >
                        <Ionicons name="images" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.uploadPrimaryBtnText}>Choose from Gallery</Text>
                      </Pressable>

                      <Pressable
                        onPress={takePhoto}
                        style={({ pressed }) => [styles.uploadSecondaryBtn, pressed && styles.pressed]}
                      >
                        <Ionicons name="camera" size={16} color="#D42F13" style={{ marginRight: 6 }} />
                        <Text style={styles.uploadSecondaryBtnText}>Take Photo</Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                <View style={styles.tipsCard}>
                  <Ionicons name="bulb-outline" size={18} color="#D42F13" style={{ marginRight: 8 }} />
                  <Text style={styles.tipsText}>
                    Snap authentic dishes from local Naga carinderias, kinalas spots, and bakeries to earn foodie XP!
                  </Text>
                </View>

                <View style={{ height: 32 }} />
              </ScrollView>
            </View>
          )}

          {/* STEP 2: ADD CAPTION, TAG PEOPLE, TAG PLACE (Instagram-style) */}
          {step === 'details' && (
            <View style={styles.stepContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Pressable onPress={() => setStep('media')} style={styles.headerBtn} hitSlop={10}>
                  <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
                </Pressable>
                <Text style={styles.headerTitle}>New Post</Text>
                <Pressable
                  onPress={handleSubmit}
                  disabled={!caption.trim()}
                  style={({ pressed }) => [
                    styles.headerBtn,
                    !caption.trim() && styles.btnDisabled,
                    pressed && styles.pressed,
                  ]}
                  hitSlop={10}
                >
                  <Text
                    style={[
                      styles.shareBtnText,
                      !caption.trim() && styles.shareBtnTextDisabled,
                    ]}
                  >
                    Share
                  </Text>
                </Pressable>
              </View>

              <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                {/* Composer Row: Square Thumbnail + Caption Input */}
                <View style={styles.composerRow}>
                  <Image source={{ uri: selectedPhoto }} style={styles.composerThumb} resizeMode="cover" />
                  <TextInput
                    style={styles.captionInput}
                    multiline
                    placeholder="Write a caption about your delicious food trip in Naga..."
                    placeholderTextColor="#8E8E93"
                    value={caption}
                    onChangeText={setCaption}
                    autoFocus
                  />
                </View>

                <View style={styles.divider} />

                {/* Tag People Row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaLeft}>
                    <Ionicons name="person-outline" size={20} color="#1C1C1E" />
                    <Text style={styles.metaTitle}>Tag foodies</Text>
                  </View>
                  {taggedPerson && (
                    <Pressable
                      onPress={() => setTaggedPerson(null)}
                      style={styles.activeTagPill}
                      hitSlop={6}
                    >
                      <Text style={styles.activeTagText}>{taggedPerson}</Text>
                      <Ionicons name="close-circle" size={14} color="#8E8E93" />
                    </Pressable>
                  )}
                </View>

                {/* Quick People Suggestions */}
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

                <View style={styles.divider} />

                {/* Add Location Row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaLeft}>
                    <Ionicons name="location-outline" size={20} color="#1C1C1E" />
                    <Text style={styles.metaTitle}>Tag eatery / spot</Text>
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
                      <Ionicons name="close-circle" size={14} color="#8E8E93" />
                    </Pressable>
                  )}
                </View>

                {/* Quick Location Suggestions */}
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
                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          )}
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
  stepContainer: {
    flex: 1,
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
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  nextBtnTextDisabled: {
    color: '#C7C7CC',
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  shareBtnTextDisabled: {
    color: '#C7C7CC',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.12)',
    marginBottom: 16,
  },
  mediaPreviewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1C1C1E',
  },
  largePreview: {
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
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8FA',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 47, 19, 0.25)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 47, 19, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  uploadBoxTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
    textAlign: 'center',
  },
  uploadBoxSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.65)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 280,
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  uploadPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IOSTokens.colors.tint,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uploadSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: IOSTokens.colors.tint,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 47, 19, 0.06)',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  tipsText: {
    flex: 1,
    fontSize: 12,
    color: '#555555',
    lineHeight: 17,
  },
  formScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 4,
  },
  composerThumb: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  captionInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 21,
    minHeight: 68,
    textAlignVertical: 'top',
    paddingTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(60, 60, 67, 0.15)',
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  activeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '55%',
  },
  activeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
  },
  tagChipsRow: {
    gap: 8,
    paddingTop: 8,
    paddingBottom: 2,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  pressed: {
    opacity: 0.75,
  },
});
