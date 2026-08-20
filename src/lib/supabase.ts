import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Post, Comment, CloudConfig } from '../types';
import { SEED_POSTS, SEED_COMMENTS } from '../data/seedData';

const CLOUD_CONFIG_KEY = 'wingman_cloud_config';
const LOCAL_POSTS_KEY = 'wingman_local_posts';
const LOCAL_COMMENTS_KEY = 'wingman_local_comments';

const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_KEY = '';

function sanitizeUrl(rawUrl: string): string {
  let url = rawUrl.trim();
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/+$/, '');
  return url;
}

// Default Supabase config from env or storage or hardcoded project default
export function getSavedCloudConfig(): CloudConfig {
  const envUrl = sanitizeUrl(import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL);
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

  try {
    const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const url = sanitizeUrl(parsed.supabaseUrl || envUrl);
      const key = parsed.supabaseAnonKey || envKey;
      return {
        supabaseUrl: url,
        supabaseAnonKey: key,
        isConnected: Boolean(url && key),
        isCustom: parsed.isCustom || false,
      };
    }
  } catch (e) {
    console.error('Error reading cloud config:', e);
  }

  return {
    supabaseUrl: envUrl,
    supabaseAnonKey: envKey,
    isConnected: Boolean(envUrl && envKey),
    isCustom: false,
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSavedCloudConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    supabaseInstance = null;
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey);
    } catch (err) {
      console.error('Failed to init Supabase client:', err);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

export function saveCloudConfig(url: string, key: string): boolean {
  try {
    const cleanUrl = sanitizeUrl(url);
    const config: CloudConfig = {
      supabaseUrl: cleanUrl,
      supabaseAnonKey: key.trim(),
      isConnected: Boolean(cleanUrl && key.trim()),
      isCustom: true,
    };
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
    supabaseInstance = null; // reset client
    return true;
  } catch (e) {
    console.error('Error saving cloud config:', e);
    return false;
  }
}

// Local Storage Fallback helpers
export function getLocalPosts(): Post[] {
  try {
    const raw = localStorage.getItem(LOCAL_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(SEED_POSTS));
      return SEED_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_POSTS;
  }
}

export function saveLocalPosts(posts: Post[]) {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
}

export function getLocalComments(): Comment[] {
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(SEED_COMMENTS));
      return SEED_COMMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_COMMENTS;
  }
}

export function saveLocalComments(comments: Comment[]) {
  localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(comments));
}

// Sync API (Works with Supabase if configured, otherwise with LocalStorage)
export async function fetchAllPosts(): Promise<{ posts: Post[]; isCloud: boolean }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        if (data.length === 0) {
          // If the cloud database is brand new and empty, seed it with initial discussions
          try {
            await client.from('posts').upsert(
              SEED_POSTS.map((p) => ({
                id: p.id,
                title: p.title,
                content: p.content,
                author: p.author,
                author_avatar: p.authorAvatar,
                category: p.category,
                tags: p.tags,
                created_at: p.createdAt,
                votes: p.votes,
                comment_count: p.commentCount,
                is_pinned: p.isPinned || false,
              })),
              { onConflict: 'id', ignoreDuplicates: true }
            );
            await client.from('comments').upsert(
              SEED_COMMENTS.map((c) => ({
                id: c.id,
                post_id: c.postId,
                author: c.author,
                author_avatar: c.authorAvatar,
                content: c.content,
                created_at: c.createdAt,
                votes: c.votes,
                parent_id: c.parentId || null,
              })),
              { onConflict: 'id', ignoreDuplicates: true }
            );
            return { posts: SEED_POSTS, isCloud: true };
          } catch {
            // ignore duplicate seed gracefully
          }
        }

        const mappedPosts: Post[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          author: item.author,
          authorAvatar: item.author_avatar,
          category: item.category,
          tags: item.tags || [],
          createdAt: item.created_at,
          votes: item.votes || 0,
          commentCount: item.comment_count || 0,
          isPinned: item.is_pinned || false,
        }));
        return { posts: mappedPosts, isCloud: true };
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local:', e);
    }
  }

  return { posts: getLocalPosts(), isCloud: false };
}

export async function createNewPost(post: Omit<Post, 'id' | 'createdAt' | 'votes' | 'commentCount'>): Promise<Post> {
  const newPost: Post = {
    ...post,
    id: 'post-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    createdAt: new Date().toISOString(),
    votes: 1,
    commentCount: 0,
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('posts').insert([
        {
          id: newPost.id,
          title: newPost.title,
          content: newPost.content,
          author: newPost.author,
          author_avatar: newPost.authorAvatar,
          category: newPost.category,
          tags: newPost.tags,
          created_at: newPost.createdAt,
          votes: newPost.votes,
          comment_count: 0,
          is_pinned: false,
        },
      ]).select().single();

      if (!error && data) {
        return newPost;
      }
    } catch (e) {
      console.warn('Supabase insert failed, saving locally:', e);
    }
  }

  const posts = getLocalPosts();
  const updated = [newPost, ...posts];
  saveLocalPosts(updated);
  return newPost;
}

export async function fetchPostComments(postId: string): Promise<Comment[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map((item) => ({
          id: item.id,
          postId: item.post_id,
          author: item.author,
          authorAvatar: item.author_avatar,
          content: item.content,
          createdAt: item.created_at,
          votes: item.votes || 0,
          parentId: item.parent_id || null,
        }));
      }
    } catch (e) {
      console.warn('Supabase comments fetch failed, using local:', e);
    }
  }

  const localComments = getLocalComments();
  return localComments.filter((c) => c.postId === postId);
}

export async function createNewComment(comment: Omit<Comment, 'id' | 'createdAt' | 'votes'>): Promise<Comment> {
  const newComment: Comment = {
    ...comment,
    id: 'comment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    createdAt: new Date().toISOString(),
    votes: 1,
  };

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('comments').insert([
        {
          id: newComment.id,
          post_id: newComment.postId,
          author: newComment.author,
          author_avatar: newComment.authorAvatar,
          content: newComment.content,
          created_at: newComment.createdAt,
          votes: newComment.votes,
          parent_id: newComment.parentId || null,
        },
      ]);
    } catch (e) {
      console.warn('Supabase insert comment failed, saving locally:', e);
    }
  }

  const comments = getLocalComments();
  saveLocalComments([...comments, newComment]);

  // Update post comment count locally
  const posts = getLocalPosts();
  const postIndex = posts.findIndex((p) => p.id === comment.postId);
  if (postIndex !== -1) {
    posts[postIndex].commentCount = (posts[postIndex].commentCount || 0) + 1;
    saveLocalPosts(posts);
  }

  return newComment;
}

export async function updatePostVoteInDb(postId: string, newVotes: number) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('posts').update({ votes: newVotes }).eq('id', postId);
    } catch (e) {
      console.warn('Failed to update post vote in cloud:', e);
    }
  }
}

export async function updateCommentVoteInDb(commentId: string, newVotes: number) {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('comments').update({ votes: newVotes }).eq('id', commentId);
    } catch (e) {
      console.warn('Failed to update comment vote in cloud:', e);
    }
  }
}


export const SUPABASE_SQL_SCHEMA = `-- Wingman Cloud Database Schema for Supabase
-- Run this in your Supabase SQL Editor to enable instant real-time sync

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  votes INTEGER DEFAULT 0,
  parent_id TEXT
);

-- Enable Row Level Security (RLS) with public read and insert
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON posts FOR UPDATE USING (true);

CREATE POLICY "Allow public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON comments FOR UPDATE USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
`;
