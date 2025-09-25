import React, { useState, useRef, useEffect } from 'react';
import Page from './Page/Page';
import './PixelBorderTest.css';

const PixelBorderTest: React.FC = () => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="test-container">
      <Page padding="40px">
        <div className="editor-content">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
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
};

export default PixelBorderTest;