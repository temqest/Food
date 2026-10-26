import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment, FoodItem } from '@/data/types';
import { TrailSide, getTrailAnchorX } from './TrailSteppingBridge';

export type TrailStopStatus = 'completed' | 'active' | 'locked';

const THEME = {
  cardBg: '#FFFDF7',           // Off-white / cream postcard paper
  borderWarm: '#D8CBB5',       // Thin warm vintage border
  terracotta: '#E0533C',       // Terracotta accent
  terracottaDark: '#B83A25',   // Deep Terracotta
  forestGreen: '#1E3A2B',      // Forest Green title & headers
  yellowWarm: '#FFC857',       // Warm Yellow sticker/accent
  amberCta: '#FFB703',         // CTA Yellow/Terracotta button
  charcoal: '#2D2B2A',         // Charcoal typography
  mutedText: '#6F6A64',        // Warm secondary charcoal
};

interface TrailStopStationProps {
  stopNumber: number;
  establishment: Establishment;
  foodItem?: FoodItem;
  status: TrailStopStatus;
  enterSide?: TrailSide;
  exitSide?: TrailSide;
  stopSide?: 'left' | 'right';
  distanceMeters?: number;
  onPress: () => void;
  onNavigate?: () => void;
  onCheckIn?: () => void;
}

export const TrailStopStation: React.FC<TrailStopStationProps> = ({
  stopNumber,
  establishment,
  foodItem,
  status,
  enterSide,
  exitSide,
  stopSide,
  distanceMeters = 240,
  onPress,
  onNavigate,
  onCheckIn,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  const signatureFood =
    establishment.foodsOffered.find((f) => f.isSignature) ||
    establishment.foodsOffered[0];

  const displayDishName = foodItem?.name || signatureFood?.foodName || 'Heritage Specialty';
  const displayImage = foodItem?.image || establishment.heroImage;
  const dishPrice = signatureFood?.price || 85;

  // Road docking coordinates relative to the card's inner frame
  // Card has 16px horizontal margins on each side
  const enterX = enterSide ? getTrailAnchorX(enterSide, screenWidth) - 16 : null;
  const exitX = exitSide ? getTrailAnchorX(exitSide, screenWidth) - 16 : null;

  // Alternating stop circle position: left or right
  const isStopOnLeft = (stopSide ?? (stopNumber % 2 === 1 ? 'left' : 'right')) === 'left';

  return (
    <View style={styles.stationWrapper}>
      {/* ============================================================ */}
      {/* PROMINENT FOOD DESTINATION POSTCARD                          */}
      {/* Connected directly to winding road at enterX and exitX       */}
      {/* ============================================================ */}
      <View
        style={[
          styles.card,
          isActive && styles.cardActive,
          isCompleted && styles.cardCompleted,
          isLocked && styles.cardLocked,
        ]}
      >
        {/* Top road arrival port */}
        {enterX !== null && (
          <View
            style={[
              styles.roadDockTop,
              { left: enterX - 6 },
              (isCompleted || isActive) && styles.roadDockActive,
            ]}
          />
        )}

        {/* Bottom road departure port */}
        {exitX !== null && (
          <View
            style={[
              styles.roadDockBottom,
              { left: exitX - 6 },
              isCompleted && styles.roadDockActive,
            ]}
          />
        )}

        {/* ============================================================ */}
        {/* OVEREXTENDING CIRCULAR STOP BADGE (Perched outside on corner) */}
        {/* ============================================================ */}
        <View
          style={[
            styles.protrudingStopBadge,
            isStopOnLeft ? styles.protrudingBadgeLeft : styles.protrudingBadgeRight,
            isActive && styles.circleStopBadgeActive,
            isCompleted && styles.circleStopBadgeCompleted,
          ]}
        >
          <Text style={styles.circleStopText}>{stopNumber}</Text>
          {isCompleted && (
            <View style={styles.circleCompletedPip}>
              <Ionicons name="checkmark" size={7.5} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Vintage Ticket Notches on left and right borders */}
        <View style={styles.ticketNotchLeft} />
        <View style={styles.ticketNotchRight} />

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.cardPressableArea, pressed && styles.cardPressed]}
          accessibilityRole="button"
          accessibilityLabel={`Stop ${stopNumber}: ${establishment.name}`}
        >
          {/* ========================================================== */}
          {/* A. HERO FOOD BANNER (Prominent 165px height)                */}
          {/* ========================================================== */}
          <View style={styles.heroBannerContainer}>
            <Image
              source={{ uri: displayImage }}
              style={[styles.heroBannerImage, isLocked && styles.heroBannerLocked]}
              resizeMode="cover"
            />

            {/* Gradient Dark Vignette Overlay for readable tags */}
            <View style={styles.heroVignetteOverlay} />

            {/* Distance Badge on the opposite top corner */}
            <View style={isStopOnLeft ? styles.heroTopRightTag : styles.heroTopLeftTag}>
              <View style={styles.distanceBadge}>
                <Ionicons name="footsteps" size={10.5} color="#FFFFFF" />
                <Text style={styles.distanceText}>
                  {distanceMeters < 1000 ? `${distanceMeters}m` : `${(distanceMeters / 1000).toFixed(1)}km`}
                </Text>
              </View>
            </View>

            {/* Bottom-Left: Authentic Tilted Price Tape */}
            <View style={styles.heroBottomLeftTag}>
              <View style={styles.priceTapeBadge}>
                <Text style={styles.priceTapeText}>₱{dishPrice}</Text>
              </View>
            </View>

            {/* Bottom-Right: Must Try / Logged Status Stamp */}
            <View style={styles.heroBottomRightTag}>
              {isCompleted ? (
                <View style={styles.loggedBadge}>
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                  <Text style={styles.loggedText}>LOGGED</Text>
                </View>
              ) : isActive ? (
                <View style={styles.mustTryBadge}>
                  <Ionicons name="flame" size={11} color="#FFFFFF" />
                  <Text style={styles.mustTryText}>MUST TRY</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* ========================================================== */}
          {/* B. POSTCARD BODY: VENUE DETAILS                            */}
          {/* ========================================================== */}
          <View style={styles.cardDetailsArea}>
            {/* Title & Neighborhood */}
            <View style={styles.titleRow}>
              <Text style={styles.establishmentTitle} numberOfLines={1}>
                {establishment.name}
              </Text>
              <Text style={styles.neighborhoodText} numberOfLines={1}>
                {establishment.neighborhood}
              </Text>
            </View>

            {/* Specialty Dish & Operating Hours */}
            <View style={styles.dishAndHoursRow}>
              <View style={styles.dishPill}>
                <Ionicons name="restaurant" size={11} color={THEME.terracottaDark} />
                <Text style={styles.signatureDishTitle} numberOfLines={1}>
                  {displayDishName}
                </Text>
              </View>

              <View style={styles.hoursRow}>
                <View
                  style={[
                    styles.openStatusDot,
                    establishment.isOpenNow ? styles.openDot : styles.closedDot,
                  ]}
                />
                <Text
                  style={[
                    styles.hoursLabel,
                    establishment.isOpenNow ? styles.hoursOpen : styles.hoursClosed,
                  ]}
                >
                  {establishment.isOpenNow ? 'Open Now' : 'Closed'}
                </Text>
                <Text style={styles.dotSeparator}>·</Text>
                <Text style={styles.hoursDetails} numberOfLines={1}>
                  until {establishment.openingHours.split('–')[1]?.trim() || 'closing'}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* ========================================================== */}
        {/* C. ACTIVE ACTION BUTTONS                                   */}
        {/* ========================================================== */}
        {isActive && (
          <View style={styles.actionRow}>
            {onNavigate && (
              <Pressable
                onPress={onNavigate}
                style={({ pressed }) => [styles.directionsBtn, pressed && styles.btnPressed]}
                accessibilityRole="button"
                accessibilityLabel="Get directions"
              >
                <Ionicons name="navigate-outline" size={14} color={THEME.charcoal} />
                <Text style={styles.directionsBtnText}>Directions</Text>
              </Pressable>
            )}

            {onCheckIn && (
              <Pressable
                onPress={onCheckIn}
                style={({ pressed }) => [styles.stampBtn, pressed && styles.btnPressed]}
                accessibilityRole="button"
                accessibilityLabel="Log tasting and stamp passport"
              >
                <Ionicons name="ribbon" size={14} color="#FFFFFF" />
                <Text style={styles.stampBtnText}>Log & Stamp</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stationWrapper: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 0,
    zIndex: 2,
  },

  /* Postcard Card Body */
  card: {
    backgroundColor: THEME.cardBg,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: THEME.borderWarm,
    position: 'relative',
    overflow: 'visible', // Allows the circular milestone badge to overextend outside the card
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardActive: {
    borderColor: '#D42F13',
    borderWidth: 2,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardCompleted: {
    borderColor: '#D8CBB5',
    backgroundColor: '#FFFDF7',
  },
  cardLocked: {
    opacity: 0.82,
    borderColor: 'rgba(60, 60, 67, 0.20)',
    borderStyle: 'dashed',
  },

  /* Road Docking Ports (Perpendicular entrance & departure notches) */
  roadDockTop: {
    position: 'absolute',
    top: 0,
    width: 12,
    height: 3,
    backgroundColor: 'rgba(135, 125, 115, 0.45)',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    zIndex: 20,
  },
  roadDockBottom: {
    position: 'absolute',
    bottom: 0,
    width: 12,
    height: 3,
    backgroundColor: 'rgba(135, 125, 115, 0.45)',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    zIndex: 20,
  },
  roadDockActive: {
    backgroundColor: '#D42F13',
  },

  /* ================================================================ */
  /* Overextending Circular Stop Number Badge                         */
  /* Perched on the top corner, slightly overextending outside        */
  /* ================================================================ */
  protrudingStopBadge: {
    position: 'absolute',
    top: -12, // Extends 12px outside above the card top border
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30, 25, 20, 0.88)',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 35,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  protrudingBadgeLeft: {
    left: -6, // Extends 6px outside the left border
  },
  protrudingBadgeRight: {
    right: -6, // Extends 6px outside the right border
  },
  circleStopBadgeActive: {
    backgroundColor: '#D42F13',
    borderColor: '#FFD700',
    borderWidth: 2.5,
    width: 38,
    height: 38,
    borderRadius: 19,
    top: -13,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.40,
        shadowRadius: 6,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  circleStopBadgeCompleted: {
    backgroundColor: '#1E3A2B',
    borderColor: '#FFFFFF',
  },
  circleStopText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  circleCompletedPip: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#2E7D32',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Ticket Notches */
  ticketNotchLeft: {
    position: 'absolute',
    left: -5,
    top: 158,
    width: 6,
    height: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    borderRightWidth: 1.5,
    borderColor: THEME.borderWarm,
    zIndex: 10,
  },
  ticketNotchRight: {
    position: 'absolute',
    right: -5,
    top: 158,
    width: 6,
    height: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 3,
    borderLeftWidth: 1.5,
    borderColor: THEME.borderWarm,
    zIndex: 10,
  },

  cardPressableArea: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.96,
  },

  /* ================================================================ */
  /* A. Hero Food Banner Styles                                       */
  /* ================================================================ */
  heroBannerContainer: {
    width: '100%',
    height: 165,
    position: 'relative',
    backgroundColor: '#EBE3D5',
    borderTopLeftRadius: 16.5,
    borderTopRightRadius: 16.5,
    overflow: 'hidden', // Clips the image to match card's top rounded corners
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroBannerLocked: {
    opacity: 0.65,
  },
  heroVignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 15, 10, 0.18)',
  },

  /* Overlaid Hero Elements */
  heroTopLeftTag: {
    position: 'absolute',
    top: 10,
    left: 12,
    zIndex: 5,
  },
  heroTopRightTag: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 5,
  },

  /* Distance Badge */
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: 'rgba(20, 15, 10, 0.65)',
    paddingHorizontal: 7.5,
    paddingVertical: 3.5,
    borderRadius: 9999,
  },
  distanceText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Price Tape Badge */
  heroBottomLeftTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 5,
  },
  priceTapeBadge: {
    backgroundColor: THEME.yellowWarm,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    transform: [{ rotate: '-2deg' }],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  priceTapeText: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.charcoal,
  },

  /* Status Badges */
  heroBottomRightTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 5,
  },
  loggedBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  loggedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  mustTryBadge: {
    backgroundColor: '#D42F13',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  mustTryText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },

  /* ================================================================ */
  /* B. Card Details Area                                             */
  /* ================================================================ */
  cardDetailsArea: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  establishmentTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: THEME.charcoal,
    letterSpacing: -0.2,
    flexShrink: 1,
    marginRight: 8,
  },
  neighborhoodText: {
    fontSize: 11,
    color: THEME.mutedText,
    fontWeight: '500',
  },

  dishAndHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  dishPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  signatureDishTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.terracottaDark,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  openDot: {
    backgroundColor: '#34C759',
  },
  closedDot: {
    backgroundColor: '#FF3B30',
  },
  hoursLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  hoursOpen: {
    color: '#34C759',
  },
  hoursClosed: {
    color: '#FF3B30',
  },
  dotSeparator: {
    fontSize: 10,
    color: THEME.mutedText,
    marginHorizontal: 4,
  },
  hoursDetails: {
    fontSize: 10.5,
    color: THEME.mutedText,
  },

  /* Action Buttons */
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  directionsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5EFE6',
    borderWidth: 1.2,
    borderColor: '#D8CBB5',
    paddingVertical: 9,
    borderRadius: 9,
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.charcoal,
  },
  stampBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D42F13',
    paddingVertical: 9,
    borderRadius: 9,
    ...Platform.select({
      ios: {
        shadowColor: '#D42F13',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  stampBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
