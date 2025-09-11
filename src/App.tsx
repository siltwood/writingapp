import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typewriter from './components/Typewriter';
import Sidebar from './components/Sidebar';
import { Story, storyService } from './lib/localStorage';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const { shareId } = useParams<{ shareId?: string }>();

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

  return (
    <div className="App">
      {!shareId && (
        <Sidebar
          currentStory={currentStory}
          onStoryLoad={handleStoryLoad}
          onNewStory={handleNewStory}
          text={text}
          onTextChange={handleTextChange}
        />
      )}
      <Typewriter 
        text={text}
        onTextChange={handleTextChange}
        onType={(text) => console.log('Typing:', text.length, 'characters')}
      />
    </div>
  );
}

export default App;
