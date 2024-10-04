// File: app/api/generateText/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// 環境変数の存在確認
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is missing');
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'ユーザーからのメッセージの文章の続きを1文のみ生成してください。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 50,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
    });

    const text = response.choices[0]?.message?.content?.trim();
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating text:', error);
    return NextResponse.json({ error: 'Failed to generate text' }, { status: 500 });
  }
}
