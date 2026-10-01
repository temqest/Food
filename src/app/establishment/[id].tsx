import React from 'react';
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
import { ESTABLISHMENTS, FOOD_ITEMS } from '@/data/mockData';
import { useSaved } from '@/context/SavedContext';
import { useBasket } from '@/context/BasketContext';

export default function EstablishmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isEstablishmentSaved, toggleSaveEstablishment } = useSaved();
  const { addToBasket, setActiveTabSection } = useBasket();

  const establishment =
    ESTABLISHMENTS.find((e) => e.id === id) || ESTABLISHMENTS[0];
  const saved = isEstablishmentSaved(establishment.id);

  const distanceStr =
    establishment.distanceKm < 1
      ? `${Math.round(establishment.distanceKm * 1000)} m`
      : `${establishment.distanceKm} km`;

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

        <Pressable
          onPress={() => toggleSaveEstablishment(establishment.id)}
          style={({ pressed }) => [styles.navIconButton, pressed && styles.pressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved' : 'Save place'}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={saved ? '#D42F13' : '#000000'}
          />
        </Pressable>
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
              source={{ uri: establishment.heroImage }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Header Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.nameTitle}>{establishment.name}</Text>
            <Text style={styles.subhead}>
              {establishment.typeLabel} · {establishment.neighborhood} · {distanceStr}
            </Text>
            <Text
              style={[
                styles.statusText,
                establishment.isOpenNow ? styles.statusOpen : styles.statusClosed,
              ]}
            >
              {establishment.isOpenNow ? 'Open Now' : 'Closed'} · {establishment.openingHours}
            </Text>
          </View>

          {/* Section: Dishes Served Here */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Dishes Offered Here</Text>
            <View style={styles.insetGroup}>
              {establishment.foodsOffered.map((food, index) => {
                const isLast = index === establishment.foodsOffered.length - 1;
                const fullFoodObj = FOOD_ITEMS.find((f) => f.id === food.foodId);

                return (
                  <View
                    key={index}
                    style={[
                      styles.foodRow,
                      isLast && styles.foodRowLast,
                    ]}
                  >
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname: '/food/[id]',
                          params: { id: food.foodId },
                        });
                      }}
                      style={({ pressed }) => [
                        styles.foodInfoPressable,
                        pressed && styles.rowPressed,
                      ]}
                    >
                      <Text style={styles.foodName}>{food.foodName}</Text>
                      {food.servingNote && (
                        <Text style={styles.foodNote}>{food.servingNote}</Text>
                      )}
                    </Pressable>

                    <View style={styles.foodRight}>
                      <Text style={styles.foodPrice}>₱{food.price}</Text>
                      <Pressable
                        onPress={() => {
                          addToBasket({
                            foodId: food.foodId,
                            foodName: food.foodName,
                            price: food.price,
                            establishmentId: establishment.id,
                            establishmentName: establishment.name,
                            establishmentAddress: establishment.address,
                            image: fullFoodObj?.image || establishment.heroImage,
                            quantity: 1,
                            selectedNote: food.servingNote,
                          });
                          setActiveTabSection('current');
                          router.push('/basket');
                        }}
                        style={({ pressed }) => [
                          styles.addBasketBtn,
                          pressed && styles.pressed,
                        ]}
                        hitSlop={8}
                        accessibilityLabel="Add to pre-order basket"
                      >
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Section: Information Group */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.insetGroup}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{establishment.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hours</Text>
                <Text style={styles.infoValue}>{establishment.openingHours}</Text>
              </View>
              {establishment.contactNumber && (
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValueTint}>{establishment.contactNumber}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Section: About */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.insetGroup}>
              <View style={styles.aboutBlock}>
                <Text style={styles.aboutText}>{establishment.description}</Text>
              </View>
            </View>
          </View>

          {/* Primary Action Button */}
          <Pressable
            onPress={() => router.push('/map')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryPressed]}
            accessibilityRole="button"
            accessibilityLabel="Locate on map"
          >
            <Ionicons name="navigate" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>Locate on Naga Map</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingBottom: 6,
  },
  navIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 20,
  },
  heroImageWrapper: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    paddingBottom: 16,
  },
  nameTitle: {
    fontFamily: sansFamily,
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.8,
  },
  subhead: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statusText: {
    fontFamily: sansFamily,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  statusOpen: {
    color: '#34C759',
  },
  statusClosed: {
    color: '#FF3B30',
  },

  // Sections
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: sansFamily,
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  insetGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Food Rows
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  foodRowLast: {
    borderBottomWidth: 0,
  },
  foodInfoPressable: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 2,
  },
  foodName: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  foodNote: {
    fontFamily: sansFamily,
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  foodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  foodPrice: {
    fontFamily: sansFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#D42F13',
  },
  addBasketBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    width: 90,
  },
  infoValue: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
    textAlign: 'right',
  },
  infoValueTint: {
    fontFamily: sansFamily,
    fontSize: 14,
    color: '#D42F13',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  aboutBlock: {
    padding: 16,
  },
  aboutText: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 21,
    color: '#48484A',
  },

  // Button
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111111',
    marginTop: 4,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontFamily: sansFamily,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  pressed: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  rowPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});
