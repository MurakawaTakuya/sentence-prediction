// File: app/page.tsx
'use client';

import { useState, useEffect, SetStateAction, useRef } from 'react';
import styles from './styles/Home.module.scss';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [generatedHint, setGeneratedHint] = useState('');
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchHint = async () => {
      if (inputText.trim() === '') {
        setGeneratedHint('');
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const response = await fetch('/api/generateText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: inputText }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const data = await response.json();
        if (data.text) {
          const hint = data.text.replace(inputText, '').trim();

          setGeneratedHint(hint);
        } else {
          setGeneratedHint('');
        }
      } catch (error) {
        if ((error as any).name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching hint:', error);
          setGeneratedHint('');
        }
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchHint();
    }, 200); // Debounce time

    return () => {
      clearTimeout(delayDebounceFn);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [inputText]);

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setInputText(e.target.value);
    setGeneratedHint('');
  };

  return (
    <div className={styles.container}>
      <h1>Text Generator with Hint</h1>
      <div className={styles.inputContainer}>
        <div className={styles.textWrapper}>
          <span className={styles.textInput}>{inputText}</span>
          <span className={styles.generatedText}>&nbsp;{generatedHint}</span>
          <textarea
            className={styles.hiddenTextArea}
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter an incomplete sentence..."
            aria-label="Input text"
          />
        </div>
      </div>
    </div>
  );
}
