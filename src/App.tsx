import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typewriter from './components/Typewriter';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Page from './components/Page/Page';
import { Story, storyService, api } from './lib/api';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { shareId } = useParams<{ shareId?: string }>();

  useEffect(() => {
    // Check for existing auth
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      // Verify token is still valid
      api.verifyToken().then(result => {
        setUser(result.user);
        setIsAuthenticated(true);
      }).catch(() => {
        // Token invalid, clear auth
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }

    // Check for auth callback from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const token_param = urlParams.get('token');
    if (token_param) {
      localStorage.setItem('token', token_param);
      setIsAuthenticated(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (shareId) {
      loadSharedStory(shareId);
    }
  }, [shareId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>('.save-btn')?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadSharedStory = async (id: string) => {
    try {
      const story = await storyService.getSharedStory(id);
      if (story) {
        setCurrentStory(story);
        setText(story.content);
      }
    } catch (error) {
      console.error('Error loading shared story:', error);
    }
  };

  const handleStoryLoad = (story: Story) => {
    setCurrentStory(story);
  };

  const handleNewStory = () => {
    setCurrentStory(null);
    setText('');
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleLogin = (token: string, user: any) => {
    if (token === 'guest') {
      setShowLogin(false);
      return;
    }
    setUser(user);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {showLogin && (
        <Login onLogin={handleLogin} />
      )}
      
      {!shareId && (
        <>
          <Sidebar
            currentStory={currentStory}
            onStoryLoad={handleStoryLoad}
            onNewStory={handleNewStory}
            text={text}
            onTextChange={handleTextChange}
            isAuthenticated={isAuthenticated}
            onAuthRequired={() => setShowLogin(true)}
          />
          
        </>
      )}
      
      <Page padding="80px">
        <div className="editor-content">
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="text-editor"
            placeholder="Start typing..."
            autoFocus
          />
          <div className="text-display">
            {text}
          </div>
        </div>
      </Page>
    </div>
  );
}

export default App;
