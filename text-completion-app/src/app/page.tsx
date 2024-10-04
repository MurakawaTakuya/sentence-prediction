// File: app/page.tsx
'use client';

import { useState, useEffect, SetStateAction, useRef } from 'react';
import styles from './styles/Home.module.scss';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [generatedHint, setGeneratedHint] = useState('');
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

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
          let hint = data.text.replace(inputText, '').trim();

          if (!inputText.endsWith(' ') && hint) {
            hint = ' ' + hint;
          }

          console.log('Generated hint:', hint);

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
    }, 200); // Prevent too many requests while typing

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'ArrowRight' && generatedHint) {
      e.preventDefault();
      let firstPart = generatedHint.split(' ')[0];
      let restHint = generatedHint.slice(firstPart.length).trim();

      if (generatedHint.startsWith(' ')) {
        const nextWord = restHint.split(' ')[0];
        firstPart += ' ' + nextWord;
        restHint = restHint.slice(nextWord.length).trim();
      }

      const shouldAddSpace = /^[a-zA-Z]+$/.test(firstPart);
      setInputText((prev) => prev + (shouldAddSpace && !prev.endsWith(' ') ? ' ' : '') + firstPart + (shouldAddSpace ? ' ' : ''));
      setGeneratedHint(restHint);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setInputText((prev) => {
        const words = prev.trim().split(' ');
        words.pop();
        return words.join(' ') + (words.length > 0 ? ' ' : '');
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <div className={styles.textWrapper}>
          <textarea
            ref={textAreaRef}
            className={styles.textArea}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter an incomplete sentence..."
            aria-label="Input text"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          <div className={styles.hintOverlay}>
            <span className={styles.textInput} style={{ visibility: 'hidden' }}>{inputText}</span>
            <span className={styles.generatedHint}>{generatedHint}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
