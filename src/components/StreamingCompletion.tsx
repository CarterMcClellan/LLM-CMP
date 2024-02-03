import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactMarkdown from 'react-markdown';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import Select from 'react-select';

export type StreamingCompletionsProps = {
  systemPrompt: string;
  userPrompt: string;
  debugFlag: boolean;
};

export type StreamingCompletionsHandle = {
  runGenerate: (
    systemPrompt: string,
    userPrompt: string,
    debugFlag: boolean,
  ) => Promise<void>;
  clear: () => void;
  stopGenerate: () => void;
  // updateApiKey: (newKey: string) => void;
};

const StreamingCompletions = forwardRef<
  StreamingCompletionsHandle,
  StreamingCompletionsProps
>((props, ref) => {
  const [combinedPrompt, setCombinedPrompt] = useState('');
  const [debugFlag, setDebugFlag] = useState(false);
  const [API_KEY, setAPI_KEY] = useState('');

  useImperativeHandle(ref, () => ({
    async runGenerate() {
      console.log('runGenerate called with systemPrompt', props.systemPrompt);
      console.log('runGenerate called with userPrompt', props.userPrompt);

      setCombinedPrompt(`${props.systemPrompt}\n${props.userPrompt}`);
      setDebugFlag(props.debugFlag);
      await generate(combinedPrompt, provider);
    },
    clear() {
      setResult('');
      setTokenCount(0);
      setElapsedTime(0);
    },
    stopGenerate() {
      stop();
    },
  }));

  const [provider, setProvider] = useState('');
  const [url, setUrl] = useState('');

  let modelOptions =
    provider === 'OpenAI'
      ? openAIModelOptions
      : provider === 'NVIDIA AI Playground'
        ? nvidiaPlaygroundModelOptions
        : [];

  const [modelName, setModelName] = useState('');
  const [maxTokens, setMaxTokens] = useState('');
  const [trainingDataDate, setTrainingDataDate] = useState('');

  function handleProviderChange(selectedOption: any) {
    setProvider(selectedOption.value);
  }

  function handleModelChange(selectedOption: any) {
    setModelName(selectedOption.label);
    setMaxTokens(selectedOption.tokens);
    // setProvider(selectedOption.provider);
    setTrainingDataDate(selectedOption.data);
    setUrl(selectedOption.url);
  }

  function renderStatusMessage() {
    if (provider == '') {
      return (
        <p>
          <b>Provider Not Selected ...</b>
        </p>
      );
    } else if (API_KEY == '') {
      return (
        <p>
          <b>API Key Not Set ...</b>
        </p>
      );
    } else if (modelName == '') {
      return (
        <p>
          <b>Model Not Selected ...</b>
        </p>
      );
    } else if (isGenerating) {
      return (
        <p>
          <b>Generating response ...</b>
        </p>
      );
    } else if (!isGenerating && elapsedTime > 0) {
      const elapsedTimeInSeconds = (elapsedTime / 1000).toFixed(2);
      const tokensPerSecond = (tokenCount / (elapsedTime / 1000)).toFixed(2);
      return (
        <>
          <p>
            <b>Response Complete...</b>
          </p>
          <p>
            {' '}
            {tokenCount} tokens generated in {elapsedTimeInSeconds}s{' '}
          </p>
          <p> {tokensPerSecond} tokens per second. </p>
        </>
      );
    }
    return null;
  }

  return (
    <div className="fullLLMContainer">
      <div className="selectModelProvider">
        <span>Provider:&nbsp;</span>
        <Select
          options={providers}
          onChange={handleProviderChange}
          placeholder={'select provider'}
        />
      </div>

      <div className="apiKey">
        API Key:&nbsp;&nbsp;&nbsp;
        <input
          type="text"
          value={API_KEY}
          onChange={(e) => setAPI_KEY(e.target.value)}
          className="apiKeyInput"
          placeholder="Enter API Key..."
        />
      </div>

      <div className="selectModel">
        <span>Model:&nbsp;</span>
        {}
        <Select
          options={modelOptions}
          onChange={handleModelChange}
          placeholder={'select model'}
        />
      </div>

      {modelName && (
        <table className="modelSpecs">
          <tbody>
            <tr>
              <td>Max Tokens</td>
              <td>{maxTokens}</td>
            </tr>
            <tr>
              <td>Training Data Date</td>
              <td>{trainingDataDate}</td>
            </tr>
            <tr>
              <td>URL</td>
              <td>{url}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div className="textCompletionContainer">
        {debugFlag && (
          <>
            <h2>DEBUG</h2>
            <p>
              <i>provider:</i> {provider}
            </p>
            <p>
              <i>compbined prompt:</i> "{combinedPrompt}"
            </p>
            <hr className="separator" />
          </>
        )}
        <div>
          <>
            {renderStatusMessage()}
            <hr className="separator" />
          </>
          <div>
            <div id="resultContainer">
              <ReactMarkdown
                className="whitespace-pre-line markdown-table"
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      // @ts-ignore
                      <SyntaxHighlighter
                        style={dark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StreamingCompletions;
