import './App.css';

import React, { useRef, useState, useEffect } from 'react';

import StreamingCompletions, {
  StreamingCompletionsHandle,
} from './components/StreamingCompletion';
import PromptSection from './components/PromptSelection';

function App() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [systemPromptIsChanged, setSystemPromptIsChanged] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const [userPrompt, setUserPrompt] = useState('');
  const [userPromptIsChanged, setUserPromptIsChanged] = useState(false);
  const [showUserPrompt, setShowUserPrompt] = useState(true);

  // DEBUG flag - tied to Debug button...
  const [debugFlag, setDebugFlag] = useState(true);

  // create three unique handles for the Streaming... component
  const streamingCompletionsRef1 = useRef<StreamingCompletionsHandle>(null);
  const streamingCompletionsRef2 = useRef<StreamingCompletionsHandle>(null);
  const streamingCompletionsRef3 = useRef<StreamingCompletionsHandle>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.title = isGenerating ? 'LLM-CMP (*)' : 'LLM-CMP';
  }, [isGenerating]); // Empty dependency array ensures this runs once on mount

  function handleKeyDown(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      callFoo();
    }
  }

  function handleSystemPromptChange(e: any) {
    setSystemPrompt(e.target.value);
    setSystemPromptIsChanged(true);
  }

  function handleUserPromptChange(e: any) {
    setUserPrompt(e.target.value);
    setUserPromptIsChanged(true);
  }

  function renderStartGenerateButton() {
    if (
      (systemPrompt && systemPromptIsChanged) ||
      (userPrompt && userPromptIsChanged)
    ) {
      return (
        <button
          onClick={callFoo}
          style={{ backgroundColor: 'lightGreen', fontWeight: 'bold' }}
        >
          Start Generation (all models)
        </button>
      );
    }
    return (
      <button onClick={callFoo} style={{ fontWeight: 'normal' }}>
        Start Generation (all models)
      </button>
    );
  }

  const callFoo = async () => {
    setIsGenerating(true);

    await Promise.all([
      streamingCompletionsRef1.current?.runGenerate(
        systemPrompt,
        userPrompt,
        debugFlag,
      ),
      streamingCompletionsRef2.current?.runGenerate(
        systemPrompt,
        userPrompt,
        debugFlag,
      ),
      streamingCompletionsRef3.current?.runGenerate(
        systemPrompt,
        userPrompt,
        debugFlag,
      ),
    ]);

    setIsGenerating(false);

    setSystemPromptIsChanged(false);
    setUserPromptIsChanged(false);
  };

  const callClear = () => {
    streamingCompletionsRef1.current?.clear();
    streamingCompletionsRef2.current?.clear();
    streamingCompletionsRef3.current?.clear();

    setSystemPromptIsChanged(false);
    setUserPromptIsChanged(false);
  };

  const callStop = () => {
    streamingCompletionsRef1.current?.stopGenerate();
    streamingCompletionsRef2.current?.stopGenerate();
    streamingCompletionsRef3.current?.stopGenerate();

    setSystemPromptIsChanged(false);
    setUserPromptIsChanged(false);
  };

  return (
    <div className="App">
      <div className="titleSection">
        <h1>LLM Comparison Tool</h1>
        <body>
          Given a <b>user prompt</b>, and an/or an optional <b>system prompt</b>{' '}
          (both of which can be entered below), generate responsis in parallel
          from one or more service providers.
        </body>
      </div>

      <PromptSection
        title="System Prompt"
        prompt={systemPrompt}
        isChanged={systemPromptIsChanged}
        showPrompt={showSystemPrompt}
        onShowPromptToggle={() => setShowSystemPrompt((prev) => !prev)}
        onPromptChange={handleSystemPromptChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a system prompt (optional)..."
        rows={5}
      />

      <PromptSection
        title="User Prompt"
        prompt={userPrompt}
        isChanged={userPromptIsChanged}
        showPrompt={showUserPrompt}
        onShowPromptToggle={() => setShowUserPrompt((prev) => !prev)}
        onPromptChange={handleUserPromptChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a user prompt..."
        rows={10}
      />

      <div className="buttonSection">
        {renderStartGenerateButton()}
        <button onClick={callClear}>Clear model outputs</button>
        <button onClick={callStop}>Stop Generation on all on models</button>
        <button onClick={() => setDebugFlag(!debugFlag)}>
          {debugFlag ? 'Turn Debug Off' : 'Turn Debug On'}
        </button>
        debug: {debugFlag ? 'on' : 'off'}
      </div>

      <div className="textCompletionRow">
        <StreamingCompletions
          systemPrompt={systemPrompt}
          userPrompt={userPrompt}
          debugFlag={debugFlag}
          ref={streamingCompletionsRef1}
        />
        <StreamingCompletions
          systemPrompt={systemPrompt}
          userPrompt={userPrompt}
          debugFlag={debugFlag}
          ref={streamingCompletionsRef2}
        />
        <StreamingCompletions
          systemPrompt={systemPrompt}
          userPrompt={userPrompt}
          debugFlag={debugFlag}
          ref={streamingCompletionsRef3}
        />
      </div>
    </div>
  );
}

export default App;
