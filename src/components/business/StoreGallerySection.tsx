import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GalleryPhoto } from '@/context/BusinessContext';
import { IOSTokens } from '@/constants/theme';

interface StoreGallerySectionProps {
  gallery: GalleryPhoto[];
  storeName: string;
  onAddPhoto: (photo: { url: string; caption?: string; category?: string }) => void;
  onDeletePhoto: (photoId: string) => void;
}

const CATEGORIES = [
  'All',
  'Kitchen & Prep',
  'Signature Food',
  'Dining Area',
  'Atmosphere & Team',
] as const;

export const StoreGallerySection: React.FC<StoreGallerySectionProps> = ({
  gallery,
  storeName,
  onAddPhoto,
  onDeletePhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Photo form state
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Kitchen & Prep');

  const filteredPhotos =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((p) => p.category === selectedCategory);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewUrl(result.assets[0].uri);
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
          'Please allow camera access in settings to take a photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error launching camera:', err);
      Alert.alert(
        'Camera Error',
        'Could not open camera. Please check your device permissions.'
      );
    }
  };

  const handleSaveNewPhoto = () => {
    if (!newUrl.trim()) {
      Alert.alert('Missing Photo', 'Please select a photo from your gallery or take a picture.');
      return;
    }
    onAddPhoto({
      url: newUrl.trim(),
      caption: newCaption.trim() || `${storeName} showcase`,
      category: newCategory,
    });
    setNewUrl('');
    setNewCaption('');
    setIsAddOpen(false);
    Alert.alert('Photo Added!', 'Your business gallery has been updated.');
  };

  const handleDeleteActivePhoto = () => {
    if (!activePhoto) return;
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to delete this photo from your store gallery?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeletePhoto(activePhoto.id);
            setActivePhoto(null);
          },
        },
      ]
    );
  };

  const col1Photos = filteredPhotos.filter((_, idx) => idx % 2 === 0);
  const col2Photos = filteredPhotos.filter((_, idx) => idx % 2 === 1);

  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftCol}>
          <View style={styles.titleWithBadge}>
            <Text style={styles.sectionTitle}>Business Gallery</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{gallery.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            Showcase your kitchen, dining space, and signature dishes
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setNewUrl('');
            setNewCaption('');
            setIsAddOpen(true);
          }}
          style={({ pressed }) => [styles.addPhotoBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Add picture about business"
        >
          <Ionicons name="camera" size={15} color="#FFFFFF" />
          <Text style={styles.addPhotoBtnText}>Add Photo</Text>
        </Pressable>
      </View>

      {/* Category Pills Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
            >
              <Text
                style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Photos 2-Column Grid */}
      {filteredPhotos.length === 0 ? (
        <View style={styles.emptyGalleryBox}>
          <Ionicons name="images-outline" size={36} color="#8E8E93" />
          <Text style={styles.emptyTitle}>No Photos in this Category</Text>
          <Text style={styles.emptySub}>
            Tap &ldquo;Add Photo&rdquo; above to upload moments from your kitchen, dining space, or dishes.
          </Text>
        </View>
      ) : (
        <View style={styles.columnsContainer}>
          {/* Column 1 */}
          <View style={styles.columnWrapper}>
            {col1Photos.map((photo) => (
              <Pressable
                key={photo.id}
                onPress={() => setActivePhoto(photo)}
                style={({ pressed }) => [styles.photoCard, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`View gallery photo: ${photo.caption || photo.category}`}
              >
                <View style={styles.photoImageContainer}>
                  <Image source={{ uri: photo.url }} style={styles.photoImage} />
                  {photo.category && (
                    <View style={styles.imageCategoryTag}>
                      <Text style={styles.imageCategoryText}>{photo.category}</Text>
                    </View>
                  )}
                </View>
                {photo.caption ? (
                  <View style={styles.photoMetaBar}>
                    <Text style={styles.photoCaption} numberOfLines={2}>
                      {photo.caption}
                    </Text>
                    {photo.createdAt && (
                      <Text style={styles.photoDate}>{photo.createdAt}</Text>
                    )}
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>

          {/* Column 2 */}
          <View style={styles.columnWrapper}>
            {col2Photos.map((photo) => (
              <Pressable
                key={photo.id}
                onPress={() => setActivePhoto(photo)}
                style={({ pressed }) => [styles.photoCard, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`View gallery photo: ${photo.caption || photo.category}`}
              >
                <View style={styles.photoImageContainer}>
                  <Image source={{ uri: photo.url }} style={styles.photoImage} />
                  {photo.category && (
                    <View style={styles.imageCategoryTag}>
                      <Text style={styles.imageCategoryText}>{photo.category}</Text>
                    </View>
                  )}
                </View>
                {photo.caption ? (
                  <View style={styles.photoMetaBar}>
                    <Text style={styles.photoCaption} numberOfLines={2}>
                      {photo.caption}
                    </Text>
                    {photo.createdAt && (
                      <Text style={styles.photoDate}>{photo.createdAt}</Text>
                    )}
                  </View>
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhoto && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActivePhoto(null)}
        >
          <View style={styles.lightboxOverlay}>
            {/* Top Close & Delete Controls */}
            <View style={styles.lightboxTopBar}>
              <Pressable
                onPress={() => setActivePhoto(null)}
                style={styles.lightboxBtn}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Close lightbox"
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>

              <Pressable
                onPress={handleDeleteActivePhoto}
                style={[styles.lightboxBtn, styles.deleteBtn]}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Delete this photo"
              >
                <Ionicons name="trash-outline" size={20} color="#FF453A" />
              </Pressable>
            </View>

            {/* Photo Centerpiece */}
            <View style={styles.lightboxImageWrapper}>
              <Image source={{ uri: activePhoto.url }} style={styles.lightboxImage} resizeMode="contain" />
            </View>

            {/* Bottom Caption Meta */}
            <View style={styles.lightboxBottomBar}>
              <View style={styles.lightboxTagRow}>
                {activePhoto.category && (
                  <View style={styles.lightboxCategoryBadge}>
                    <Text style={styles.lightboxCategoryText}>{activePhoto.category}</Text>
                  </View>
                )}
                <Text style={styles.lightboxDate}>{activePhoto.createdAt}</Text>
              </View>

              {activePhoto.caption && (
                <Text style={styles.lightboxCaption}>{activePhoto.caption}</Text>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Add Photo Modal */}
      <Modal
        visible={isAddOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsAddOpen(false)} />
          <View style={styles.modalSheet}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => setIsAddOpen(false)}
                style={styles.headerBtn}
                hitSlop={8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.modalHeaderTitle}>Add Business Photo</Text>
              <Pressable onPress={handleSaveNewPhoto} style={styles.headerBtn} hitSlop={8}>
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Photo Section: Preview or Upload Box */}
              <Text style={styles.formSectionLabel}>BUSINESS PHOTO</Text>
              {newUrl ? (
                <View style={styles.previewCard}>
                  <View style={styles.addPreviewWrapper}>
                    <Image source={{ uri: newUrl }} style={styles.addPreviewImage} />
                    <View style={styles.addPreviewTag}>
                      <Text style={styles.addPreviewTagText}>{newCategory}</Text>
                    </View>
                  </View>
                  <View style={styles.previewActionsBar}>
                    <Pressable
                      onPress={pickImage}
                      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                    >
                      <Ionicons name="images-outline" size={16} color="#000000" />
                      <Text style={styles.actionButtonText}>Choose from Gallery</Text>
                    </Pressable>
                    <Pressable
                      onPress={takePhoto}
                      style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
                    >
                      <Ionicons name="camera-outline" size={16} color="#000000" />
                      <Text style={styles.actionButtonText}>Take Photo</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setNewUrl('')}
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
                    <Ionicons name="images-outline" size={32} color="#D42F13" />
                  </View>
                  <Text style={styles.uploadBoxTitle}>Upload Business Photo</Text>
                  <Text style={styles.uploadBoxSubtitle}>
                    Showcase your dishes, kitchen, dining hall, or team from your gallery or take a live picture.
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

              {/* Category Picker */}
              <Text style={styles.formSectionLabel}>PHOTO CATEGORY</Text>
              <View style={styles.categoryPickerRow}>
                {(['Kitchen & Prep', 'Signature Food', 'Dining Area', 'Atmosphere & Team'] as const).map(
                  (cat) => {
                    const isSelected = newCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setNewCategory(cat)}
                        style={[styles.catPickBtn, isSelected && styles.catPickBtnActive]}
                      >
                        <Text
                          style={[
                            styles.catPickText,
                            isSelected && styles.catPickTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>

              {/* Caption Input */}
              <Text style={styles.formSectionLabel}>CAPTION &amp; STORY</Text>
              <View style={styles.inputCard}>
                <TextInput
                  style={styles.captionInput}
                  value={newCaption}
                  onChangeText={setNewCaption}
                  placeholder="Describe what makes this scene special..."
                  placeholderTextColor="rgba(60, 60, 67, 0.4)"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Bottom Add Photo CTA */}
              <Pressable
                onPress={handleSaveNewPhoto}
                style={({ pressed }) => [styles.submitPhotoBtn, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Add Photo to Gallery"
              >
                <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
                <Text style={styles.submitPhotoBtnText}>Add Photo to Gallery</Text>
              </Pressable>
              <View style={{ height: 28 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  countBadge: {
    backgroundColor: 'rgba(60, 60, 67, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2,
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 6px rgba(212, 47, 19, 0.25)',
      } as any,
    }),
  },
  addPhotoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
  },
  categoryPillActive: {
    backgroundColor: '#000000',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.8)',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  columnsContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  columnWrapper: {
    flex: 1,
    gap: 10,
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFF4',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      } as any,
      default: {
        elevation: 2,
      },
    }),
  },
  photoImageContainer: {
    width: '100%',
    height: 125,
    backgroundColor: '#F2F2F7',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoMetaBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  photoCaption: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 16,
  },
  photoDate: {
    fontSize: 10,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 4,
  },
  imageCategoryTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  imageCategoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  emptyGalleryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    maxWidth: 280,
  },
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'space-between',
  },
  lightboxTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
  },
  lightboxBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: 'rgba(255, 69, 58, 0.25)',
  },
  lightboxImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: '100%',
    height: '100%',
  },
  lightboxBottomBar: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  lightboxTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  lightboxCategoryBadge: {
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lightboxCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lightboxDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  lightboxCaption: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheet: {
    width: '100%',
    height: '88%',
    maxHeight: '92%',
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
    maxWidth: 600,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
      } as any,
      default: {
        elevation: 20,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.2)',
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: IOSTokens.colors.tint,
  },
  modalBody: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    paddingBottom: 60,
  },
  formSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: -0.08,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  addPreviewWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E5E5EA',
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  addPreviewImage: {
    width: '100%',
    height: '100%',
  },
  addPreviewTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addPreviewTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
    marginBottom: 6,
  },
  previewActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#FFF2F2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C7C7CC',
    padding: 24,
    alignItems: 'center',
    marginBottom: 6,
  },
  uploadIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  uploadBoxSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  uploadButtonsRow: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  uploadPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D42F13',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  uploadPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uploadSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2EE',
    borderWidth: 1,
    borderColor: '#D42F13',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  uploadSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D42F13',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPickBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  catPickBtnActive: {
    backgroundColor: IOSTokens.colors.tint,
    borderColor: IOSTokens.colors.tint,
  },
  catPickText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  catPickTextActive: {
    color: '#FFFFFF',
  },
  captionInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    minHeight: 60,
    textAlignVertical: 'top',
    padding: 0,
  },
  submitPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(212, 47, 19, 0.25)',
      } as any,
      default: {
        elevation: 3,
      },
    }),
  },
  submitPhotoBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
