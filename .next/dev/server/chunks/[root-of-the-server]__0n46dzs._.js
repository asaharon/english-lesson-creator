module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/claude.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateLesson",
    ()=>generateLesson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/client.mjs [app-route] (ecmascript) <export Anthropic as default>");
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
    apiKey: process.env.ANTHROPIC_API_KEY
});
function buildPrompt(form) {
    const band = form.grade <= 2 ? 1 : form.grade <= 4 ? 2 : form.grade <= 6 ? 3 : 4;
    const bandInfo = {
        1: 'Grades 1–2: Complete beginners (A1). 4–5 new words max, very short sentences, heavy use of emojis and visuals. Focus on listening and repeating.',
        2: 'Grades 3–4: A1–A2. 6–8 new words, simple reading and writing, short sentences. Matching, fill-in-the-blanks activities.',
        3: 'Grades 5–6: A2. 8–10 new words, grammar introduction, short reading texts, sentence-level writing.',
        4: 'Grades 7–8: A2–B1. 10–12 words/expressions, complex grammar, reading paragraphs, discussions and writing.'
    };
    const lessonTypeGuide = {
        vocabulary: `VOCABULARY SLIDES: Include ${band <= 1 ? '4–5' : band === 2 ? '6–8' : band === 3 ? '8–10' : '10–12'} words. Each word must have: "word", "definition" (simple English, not Hebrew), "emoji" (1 relevant emoji), "example" (complete sentence). Split into separate vocabulary slides if there are many words.`,
        grammar: `GRAMMAR SLIDE: State the rule clearly. Include "structure" (formula like "Subject + is/are + Verb-ing"), and 3–4 example sentences showing the pattern.`,
        reading: `READING SLIDE: Write an age-appropriate text: ${band <= 1 ? '2–3 sentences' : band === 2 ? '4–6 sentences' : band === 3 ? '6–10 sentences' : '1–2 short paragraphs'}. Include 2–4 comprehension questions.`,
        speaking: `SPEAKING/CONVERSATION SLIDE: Provide a guided conversation, role-play script, or discussion prompts appropriate for ${band <= 1 ? 'simple greetings' : band === 2 ? 'short exchanges' : band === 3 ? 'opinions and preferences' : 'extended discussion'}.`
    };
    const selected = form.lessonTypes.map((t)=>lessonTypeGuide[t]).join('\n');
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
async function generateLesson(form) {
    const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 6000,
        system: 'You are an expert English teacher. Always respond with valid JSON only — no markdown, no explanation, just the JSON object.',
        messages: [
            {
                role: 'user',
                content: buildPrompt(form)
            }
        ]
    });
    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch  {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Claude returned non-JSON response');
        parsed = JSON.parse(match[0]);
    }
    const slides = (parsed.slides ?? []).map((s, i)=>({
            id: crypto.randomUUID(),
            type: s.type ?? 'activity',
            title: s.title ?? `Slide ${i + 1}`,
            subtitle: s.subtitle,
            content: s.content ?? {
                type: 'bullets',
                bullets: []
            },
            duration: s.duration ?? 0,
            teacherNotes: s.teacherNotes ?? '',
            emoji: s.emoji
        }));
    return {
        id: crypto.randomUUID(),
        title: parsed.title ?? `${form.topic} — Grade ${form.grade}`,
        grade: form.grade,
        topic: form.topic,
        lessonTypes: form.lessonTypes,
        createdAt: new Date().toISOString(),
        slides,
        totalDuration: slides.reduce((s, sl)=>s + sl.duration, 0)
    };
}
}),
"[project]/app/api/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$claude$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/claude.ts [app-route] (ecmascript)");
;
;
/** Parse Anthropic SDK errors into clean user-facing messages. */ function anthropicErrorMessage(err) {
    if (!(err instanceof Error)) return 'Generation failed — please try again.';
    // The SDK embeds the raw API response in the message as JSON.
    // Try to extract a structured error body from the message string.
    const raw = err.message;
    try {
        // Messages sometimes start with the HTTP status followed by a JSON body.
        const jsonStart = raw.indexOf('{');
        if (jsonStart !== -1) {
            const parsed = JSON.parse(raw.slice(jsonStart));
            const type = parsed?.error?.type ?? '';
            const msg = parsed?.error?.message ?? '';
            if (type === 'authentication_error' || raw.includes('401')) {
                return 'Invalid API key. Please check the ANTHROPIC_API_KEY value in your .env.local file.';
            }
            if (msg.toLowerCase().includes('credit balance')) {
                return 'Your Anthropic API account has insufficient credits. Please add credits at console.anthropic.com/billing — note that API credits are separate from a Claude.ai subscription.';
            }
            if (msg) return msg;
        }
    } catch  {
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
async function POST(request) {
    try {
        const form = await request.json();
        if (!form.grade || !form.topic || !form.lessonTypes?.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        if (!process.env.ANTHROPIC_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'ANTHROPIC_API_KEY is not set. Add it to your .env.local file and restart the server.'
            }, {
                status: 500
            });
        }
        const presentation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$claude$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateLesson"])(form);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(presentation);
    } catch (err) {
        console.error('Generate error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: anthropicErrorMessage(err)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0n46dzs._.js.map