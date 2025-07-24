import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  const { messages } = await request.json();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    stream: true,
  });
  return NextResponse.json(chat);
}
