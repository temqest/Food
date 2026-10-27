import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment, FoodItem } from '@/data/types';
import { DISH_INSIDER_TIPS } from '@/data/gamification';

interface TrailStopDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  stopNumber: number;
  establishment: Establishment | null;
  foodItem?: FoodItem | null;
  isCompleted: boolean;
  onLogStamp: () => void;
  onViewStallDetails: () => void;
}

export const TrailStopDetailsSheet: React.FC<TrailStopDetailsSheetProps> = ({
  visible,
  onClose,
  stopNumber,
  establishment,
  foodItem,
  isCompleted,
  onLogStamp,
  onViewStallDetails,
}) => {
  if (!establishment) return null;

  const primaryFood = foodItem || undefined;
  const insiderTip = primaryFood ? DISH_INSIDER_TIPS[primaryFood.id] : undefined;

  const handleOpenNavigation = () => {
    const lat = establishment.coordinates.latitude;
    const lng = establishment.coordinates.longitude;
    const label = encodeURIComponent(establishment.name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${label})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Grabber Handle */}
          <View style={styles.grabber} />

          {/* Close button in header */}
          <View style={styles.headerRow}>
            <View style={styles.stopNumberBadge}>
              <Text style={styles.stopNumberText}>STOP #{stopNumber}</Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.btnPressed]}
              hitSlop={10}
            >
              <Ionicons name="close" size={20} color="#000000" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hero Image */}
            <Image
              source={{ uri: establishment.heroImage }}
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Title & Address */}
            <View style={styles.titleSection}>
              <Text style={styles.establishmentName}>{establishment.name}</Text>
              <Text style={styles.establishmentAddress}>{establishment.address}</Text>

              {/* Status pills */}
              <View style={styles.pillsRow}>
                <View
                  style={[
                    styles.statusPill,
                    establishment.isOpenNow ? styles.statusOpen : styles.statusClosed,
                  ]}
                >
                  <Ionicons
                    name="time"
                    size={12}
                    color={establishment.isOpenNow ? '#34C759' : '#8E8E93'}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      establishment.isOpenNow ? styles.statusOpenText : styles.statusClosedText,
                    ]}
                  >
                    {establishment.openingHours}
                  </Text>
                </View>

                {isCompleted && (
                  <View style={styles.completedPill}>
                    <Ionicons name="checkmark-circle" size={12} color="#34C759" />
                    <Text style={styles.completedPillText}>Visited & Tasted</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            <Text style={styles.descriptionText}>{establishment.description}</Text>

            {/* Insider Tip Box (if available) */}
            {insiderTip && (
              <View style={styles.insiderTipBox}>
                <View style={styles.tipHeader}>
                  <Ionicons name="bulb-outline" size={16} color="#FF9500" />
                  <Text style={styles.tipTitle}>Nagueño Insider Tip</Text>
                </View>
                <Text style={styles.tipContent}>{`"${insiderTip.secretHack}"`}</Text>
              </View>
            )}

            {/* Foods Offered Section */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionHeading}>Featured Specialties</Text>
              {establishment.foodsOffered.map((food, idx) => (
                <View key={`food-${idx}`} style={styles.menuItemRow}>
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{food.foodName}</Text>
                    {food.servingNote && (
                      <Text style={styles.menuItemNote}>{food.servingNote}</Text>
                    )}
                  </View>
                  <Text style={styles.menuItemPrice}>₱{food.price}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Action Footer */}
          <View style={styles.footerActions}>
            <Pressable
              onPress={handleOpenNavigation}
              style={({ pressed }) => [styles.directionsBtn, pressed && styles.btnPressed]}
              accessibilityRole="button"
            >
              <Ionicons name="navigate-outline" size={18} color="#000000" />
              <Text style={styles.directionsBtnText}>Directions</Text>
            </Pressable>

            <Pressable
              onPress={onLogStamp}
              style={({ pressed }) => [styles.stampBtn, pressed && styles.btnPressed]}
              accessibilityRole="button"
            >
              <Ionicons name="ribbon-outline" size={18} color="#FFFFFF" />
              <Text style={styles.stampBtnText}>
                {isCompleted ? 'Log Another Bite' : 'Log Bite & Stamp'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  stopNumberBadge: {
    backgroundColor: 'rgba(212, 47, 19, 0.10)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stopNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
    marginBottom: 14,
  },
  titleSection: {
    marginBottom: 12,
  },
  establishmentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  establishmentAddress: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.65)',
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusOpen: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
  },
  statusClosed: {
    backgroundColor: 'rgba(142, 142, 147, 0.12)',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusOpenText: {
    color: '#34C759',
  },
  statusClosedText: {
    color: '#8E8E93',
  },
  completedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
  },
  completedPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(60, 60, 67, 0.85)',
    marginBottom: 14,
  },
  insiderTipBox: {
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 149, 0, 0.25)',
    marginBottom: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF9500',
    letterSpacing: 0.2,
  },
  tipContent: {
    fontSize: 13,
    color: '#000000',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  menuSection: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  menuItemNote: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D42F13',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
  },
  directionsBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  directionsBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  stampBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stampBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
