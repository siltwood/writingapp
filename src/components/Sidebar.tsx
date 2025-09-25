import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Save, 
  FolderOpen, 
  Share2, 
  Trash2, 
  Plus,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { Story, storyService } from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import './Sidebar.css';
import '../styles/shared.css';

interface SidebarProps {
  currentStory: Story | null;
  onStoryLoad: (story: Story) => void;
  onNewStory: () => void;
  text: string;
  onTextChange: (text: string) => void;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentStory, 
  onStoryLoad, 
  onNewStory,
  text,
  onTextChange,
  isAuthenticated = false,
  onAuthRequired = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [storyTitle, setStoryTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentStory) {
      setStoryTitle(currentStory.title);
    }
  }, [currentStory]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStories();
    }
  }, [isAuthenticated]);

  const loadStories = async () => {
    try {
      const data = await storyService.getStories();
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast('Sign up to save your stories!', {
        icon: '🔐',
        duration: 3000
      });
      onAuthRequired();
      return;
    }

    if (!storyTitle.trim()) {
      toast.error('Please enter a title for your story');
      return;
    }

    setLoading(true);
    try {
      const story: Story = {
        ...(currentStory?.id && { id: currentStory.id }),
        title: storyTitle,
        content: text,
        updated_at: new Date().toISOString()
      };

      const savedStory = await storyService.saveStory(story);
      toast.success('Story saved successfully!');
      onStoryLoad(savedStory);
      loadStories();
    } catch (error) {
      toast.error('Failed to save story');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this story?')) return;

    try {
      await storyService.deleteStory(id);
      toast.success('Story deleted');
      if (currentStory?.id === id) {
        handleNewStory();
      }
      loadStories();
    } catch (error) {
      toast.error('Failed to delete story');
    }
  };

  const handleShare = async () => {
    if (!isAuthenticated) {
      toast('Sign up to share your stories!', {
        icon: '🔐',
        duration: 3000
      });
      onAuthRequired();
      return;
    }

    if (!currentStory?.id) {
      toast.error('Please save your story first');
      return;
    }

    try {
      const sharedStory = await storyService.shareStory(currentStory.id);
      const shareUrl = `${window.location.origin}/share/${sharedStory.share_id}`;
      
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Share link copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to share story');
    }
  };

  const handleLoadStory = async (story: Story) => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    
    onStoryLoad(story);
    onTextChange(story.content);
    setStoryTitle(story.title);
    setIsOpen(false);
  };

  const handleNewStory = () => {
    onNewStory();
    setStoryTitle('');
    onTextChange('');
    setIsOpen(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      
      <button
        className="close-button-standard close-button-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Typewriter Studio</h2>
        </div>

        <div className="story-controls">
          <input
            type="text"
            placeholder="Story title..."
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            className="story-title-input"
          />

          <div className="control-buttons">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="control-btn save-btn"
              title="Save story"
            >
              <Save size={18} />
              <span>Save</span>
            </button>

            <button 
              onClick={handleShare}
              className="control-btn share-btn"
              title="Share story"
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <button 
              onClick={handleNewStory}
              className="control-btn new-btn"
              title="New story"
            >
              <Plus size={18} />
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="stories-section">
          <h3>
            <FolderOpen size={18} />
            Your Stories
          </h3>
          
          <div className="stories-list">
            {!isAuthenticated ? (
              <div className="auth-prompt">
                <p className="no-stories">Sign up to save your stories!</p>
                <button 
                  onClick={onAuthRequired}
                  className="control-btn"
                  style={{ margin: '10px auto', display: 'block' }}
                >
                  Sign Up / Sign In
                </button>
              </div>
            ) : stories.length === 0 ? (
              <p className="no-stories">No stories yet. Start typing!</p>
            ) : (
              stories.map((story) => (
                <div 
                  key={story.id} 
                  className={`story-item ${currentStory?.id === story.id ? 'active' : ''}`}
                >
                  <button
                    onClick={() => handleLoadStory(story)}
                    className="story-btn"
                  >
                    <FileText size={16} />
                    <div className="story-info">
                      <span className="story-title">{story.title}</span>
                      <span className="story-date">
                        {new Date(story.updated_at!).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(story.id!)}
                    className="delete-btn"
                    title="Delete story"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <p className="hint">Press Cmd+S to quick save</p>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;