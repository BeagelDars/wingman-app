import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Post, Comment, UserProfile, PostCategory, Guide } from '../types';
import { 
  fetchAllPosts, 
  createNewPost, 
  fetchPostComments, 
  createNewComment, 
  saveLocalPosts, 
  saveCloudConfig,
  getSupabaseClient,
  updatePostVoteInDb,
  updateCommentVoteInDb
} from '../lib/supabase';

interface AppContextType {
  // Navigation & View
  activeTab: 'forum' | 'guides' | 'tools' | 'saved';
  setActiveTab: (tab: 'forum' | 'guides' | 'tools' | 'saved') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortMode: 'hot' | 'new' | 'top';
  setSortMode: (mode: 'hot' | 'new' | 'top') => void;

  // Posts & Comments
  posts: Post[];
  isLoading: boolean;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  selectedGuide: Guide | null;
  setSelectedGuide: (guide: Guide | null) => void;

  // Modals
  isCloudModalOpen: boolean;
  setIsCloudModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // User Profile
  user: UserProfile;
  updateUserName: (name: string) => void;
  
  // Actions
  addPost: (title: string, content: string, category: PostCategory, tags: string[]) => Promise<Post>;
  votePost: (postId: string, direction: 'up' | 'down') => void;
  toggleSavePost: (postId: string) => void;
  getCommentsForPost: (postId: string) => Promise<Comment[]>;
  addCommentToPost: (postId: string, content: string, parentId?: string | null) => Promise<Comment>;
  voteComment: (commentId: string, direction: 'up' | 'down') => void;
  
  // Cloud
  isCloudConnected: boolean;
  connectCloud: (url: string, key: string) => boolean;
  refreshPosts: () => Promise<void>;
}

const USER_KEY = 'wingman_user_profile';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'guides' | 'tools' | 'saved'>('forum');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<'hot' | 'new' | 'top'>('hot');

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // User Identity
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const defaultUser: UserProfile = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name: 'Guest_' + Math.floor(1000 + Math.random() * 9000),
      avatarSeed: 'User_' + Math.floor(Math.random() * 1000),
      upvotedPosts: [],
      downvotedPosts: [],
      savedPosts: [],
      upvotedComments: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  });

  const saveUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const updateUserName = (name: string) => {
    if (!name.trim()) return;
    const updated = { ...user, name: name.trim() };
    saveUser(updated);
  };

  // Load Posts
  const refreshPosts = async () => {
    setIsLoading(true);
    try {
      const { posts: loadedPosts, isCloud } = await fetchAllPosts();
      setPosts(loadedPosts);
      setIsCloudConnected(isCloud);
    } catch (e) {
      console.error('Error refreshing posts:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPosts();

    // Setup Supabase Realtime subscription if available
    const client = getSupabaseClient();
    if (client) {
      const channel = client
        .channel('public:posts')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'posts' },
          () => {
            refreshPosts();
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, []);

  const addPost = async (title: string, content: string, category: PostCategory, tags: string[]): Promise<Post> => {
    const newPost = await createNewPost({
      title,
      content,
      category,
      tags,
      author: user.name,
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatarSeed}`,
    });

    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const votePost = (postId: string, direction: 'up' | 'down') => {
    const hasUpvoted = user.upvotedPosts.includes(postId);
    const hasDownvoted = user.downvotedPosts.includes(postId);

    let delta = 0;
    let newUpvoted = [...user.upvotedPosts];
    let newDownvoted = [...user.downvotedPosts];

    if (direction === 'up') {
      if (hasUpvoted) {
        delta = -1;
        newUpvoted = newUpvoted.filter((id) => id !== postId);
      } else {
        delta = hasDownvoted ? 2 : 1;
        newUpvoted.push(postId);
        newDownvoted = newDownvoted.filter((id) => id !== postId);
      }
    } else {
      if (hasDownvoted) {
        delta = 1;
        newDownvoted = newDownvoted.filter((id) => id !== postId);
      } else {
        delta = hasUpvoted ? -2 : -1;
        newDownvoted.push(postId);
        newUpvoted = newUpvoted.filter((id) => id !== postId);
      }
    }

    // Update post in state
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const newVotes = p.votes + delta;
          updatePostVoteInDb(postId, newVotes);
          return { ...p, votes: newVotes };
        }
        return p;
      });
      saveLocalPosts(updated);
      return updated;
    });

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, votes: prev.votes + delta } : null));
    }

    saveUser({
      ...user,
      upvotedPosts: newUpvoted,
      downvotedPosts: newDownvoted,
    });
  };

  const toggleSavePost = (postId: string) => {
    const isSaved = user.savedPosts.includes(postId);
    const newSaved = isSaved
      ? user.savedPosts.filter((id) => id !== postId)
      : [...user.savedPosts, postId];

    saveUser({
      ...user,
      savedPosts: newSaved,
    });
  };

  const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
    return await fetchPostComments(postId);
  };

  const addCommentToPost = async (postId: string, content: string, parentId?: string | null): Promise<Comment> => {
    const newComment = await createNewComment({
      postId,
      content,
      author: user.name,
      authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatarSeed}`,
      parentId: parentId || null,
    });

    // Update local post comment count
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p))
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null
      );
    }

    return newComment;
  };

  const voteComment = (commentId: string, direction: 'up' | 'down') => {
    const hasUpvoted = user.upvotedComments.includes(commentId);
    let delta = 0;
    let newUpvoted = [...user.upvotedComments];

    if (direction === 'up') {
      if (hasUpvoted) {
        delta = -1;
        newUpvoted = newUpvoted.filter((id) => id !== commentId);
      } else {
        delta = 1;
        newUpvoted.push(commentId);
      }
    } else {
      if (hasUpvoted) {
        delta = -1;
        newUpvoted = newUpvoted.filter((id) => id !== commentId);
      }
    }

    if (delta !== 0) {
      updateCommentVoteInDb(commentId, delta);
    }

    saveUser({
      ...user,
      upvotedComments: newUpvoted,
    });
  };

  const connectCloud = (url: string, key: string): boolean => {
    const success = saveCloudConfig(url, key);
    if (success) {
      refreshPosts();
    }
    return success;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortMode,
        setSortMode,
        posts,
        isLoading,
        selectedPost,
        setSelectedPost,
        isCreateModalOpen,
        setIsCreateModalOpen,
        selectedGuide,
        setSelectedGuide,
        isCloudModalOpen,
        setIsCloudModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        user,
        updateUserName,
        addPost,
        votePost,
        toggleSavePost,
        getCommentsForPost,
        addCommentToPost,
        voteComment,
        isCloudConnected,
        connectCloud,
        refreshPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
