import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { ESTABLISHMENTS } from '@/data/mockData';
import { IOSTokens } from '@/constants/theme';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

const INITIAL_GALLERY_PHOTOS = [
  {
    id: 'photo-kinalas',
    label: 'Kinalas',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-express',
    label: 'Bicol Express',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-sinanglay',
    label: 'Sinanglay',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-siopao',
    label: 'Toasted Siopao',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-dessert',
    label: 'Pili Sweets',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-carinderia',
    label: 'Carinderia Pot',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-bbq',
    label: 'Street BBQ',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'photo-resto',
    label: 'Dining Table',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
];

const SUGGESTED_PEOPLE = [
  '@bicolcrawlers',
  '@mariasantos',
  '@paoloeats',
  '@chachaskinalas',
  '@bobmarlinnaga',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ visible, onClose }) => {
  const { createPost } = useSocialFeed();
  const fileInputRef = useRef<any>(null);

  // Step 1: Select Media / Upload Photo -> Step 2: Add Caption & Tag Places/People
  const [step, setStep] = useState<'media' | 'details'>('media');
  const [galleryPhotos, setGalleryPhotos] = useState(INITIAL_GALLERY_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState(INITIAL_GALLERY_PHOTOS[0].url);
  const [caption, setCaption] = useState('');
  const [taggedPlace, setTaggedPlace] = useState<string | null>(ESTABLISHMENTS[0].name);
  const [taggedPerson, setTaggedPerson] = useState<string | null>(null);

  const handleFileUpload = (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setSelectedPhoto(dataUrl);
          setGalleryPhotos((prev) => [
            { id: `upload_${Date.now()}`, label: 'Uploaded', url: dataUrl },
            ...prev,
          ]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUploadOrCamera = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClose = () => {
    setStep('media');
    setCaption('');
    setTaggedPerson(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!caption.trim()) return;

    const matchedEst = ESTABLISHMENTS.find(
      (e) => e.name.toLowerCase() === (taggedPlace || '').toLowerCase()
    );

    createPost({
      authorType: 'user',
      caption: caption.trim(),
      image: selectedPhoto,
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

        {/* Hidden Web File Input for Camera/Gallery Upload */}
        {Platform.OS === 'web' && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        )}

        <View style={styles.sheetContainer}>
          {/* STEP 1: UPLOAD / SELECT PICTURE FIRST (Instagram-style) */}
          {step === 'media' && (
            <View style={styles.stepContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.headerBtn} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#1C1C1E" />
                </Pressable>
                <Text style={styles.headerTitle}>New post</Text>
                <Pressable
                  onPress={() => setStep('details')}
                  style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
                  hitSlop={10}
                >
                  <Text style={styles.nextBtnText}>Next</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* 1:1 Large Media Preview */}
                <View style={styles.mediaPreviewContainer}>
                  <Image source={{ uri: selectedPhoto }} style={styles.largePreview} resizeMode="cover" />
                </View>

                {/* Gallery Bar with Camera/Upload Button */}
                <View style={styles.galleryBar}>
                  <Text style={styles.galleryBarTitle}>Recents</Text>
                  <Pressable
                    onPress={triggerUploadOrCamera}
                    style={({ pressed }) => [styles.cameraUploadBtn, pressed && styles.pressed]}
                    hitSlop={6}
                  >
                    <Ionicons name="camera" size={16} color="#FFFFFF" />
                    <Text style={styles.cameraUploadText}>Upload / Camera</Text>
                  </Pressable>
                </View>

                {/* Photo Grid */}
                <View style={styles.photoGrid}>
                  {galleryPhotos.map((item) => {
                    const isSelected = selectedPhoto === item.url;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setSelectedPhoto(item.url)}
                        style={[styles.gridItem, isSelected && styles.gridItemSelected]}
                      >
                        <Image source={{ uri: item.url }} style={styles.gridImage} />
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
                <View style={{ height: 24 }} />
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
                <Text style={styles.headerTitle}>New post</Text>
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
                  <Image source={{ uri: selectedPhoto }} style={styles.composerThumb} />
                  <TextInput
                    style={styles.captionInput}
                    multiline
                    placeholder="Write a caption..."
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
                    <Text style={styles.metaTitle}>Tag people</Text>
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
                    <Text style={styles.metaTitle}>Add location</Text>
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
                  {ESTABLISHMENTS.slice(0, 6).map((est) => {
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '92%',
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  stepContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  mediaPreviewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000000',
  },
  largePreview: {
    width: '100%',
    height: '100%',
  },
  galleryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8FA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.1)',
  },
  galleryBarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  cameraUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cameraUploadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    backgroundColor: '#E5E5EA',
  },
  gridItem: {
    width: '24.5%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#F2F2F7',
  },
  gridItemSelected: {
    opacity: 0.85,
    borderWidth: 2,
    borderColor: IOSTokens.colors.tint,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: IOSTokens.colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
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
