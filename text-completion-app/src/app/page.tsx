// File: app/page.tsx
'use client';

import { useState, useEffect, SetStateAction } from 'react';
import styles from './styles/Home.module.scss';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [generatedHint, setGeneratedHint] = useState('');

  useEffect(() => {
    const fetchHint = async () => {
      if (inputText.trim() === '') {
        setGeneratedHint('');
        return;
      }
      try {
        const response = await fetch('/api/generateText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: inputText }),
        });
        const data = await response.json();
        if (data.text) {
          const hint = data.text.replace(inputText, '').trim();

          console.log('Generated hint:', hint);

          setGeneratedHint(hint);
        } else {
          setGeneratedHint('');
        }
      } catch (error) {
        console.error('Error fetching hint:', error);
        setGeneratedHint('');
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchHint();
    }, 300); // Trigger hint generation 300ms after input changes

    return () => clearTimeout(delayDebounceFn);
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
