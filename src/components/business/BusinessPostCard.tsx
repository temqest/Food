import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SocialPost } from '@/data/socialFeedData';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { resolveFoodImage } from '@/utils/imageHelper';

interface BusinessPostCardProps {
  post: SocialPost;
  onOpenComments: (post: SocialPost) => void;
  onDeletePost?: (postId: string) => void;
}

export const BusinessPostCard: React.FC<BusinessPostCardProps> = ({
  post,
  onOpenComments,
  onDeletePost,
}) => {
  const { toggleLikePost } = useSocialFeed();

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
    if (post.image && typeof post.image === 'string') {
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to remove this post from your store page and the community feed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeletePost?.(post.id),
        },
      ]
    );
  };

  const getBadgeLabel = () => {
    switch (post.postType) {
      case 'dish_spotlight':
        return '⭐ Spotlight';
      case 'business_announcement':
        return '📢 Broadcast';
      default:
        return '🍲 Fresh Batch';
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Card Header */}
      <View style={styles.headerRow}>
        <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.author.name}
            </Text>
            <Ionicons name="checkmark-circle" size={14} color="#34C759" style={styles.verifiedIcon} />
          </View>
          <View style={styles.authorSubRow}>
            <Text style={styles.postTime}>{post.timestamp}</Text>
            <Text style={styles.bulletDot}>·</Text>
            <View style={styles.postTypePill}>
              <Text style={styles.postTypePillText}>{getBadgeLabel()}</Text>
            </View>
          </View>
        </View>

        {/* Delete / Manage Action */}
        {onDeletePost && (
          <Pressable
            onPress={handleDeletePress}
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Delete this store post"
          >
            <Ionicons name="trash-outline" size={17} color="#8E8E93" />
          </Pressable>
        )}
      </View>

      {/* Main Image with Optional Tagged Dish Glass Pill */}
      <View style={[styles.imageContainer, { aspectRatio }]}>
        <Image source={resolveFoodImage(post.image)} style={styles.postImage} resizeMode="cover" />

        {/* Tagged Dish Floating Badge */}
        {post.foodName && (
          <View style={styles.floatingDishBadge}>
            <Ionicons name="restaurant" size={12} color="#FFFFFF" />
            <Text style={styles.floatingDishName} numberOfLines={1}>
              {post.foodName}
            </Text>
            {post.foodPrice && (
              <Text style={styles.floatingDishPrice}>{post.foodPrice}</Text>
            )}
          </View>
        )}

        {/* Live on Naga Feed Indicator */}
        <View style={styles.liveFeedPill}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.liveFeedText}>Live on Feed</Text>
        </View>
      </View>

      {/* Post Body: Caption & Tags */}
      <View style={styles.bodyContainer}>
        <Text
          style={styles.captionText}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {post.caption}
        </Text>

        {post.caption.length > 120 && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)} hitSlop={6}>
            <Text style={styles.expandText}>{isExpanded ? 'Show less' : 'Read more'}</Text>
          </Pressable>
        )}

        {/* Insider Tip Box if present */}
        {post.insiderTip && (
          <View style={styles.insiderTipBox}>
            <Ionicons name="bulb-outline" size={15} color="#D42F13" style={styles.tipIcon} />
            <Text style={styles.insiderTipText}>
              <Text style={styles.insiderTipLabel}>Kitchen Tip: </Text>
              {post.insiderTip}
            </Text>
          </View>
        )}

        {/* Hashtags Strip */}
        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {post.tags.map((tag, idx) => (
              <Text key={`${tag}-${idx}`} style={styles.tagText}>
                {tag}{' '}
              </Text>
            ))}
          </View>
        )}

        {/* Social Engagement Row */}
        <View style={styles.engagementRow}>
          <Pressable
            onPress={handleLikePress}
            style={({ pressed }) => [styles.engageActionBtn, pressed && styles.engagePressed]}
            hitSlop={6}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={21}
                color={post.isLiked ? '#D42F13' : '#1C1C1E'}
              />
            </Animated.View>
            <Text style={[styles.engageCount, post.isLiked && styles.likedCount]}>
              {post.likesCount}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onOpenComments(post)}
            style={({ pressed }) => [styles.engageActionBtn, pressed && styles.engagePressed]}
            hitSlop={6}
          >
            <Ionicons name="chatbubble-outline" size={19} color="#1C1C1E" />
            <Text style={styles.engageCount}>{post.commentsCount}</Text>
          </Pressable>

          <View style={styles.engagementSpacer} />

          {/* View Comments Trigger Pill */}
          <Pressable
            onPress={() => onOpenComments(post)}
            style={({ pressed }) => [styles.viewCommentsPill, pressed && styles.pressed]}
          >
            <Text style={styles.viewCommentsPillText}>
              {post.commentsCount === 0
                ? 'No comments'
                : post.commentsCount === 1
                ? '1 comment'
                : `View all ${post.commentsCount} comments`}
            </Text>
            <Ionicons name="chevron-forward" size={13} color="#D42F13" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      } as any,
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  authorInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  authorSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  bulletDot: {
    fontSize: 11,
    color: '#C7C7CC',
    marginHorizontal: 5,
  },
  postTypePill: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  postTypePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    backgroundColor: '#FEECEC',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    position: 'relative',
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  floatingDishBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    maxWidth: '75%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  floatingDishName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },
  floatingDishPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFB3A7',
    backgroundColor: 'rgba(212, 47, 19, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  liveFeedPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
  },
  liveFeedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bodyContainer: {
    padding: 14,
  },
  captionText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  expandText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    marginTop: 4,
  },
  insiderTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8F6',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE3DC',
    marginTop: 10,
  },
  tipIcon: {
    marginTop: 1.5,
    marginRight: 6,
  },
  insiderTipText: {
    fontSize: 12,
    color: '#3A3A3C',
    lineHeight: 17,
    flex: 1,
  },
  insiderTipLabel: {
    fontWeight: '700',
    color: '#D42F13',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#D42F13',
    fontWeight: '600',
    marginRight: 4,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EFEFF4',
  },
  engageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 5,
  },
  engageCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  likedCount: {
    color: '#D42F13',
    fontWeight: '700',
  },
  engagePressed: {
    opacity: 0.65,
  },
  engagementSpacer: {
    flex: 1,
  },
  viewCommentsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2EE',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    gap: 3,
  },
  viewCommentsPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D42F13',
  },
  pressed: {
    opacity: 0.7,
  },
});
