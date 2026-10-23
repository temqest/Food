import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FoodItem, Establishment } from '@/data/types';
import { DishInsiderTip } from '@/data/gamification';

interface DishDossierModalProps {
  visible: boolean;
  food: FoodItem | null;
  insiderTip?: DishInsiderTip;
  servingEstablishments: Establishment[];
  isLogged: boolean;
  onClose: () => void;
  onLogTasting: (food: FoodItem) => void;
}

export const DishDossierModal: React.FC<DishDossierModalProps> = ({
  visible,
  food,
  insiderTip,
  servingEstablishments,
  isLogged,
  onClose,
  onLogTasting,
}) => {
  if (!food) return null;

  const siliLevel = insiderTip?.siliLevel ?? 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* iOS Grabber */}
          <View style={styles.grabberRow}>
            <View style={styles.grabber} />
          </View>

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleColumn}>
              <Text style={styles.headerEyebrow}>CODEX DOSSIER · ENTRY #{food.id.toUpperCase()}</Text>
              <Text style={styles.headerTitle}>{food.name}</Text>
              {food.bikolName && (
                <Text style={styles.headerBikolName}>
                  Bikol: <Text style={styles.bikolItalic}>{food.bikolName}</Text>
                </Text>
              )}
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close dossier modal"
            >
              <Ionicons name="close" size={20} color="#000000" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.sheetScrollView}
            contentContainerStyle={styles.sheetScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Image with Overlays */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: food.image }} style={styles.heroImage} resizeMode="cover" />

              <View style={styles.imageOverlayTop}>
                {isLogged ? (
                  <View style={styles.tastedSeal}>
                    <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.tastedSealText}>PASSPORT TASTED</Text>
                  </View>
                ) : (
                  <View style={styles.unloggedSeal}>
                    <Ionicons name="sparkles" size={12} color="#D42F13" style={{ marginRight: 4 }} />
                    <Text style={styles.unloggedSealText}>UNLOCKED IN CODEX</Text>
                  </View>
                )}

                <View style={styles.heatBadge}>
                  <Text style={styles.heatBadgeText}>
                    {'🌶️'.repeat(Math.min(siliLevel, 3))} Level {siliLevel}/5
                  </Text>
                </View>
              </View>

              <View style={styles.priceTape}>
                <Text style={styles.priceTapeText}>{food.priceRange}</Text>
              </View>
            </View>

            {/* Section 1: Cultural Context & Origin Story */}
            <View style={styles.dossierSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="book-outline" size={15} color="#D42F13" style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeading}>Cultural Heritage & Origins</Text>
              </View>
              <Text style={styles.bodyParagraph}>{food.culturalContext}</Text>
              <Text style={[styles.bodyParagraph, { marginTop: 6 }]}>{food.description}</Text>
            </View>

            {/* Section 2: Flavor Matrix & Profile */}
            <View style={styles.dossierSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="flask-outline" size={15} color="#D42F13" style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeading}>Flavor Matrix & Profile</Text>
              </View>
              <View style={styles.flavorCloud}>
                {food.flavorProfile.map((flavor, index) => (
                  <View key={index} style={styles.flavorTag}>
                    <Text style={styles.flavorTagDot}>●</Text>
                    <Text style={styles.flavorTagText}>{flavor}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Section 3: Insider Hack & Ordering Lingo */}
            {insiderTip && (
              <View style={styles.secretCard}>
                <View style={styles.secretHeader}>
                  <Ionicons name="bulb" size={16} color="#FF9500" style={{ marginRight: 6 }} />
                  <Text style={styles.secretTitle}>Nagueño Insider Secret</Text>
                </View>
                <Text style={styles.secretText}>{insiderTip.secretHack}</Text>

                <View style={styles.lingoSubCard}>
                  <Text style={styles.lingoSubTitle}>🗣️ HOW TO ORDER LIKE A LOCAL:</Text>
                  <Text style={styles.lingoSubQuote}>{insiderTip.orderingLingo}</Text>
                  {insiderTip.funFact && (
                    <Text style={styles.lingoFunFact}>💡 Did you know? {insiderTip.funFact}</Text>
                  )}
                </View>
              </View>
            )}

            {/* Section 4: Authentic Spots in Naga */}
            <View style={styles.dossierSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="location-outline" size={15} color="#D42F13" style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeading}>
                  Where to Taste in Naga ({servingEstablishments.length} Spots)
                </Text>
              </View>

              {servingEstablishments.map((est) => (
                <Pressable
                  key={est.id}
                  onPress={() => {
                    onClose();
                    router.push(`/establishment/${est.id}`);
                  }}
                  style={({ pressed }) => [styles.estCard, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Visit ${est.name}`}
                >
                  <View style={styles.estInfo}>
                    <Text style={styles.estName}>{est.name}</Text>
                    <Text style={styles.estAddress}>{est.neighborhood} · {est.address}</Text>
                    <View style={styles.estMetaRow}>
                      <Text style={[styles.estStatus, { color: est.isOpenNow ? '#34C759' : '#8E8E93' }]}>
                        {est.isOpenNow ? '● Open Now' : '○ Closed'}
                      </Text>
                      <Text style={styles.estMetaDot}>·</Text>
                      <Text style={styles.estDistance}>{Math.round(est.distanceKm * 1000)}m away</Text>
                      <Text style={styles.estMetaDot}>·</Text>
                      <Text style={styles.estHours}>{est.openingHours}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Fixed Footer Actions */}
          <View style={styles.sheetFooter}>
            {!isLogged && (
              <Pressable
                onPress={() => {
                  onClose();
                  onLogTasting(food);
                }}
                style={({ pressed }) => [styles.primaryLogButton, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Log tasting in passport"
              >
                <Ionicons name="ribbon" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryLogButtonText}>Log Tasting (+50 XP)</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                onClose();
                router.push(`/food/${food.id}`);
              }}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="View full food page and pre-order"
            >
              <Text style={styles.secondaryButtonText}>Open Food & Menu Page</Text>
              <Ionicons name="arrow-forward" size={14} color="#D42F13" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const serifFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", serif',
  default: 'Georgia',
});

const sansFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
  default: 'system-ui',
});

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    ...Platform.select({
      web: { boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.2)' } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
      },
    }),
  },
  grabberRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(60, 60, 67, 0.3)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerTitleColumn: {
    flex: 1,
    paddingRight: 10,
  },
  headerEyebrow: {
    fontFamily: sansFamily,
    fontSize: 9,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontFamily: sansFamily,
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  headerBikolName: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  bikolItalic: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    color: '#D42F13',
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScrollView: {
    flexGrow: 0,
  },
  sheetScrollContent: {
    padding: 18,
    paddingBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#E5E5EA',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tastedSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A2B',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  tastedSealText: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  unloggedSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D42F13',
  },
  unloggedSealText: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.4,
  },
  heatBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  heatBadgeText: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceTape: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#FFC857',
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 4,
    transform: [{ rotate: '-2deg' }],
  },
  priceTapeText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#4A3400',
  },
  dossierSection: {
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeading: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.2,
  },
  bodyParagraph: {
    fontFamily: sansFamily,
    fontSize: 13,
    color: '#3C3C43',
    lineHeight: 19,
  },
  flavorCloud: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  flavorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
  },
  flavorTagDot: {
    fontSize: 7,
    color: '#D42F13',
  },
  flavorTagText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  secretCard: {
    backgroundColor: '#FFFDF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#D8CBB5',
    marginBottom: 18,
  },
  secretHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  secretTitle: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#D42F13',
  },
  secretText: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#1C1C1E',
    lineHeight: 18,
    marginBottom: 10,
  },
  lingoSubCard: {
    backgroundColor: '#FFF2EE',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#D42F13',
  },
  lingoSubTitle: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#D42F13',
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  lingoSubQuote: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 18,
  },
  lingoFunFact: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 6,
    lineHeight: 15,
  },
  estCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 8,
  },
  estInfo: {
    flex: 1,
    paddingRight: 8,
  },
  estName: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  estAddress: {
    fontFamily: sansFamily,
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  estMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  estStatus: {
    fontFamily: sansFamily,
    fontSize: 10,
    fontWeight: '600',
  },
  estMetaDot: {
    marginHorizontal: 4,
    color: '#C7C7CC',
    fontSize: 10,
  },
  estDistance: {
    fontFamily: sansFamily,
    fontSize: 10,
    color: '#3C3C43',
  },
  estHours: {
    fontFamily: sansFamily,
    fontSize: 10,
    color: '#8E8E93',
  },
  sheetFooter: {
    paddingHorizontal: 18,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    gap: 8,
  },
  primaryLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    backgroundColor: '#D42F13',
    borderRadius: 14,
  },
  primaryLogButtonText: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    backgroundColor: '#FFF2EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.2)',
  },
  secondaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
