-- ==========================================================
-- Wingman HQ: Supabase Cloud Database Schema
-- ==========================================================
-- To enable live real-time sync for everyone:
-- 1. Create a free project at https://supabase.com
-- 2. Go to the SQL Editor and paste this entire script
-- 3. Click "Run"
-- 4. Copy your Project URL & Anon Public Key into the Wingman app
-- ==========================================================

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

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read, insert, and update
CREATE POLICY "Allow public read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON posts FOR UPDATE USING (true);

CREATE POLICY "Allow public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update comments" ON comments FOR UPDATE USING (true);

-- Enable Realtime for instant updates without page refresh
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
