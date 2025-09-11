import React, { useState, useEffect, useRef } from 'react';
import './Typewriter.css';

interface TypewriterProps {
  onType?: (text: string) => void;
  text: string;
  onTextChange: (text: string) => void;
}

const Typewriter: React.FC<TypewriterProps> = ({ onType, text, onTextChange }) => {
  const [caretPosition, setCaretPosition] = useState({ line: 0, char: 0 });
  const [caretVisible, setCaretVisible] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const playTypeSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    playTypeSound();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const lines = text.split('\n');
      if (lines.length < 30) {
        onTextChange(text + '\n');
        setCaretPosition({ line: caretPosition.line + 1, char: 0 });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onTextChange(newText);
    
    const lines = newText.split('\n');
    const currentLine = lines.length - 1;
    const currentChar = lines[currentLine].length;
    setCaretPosition({ line: currentLine, char: currentChar });
    
    if (onType) {
      onType(newText);
    }
  };

  return (
    <div className="typewriter-container">
      <div className="paper-sheet">
        <div className="paper-texture"></div>
        <div className="paper-lines">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="paper-line"></div>
          ))}
        </div>
        <textarea
          ref={textAreaRef}
          className="typewriter-input"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Start typing..."
          spellCheck={false}
          autoFocus
        />
        {caretVisible && (
          <div 
            className="typewriter-caret"
            style={{
              top: `${45 + caretPosition.line * 28}px`,
              left: `${60 + caretPosition.char * 11}px`
            }}
          />
        )}
      </div>
      <div className="typewriter-frame">
        <div className="typewriter-keys"></div>
      </div>
    </div>
  );
};

export default Typewriter;