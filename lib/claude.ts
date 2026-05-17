import Anthropic from '@anthropic-ai/sdk';
import { LessonFormData, Presentation, Slide } from '@/types/lesson';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(form: LessonFormData): string {
  const band = form.grade <= 2 ? 1 : form.grade <= 4 ? 2 : form.grade <= 6 ? 3 : 4;

  const bandInfo: Record<number, string> = {
    1: 'Grades 1–2: Complete beginners (A1). 4–5 new words max, very short sentences, heavy use of emojis and visuals. Focus on listening and repeating.',
    2: 'Grades 3–4: A1–A2. 6–8 new words, simple reading and writing, short sentences. Matching, fill-in-the-blanks activities.',
    3: 'Grades 5–6: A2. 8–10 new words, grammar introduction, short reading texts, sentence-level writing.',
    4: 'Grades 7–8: A2–B1. 10–12 words/expressions, complex grammar, reading paragraphs, discussions and writing.',
  };

  const lessonTypeGuide: Record<string, string> = {
    vocabulary: `VOCABULARY SLIDES: Include ${band <= 1 ? '4–5' : band === 2 ? '6–8' : band === 3 ? '8–10' : '10–12'} words. Each word must have: "word", "definition" (simple English, not Hebrew), "emoji" (1 relevant emoji), "example" (complete sentence). Split into separate vocabulary slides if there are many words.`,
    grammar: `GRAMMAR SLIDE: State the rule clearly. Include "structure" (formula like "Subject + is/are + Verb-ing"), and 3–4 example sentences showing the pattern.`,
    reading: `READING SLIDE: Write an age-appropriate text: ${band <= 1 ? '2–3 sentences' : band === 2 ? '4–6 sentences' : band === 3 ? '6–10 sentences' : '1–2 short paragraphs'}. Include 2–4 comprehension questions.`,
    speaking: `SPEAKING/CONVERSATION SLIDE: Provide a guided conversation, role-play script, or discussion prompts appropriate for ${band <= 1 ? 'simple greetings' : band === 2 ? 'short exchanges' : band === 3 ? 'opinions and preferences' : 'extended discussion'}.`,
  };

  const selected = form.lessonTypes.map(t => lessonTypeGuide[t]).join('\n');

  return `You are an expert English teacher designing a lesson for Israeli elementary school students.

LESSON:
- Grade: ${form.grade} (${bandInfo[band]})
- Topic: ${form.topic}
- Focus areas: ${form.lessonTypes.join(', ')}
${form.specificContent ? `- Specific content: ${form.specificContent}` : ''}
${form.includeGames ? '- Include a Zoom-friendly game slide' : ''}
${form.includeSongs ? '- Include a song, chant, or rhyme slide' : ''}
${form.includeHomework ? '- Include a homework slide' : ''}

CONTENT REQUIREMENTS:
${selected}

LESSON STRUCTURE (45 minutes):
1. Title slide (0 min)
2. Warm-up (5 min) – engaging, topic-related activity
3. Learning objectives (1 min) – student-friendly "Today we will..." list
4. Main content slides (15–20 min) – based on focus areas above${form.includeGames ? '\n5. Game (5 min) – fun Zoom-friendly consolidation game' : ''}${form.includeSongs ? '\n5. Song/Chant (3 min) – memorable repetition activity' : ''}
6. Practice (8 min) – interactive Zoom activity (chat, polls, raise hand)
7. Wrap-up (3 min) – quick review
${form.includeHomework ? '8. Homework (1 min)\n' : ''}
ZOOM-FRIENDLY IDEAS: chat box, raise hand yes/no, screen share, repeat after me, partner chat in breakout rooms.

CRITICAL: Reply with ONLY valid JSON. No markdown code fences, no explanation.

JSON format:
{
  "title": "Lesson title here",
  "slides": [
    {
      "type": "title",
      "title": "Slide title",
      "subtitle": "Grade X | Topic",
      "emoji": "🎓",
      "duration": 0,
      "teacherNotes": "Practical Zoom delivery instructions",
      "content": { "type": "title", "emoji": "🎓" }
    }
  ]
}

CONTENT OBJECT SHAPES (use exactly these):
- title slide:        { "type": "title", "emoji": "🎓" }
- warmup/objectives/wrapup/homework: { "type": "bullets", "bullets": ["item 1", "item 2"] }
- vocabulary:         { "type": "vocabulary", "words": [{ "word": "...", "definition": "...", "emoji": "🐱", "example": "..." }] }
- grammar:            { "type": "grammar", "rule": "...", "structure": "Subject + is + Verb-ing", "examples": ["...", "..."], "emoji": "📝" }
- reading:            { "type": "reading", "text": "...", "questions": ["..."] }
- activity/game/song/speaking/practice: { "type": "activity", "activityType": "game|exercise|discussion|song", "instructions": ["Step 1: ...", "Step 2: ..."], "content": "game content or lyrics" }`;
}

export async function generateLesson(form: LessonFormData): Promise<Presentation> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 6000,
    system: 'You are an expert English teacher. Always respond with valid JSON only — no markdown, no explanation, just the JSON object.',
    messages: [{ role: 'user', content: buildPrompt(form) }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

  let parsed: { title: string; slides: Partial<Slide>[] };
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Claude returned non-JSON response');
    parsed = JSON.parse(match[0]);
  }

  const slides: Slide[] = (parsed.slides ?? []).map((s, i) => ({
    id: crypto.randomUUID(),
    type: s.type ?? 'activity',
    title: s.title ?? `Slide ${i + 1}`,
    subtitle: s.subtitle,
    content: s.content ?? { type: 'bullets', bullets: [] },
    duration: s.duration ?? 0,
    teacherNotes: s.teacherNotes ?? '',
    emoji: s.emoji,
  }));

  return {
    id: crypto.randomUUID(),
    title: parsed.title ?? `${form.topic} — Grade ${form.grade}`,
    grade: form.grade,
    topic: form.topic,
    lessonTypes: form.lessonTypes,
    createdAt: new Date().toISOString(),
    slides,
    totalDuration: slides.reduce((s, sl) => s + sl.duration, 0),
  };
}
