import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if credentials are provided
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here';

// Create client only if we have valid credentials
export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export interface Story {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  share_id?: string;
}

export const storyService = {
  async saveStory(story: Story) {
    if (!supabase) {
      console.warn('Supabase not configured - using localStorage');
      return story;
    }
    const { data, error } = await supabase
      .from('stories')
      .upsert(story)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStories() {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getStory(id: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSharedStory(shareId: string) {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('share_id', shareId)
      .eq('is_public', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteStory(id: string) {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async shareStory(id: string) {
    const shareId = Math.random().toString(36).substring(2, 15);
    const { data, error } = await supabase
      .from('stories')
      .update({ is_public: true, share_id: shareId })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};