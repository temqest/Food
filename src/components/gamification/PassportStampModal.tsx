import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuest } from '@/context/QuestContext';

interface PassportStampModalProps {
  visible: boolean;
  onClose: () => void;
  foodId: string;
  foodName: string;
  establishmentId: string;
  establishmentName: string;
  image?: string;
}

export const PassportStampModal: React.FC<PassportStampModalProps> = ({
  visible,
  onClose,
  foodId,
  foodName,
  establishmentId,
  establishmentName,
  image,
}) => {
  const { logTasting } = useQuest();
  const [rating, setRating] = useState<number>(5);
  const [spiceRating, setSpiceRating] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = () => {
    const result = logTasting({
      foodId,
      foodName,
      establishmentId,
      establishmentName,
      rating,
      spiceRating,
      notes: notes.trim() || 'Delicious authentic taste!',
      image,
    });

    onClose();

    if (result.newBadgeAwarded) {
      Alert.alert(
        '🎉 Badge Unlocked!',
        `You earned the "${result.newBadgeAwarded.name}" badge and +${result.newBadgeAwarded.xpReward} XP! Check your Passport.`
      );
    } else {
      Alert.alert('Stamp Added!', 'Dish logged in your Naga Food Passport (+60 XP)!');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.stampIcon}>
              <Ionicons name="ribbon" size={20} color="#D42F13" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.sheetTitle}>Stamp Your Passport</Text>
              <Text style={styles.sheetSubtitle}>
                Log tasting at {establishmentName}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </Pressable>
          </View>

          {/* Dish info */}
          <View style={styles.dishPill}>
            <Text style={styles.dishPillName}>{foodName}</Text>
          </View>

          {/* Overall Rating */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Flavor Rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starPressable}
                  hitSlop={6}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={28}
                    color="#FF9500"
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Spice / Heat Rating */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Bicolano Heat Level</Text>
            <View style={styles.chiliRow}>
              {[1, 2, 3, 4, 5].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setSpiceRating(level)}
                  style={styles.chiliPressable}
                  hitSlop={6}
                >
                  <Ionicons
                    name="flame"
                    size={26}
                    color={level <= spiceRating ? '#D42F13' : '#E5E5EA'}
                  />
                </Pressable>
              ))}
              <Text style={styles.chiliLabel}>
                {spiceRating === 1
                  ? 'Mild'
                  : spiceRating === 2
                  ? 'Gentle kick'
                  : spiceRating === 3
                  ? 'Authentic Bicol heat'
                  : spiceRating === 4
                  ? 'Fiery Labuyo'
                  : 'Nuclear (Titano)'}
              </Text>
            </View>
          </View>

          {/* Tasting Notes */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>Explorer Field Notes (Optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Rich brain gravy, paired with sili paste & calamansi..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={3}
              style={styles.textInput}
            />
          </View>

          {/* Submit Action */}
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Stamp passport"
          >
            <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.submitBtnText}>Stamp Passport & Claim +60 XP</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 -3px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stampIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: 'rgba(60, 60, 67, 0.60)',
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  dishPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  dishPillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  fieldSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(60, 60, 67, 0.80)',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starPressable: {
    padding: 2,
  },
  chiliRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chiliPressable: {
    padding: 2,
  },
  chiliLabel: {
    fontSize: 12,
    color: '#D42F13',
    fontWeight: '600',
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: '#000000',
    minHeight: 64,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#D42F13',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 6,
  },
  submitBtnPressed: {
    opacity: 0.88,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
