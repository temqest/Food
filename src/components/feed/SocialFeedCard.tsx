import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SocialPost } from '@/data/socialFeedData';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { IOSTokens } from '@/constants/theme';
import { UserAvatar } from '@/components/common/UserAvatar';

interface SocialFeedCardProps {
  post: SocialPost;
  onOpenComments: (post: SocialPost) => void;
}

export const SocialFeedCard: React.FC<SocialFeedCardProps> = ({ post, onOpenComments }) => {
  const { toggleLikePost, toggleBookmarkPost } = useSocialFeed();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Dynamic aspect ratio: clamp between 0.8 (4:5 portrait) and 1.91 (landscape)
  const [aspectRatio, setAspectRatio] = useState<number>(() => {
    if (post.aspectRatio) {
      return Math.min(Math.max(post.aspectRatio, 0.8), 1.91);
    }
    return 4 / 3;
  });

  useEffect(() => {
    if (post.aspectRatio) {
      setAspectRatio(Math.min(Math.max(post.aspectRatio, 0.8), 1.91));
      return;
    }
    if (post.image) {
      Image.getSize(
        post.image,
        (w, h) => {
          if (w > 0 && h > 0) {
            const ratio = w / h;
            setAspectRatio(Math.min(Math.max(ratio, 0.8), 1.91));
          }
        },
        () => {}
      );
    }
  }, [post.image, post.aspectRatio]);

  // Heart bounce animation
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const [lastTap, setLastTap] = useState(0);

  const triggerLikeAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLikePress = () => {
    triggerLikeAnimation();
    toggleLikePost(post.id);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        handleLikePress();
      } else {
        triggerLikeAnimation();
      }
    }
    setLastTap(now);
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => {
      setShowShareToast(false);
    }, 2000);
  };

  return (
    <View style={styles.cardContainer}>
      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <UserAvatar uri={post.author.avatar} style={styles.authorAvatar} />

        <View style={styles.authorInfo}>
          {/* Author Name + Verified Checkmark */}
          <View style={styles.nameRow}>
            <Text style={styles.authorName} numberOfLines={1} ellipsizeMode="tail">
              {post.author.name}
            </Text>
            {post.author.isVerified && (
              <Ionicons name="checkmark-circle" size={15} color="#34C759" style={styles.verifiedIcon} />
            )}
          </View>

          {/* Location & Time Row */}
          <View style={styles.locationMetaRow}>
            {post.establishmentName ? (
              <Pressable
                onPress={() => {
                  if (post.establishmentId) {
                    router.push(`/establishment/${post.establishmentId}` as any);
                  }
                }}
                style={styles.locationButton}
                hitSlop={6}
              >
                <Ionicons name="location-sharp" size={11} color={IOSTokens.colors.tint} style={styles.shrinkZero} />
                <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                  {post.establishmentName}
                </Text>
              </Pressable>
            ) : (
              <Text style={styles.districtText} numberOfLines={1} ellipsizeMode="tail">
                {post.district || 'Naga City'}
              </Text>
            )}
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.timestampText}>{post.timestamp}</Text>
          </View>
        </View>

        {/* Post Type Tag (Only for trips) */}
        {post.postType === 'trip' && (
          <View style={styles.tripTagBadge}>
            <Ionicons name="compass" size={11} color="#1E3A2B" />
            <Text style={styles.tripTagText}>Trip</Text>
          </View>
        )}
      </View>

      {/* 2. Media Section (Double-Tap to Like) */}
      <Pressable onPress={handleDoubleTap} style={[styles.mediaContainer, { aspectRatio }]}>
        <Image source={{ uri: post.image }} style={styles.foodImage} resizeMode="cover" />

        {/* Tappable Dish Tag Overlay (smart truncation) */}
        {post.foodName && (
          <Pressable
            onPress={() => {
              if (post.foodId) {
                router.push(`/food/${post.foodId}` as any);
              }
            }}
            style={({ pressed }) => [styles.dishTagOverlay, pressed && styles.pressed]}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`View dish details for ${post.foodName}`}
          >
            <Ionicons name="restaurant" size={12} color="#FFFFFF" />
            <Text style={styles.dishTagText} numberOfLines={1} ellipsizeMode="tail">
              {post.foodName}
            </Text>
            {post.foodPrice && (
              <View style={styles.pricePill}>
                <Text style={styles.pricePillText}>{post.foodPrice}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={12} color="rgba(255, 255, 255, 0.7)" />
          </Pressable>
        )}
      </Pressable>

      {/* 3. Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          {/* Like Button */}
          <Pressable
            onPress={handleLikePress}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={post.isLiked ? 'Unlike' : 'Like'}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={23}
                color={post.isLiked ? '#FF3B30' : '#1C1C1E'}
              />
            </Animated.View>
            <Text style={[styles.actionCount, post.isLiked && styles.actionCountLiked]}>
              {post.likesCount}
            </Text>
          </Pressable>

          {/* Comment Button */}
          <Pressable
            onPress={() => onOpenComments(post)}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Comments"
          >
            <Ionicons name="chatbubble-outline" size={21} color="#1C1C1E" />
            <Text style={styles.actionCount}>{post.commentsCount}</Text>
          </Pressable>

          {/* Share Button */}
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share post"
          >
            <Ionicons name="paper-plane-outline" size={21} color="#1C1C1E" />
          </Pressable>
        </View>

        {/* Bookmark Button */}
        <Pressable
          onPress={() => toggleBookmarkPost(post.id)}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={post.isBookmarked ? 'Unsave' : 'Save'}
        >
          <Ionicons
            name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={post.isBookmarked ? IOSTokens.colors.tint : '#1C1C1E'}
          />
        </Pressable>
      </View>

      {/* Share Toast Feedback */}
      {showShareToast && (
        <View style={styles.shareToast}>
          <Ionicons name="checkmark-circle" size={13} color="#1E3A2B" />
          <Text style={styles.shareToastText}>Food trip link copied to clipboard!</Text>
        </View>
      )}

      {/* 4. Caption & Body (with robust, anti-shift text container) */}
      <View style={styles.contentSection}>
        <Text style={styles.captionText} numberOfLines={isExpanded ? undefined : 3}>
          <Text style={styles.authorHandle}>{post.author.handle} </Text>
          {post.caption}
        </Text>

        {post.caption.length > 100 && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)} hitSlop={6} style={styles.expandButton}>
            <Text style={styles.expandText}>{isExpanded ? 'Show less' : 'Read more'}</Text>
          </Pressable>
        )}

        {/* Tags Row */}
        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {post.tags.map((tag, i) => (
              <Text key={i} style={styles.tagText}>
                {tag}
              </Text>
            ))}
          </View>
        )}

        {/* Comments Preview Trigger */}
        <Pressable
          onPress={() => onOpenComments(post)}
          style={styles.viewCommentsBtn}
          hitSlop={6}
        >
          <Text style={styles.viewCommentsText}>
            {post.commentsCount === 0
              ? 'Be the first to comment...'
              : `View all ${post.commentsCount} comments`}
          </Text>
        </Pressable>

        {/* Establishment Navigation CTA */}
        {post.establishmentId && (
          <Pressable
            onPress={() => router.push(`/establishment/${post.establishmentId}` as any)}
            style={({ pressed }) => [styles.establishmentFooterLink, pressed && styles.pressed]}
          >
            <View style={styles.estFooterLeft}>
              <Ionicons name="storefront-outline" size={14} color={IOSTokens.colors.tint} />
              <Text style={styles.estFooterName} numberOfLines={1} ellipsizeMode="tail">
                {post.establishmentName}
              </Text>
            </View>
            <View style={styles.estFooterRight}>
              <Text style={styles.estFooterAction}>Menu & Info</Text>
              <Ionicons name="chevron-forward" size={12} color="#8E8E93" />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 235, 0.9)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexShrink: 0,
  },
  authorInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 0,
    flexShrink: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
    flexShrink: 1,
  },
  verifiedIcon: {
    flexShrink: 0,
  },
  shrinkZero: {
    flexShrink: 0,
  },
  locationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    minWidth: 0,
    flexShrink: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
    minWidth: 0,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: IOSTokens.colors.tint,
    flexShrink: 1,
  },
  districtText: {
    fontSize: 11,
    color: '#8E8E93',
    flexShrink: 1,
  },
  dotSeparator: {
    fontSize: 10,
    color: '#C7C7CC',
    flexShrink: 0,
  },
  timestampText: {
    fontSize: 11,
    color: '#8E8E93',
    flexShrink: 0,
  },
  tripTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    flexShrink: 0,
  },
  tripTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A2B',
  },
  mediaContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  dishTagOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(28, 28, 30, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxWidth: '88%',
    alignSelf: 'flex-start',
  },
  dishTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  pricePill: {
    backgroundColor: IOSTokens.colors.tint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    flexShrink: 0,
  },
  pricePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  actionCountLiked: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  shareToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    marginHorizontal: 14,
    marginVertical: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shareToastText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E3A2B',
  },
  contentSection: {
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 14,
  },
  captionText: {
    fontSize: 13,
    color: '#1C1C1E',
    lineHeight: 19,
    ...Platform.select({
      web: {
        wordBreak: 'break-word',
      } as any,
    }),
  },
  authorHandle: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  expandButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  expandText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  viewCommentsBtn: {
    marginTop: 8,
  },
  viewCommentsText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  establishmentFooterLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  estFooterLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  estFooterName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  estFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
    marginLeft: 8,
  },
  estFooterAction: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  pressed: {
    opacity: 0.8,
  },
});
