import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { FOOD_ITEMS, ESTABLISHMENTS } from '@/data/mockData';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';
import { useQuest } from '@/context/QuestContext';
import { DISH_INSIDER_TIPS } from '@/data/gamification';
import { PassportStampModal } from '@/components/gamification/PassportStampModal';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFoodSaved, toggleSaveFood } = useSaved();
  const { addToBasket, setActiveTabSection } = useBasket();
  const { isFoodLogged } = useQuest();

  const [stampModalVisible, setStampModalVisible] = useState(false);

  const food = FOOD_ITEMS.find((f) => f.id === id) || FOOD_ITEMS[0];
  const saved = isFoodSaved(food.id);
  const isLogged = isFoodLogged(food.id);

  // Establishments serving this food
  const servingEstablishments = ESTABLISHMENTS.filter((est) =>
    est.foodsOffered.some((item) => item.foodId === food.id)
  );

  const primaryEst = servingEstablishments[0] || ESTABLISHMENTS[0];
  const insiderTip = DISH_INSIDER_TIPS[food.id];
  const siliLevel = insiderTip?.siliLevel || 2;

  const handleOpenStamp = () => {
    setStampModalVisible(true);
  };

  const handlePreOrder = () => {
    const offering = primaryEst.foodsOffered.find((f) => f.foodId === food.id);
    addToBasket({
      foodId: food.id,
      foodName: food.name,
      price: offering ? offering.price : 85,
      establishmentId: primaryEst.id,
      establishmentName: primaryEst.name,
      establishmentAddress: primaryEst.address,
      image: food.image,
      quantity: 1,
    });
    setActiveTabSection('current');
    router.push('/basket');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Minimal Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>

        <View style={styles.topBarRight}>
          {isLogged && (
            <View style={styles.loggedBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#34C759" />
              <Text style={styles.loggedBadgeText}>Tasted</Text>
            </View>
          )}

          <Pressable
            onPress={() => toggleSaveFood(food.id)}
            style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save dish'}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={saved ? '#D42F13' : '#000000'}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Hero Photo Banner */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={{ uri: food.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Title Header with Editorial Styling */}
          <View style={styles.titleSection}>
            <Text style={styles.foodTitle}>{food.name}</Text>
            {food.bikolName && (
              <Text style={styles.bikolName}>
                Bikolano: <Text style={styles.bikolItalic}>{food.bikolName}</Text>
              </Text>
            )}
            <Text style={styles.tagline}>{food.tagline}</Text>
          </View>

          {/* Sili Heat & Overview Group */}
          <View style={styles.insetGroup}>
            <View style={styles.groupRow}>
              <Text style={styles.groupRowLabel}>Bicolano Sili Heat</Text>
              <View style={styles.heatMeterRow}>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <Ionicons
                    key={lvl}
                    name="flame"
                    size={16}
                    color={lvl <= siliLevel ? '#D42F13' : '#E5E5EA'}
                  />
                ))}
                <Text style={styles.heatMeterText}>
                  {siliLevel >= 4 ? 'Fiery Labuyo' : siliLevel === 3 ? 'Authentic Kick' : 'Mild'}
                </Text>
              </View>
            </View>
            <View style={styles.groupRow}>
              <Text style={styles.groupRowLabel}>Typical Price</Text>
              <Text style={styles.groupRowValueBold}>{food.priceRange}</Text>
            </View>
            <View style={[styles.groupRow, styles.groupRowLast]}>
              <Text style={styles.groupRowLabel}>Serving Places</Text>
              <Text style={styles.groupRowValue}>
                {servingEstablishments.length} authentic spots in Naga
              </Text>
            </View>
          </View>

          {/* Insider Secret Hack Card */}
          {insiderTip && (
            <View style={styles.insiderCard}>
              <View style={styles.insiderHeader}>
                <Ionicons name="bulb" size={16} color="#D42F13" />
                <Text style={styles.insiderTitle}>Nagueño Secret Hack</Text>
              </View>
              <Text style={styles.insiderHack}>{insiderTip.secretHack}</Text>
              <View style={styles.lingoBox}>
                <Text style={styles.lingoLabel}>Local Ordering Lingo:</Text>
                <Text style={styles.lingoText}>{insiderTip.orderingLingo}</Text>
              </View>
            </View>
          )}

          {/* Flavor Profile Pills */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Flavor Profile</Text>
            <View style={styles.flavorTagsContainer}>
              {food.flavorProfile.map((flavor, index) => {
                const isDashed = index % 2 === 0;
                return (
                  <View
                    key={index}
                    style={[
                      styles.flavorPill,
                      isDashed ? styles.flavorPillDashed : styles.flavorPillSolid,
                    ]}
                  >
                    <Text style={styles.flavorPillText}>{flavor}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Cultural Heritage & Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Lore & Background</Text>
            <View style={styles.insetGroup}>
              <View style={styles.textBlock}>
                <Text style={styles.bodyText}>{food.description}</Text>
              </View>
              {food.culturalContext && (
                <View style={[styles.textBlock, styles.textBlockDivider]}>
                  <Text style={styles.contextHeader}>Cultural Roots in Naga</Text>
                  <Text style={styles.bodyText}>{food.culturalContext}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Serving Establishments Inset Group */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>Where to Taste It in Naga</Text>
            <View style={styles.insetGroup}>
              {servingEstablishments.map((est, index) => {
                const offering = est.foodsOffered.find((f) => f.foodId === food.id);
                const isLast = index === servingEstablishments.length - 1;
                const distanceStr =
                  est.distanceKm < 1
                    ? `${Math.round(est.distanceKm * 1000)} m`
                    : `${est.distanceKm} km`;

                return (
                  <Pressable
                    key={est.id}
                    onPress={() => {
                      router.push({
                        pathname: '/establishment/[id]',
                        params: { id: est.id },
                      });
                    }}
                    style={({ pressed }) => [
                      styles.establishmentRow,
                      isLast && styles.establishmentRowLast,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <Image
                      source={{ uri: est.heroImage }}
                      style={styles.estThumbnail}
                      resizeMode="cover"
                    />

                    <View style={[styles.estContent, isLast && styles.estContentLast]}>
                      <View style={styles.estInfo}>
                        <Text style={styles.estName} numberOfLines={1}>
                          {est.name}
                        </Text>
                        <Text style={styles.estSubhead} numberOfLines={1}>
                          {offering ? `₱${offering.price} · ` : ''}
                          {est.neighborhood} · {distanceStr}
                        </Text>
                        <Text
                          style={[
                            styles.estStatus,
                            est.isOpenNow ? styles.statusOpen : styles.statusClosed,
                          ]}
                        >
                          {est.isOpenNow ? 'Open Now' : 'Closed'}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#C7C7CC"
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Action Buttons: Stamp Passport & Reserve Pass */}
          <View style={styles.actionContainer}>
            <Pressable
              onPress={handleOpenStamp}
              style={({ pressed }) => [styles.stampButton, pressed && styles.primaryPressed]}
              accessibilityRole="button"
              accessibilityLabel="Stamp passport for this dish"
            >
              <Ionicons name="ribbon-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.stampButtonText}>
                {isLogged ? 'Log Another Tasting (+60 XP)' : 'Stamp My Passport (I Ate This!)'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handlePreOrder}
              style={({ pressed }) => [styles.secondaryPassButton, pressed && styles.rowPressed]}
              accessibilityRole="button"
              accessibilityLabel="Reserve dine-in pass"
            >
              <Ionicons name="ticket-outline" size={16} color="#D42F13" style={{ marginRight: 6 }} />
              <Text style={styles.secondaryPassText}>Reserve Dine-In Pass</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Passport Stamp Logger Modal */}
      <PassportStampModal
        visible={stampModalVisible}
        onClose={() => setStampModalVisible(false)}
        foodId={food.id}
        foodName={food.name}
        establishmentId={primaryEst.id}
        establishmentName={primaryEst.name}
        image={food.image}
      />
    </SafeAreaView>
  );
}

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
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 8,
    backgroundColor: '#F2F2F7',
    zIndex: 10,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loggedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F9EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loggedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
    marginLeft: 4,
  },
  navIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  // Hero Photo Banner
  heroImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E5E5EA',
    marginTop: 4,
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  // Title Section
  titleSection: {
    marginBottom: 16,
  },
  foodTitle: {
    fontFamily: sansFamily,
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.6,
  },
  bikolName: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  bikolItalic: {
    fontFamily: serifFamily,
    fontStyle: 'italic',
    color: '#D42F13',
    fontWeight: '600',
  },
  tagline: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(60, 60, 67, 0.75)',
    marginTop: 6,
  },

  // Inset Groups
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
    marginBottom: 16,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  groupRowLast: {
    borderBottomWidth: 0,
  },
  groupRowLabel: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: 'rgba(60, 60, 67, 0.60)',
  },
  groupRowValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  groupRowValueBold: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#D42F13',
  },

  // Heat meter
  heatMeterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  heatMeterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D42F13',
    marginLeft: 6,
  },

  // Insider Secret Hack Card
  insiderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.15)',
  },
  insiderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  insiderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D42F13',
    letterSpacing: 0.2,
  },
  insiderHack: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(60, 60, 67, 0.85)',
    marginBottom: 10,
  },
  lingoBox: {
    backgroundColor: '#FFF0EE',
    padding: 10,
    borderRadius: 8,
  },
  lingoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D42F13',
    marginBottom: 2,
  },
  lingoText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#1C1C1E',
  },

  // Flavor Profile
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  flavorTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  flavorPillSolid: {
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  flavorPillDashed: {
    backgroundColor: '#FFF0EE',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(212, 47, 19, 0.3)',
  },
  flavorPillText: {
    fontFamily: sansFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },

  // Text Blocks
  textBlock: {
    padding: 16,
  },
  textBlockDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F2F2F7',
  },
  contextHeader: {
    fontFamily: sansFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#D42F13',
    marginBottom: 4,
  },
  bodyText: {
    fontFamily: sansFamily,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(60, 60, 67, 0.80)',
  },

  // Establishments List
  establishmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F2F2F7',
  },
  establishmentRowLast: {
    borderBottomWidth: 0,
  },
  estThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E5E5EA',
    marginRight: 12,
  },
  estContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estContentLast: {
    borderBottomWidth: 0,
  },
  estInfo: {
    flex: 1,
  },
  estName: {
    fontFamily: sansFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  estSubhead: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.60)',
    marginTop: 1,
  },
  estStatus: {
    fontFamily: sansFamily,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statusOpen: {
    color: '#34C759',
  },
  statusClosed: {
    color: '#8E8E93',
  },

  // Action Buttons
  actionContainer: {
    marginTop: 8,
    gap: 10,
  },
  stampButton: {
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 3px 10px rgba(212, 47, 19, 0.25)',
      },
    }),
  },
  stampButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryPassButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(212, 47, 19, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryPassText: {
    color: '#D42F13',
    fontSize: 14,
    fontWeight: '600',
  },

  primaryPressed: {
    opacity: 0.88,
  },
  rowPressed: {
    backgroundColor: 'rgba(60, 60, 67, 0.05)',
  },
  pressed: {
    opacity: 0.8,
  },
});
