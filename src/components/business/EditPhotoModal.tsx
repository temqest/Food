import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { IOSTokens } from '@/constants/theme';

interface EditPhotoModalProps {
  visible: boolean;
  type: 'banner' | 'logo';
  currentUrl: string;
  storeName: string;
  onClose: () => void;
  onSave: (url: string) => void;
}

export const EditPhotoModal: React.FC<EditPhotoModalProps> = ({
  visible,
  type,
  currentUrl,
  storeName,
  onClose,
  onSave,
}) => {
  const [selectedUrl, setSelectedUrl] = useState(currentUrl);

  useEffect(() => {
    setSelectedUrl(currentUrl);
  }, [currentUrl, visible]);

  const title = type === 'banner' ? 'Update Cover Banner' : 'Update Profile Logo';
  const subtitle =
    type === 'banner'
      ? `Choose a wide cover banner for ${storeName}`
      : `Select a recognizable profile logo / avatar for ${storeName}`;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedUrl(result.assets[0].uri);
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
        setSelectedUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error launching camera:', err);
      Alert.alert(
        'Camera Error',
        'Could not open camera. Please check your device permissions.'
      );
    }
  };

  const handleSave = () => {
    if (!selectedUrl.trim()) {
      Alert.alert('Missing Image', 'Please choose a photo from your gallery or take a picture.');
      return;
    }
    onSave(selectedUrl.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalSheet}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.headerBtn} hitSlop={8}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{title}</Text>
            <Pressable
              onPress={handleSave}
              disabled={!selectedUrl.trim()}
              style={[styles.headerBtn, !selectedUrl.trim() && { opacity: 0.4 }]}
              hitSlop={8}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalBody}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalSub}>{subtitle}</Text>

            {/* Photo Section: Preview or Upload Box */}
            <View style={styles.photoSection}>
              {selectedUrl ? (
                <View style={styles.previewCard}>
                  {type === 'banner' ? (
                    <View style={styles.bannerPreviewWrapper}>
                      <Image source={{ uri: selectedUrl }} style={styles.bannerPreviewImage} />
                      <View style={styles.previewBadge}>
                        <Ionicons name="image-outline" size={13} color="#FFFFFF" />
                        <Text style={styles.previewBadgeText}>Cover Banner (16:9)</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.logoPreviewWrapper}>
                      <Image source={{ uri: selectedUrl }} style={styles.logoPreviewImage} />
                      <View style={styles.previewBadge}>
                        <Ionicons name="camera-outline" size={13} color="#FFFFFF" />
                        <Text style={styles.previewBadgeText}>Avatar Logo (1:1)</Text>
                      </View>
                    </View>
                  )}

                  {/* Actions Bar */}
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
                      onPress={() => setSelectedUrl('')}
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
                    <Ionicons
                      name={type === 'banner' ? 'image-outline' : 'camera-outline'}
                      size={32}
                      color="#D42F13"
                    />
                  </View>
                  <Text style={styles.uploadBoxTitle}>
                    {type === 'banner' ? 'Upload Cover Banner' : 'Upload Profile Logo'}
                  </Text>
                  <Text style={styles.uploadBoxSubtitle}>
                    {type === 'banner'
                      ? 'Add a high-resolution storefront photo from your device gallery or take a new picture.'
                      : 'Add a clean logo or dish stamp from your device gallery or take a new picture.'}
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
            </View>

            {/* Bottom Apply / Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={!selectedUrl.trim()}
              style={({ pressed }) => [
                styles.applyBtn,
                !selectedUrl.trim() && styles.applyBtnDisabled,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Save ${type === 'banner' ? 'Cover Banner' : 'Profile Logo'}`}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.applyBtnText}>
                {type === 'banner' ? 'Save Cover Banner' : 'Save Profile Logo'}
              </Text>
            </Pressable>
            <View style={{ height: 28 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheet: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    maxHeight: '85%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
      } as any,
      default: {
        elevation: 10,
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
    borderBottomColor: 'rgba(60, 60, 67, 0.18)',
  },
  headerBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 17,
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
  modalSub: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.6)',
    marginBottom: 16,
    textAlign: 'center',
  },

  // Photo Section
  photoSection: {
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
    padding: 12,
  },
  bannerPreviewWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerPreviewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5EA',
    resizeMode: 'cover',
  },
  logoPreviewWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  logoPreviewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E5EA',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
      } as any,
      default: {
        elevation: 4,
      },
    }),
  },
  previewBadge: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Actions Bar under preview
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

  // Empty Upload Box
  uploadBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#C7C7CC',
    padding: 24,
    alignItems: 'center',
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

  // Apply Button
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: IOSTokens.colors.tint,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(212, 47, 19, 0.25)',
      } as any,
      default: {
        elevation: 3,
      },
    }),
  },
  applyBtnDisabled: {
    backgroundColor: 'rgba(60, 60, 67, 0.3)',
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
