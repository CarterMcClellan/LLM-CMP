import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import StreamingOpenAICompletions, { StreamingOpenAICompletionsHandle } from './TextStream2';

import emptyIcon from "./icons/empty-text.png";
import textIcon from "./icons/text.png";

function App() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [systemPromptIsChanged, setSystemPromptIsChanged] = useState(false);  
  const [showSystemPrompt, setShowSystemPrompt] = useState(false); 

  const [userPrompt, setUserPrompt] = useState('');
  const [userPromptIsChanged, setUserPromptIsChanged] = useState(false);  
  const [showUserPrompt, setShowUserPrompt] = useState(true); 

  // create three unique handles for the Streaming... component
  const streamingRef1 = useRef<StreamingOpenAICompletionsHandle>(null);
  const streamingRef2 = useRef<StreamingOpenAICompletionsHandle>(null);
  const streamingRef3 = useRef<StreamingOpenAICompletionsHandle>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = isGenerating ? "LLM-CMP (*)" : "LLM-CMP";
  }, [isGenerating]); // Empty dependency array ensures this runs once on mount

  function handleKeyDown(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      callFoo()
    }
  }

  function handleSystemPromptChange(e: any) {
    setSystemPrompt(e.target.value);
    setSystemPromptIsChanged(true);
  };

  function handleUserPromptChange(e: any) {
    setUserPrompt(e.target.value);
    setUserPromptIsChanged(true);
  };

  function renderEmptyIcon() {
    return (
      <img src={emptyIcon} title="Description" style={{ width: '20px', height: '20px' }} />
    )
  }

  function renderTextIcon( changed: boolean) {
    if (changed) {
      return (<img src={textIcon} alt="Text Icon" style={{ backgroundColor: 'lightGreen', width: '20px', height: '20px' }}/>)
    }
    return (<img src={emptyIcon} alt="Empty Icon" style={{ width: '20px', height: '20px' }}/>)
  }

  function renderStartGenerateButton() {
    if ((systemPrompt && systemPromptIsChanged) || (userPrompt && userPromptIsChanged)) {
        return ( <button onClick={callFoo} style={{ backgroundColor: 'lightGreen', fontWeight: 'bold' }}>Start Generation (all models)</button> )
    }
    return ( <button onClick={callFoo} style={{ fontWeight: 'normal' }}>Start Generation (all models)</button> )
  }


  const callFoo = async () => {

    setIsGenerating(true)
    
    await Promise.all([
      streamingRef1.current?.runGenerate(systemPrompt, userPrompt),
      streamingRef2.current?.runGenerate(systemPrompt, userPrompt),
      streamingRef3.current?.runGenerate(systemPrompt, userPrompt)
    ]);

    setIsGenerating(false)

    setSystemPromptIsChanged(false);
    setUserPromptIsChanged(false);
  };

  const callClear = () => {
    streamingRef1.current?.clear();
    streamingRef2.current?.clear();
    streamingRef3.current?.clear();

    setSystemPromptIsChanged(false);
    setUserPromptIsChanged(false);
  }

  const callStop = () => {
    streamingRef1.current?.stopGenerate();
    streamingRef2.current?.stopGenerate();
    streamingRef3.current?.stopGenerate();

    setSystemPromptIsChanged(false);
    setUserPromptIsChanged(false);
  }
 
  return (
    <div className="App">

      <div className="titleSection">
        <h1>LLM Comparison Tool</h1>
          <body>
          Given a <b>user prompt</b>, and an/or an optional <b>system prompt</b> (both of which can be entered below), generate responsis in parallel from one or more service providers.
          </body>
        </div>

      <div className="systemPromptHeader">
        <h1> 
            System Prompt&nbsp;
            {systemPrompt ? renderTextIcon(systemPromptIsChanged) : renderEmptyIcon()}
        <button onClick={() => setShowSystemPrompt(prev => !prev)}>
          {showUserPrompt ? 'Hide System Prompt' : 'Show System Prompt'}
        </button>
        </h1>
      </div>

      <div className="systemPromptInputSection">
        {showSystemPrompt && (
          <textarea
            value={systemPrompt}
            onChange={handleSystemPromptChange}
            onKeyDown={handleKeyDown}
            className="systemPromptInput"
            placeholder="Enter a system prompt (optional)..."
            rows={5} // Adjust number of rows as needed
          />
        )}
      </div>

      <div className="userPromptHeader">
        <h1> 
            User Prompt&nbsp;
            {userPrompt ? renderTextIcon(userPromptIsChanged) : renderEmptyIcon()}
        <button onClick={() => setShowUserPrompt(prev => !prev)}>
          {showUserPrompt ? 'Hide User Prompt' : 'Show User Prompt'}
        </button>
        </h1>
      </div>

      <div className="userPromptInputSection">
        {showUserPrompt && (
          <textarea
            value={userPrompt}
            onChange={handleUserPromptChange}
            onKeyDown={handleKeyDown}
            className="userPromptInput"
            placeholder="Enter a user prompt..."
            rows={10} // Adjust number of rows as needed
          />
        )}
      </div>

      {/*
      <div className="apiSection">
        <input
          type="text"
          value={key}
          onChange={handleKeyChange}
          className="apiKeyInput"
          placeholder="Use the same api key for all?"
        />
        <button onClick={updateApiKey}>Update API Key</button>
      </div>
      */}

      <div className="buttonSection">
        {renderStartGenerateButton()}
        <button onClick={callClear}>Clear model outputs</button>
        <button onClick={callStop}>Stop Generation on all on models</button>
      </div>

      <div className="textCompletionRow">
        <StreamingOpenAICompletions systemPrompt={systemPrompt} userPrompt={userPrompt} ref={streamingRef1}/>
        <StreamingOpenAICompletions systemPrompt={systemPrompt} userPrompt={userPrompt} ref={streamingRef2}/>
        <StreamingOpenAICompletions systemPrompt={systemPrompt} userPrompt={userPrompt} ref={streamingRef3}/>
      </div>
    </div>
  );
}

export default App;
