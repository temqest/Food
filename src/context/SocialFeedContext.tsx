import React, { createContext, useContext, useState } from 'react';
import {
  SocialPost,
  NagaMomentStory,
  INITIAL_POSTS,
  INITIAL_STORIES,
  SocialComment,
} from '@/data/socialFeedData';
import { useAuth } from './AuthContext';
import { getDiceBearAvatar } from '@/utils/dicebearAvatar';

export type FeedFilterType = 'all' | 'trips' | 'businesses' | 'trending';

interface SocialFeedContextType {
  posts: SocialPost[];
  stories: NagaMomentStory[];
  activeFilter: FeedFilterType;
  setActiveFilter: (filter: FeedFilterType) => void;
  filteredPosts: SocialPost[];
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createPost: (newPostData: {
    authorType: 'user' | 'business';
    caption: string;
    image: string;
    establishmentId?: string;
    establishmentName?: string;
    foodId?: string;
    foodName?: string;
    foodPrice?: string;
    district?: string;
    insiderTip?: string;
    spiceLevel?: 'mild' | 'moderate' | 'fiery';
    rating?: number;
    tags?: string[];
    aspectRatio?: number;
  }) => void;
  activeStory: NagaMomentStory | null;
  openStory: (story: NagaMomentStory) => void;
  closeStory: () => void;
}

const SocialFeedContext = createContext<SocialFeedContextType | undefined>(undefined);

export const SocialFeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<NagaMomentStory[]>(INITIAL_STORIES);
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>('all');
  const [activeStory, setActiveStory] = useState<NagaMomentStory | null>(null);

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentlyLiked = post.isLiked;
          return {
            ...post,
            isLiked: !currentlyLiked,
            likesCount: currentlyLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
          };
        }
        return post;
      })
    );
  };

  const toggleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked,
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: SocialComment = {
      id: `comm_${Date.now()}`,
      authorName: user?.name || 'Local Foodie',
      authorAvatar:
        user?.avatar || getDiceBearAvatar(user?.name || 'Local Foodie'),
      content: text.trim(),
      timestamp: 'Just now',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [newComment, ...post.comments],
          };
        }
        return post;
      })
    );
  };

  const createPost = (newPostData: {
    authorType: 'user' | 'business';
    caption: string;
    image: string;
    establishmentId?: string;
    establishmentName?: string;
    foodId?: string;
    foodName?: string;
    foodPrice?: string;
    district?: string;
    insiderTip?: string;
    spiceLevel?: 'mild' | 'moderate' | 'fiery';
    rating?: number;
    tags?: string[];
    aspectRatio?: number;
  }) => {
    const isBiz = newPostData.authorType === 'business';

    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      author: {
        id: isBiz ? 'biz_custom' : (user?.id || 'usr_current'),
        name: isBiz ? (newPostData.establishmentName || 'Local Carinderia') : (user?.name || 'Maria Santos'),
        handle: isBiz
          ? `@${(newPostData.establishmentName || 'eatery').toLowerCase().replace(/\s+/g, '')}`
          : '@mariasantos',
        avatar: isBiz
          ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'
          : (user?.avatar || getDiceBearAvatar(user?.name || 'Maria Santos')),
        isBusiness: isBiz,
        isVerified: isBiz,
        badge: isBiz ? 'Verified Local Eatery' : (user?.badge || 'Foodie Lv. 4'),
      },
      postType: isBiz ? 'business_announcement' : 'food_review',
      timestamp: 'Just now',
      establishmentId: newPostData.establishmentId,
      establishmentName: newPostData.establishmentName,
      district: newPostData.district || 'Centro, Naga City',
      foodId: newPostData.foodId,
      foodName: newPostData.foodName,
      foodPrice: newPostData.foodPrice || '₱80',
      image: newPostData.image,
      aspectRatio: newPostData.aspectRatio,
      caption: newPostData.caption,
      insiderTip: newPostData.insiderTip,
      spiceLevel: newPostData.spiceLevel || 'moderate',
      rating: newPostData.rating || 5,
      likesCount: 1,
      isLiked: true,
      isBookmarked: false,
      commentsCount: 0,
      comments: [],
      tags: newPostData.tags && newPostData.tags.length > 0 ? newPostData.tags : ['#NagaFood', '#TasteOfBicol'],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const openStory = (story: NagaMomentStory) => {
    setActiveStory(story);
    // Mark as read
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, isUnread: false } : s))
    );
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trips') return post.postType === 'trip';
    if (activeFilter === 'businesses') return post.author.isBusiness;
    if (activeFilter === 'trending') return post.likesCount > 100;
    return true;
  });

  return (
    <SocialFeedContext.Provider
      value={{
        posts,
        stories,
        activeFilter,
        setActiveFilter,
        filteredPosts,
        toggleLikePost,
        toggleBookmarkPost,
        addComment,
        createPost,
        activeStory,
        openStory,
        closeStory,
      }}
    >
      {children}
    </SocialFeedContext.Provider>
  );
};

export const useSocialFeed = () => {
  const context = useContext(SocialFeedContext);
  if (!context) {
    throw new Error('useSocialFeed must be used within a SocialFeedProvider');
  }
  return context;
};
