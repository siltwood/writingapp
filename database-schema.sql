-- Typewriter Studio Database Schema
-- This is the complete database schema for Supabase
-- Run this file to set up a new database instance

-- ============================================
-- TABLES
-- ============================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- For email/password auth
  name VARCHAR(255),
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  provider VARCHAR(50) DEFAULT 'email',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stories table with user association
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  is_public BOOLEAN DEFAULT FALSE,
  share_id VARCHAR(100) UNIQUE
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Stories indexes
CREATE INDEX IF NOT EXISTS idx_stories_updated_at ON stories(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_share_id ON stories(share_id) WHERE share_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Auth indexes
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on stories" ON stories;
DROP POLICY IF EXISTS "Users can manage their own stories" ON stories;
DROP POLICY IF EXISTS "Public stories are viewable by all" ON stories;
DROP POLICY IF EXISTS "Users can view their own data" ON users;

-- ============================================
-- POLICIES
-- ============================================

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR true); -- Remove 'OR true' in production

-- Stories policies  
CREATE POLICY "Users can manage their own stories" ON stories
  FOR ALL USING (auth.uid()::text = user_id::text OR true); -- Remove 'OR true' in production

CREATE POLICY "Public stories are viewable by all" ON stories
  FOR SELECT USING (is_public = true);

-- Development only - remove in production
CREATE POLICY "Allow all operations on stories" ON stories
  FOR ALL USING (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for stories table
DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at 
  BEFORE UPDATE ON stories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION HELPERS
-- ============================================

-- If you already have a stories table without user_id, run this:
-- ALTER TABLE stories ADD COLUMN IF NOT EXISTS user_id UUID;

-- ============================================
-- PRODUCTION CHECKLIST
-- ============================================

-- Before going to production:
-- 1. Remove the "OR true" from policies
-- 2. Remove "Allow all operations on stories" policy
-- 3. Update RLS policies to use proper auth checks
-- 4. Test all operations with real authentication