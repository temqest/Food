import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Establishment } from '@/data/types';
import { BrandColors, Spacing, BorderRadius } from '@/constants/theme';

interface NagaMapCanvasProps {
  establishments: Establishment[];
  selectedId?: string;
  onSelectEstablishment: (establishment: Establishment) => void;
  height?: number;
}

export const NagaMapCanvas: React.FC<NagaMapCanvasProps> = ({
  establishments,
  selectedId,
  onSelectEstablishment,
  height = 360,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      {/* Background River Simulation (Bicol / Naga River) */}
      <View style={styles.riverCurveOne} />
      <View style={styles.riverCurveTwo} />
      <View style={styles.riverLabel}>
        <Text style={styles.riverText}>~ Naga River ~</Text>
      </View>

      {/* Grid Reference & Roads */}
      <View style={styles.roadMagsaysay} />
      <Text style={styles.roadMagsaysayText}>Magsaysay Ave (Dining Strip)</Text>

      <View style={styles.roadBarlin} />
      <Text style={styles.roadBarlinText}>Barlin St (Kinalas Hub)</Text>

      <View style={styles.roadPanganiban} />
      <Text style={styles.roadPanganibanText}>Panganiban Dr</Text>

      {/* Historic Landmarks */}
      <View style={[styles.landmark, { left: '32%', top: '48%' }]}>
        <View style={styles.landmarkIconCircle}>
          <Ionicons name="flag" size={9} color={BrandColors.amber} />
        </View>
        <Text style={styles.landmarkText}>Plaza Rizal (Centro)</Text>
      </View>

      <View style={[styles.landmark, { left: '60%', top: '16%' }]}>
        <View style={styles.landmarkIconCircle}>
          <Ionicons name="business" size={9} color={BrandColors.primary} />
        </View>
        <Text style={styles.landmarkText}>Peñafrancia Basilica</Text>
      </View>

      <View style={[styles.landmark, { left: '22%', top: '68%' }]}>
        <View style={styles.landmarkIconCircle}>
          <Ionicons name="cart" size={9} color={BrandColors.green} />
        </View>
        <Text style={styles.landmarkText}>{"Naga People's Mall"}</Text>
      </View>

      {/* Establishment Map Pins */}
      {establishments.map((est) => {
        const isSelected = est.id === selectedId;
        const x = est.coordinates.mapX;
        const y = est.coordinates.mapY;

        return (
          <Pressable
            key={est.id}
            onPress={() => onSelectEstablishment(est)}
            style={[
              styles.pinWrapper,
              { left: `${x}%`, top: `${y}%` },
              isSelected && styles.pinWrapperSelected,
            ]}
          >
            {isSelected && <View style={styles.pinRadarPulse} />}
            <View
              style={[
                styles.pinBubble,
                isSelected ? styles.pinBubbleSelected : styles.pinBubbleNormal,
              ]}
            >
              <Ionicons
                name={
                  est.type === 'bakery'
                    ? 'cafe'
                    : est.type === 'kinalas-station'
                    ? 'restaurant'
                    : est.type === 'pasalubong-center'
                    ? 'nutrition'
                    : 'storefront'
                }
                size={13}
                color={isSelected ? '#FFFFFF' : BrandColors.primary}
              />
            </View>
            <View
              style={[
                styles.pinLabelBox,
                isSelected && styles.pinLabelBoxSelected,
              ]}
            >
              <Text
                style={[
                  styles.pinLabelText,
                  isSelected && styles.pinLabelTextSelected,
                ]}
                numberOfLines={1}
              >
                {est.name.replace(/^(Cha Cha’s|Aling Cely’s|Bob Marlin|Baker’s Plaza|J. Emanuel|Geewan|Naga People’s Mall|Kape Bicolano).*/, '$1')}
              </Text>
            </View>
          </Pressable>
        );
      })}

      {/* Interactive Compass / Map Badge */}
      <View style={styles.mapBadge}>
        <Ionicons name="compass-outline" size={14} color={BrandColors.textPrimary} />
        <Text style={styles.mapBadgeText}>Naga City Core Zone</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#F3ECE3',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: BrandColors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  riverCurveOne: {
    position: 'absolute',
    left: '18%',
    top: -20,
    width: 24,
    height: '120%',
    backgroundColor: '#D1E6E2',
    transform: [{ rotate: '18deg' }],
    opacity: 0.85,
  },
  riverCurveTwo: {
    position: 'absolute',
    left: '28%',
    top: '30%',
    width: 20,
    height: '90%',
    backgroundColor: '#D1E6E2',
    transform: [{ rotate: '-25deg' }],
    opacity: 0.85,
  },
  riverLabel: {
    position: 'absolute',
    left: '21%',
    top: '50%',
    transform: [{ rotate: '70deg' }],
  },
  riverText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6FA49C',
    letterSpacing: 1.5,
  },
  roadMagsaysay: {
    position: 'absolute',
    left: '52%',
    top: '20%',
    width: '44%',
    height: 7,
    backgroundColor: '#E2D7C8',
    borderRadius: 3,
    transform: [{ rotate: '12deg' }],
  },
  roadMagsaysayText: {
    position: 'absolute',
    left: '60%',
    top: '28%',
    fontSize: 9,
    fontWeight: '600',
    color: '#A09385',
    transform: [{ rotate: '12deg' }],
  },
  roadBarlin: {
    position: 'absolute',
    left: '32%',
    top: '40%',
    width: '28%',
    height: 5,
    backgroundColor: '#E2D7C8',
    borderRadius: 3,
    transform: [{ rotate: '-18deg' }],
  },
  roadBarlinText: {
    position: 'absolute',
    left: '35%',
    top: '44%',
    fontSize: 8,
    fontWeight: '600',
    color: '#A09385',
  },
  roadPanganiban: {
    position: 'absolute',
    left: '45%',
    top: '64%',
    width: '40%',
    height: 6,
    backgroundColor: '#E2D7C8',
    borderRadius: 3,
  },
  roadPanganibanText: {
    position: 'absolute',
    left: '52%',
    top: '68%',
    fontSize: 8,
    fontWeight: '600',
    color: '#A09385',
  },
  landmark: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -40 }],
  },
  landmarkIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BrandColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landmarkText: {
    fontSize: 9,
    fontWeight: '600',
    color: BrandColors.textSecondary,
    marginTop: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -22 }, { translateY: -22 }],
    zIndex: 10,
  },
  pinWrapperSelected: {
    zIndex: 30,
  },
  pinRadarPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(192, 74, 38, 0.25)',
    top: -8,
  },
  pinBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  pinBubbleNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: BrandColors.primary,
  },
  pinBubbleSelected: {
    backgroundColor: BrandColors.primary,
    borderColor: '#FFFFFF',
  },
  pinLabelBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
    borderWidth: 1,
    borderColor: BrandColors.borderSubtle,
    maxWidth: 90,
  },
  pinLabelBoxSelected: {
    backgroundColor: BrandColors.textPrimary,
    borderColor: BrandColors.textPrimary,
  },
  pinLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: BrandColors.textPrimary,
  },
  pinLabelTextSelected: {
    color: '#FFFFFF',
  },
  mapBadge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: BrandColors.borderSubtle,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: BrandColors.textPrimary,
  },
});
