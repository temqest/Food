import React, { createContext, useContext, useState, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import { supabase } from '@/lib/supabase';
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
  deletePost: (postId: string) => void;
  createPost: (newPostData: {
    authorType: 'user' | 'business';
    caption: string;
    image: string | ImageSourcePropType;
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
    postType?: 'trip' | 'food_review' | 'business_announcement' | 'dish_spotlight';
    authorAvatar?: string;
    authorHandle?: string;
  }) => void;
  activeStory: NagaMomentStory | null;
  openStory: (story: NagaMomentStory) => void;
  closeStory: () => void;
  voteOnPoll: (postId: string, optionId: string) => void;
  claimVoucher: (postId: string) => void;
  refreshPosts: () => Promise<void>;
}

const SocialFeedContext = createContext<SocialFeedContextType | undefined>(undefined);

export const SocialFeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<NagaMomentStory[]>(INITIAL_STORIES);
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>('all');
  const [activeStory, setActiveStory] = useState<NagaMomentStory | null>(null);

  // Fetch posts from Supabase on mount
  const refreshPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        if (data.length > 0) {
          const mappedPosts: SocialPost[] = data.map((row) => ({
            id: row.id,
            author: {
              id: row.author_id,
              name: row.author_name,
              handle: row.author_handle || `@${row.author_name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              avatar: row.author_avatar || getDiceBearAvatar(row.author_name),
              isBusiness: false,
              isVerified: false,
              badge: 'Foodie Explorer',
            },
            postType: 'food_review',
            timestamp: row.created_at ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            establishmentId: row.eatery_id,
            establishmentName: row.eatery_name,
            district: row.location_name || 'Centro, Naga City',
            foodName: row.dish_tags?.[0],
            foodPrice: '₱90',
            image: row.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            caption: row.content,
            spiceLevel: 'moderate',
            rating: 5,
            likesCount: row.likes_count || 0,
            isLiked: false,
            isBookmarked: false,
            commentsCount: row.comments_count || 0,
            comments: [],
            tags: row.dish_tags || ['#NagaFood'],
          }));

          // Show database posts prioritized first, merged with initial community posts
          setPosts([...mappedPosts, ...INITIAL_POSTS.filter((ip) => !mappedPosts.some((mp) => mp.id === ip.id))]);
        }
      }
    } catch (err) {
      console.warn('Could not load remote posts:', err);
    }
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  const toggleLikePost = async (postId: string) => {
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

    if (user?.id) {
      try {
        const post = posts.find((p) => p.id === postId);
        if (post?.isLiked) {
          await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id });
        } else {
          await supabase.from('post_likes').upsert({ post_id: postId, user_id: user.id });
        }
      } catch (err) {
        console.warn('Like sync error:', err);
      }
    }
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

  const addComment = async (postId: string, text: string) => {
    if (!text.trim()) return;

    const newComment: SocialComment = {
      id: `comm_${Date.now()}`,
      authorName: user?.name || 'Local Foodie',
      authorAvatar: user?.avatar || getDiceBearAvatar(user?.name || 'Local Foodie'),
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

    if (user?.id) {
      try {
        await supabase.from('post_comments').insert({
          post_id: postId,
          author_id: user.id,
          author_name: user.name || 'Local Foodie',
          author_avatar: user.avatar || '',
          text: text.trim(),
        });
      } catch (err) {
        console.warn('Comment sync error:', err);
      }
    }
  };

  const deletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    if (user?.id) {
      try {
        await supabase.from('posts').delete().eq('id', postId);
      } catch (err) {
        console.warn('Post delete sync error:', err);
      }
    }
  };

  const createPost = async (newPostData: {
    authorType: 'user' | 'business';
    caption: string;
    image: string | ImageSourcePropType;
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
    postType?: 'trip' | 'food_review' | 'business_announcement' | 'dish_spotlight';
    authorAvatar?: string;
    authorHandle?: string;
  }) => {
    const isBiz = newPostData.authorType === 'business';
    const postImageUri = typeof newPostData.image === 'string'
      ? newPostData.image
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      author: {
        id: isBiz ? (newPostData.establishmentId || 'biz_custom') : (user?.id || 'usr_current'),
        name: isBiz ? (newPostData.establishmentName || 'Local Carinderia') : (user?.name || 'Local Foodie'),
        handle: isBiz
          ? (newPostData.authorHandle || `@${(newPostData.establishmentName || 'eatery').toLowerCase().replace(/[^a-z0-9]/g, '')}`)
          : `@${(user?.name || 'foodie').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        avatar: isBiz
          ? (newPostData.authorAvatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80')
          : (user?.avatar || getDiceBearAvatar(user?.name || 'Local Foodie')),
        isBusiness: isBiz,
        isVerified: isBiz,
        badge: isBiz ? 'Verified Local Eatery' : (user?.badge || 'Foodie Lv. 4'),
      },
      postType: newPostData.postType || (isBiz ? 'business_announcement' : 'food_review'),
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

    // Persist to Supabase if logged in
    if (user?.id) {
      try {
        await supabase.from('posts').insert({
          author_id: user.id,
          author_name: user.name,
          author_handle: `@${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          author_avatar: user.avatar,
          location_name: newPostData.district || 'Centro, Naga City',
          content: newPostData.caption,
          image_url: postImageUri,
          category: 'Street Food Crawl',
          dish_tags: newPostData.tags || [],
          eatery_id: newPostData.establishmentId || null,
          eatery_name: newPostData.establishmentName || null,
          likes_count: 1,
          comments_count: 0,
        });
      } catch (err) {
        console.warn('Post creation sync error:', err);
      }
    }
  };

  const openStory = (story: NagaMomentStory) => {
    setActiveStory(story);
    setStories((prev) =>
      prev.map((s) => (s.id === story.id ? { ...s, isUnread: false } : s))
    );
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  const voteOnPoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.advertisement?.poll) {
          const poll = post.advertisement.poll;
          if (poll.userVotedOptionId === optionId) return post;

          const prevVotedId = poll.userVotedOptionId;
          const updatedOptions = poll.options.map((opt) => {
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            if (opt.id === prevVotedId) return { ...opt, votes: Math.max(0, opt.votes - 1) };
            return opt;
          });

          const newTotalVotes = prevVotedId ? poll.totalVotes : poll.totalVotes + 1;

          return {
            ...post,
            advertisement: {
              ...post.advertisement,
              poll: {
                ...poll,
                totalVotes: newTotalVotes,
                userVotedOptionId: optionId,
                options: updatedOptions,
              },
            },
          };
        }
        return post;
      })
    );
  };

  const claimVoucher = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.advertisement?.callToAction) {
          return {
            ...post,
            advertisement: {
              ...post.advertisement,
              callToAction: {
                ...post.advertisement.callToAction,
                isClaimed: true,
              },
            },
          };
        }
        return post;
      })
    );
  };

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trips') return post.postType === 'trip';
    if (activeFilter === 'businesses') return post.author.isBusiness;
    if (activeFilter === 'trending') return post.likesCount > 10;
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
        deletePost,
        createPost,
        activeStory,
        openStory,
        closeStory,
        voteOnPoll,
        claimVoucher,
        refreshPosts,
      }}
    >
      {children}
    </SocialFeedContext.Provider>
  );
};

export const useSocialFeed = (): SocialFeedContextType => {
  const context = useContext(SocialFeedContext);
  if (!context) {
    throw new Error('useSocialFeed must be used within a SocialFeedProvider');
  }
  return context;
};
