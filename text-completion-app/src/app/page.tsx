// File: app/page.tsx
'use client';

import { useState } from 'react';
import styles from './styles/Home.module.scss';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateText = async () => {
    if (!inputText) return;
    setLoading(true);

    try {
      const response = await fetch('/api/generateText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      const data = await response.json();
      console.log(data);
      if (data.text) {
        setGeneratedText(data.text);
      } else {
        setGeneratedText('Error: No text generated');
      }
    } catch {
      setGeneratedText('Error: Failed to fetch generated text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Text Generator</h1>
      <textarea
        className={styles.textInput}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter an incomplete sentence..."
      />
      <button className={styles.generateButton} onClick={handleGenerateText} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {generatedText && <p className={styles.generatedText}>{generatedText}</p>}
    </div>
  );
}
