// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'ユーザーからのメッセージの文章の続きを1文のみ生成してください。' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 50,
        temperature: 0.5,
        top_p: 1,
        frequency_penalty: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return NextResponse.json({ text: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error generating text:', error);
    return NextResponse.json({ error: 'Error generating text.' }, { status: 500 });
  }
}
