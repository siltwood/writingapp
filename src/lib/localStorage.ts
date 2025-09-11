export interface Story {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  is_public?: boolean;
  share_id?: string;
}

const STORAGE_KEY = 'typewriter_stories';
const SHARED_STORAGE_KEY = 'typewriter_shared_stories';

export const storyService = {
  async saveStory(story: Story): Promise<Story> {
    const stories = this.getStoriesSync();
    const id = story.id || Date.now().toString();
    const updatedStory: Story = {
      ...story,
      id,
      updated_at: new Date().toISOString(),
      created_at: story.created_at || new Date().toISOString()
    };
    
    const existingIndex = stories.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
      stories[existingIndex] = updatedStory;
    } else {
      stories.push(updatedStory);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    return updatedStory;
  },

  async getStories(): Promise<Story[]> {
    return this.getStoriesSync();
  },

  getStoriesSync(): Story[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async getStory(id: string): Promise<Story | undefined> {
    const stories = this.getStoriesSync();
    return stories.find(s => s.id === id);
  },

  async getSharedStory(shareId: string): Promise<Story | undefined> {
    const sharedStories = localStorage.getItem(SHARED_STORAGE_KEY);
    const shared = sharedStories ? JSON.parse(sharedStories) : {};
    return shared[shareId];
  },

  async deleteStory(id: string): Promise<void> {
    const stories = this.getStoriesSync();
    const filtered = stories.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  async shareStory(id: string): Promise<Story> {
    const story = await this.getStory(id);
    if (!story) throw new Error('Story not found');
    
    const shareId = Math.random().toString(36).substring(2, 15);
    const sharedStory = { ...story, is_public: true, share_id: shareId };
    
    // Save to shared stories
    const sharedStories = localStorage.getItem(SHARED_STORAGE_KEY);
    const shared = sharedStories ? JSON.parse(sharedStories) : {};
    shared[shareId] = sharedStory;
    localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(shared));
    
    // Update original story
    await this.saveStory(sharedStory);
    
    return sharedStory;
  }
};