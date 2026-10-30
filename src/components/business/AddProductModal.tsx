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
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BusinessProduct } from '@/context/BusinessContext';
import { MENU_FOOD_CATEGORIES, MenuFoodCategory } from '@/data/mockData';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>) => void;
  editingProduct?: BusinessProduct | null;
}

interface ProductFormProps {
  editingProduct?: BusinessProduct | null;
  onClose: () => void;
  onSave: (product: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>) => void;
}

const DEFAULT_DISH_FALLBACK =
  'https://images.unsplash.com/photo-1594998893017-3f7a3d6f0e2c?auto=format&fit=crop&w=900&q=80';

const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(editingProduct?.name ?? '');
  const [bikolName, setBikolName] = useState(editingProduct?.bikolName ?? '');
  const [category, setCategory] = useState<string>(
    editingProduct?.category ?? 'soups-noodles'
  );
  const [price, setPrice] = useState(
    editingProduct ? String(editingProduct.price) : '85'
  );
  const [prepTime, setPrepTime] = useState(
    editingProduct?.prepTime ?? '5â€“10 mins'
  );
  const [description, setDescription] = useState(
    editingProduct?.description ?? ''
  );
  const [servingNote, setServingNote] = useState(
    editingProduct?.servingNote ?? ''
  );
  const [image, setImage] = useState<string>(
    editingProduct?.image ?? ''
  );
  const [isSignature, setIsSignature] = useState(
    editingProduct?.isSignature ?? false
  );
  const [inStock, setInStock] = useState(editingProduct?.inStock ?? true);
  const [flavorTag, setFlavorTag] = useState(
    editingProduct?.flavorProfile?.[0] ?? 'Savory & Rich'
  );

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
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
          'Please allow camera access in settings to take a photo of your dish.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
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
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please provide a dish or product name.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price in Philippine Pesos (â‚±).');
      return;
    }

    const categoryObj =
      MENU_FOOD_CATEGORIES.find((c) => c.id === category) ?? MENU_FOOD_CATEGORIES[0];

    onSave({
      foodId: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name.trim(),
      bikolName: bikolName.trim() || undefined,
      description:
        description.trim() ||
        `Freshly prepared authentic ${name.trim()} made with quality ingredients.`,
      category: categoryObj.id,
      categoryLabel: categoryObj.label,
      price: numPrice,
      isSignature,
      inStock,
      prepTime: prepTime.trim() || '10â€“15 mins',
      image: image.trim() || DEFAULT_DISH_FALLBACK,
      flavorProfile: [flavorTag.trim() || 'House Recipe', 'Authentic Taste'],
      servingNote: servingNote.trim() || undefined,
    });

    onClose();
  };

  return (
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

        <Text style={styles.headerTitle}>
          {editingProduct ? 'Edit Dish' : 'Add New Product'}
        </Text>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
          hitSlop={8}
        >
          <Text style={styles.doneText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {/* Photo Upload / Preview Section */}
        <View style={styles.photoSection}>
          {image ? (
            <View style={styles.previewCard}>
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
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
                  onPress={() => setImage('')}
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
                <Ionicons name="camera-outline" size={32} color="#D42F13" />
              </View>
              <Text style={styles.uploadBoxTitle}>Upload Dish Photo</Text>
              <Text style={styles.uploadBoxSubtitle}>
                Add a photo of your cooked dish from your camera roll or take a fresh picture
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

        {/* Inset Group 1: Dish Details */}
        <Text style={styles.groupHeader}>DISH DETAILS</Text>
        <View style={styles.insetGroup}>
          <View style={styles.inputRow}>
            <Text style={styles.rowLabel}>Product Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Kinalas Special"
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.rowLabel}>Local/Bikol Name</Text>
            <TextInput
              style={styles.textInput}
              value={bikolName}
              onChangeText={setBikolName}
              placeholder="e.g. Kinalas na may Utok"
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.rowLabel}>Price (â‚±)</Text>
            <TextInput
              style={styles.textInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="85"
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
            />
          </View>

          <View style={[styles.inputRow, styles.inputRowLast]}>
            <Text style={styles.rowLabel}>Prep Time</Text>
            <TextInput
              style={styles.textInput}
              value={prepTime}
              onChangeText={setPrepTime}
              placeholder="e.g. 5â€“10 mins"
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
            />
          </View>
        </View>

        {/* Inset Group 2: Food Category Selector */}
        <Text style={styles.groupHeader}>FOOD CATEGORY</Text>
        <View style={styles.insetGroup}>
          {MENU_FOOD_CATEGORIES.map((cat, idx) => {
            const isSelected = category === cat.id;
            const isLast = idx === MENU_FOOD_CATEGORIES.length - 1;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.categoryRow, isLast && styles.inputRowLast]}
              >
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryIconWrap, isSelected && styles.categoryIconWrapActive]}>
                    <Ionicons
                      name={cat.icon as any}
                      size={17}
                      color={isSelected ? '#FFFFFF' : '#8E8E93'}
                    />
                  </View>
                  <View style={styles.categoryTextCol}>
                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && styles.categoryNameActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                    <Text style={styles.categoryDesc} numberOfLines={1}>
                      {cat.description}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={21} color="#D42F13" />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Inset Group 3: Options & Toggles */}
        <Text style={styles.groupHeader}>AVAILABILITY & HIGHLIGHTS</Text>
        <View style={styles.insetGroup}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleTitle}>Available for Pre-Order</Text>
              <Text style={styles.toggleSubtitle}>
                Show as in-stock on your store menu
              </Text>
            </View>
            <Switch
              value={inStock}
              onValueChange={setInStock}
              trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.toggleRow, styles.inputRowLast]}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleTitle}>Signature House Special</Text>
              <Text style={styles.toggleSubtitle}>
                Badge this item as a top recommended dish
              </Text>
            </View>
            <Switch
              value={isSignature}
              onValueChange={setIsSignature}
              trackColor={{ false: 'rgba(118, 118, 128, 0.16)', true: '#D42F13' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Inset Group 4: Serving & Flavor Notes */}
        <Text style={styles.groupHeader}>SERVING & FLAVOR NOTES</Text>
        <View style={styles.insetGroup}>
          <View style={styles.inputRow}>
            <Text style={styles.rowLabel}>Flavor Tag</Text>
            <TextInput
              style={styles.textInput}
              value={flavorTag}
              onChangeText={setFlavorTag}
              placeholder="e.g. Rich Gravy & Spicy"
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
            />
          </View>

          <View style={[styles.inputRow, styles.inputRowLast]}>
            <Text style={styles.rowLabel}>Serving Note</Text>
            <TextInput
              style={styles.textInput}
              value={servingNote}
              onChangeText={setServingNote}
              placeholder="e.g. Served with fresh calamansi"
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
            />
          </View>
        </View>

        {/* Inset Group 5: Detailed Description */}
        <Text style={styles.groupHeader}>DESCRIPTION</Text>
        <View style={styles.insetGroup}>
          <View style={styles.textAreaRow}>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your dish ingredients, preparation, and what makes it special to Naga food lovers..."
              placeholderTextColor="rgba(60, 60, 67, 0.3)"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onSave,
  editingProduct,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        {visible ? (
          <ProductForm
            key={editingProduct?.id ?? 'new-product'}
            editingProduct={editingProduct}
            onClose={onClose}
            onSave={onSave}
          />
        ) : null}
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
    flex: 1,
  },
  sheetContainer: {
    width: '100%',
    height: '88%',
    maxHeight: '92%',
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
  photoSection: {
    marginBottom: 16,
  },
  previewCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(60, 60, 67, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: 190,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
  },
  previewActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FFF2F2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(212, 47, 19, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
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
    paddingHorizontal: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
  },
  uploadPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D42F13',
    paddingVertical: 11,
    borderRadius: 12,
  },
  uploadPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uploadSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D42F13',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  uploadSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
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
    width: 130,
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  categoryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconWrapActive: {
    backgroundColor: '#D42F13',
  },
  categoryTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  categoryNameActive: {
    fontWeight: '700',
    color: '#D42F13',
  },
  categoryDesc: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
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
