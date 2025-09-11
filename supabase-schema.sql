-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  is_public BOOLEAN DEFAULT FALSE,
  share_id VARCHAR(100) UNIQUE
);

-- Create index for faster queries
CREATE INDEX idx_stories_updated_at ON stories(updated_at DESC);
CREATE INDEX idx_stories_share_id ON stories(share_id) WHERE share_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can customize this based on auth)
CREATE POLICY "Allow all operations on stories" ON stories
  FOR ALL USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE
  ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();