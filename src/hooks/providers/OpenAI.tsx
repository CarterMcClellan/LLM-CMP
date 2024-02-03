import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for interacting with the OpenAI API to generate text based on input.
 * 
 * @param {string} API_KEY - The API key for authenticating requests to the OpenAI API.
 * @param {string} API_URL - The URL of the OpenAI API endpoint.
 * @param {string} modelName - The name of the model to use for generating text.
 * @returns {object} An object containing the state and functions for generating text, stopping generation, and the current state of the operation.
 */
export const useOpenAIStreaming = (API_KEY: string, API_URL: string, modelName: string) => {
  const [result, setResult] = useState(''); // Stores the result text from the API
  const [isGenerating, setIsGenerating] = useState(false); // Flag to indicate if the text is currently being generated
  const [elapsedTime, setElapsedTime] = useState(0); // Time taken for the generation request
  const [tokenCount, setTokenCount] = useState(0); // Number of tokens generated in the current request
  const controllerRef = useRef<AbortController | null>(new AbortController()); // Ref to hold the AbortController instance for canceling fetch requests

  // Effect hook for cleanup: Aborts any ongoing requests when the component using this hook unmounts.
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Generates text using the OpenAI API based on the provided input.
   * 
   * @param {string} input - The input text to base the generation on.
   */
  const generate = useCallback(async (input: string) => {
    if (!API_KEY || !modelName || !API_URL) {
      console.error('API Key, Model Name, or API URL is missing');
      return;
    }

    setResult('...');
    setIsGenerating(true);
    const startTime = Date.now();

    controllerRef.current = new AbortController();

    try {
      // Making the API request to the OpenAI endpoint
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: 'user', content: input }],
          stream: true,
        }),
        signal: controllerRef.current.signal,
      });

      // Handle response stream and update result state
      if (!response.body) {
        console.error('Response body is undefined.');
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let contentResult = '';
      let counter = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, '').trim())
          .filter((line) => line !== '' && line !== '[DONE]')
          .map((line) => JSON.parse(line));

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          if (delta.content) {
            contentResult += delta.content;
            counter += 1;
          }
        }

        setResult(contentResult);
        setTokenCount(counter);
      }
    } catch (error) {
      if (controllerRef.current.signal.aborted) {
        setResult('Request aborted.');
      } else {
        console.error('Error:', error);
        setResult('Error occurred while generating.');
      }
    } finally {
      setIsGenerating(false);
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      setElapsedTime(elapsed);
    }
  }, [API_KEY, API_URL, modelName]);

  /**
   * Aborts the ongoing generation request, if any.
   */
  const stop = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  return {
    result,
    isGenerating,
    elapsedTime,
    tokenCount,
    generate,
    stop,
  };
};
