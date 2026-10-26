import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '@/components/common/NavBar';
import { useSocialFeed } from '@/context/SocialFeedContext';
import { FeedHeader } from '@/components/feed/FeedHeader';
import { NagaMomentsBar } from '@/components/feed/NagaMomentsBar';
import { FeedFilterStrip } from '@/components/feed/FeedFilterStrip';
import { SocialFeedCard } from '@/components/feed/SocialFeedCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { CommentsBottomSheet } from '@/components/feed/CommentsBottomSheet';
import { StoryViewerModal } from '@/components/feed/StoryViewerModal';
import { SocialPost } from '@/data/socialFeedData';
import { IOSTokens } from '@/constants/theme';

export default function FeedScreen() {
  const { filteredPosts } = useSocialFeed();
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<SocialPost | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={IOSTokens.colors.tint}
          />
        }
      >
        {/* Top Header */}
        <FeedHeader onOpenCreateModal={() => setCreateModalVisible(true)} />

        {/* Stories / Moments Carousel */}
        <NagaMomentsBar onOpenCreateModal={() => setCreateModalVisible(true)} />

        {/* Category Filter Pills */}
        <FeedFilterStrip />

        {/* Social Feed List */}
        <View style={styles.feedContainer}>
          {filteredPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No posts in this category</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to share a culinary discovery or food trip!
              </Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <SocialFeedCard
                key={post.id}
                post={post}
                onOpenComments={(p) => setSelectedPostForComments(p)}
              />
            ))
          )}
        </View>

        {/* Spacer for bottom floating NavBar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <NavBar currentTab="feed" />

      {/* Create Post Composer Modal */}
      <CreatePostModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      {/* Interactive Comments Bottom Sheet */}
      <CommentsBottomSheet
        post={selectedPostForComments}
        visible={!!selectedPostForComments}
        onClose={() => setSelectedPostForComments(null)}
      />

      {/* Full-Screen Story Viewer */}
      <StoryViewerModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  feedContainer: {
    marginTop: 4,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
});
