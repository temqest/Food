import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IOSTokens } from '@/constants/theme';

interface FeedHeaderProps {
  onOpenCreateModal: () => void;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.headingSans}>
            Naga <Text style={styles.headingSerif}>community</Text>
          </Text>
          <Text style={styles.subheadText} numberOfLines={1}>
            Trips, food lore & local carinderia dispatches
          </Text>
        </View>

        {/* Red Plus Icon (No circle outside) */}
        <Pressable
          onPress={onOpenCreateModal}
          style={({ pressed }) => [styles.createIconBtn, pressed && styles.btnPressed]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Create new post"
        >
          <Ionicons name="add" size={32} color={IOSTokens.colors.tint} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F2F2F7',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleColumn: {
    flex: 1,
    minWidth: 0,
  },
  headingSans: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.4,
  },
  headingSerif: {
    fontStyle: 'italic',
    fontWeight: '400',
    color: IOSTokens.colors.tint,
  },
  subheadText: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.7)',
    marginTop: 2,
  },
  createIconBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.92 }],
  },
});
