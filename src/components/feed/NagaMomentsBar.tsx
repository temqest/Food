import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { useAuth } from '@/context/AuthContext';
import { IOSTokens } from '@/constants/theme';
import { getDiceBearAvatar } from '@/utils/dicebearAvatar';
import { UserAvatar } from '@/components/common/UserAvatar';

interface NagaMomentsBarProps {
  onOpenCreateModal: () => void;
}

export const NagaMomentsBar: React.FC<NagaMomentsBarProps> = ({ onOpenCreateModal }) => {
  const { stories, openStory } = useSocialFeed();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>NAGA MOMENTS</Text>
        <Text style={styles.sectionSubtitle}>Real-time bites & updates</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Your Story Action Bubble */}
        <Pressable
          onPress={onOpenCreateModal}
          style={({ pressed }) => [styles.storyItem, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Add to Naga Moments"
        >
          <View style={styles.myAvatarContainer}>
            <UserAvatar
              uri={user?.avatar || getDiceBearAvatar(user?.name || 'Your Story')}
              style={styles.avatarImage}
            />
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={12} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.authorName} numberOfLines={1}>
            Your Story
          </Text>
        </Pressable>

        {/* Stories from Foodies & Local Eateries */}
        {stories.map((story) => {
          return (
            <Pressable
              key={story.id}
              onPress={() => openStory(story)}
              style={({ pressed }) => [styles.storyItem, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`View story from ${story.author.name}`}
            >
              <View
                style={[
                  styles.avatarRing,
                  story.isUnread ? styles.avatarRingUnread : styles.avatarRingRead,
                ]}
              >
                <UserAvatar uri={story.author.avatar} style={styles.avatarImage} />
                {story.author.isBusiness && (
                  <View style={styles.businessIconBadge}>
                    <Ionicons name="restaurant" size={8} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={styles.authorName} numberOfLines={1}>
                {story.author.name.split(' ')[0]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(60, 60, 67, 0.6)',
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: IOSTokens.colors.tint,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 14,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 68,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  myAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarRingUnread: {
    borderWidth: 2.5,
    borderColor: IOSTokens.colors.tint,
  },
  avatarRingRead: {
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  addIconCircle: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: IOSTokens.colors.tint,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  businessIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1E3A2B',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  authorName: {
    fontSize: 11,
    color: '#1C1C1E',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
});
