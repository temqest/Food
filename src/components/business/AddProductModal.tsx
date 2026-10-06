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
import { FoodCategory } from '@/data/types';
import { BusinessProduct } from '@/context/BusinessContext';
import { CATEGORIES } from '@/data/mockData';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>) => void;
  editingProduct?: BusinessProduct | null;
}

const PHOTO_PRESETS = [
  {
    label: 'Kinalas Soup',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'Sinanglay / Fish',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'Toasted Siopao',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'Bicol Express',
    url: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'Pili Delicacy',
    url: 'https://images.unsplash.com/photo-1536591375315-1b836814d60a?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'Native Drink / Puto',
    url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80',
  },
];

interface ProductFormProps {
  editingProduct?: BusinessProduct | null;
  onClose: () => void;
  onSave: (product: Omit<BusinessProduct, 'id' | 'totalOrdersCount'>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(editingProduct?.name ?? '');
  const [bikolName, setBikolName] = useState(editingProduct?.bikolName ?? '');
  const [category, setCategory] = useState<FoodCategory>(
    editingProduct?.category ?? 'heritage-soups'
  );
  const [price, setPrice] = useState(
    editingProduct ? String(editingProduct.price) : '85'
  );
  const [prepTime, setPrepTime] = useState(
    editingProduct?.prepTime ?? '10–15 mins'
  );
  const [description, setDescription] = useState(
    editingProduct?.description ?? ''
  );
  const [servingNote, setServingNote] = useState(
    editingProduct?.servingNote ?? ''
  );
  const [image, setImage] = useState(
    editingProduct?.image ?? PHOTO_PRESETS[0].url
  );
  const [isSignature, setIsSignature] = useState(
    editingProduct?.isSignature ?? false
  );
  const [inStock, setInStock] = useState(editingProduct?.inStock ?? true);
  const [flavorTag, setFlavorTag] = useState(
    editingProduct?.flavorProfile[0] ?? 'Savory & Rich'
  );

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please provide a dish or product name.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price in Philippine Pesos (₱).');
      return;
    }

    const categoryObj = CATEGORIES.find((c) => c.id === category);
    const categoryLabel = categoryObj ? categoryObj.label : 'Specialty Dish';

    onSave({
      foodId: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name.trim(),
      bikolName: bikolName.trim() || undefined,
      description:
        description.trim() ||
        `Freshly prepared authentic ${name.trim()} made with local Bicolano ingredients.`,
      category,
      categoryLabel,
      price: numPrice,
      isSignature,
      inStock,
      prepTime: prepTime.trim() || '10–15 mins',
      image,
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
            {/* Photo Preview & Selector */}
            <View style={styles.photoSection}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <Text style={styles.sectionLabel}>Select Dish Photography</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.presetsList}
              >
                {PHOTO_PRESETS.map((preset, idx) => {
                  const isSelected = image === preset.url;
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setImage(preset.url)}
                      style={[styles.presetCard, isSelected && styles.presetCardActive]}
                    >
                      <Image source={{ uri: preset.url }} style={styles.presetThumb} />
                      <Text
                        style={[
                          styles.presetLabel,
                          isSelected && styles.presetLabelActive,
                        ]}
                        numberOfLines={1}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
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
                <Text style={styles.rowLabel}>Price (₱)</Text>
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
                  placeholder="e.g. 5–10 mins"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                />
              </View>
            </View>

            {/* Inset Group 2: Category Selector */}
            <Text style={styles.groupHeader}>CATEGORY</Text>
            <View style={styles.insetGroup}>
              {CATEGORIES.map((cat, idx) => {
                const isSelected = category === cat.id;
                const isLast = idx === CATEGORIES.length - 1;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={[styles.categoryRow, isLast && styles.inputRowLast]}
                  >
                    <View style={styles.categoryLeft}>
                      <Ionicons
                        name={cat.icon as any}
                        size={18}
                        color={isSelected ? '#D42F13' : '#8E8E93'}
                      />
                      <Text
                        style={[
                          styles.categoryName,
                          isSelected && styles.categoryNameActive,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={19} color="#D42F13" />
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

            {/* Inset Group 4: Description & Serving Notes */}
            <Text style={styles.groupHeader}>NOTES & INGREDIENTS</Text>
            <View style={styles.insetGroup}>
              <View style={styles.textAreaRow}>
                <Text style={styles.rowLabelTop}>Description</Text>
                <TextInput
                  style={styles.textArea}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholder="Describe your dish, broth recipe, or cuts of meat..."
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.rowLabel}>Flavor Profile</Text>
                <TextInput
                  style={styles.textInput}
                  value={flavorTag}
                  onChangeText={setFlavorTag}
                  placeholder="e.g. Rich &amp; Savory"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
                />
              </View>

              <View style={[styles.inputRow, styles.inputRowLast]}>
                <Text style={styles.rowLabel}>Serving Note</Text>
                <TextInput
                  style={styles.textInput}
                  value={servingNote}
                  onChangeText={setServingNote}
                  placeholder="e.g. Served with calamansi &amp; chili oil"
                  placeholderTextColor="rgba(60, 60, 67, 0.3)"
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
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      web: {
        maxWidth: 600,
        width: '100%',
        alignSelf: 'center',
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
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.6)',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  presetsList: {
    gap: 10,
    paddingVertical: 4,
  },
  presetCard: {
    width: 90,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    paddingBottom: 6,
  },
  presetCardActive: {
    borderColor: '#D42F13',
  },
  presetThumb: {
    width: '100%',
    height: 60,
    marginBottom: 4,
  },
  presetLabel: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  presetLabelActive: {
    color: '#D42F13',
    fontWeight: '600',
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
  rowLabelTop: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
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
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
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
    gap: 12,
  },
  categoryName: {
    fontSize: 16,
    color: '#000000',
  },
  categoryNameActive: {
    fontWeight: '600',
    color: '#D42F13',
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
