import React, { useEffect } from 'react';
import { $getRoot, $getSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import './LexicalEditor.css';

interface LexicalEditorProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

// Plugin to sync external value changes
function ValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (value !== undefined) {
      editor.update(() => {
        const root = $getRoot();
        const currentText = root.getTextContent();
        if (currentText !== value && value === '') {
          root.clear();
        }
      });
    }
  }, [editor, value]);

  return null;
}

// Plugin for autofocus
function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({ value, onChange, placeholder = "Start typing..." }) => {
  const initialConfig = {
    namespace: 'TypewriterEditor',
    onError: (error: Error) => {
      console.error(error);
    },
    editorState: value ? JSON.stringify({
      root: {
        children: [{
          children: [{
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: value,
            type: "text",
            version: 1
          }],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1
        }],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1
      }
    }) : undefined,
  };

  const handleChange = (editorState: any) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      onChange(text);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="lexical-editor-container">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="lexical-editor-input" />}
          placeholder={<div className="lexical-editor-placeholder">{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <ValuePlugin value={value} />
        <AutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
};

export default LexicalEditor;