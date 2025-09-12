import { Router } from 'express';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';

export const storiesRouter = Router();

// Get all stories for authenticated user
storiesRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get single story
storiesRouter.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Story not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Create or update story
storiesRouter.post('/', authenticateToken, async (req, res) => {
  try {
    const { id, title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const storyData = {
      title,
      content,
      user_id: req.user!.id,
      updated_at: new Date().toISOString()
    };

    let result;
    if (id) {
      // Update existing
      result = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', id)
        .eq('user_id', req.user!.id)
        .select()
        .single();
    } else {
      // Create new
      result = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single();
    }

    if (result.error) throw result.error;
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save story' });
  }
});

// Delete story
storiesRouter.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id);

    if (error) throw error;
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

// Share story
storiesRouter.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const shareId = Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await supabase
      .from('stories')
      .update({ 
        is_public: true, 
        share_id: shareId 
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    
    const shareUrl = `${process.env.FRONTEND_URL}/share/${shareId}`;
    res.json({ ...data, shareUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share story' });
  }
});

// Get shared story (no auth required)
storiesRouter.get('/shared/:shareId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('title, content, created_at')
      .eq('share_id', req.params.shareId)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Shared story not found' });
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared story' });
  }
});