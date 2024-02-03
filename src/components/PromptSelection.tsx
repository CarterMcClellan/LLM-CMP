import React from 'react';
import TextIcon from './icons/TextIcon';
import EmptyIcon from './icons/EmptyIcon';

type PromptSelectionProps = {
  title: string;
  prompt: string;
  isChanged: boolean;
  showPrompt: boolean;
  onShowPromptToggle: () => void;
  onPromptChange: (e: any) => void;
  onKeyDown: (e: any) => void;
  placeholder: string;
  rows: number;
};

const PromptSection = ({
  title,
  prompt,
  isChanged,
  showPrompt,
  onShowPromptToggle,
  onPromptChange,
  onKeyDown,
  placeholder,
  rows,
}: PromptSelectionProps) => (
  <div>
    <div className="promptHeader">
      <h1>
        {title}&nbsp;
        {prompt ? <TextIcon changed={isChanged} /> : <EmptyIcon />}
        <button onClick={onShowPromptToggle}>
          {showPrompt ? `Hide ${title}` : `Show ${title}`}
        </button>
      </h1>
    </div>
    <div className="promptInputSection">
      {showPrompt && (
        <textarea
          value={prompt}
          onChange={onPromptChange}
          onKeyDown={onKeyDown}
          className="promptInput"
          placeholder={placeholder}
          rows={rows}
        />
      )}
    </div>
  </div>
);

export default PromptSection;
