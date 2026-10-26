import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { NagaMomentStory } from '@/data/socialFeedData';
import { router } from 'expo-router';
import { UserAvatar } from '@/components/common/UserAvatar';

const { width, height } = Dimensions.get('window');

interface StoryContentProps {
  story: NagaMomentStory;
  onClose: () => void;
}

const StoryContent: React.FC<StoryContentProps> = ({ story, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          onClose();
          return 1;
        }
        return prev + 0.05;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <View style={styles.container}>
      {/* Progress Bar Header */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Top Author Navigation Bar */}
      <View style={styles.topBar}>
        <View style={styles.authorRow}>
          <UserAvatar uri={story.author.avatar} style={styles.avatar} />
          <View>
            <View style={styles.nameWithBadge}>
              <Text style={styles.authorName}>{story.author.name}</Text>
              {story.author.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color="#34C759" />
              )}
            </View>
            <Text style={styles.timeAgo}>{story.timeAgo}</Text>
          </View>
        </View>

        <Pressable
          onPress={onClose}
          style={styles.closeBtn}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close story"
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Story Photo */}
      <Image source={{ uri: story.image }} style={styles.storyImage} resizeMode="cover" />

      {/* Bottom Caption Overlay */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.captionText}>{story.caption}</Text>

        {story.establishmentId && (
          <Pressable
            onPress={() => {
              onClose();
              router.push(`/establishment/${story.establishmentId}` as any);
            }}
            style={styles.establishmentLink}
          >
            <Ionicons name="location-sharp" size={14} color="#FFC857" />
            <Text style={styles.establishmentLinkText}>View Establishment</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Quick Reaction Bar */}
        <View style={styles.reactionsRow}>
          {['🔥', '🤤', '❤️', '🍲', '🌶️'].map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => {
                onClose();
              }}
              style={styles.reactionBtn}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export const StoryViewerModal: React.FC = () => {
  const { activeStory, closeStory } = useSocialFeed();

  if (!activeStory) return null;

  return (
    <Modal
      visible={!!activeStory}
      animationType="fade"
      transparent={false}
      onRequestClose={closeStory}
    >
      <StoryContent story={activeStory} onClose={closeStory} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'space-between',
  },
  progressContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 25,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 62 : 36,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  nameWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  timeAgo: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImage: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  captionText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 21,
    fontWeight: '500',
    marginBottom: 12,
  },
  establishmentLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 14,
  },
  establishmentLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 10,
  },
  reactionBtn: {
    padding: 6,
  },
  emojiText: {
    fontSize: 24,
  },
});
