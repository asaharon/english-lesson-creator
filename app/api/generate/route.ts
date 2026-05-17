import { NextRequest, NextResponse } from 'next/server';
import { generateLesson } from '@/lib/claude';
import { LessonFormData } from '@/types/lesson';

/** Parse Anthropic SDK errors into clean user-facing messages. */
function anthropicErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) return 'Generation failed — please try again.';

  // The SDK embeds the raw API response in the message as JSON.
  // Try to extract a structured error body from the message string.
  const raw = err.message;
  try {
    // Messages sometimes start with the HTTP status followed by a JSON body.
    const jsonStart = raw.indexOf('{');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart)) as {
        error?: { type?: string; message?: string };
      };
      const type = parsed?.error?.type ?? '';
      const msg  = parsed?.error?.message ?? '';

      if (type === 'authentication_error' || raw.includes('401')) {
        return 'Invalid API key. Please check the ANTHROPIC_API_KEY value in your .env.local file.';
      }
      if (msg.toLowerCase().includes('credit balance')) {
        return 'Your Anthropic API account has insufficient credits. Please add credits at console.anthropic.com/billing — note that API credits are separate from a Claude.ai subscription.';
      }
      if (msg) return msg;
    }
  } catch {
    // fall through to the raw message
  }

  if (raw.toLowerCase().includes('credit')) {
    return 'Your Anthropic API account has insufficient credits. Please add credits at console.anthropic.com/billing.';
  }
  if (raw.toLowerCase().includes('api key') || raw.includes('401')) {
    return 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local.';
  }

  return raw;
}

export async function POST(request: NextRequest) {
  try {
    const form: LessonFormData = await request.json();

    if (!form.grade || !form.topic || !form.lessonTypes?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set. Add it to your .env.local file and restart the server.' },
        { status: 500 },
      );
    }

    const presentation = await generateLesson(form);
    return NextResponse.json(presentation);
  } catch (err) {
    console.error('Generate error:', err);
    return NextResponse.json(
      { error: anthropicErrorMessage(err) },
      { status: 500 },
    );
  }
}
