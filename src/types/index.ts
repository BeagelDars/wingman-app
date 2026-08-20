export type PostCategory = 
  | 'advice' 
  | 'texting' 
  | 'approaching' 
  | 'first-dates' 
  | 'profile-review' 
  | 'mindset' 
  | 'success';

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  votes: number;
  parentId?: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
  votes: number;
  commentCount: number;
  isPinned?: boolean;
}

export interface Guide {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  content: string;
  keyTakeaways: string[];
  icon: string;
}

export interface DateIdea {
  id: string;
  title: string;
  vibe: 'casual' | 'active' | 'creative' | 'cozy' | 'drinks' | 'budget';
  budget: '$' | '$$' | '$$$';
  timeOfDay: 'day' | 'evening' | 'anytime';
  description: string;
  whyItWorks: string;
  proTip: string;
  conversationStarters: string[];
}

export interface OpenerIdea {
  id: string;
  context: 'hinge_prompt' | 'tinder_bio' | 'instagram_story' | 'cafe_approach' | 'party_event' | 'gym_hobby';
  tone: 'playful' | 'witty' | 'direct' | 'observational' | 'casual' | 'thoughtful';
  opener: string;
  whyItWorks: string;
  goodFollowUp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarSeed: string;
  upvotedPosts: string[];
  downvotedPosts: string[];
  savedPosts: string[];
  upvotedComments: string[];
  createdAt: string;
}

export interface CloudConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConnected: boolean;
  isCustom: boolean;
}
