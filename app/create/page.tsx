'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LessonFormData, LessonType, getGradeBandLabel, Presentation } from '@/types/lesson';

const GRADE_COLORS = ['', '#ec4899', '#ec4899', '#f97316', '#f97316', '#10b981', '#10b981', '#6366f1', '#6366f1'];
const LESSON_TYPES: { id: LessonType; label: string; emoji: string; desc: string }[] = [
  { id: 'vocabulary', label: 'Vocabulary', emoji: '📚', desc: 'New words, meanings & examples' },
  { id: 'grammar',    label: 'Grammar',    emoji: '📝', desc: 'Rules, structures & patterns' },
  { id: 'reading',    label: 'Reading',    emoji: '📖', desc: 'Short texts & comprehension' },
  { id: 'speaking',   label: 'Speaking',   emoji: '💬', desc: 'Dialogues & conversation' },
];

const TOPIC_SUGGESTIONS = [
  'Farm Animals', 'My Family', 'Food & Drinks', 'Colors & Shapes', 'Weather',
  'School Supplies', 'Body Parts', 'Numbers 1–20', 'Feelings & Emotions', 'Clothes',
  'Present Continuous', 'Past Simple', 'There is / There are', 'Can / Can\'t',
  'Adjectives', 'Prepositions of Place', 'Daily Routine', 'Sports & Hobbies',
];

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<LessonFormData>({
    grade: 0,
    topic: '',
    lessonTypes: [],
    specificContent: '',
    includeGames: false,
    includeSongs: false,
    includeHomework: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const LOADING_MSGS = [
    '🤔 Designing your lesson plan...',
    '📚 Selecting vocabulary and content...',
    '🎨 Building interactive slides...',
    '✨ Adding Zoom-friendly activities...',
    '🇮🇱 Adapting for Israeli curriculum...',
    '🎉 Almost ready!',
  ];

  function toggleType(t: LessonType) {
    setForm(f => ({
      ...f,
      lessonTypes: f.lessonTypes.includes(t)
        ? f.lessonTypes.filter(x => x !== t)
        : [...f.lessonTypes, t],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.grade) { setError('Please select a grade.'); return; }
    if (!form.topic.trim()) { setError('Please enter a lesson topic.'); return; }
    if (!form.lessonTypes.length) { setError('Please select at least one lesson type.'); return; }

    setError('');
    setLoading(true);
    let msgIdx = 0;
    setLoadingMsg(LOADING_MSGS[0]);
    const interval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, LOADING_MSGS.length - 1);
      setLoadingMsg(LOADING_MSGS[msgIdx]);
    }, 4000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');

      const presentation: Presentation = data;
      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('lessons') ?? '[]') as Presentation[];
      existing.push(presentation);
      localStorage.setItem('lessons', JSON.stringify(existing));
      localStorage.setItem(`lesson_${presentation.id}`, JSON.stringify(presentation));

      router.push(`/lesson/${presentation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  const canSubmit = form.grade > 0 && form.topic.trim() && form.lessonTypes.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>New Lesson</h1>
        <p style={{ color: 'var(--app-muted)' }}>Fill in the details below and Claude will generate a complete 45-minute lesson.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-7">

        {/* Grade selector */}
        <div className="rounded-xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--app-muted)' }}>
            1. Choose Grade
          </h2>
          <div className="grid grid-cols-8 gap-2 mb-3">
            {[1,2,3,4,5,6,7,8].map(g => (
              <button
                key={g} type="button"
                onClick={() => setForm(f => ({ ...f, grade: g }))}
                className="h-12 rounded-xl font-bold text-base transition-all"
                style={{
                  background: form.grade === g ? GRADE_COLORS[g] : 'var(--app-bg)',
                  color: form.grade === g ? '#fff' : 'var(--app-muted)',
                  border: `2px solid ${form.grade === g ? GRADE_COLORS[g] : 'var(--app-border)'}`,
                  transform: form.grade === g ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {g}
              </button>
            ))}
          </div>
          {form.grade > 0 && (
            <p className="text-sm font-medium" style={{ color: GRADE_COLORS[form.grade] }}>
              Grade {form.grade} · {getGradeBandLabel(form.grade)}
            </p>
          )}
          {!form.grade && (
            <p className="text-sm" style={{ color: 'var(--app-muted)' }}>Select a grade (1–8)</p>
          )}
        </div>

        {/* Topic */}
        <div className="rounded-xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--app-muted)' }}>
            2. Lesson Topic
          </h2>
          <div className="relative">
            <input
              type="text"
              value={form.topic}
              onChange={e => { setForm(f => ({ ...f, topic: e.target.value })); setShowSuggestions(false); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="e.g. Farm Animals, Present Continuous, My Family..."
              className="w-full px-4 py-3 rounded-lg text-base outline-none"
              style={{
                background: 'var(--app-bg)',
                color: 'var(--app-text)',
                border: '1px solid var(--app-border)',
              }}
            />
            {showSuggestions && !form.topic && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto"
                   style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                {TOPIC_SUGGESTIONS.map(s => (
                  <button key={s} type="button"
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-opacity-80 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    style={{ color: 'var(--app-text)' }}
                    onMouseDown={() => { setForm(f => ({ ...f, topic: s })); setShowSuggestions(false); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lesson types */}
        <div className="rounded-xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--app-muted)' }}>
            3. Lesson Focus <span className="normal-case font-normal">(select all that apply)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {LESSON_TYPES.map(({ id, label, emoji, desc }) => {
              const selected = form.lessonTypes.includes(id);
              return (
                <button key={id} type="button" onClick={() => toggleType(id)}
                  className="flex items-start gap-3 p-4 rounded-xl text-left transition-all"
                  style={{
                    background: selected ? 'rgba(99,102,241,0.15)' : 'var(--app-bg)',
                    border: `2px solid ${selected ? 'var(--app-accent)' : 'var(--app-border)'}`,
                  }}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: selected ? '#a5b4fc' : 'var(--app-text)' }}>{label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>{desc}</div>
                  </div>
                  {selected && <span className="ml-auto text-indigo-400 text-lg">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Extras */}
        <div className="rounded-xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--app-muted)' }}>
            4. Extras <span className="normal-case font-normal">(optional)</span>
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { key: 'includeGames', label: 'Include a game', emoji: '🎮', desc: 'Zoom-friendly competitive activity' },
              { key: 'includeSongs', label: 'Include a song or chant', emoji: '🎵', desc: 'Catchy repetition for vocabulary' },
              { key: 'includeHomework', label: 'Include homework', emoji: '📋', desc: 'Short practice assignment slide' },
            ].map(({ key, label, emoji, desc }) => {
              const val = form[key as keyof LessonFormData] as boolean;
              return (
                <button key={key} type="button"
                  onClick={() => setForm(f => ({ ...f, [key]: !val }))}
                  className="flex items-center gap-3 p-4 rounded-xl text-left transition-all"
                  style={{
                    background: val ? 'rgba(99,102,241,0.1)' : 'var(--app-bg)',
                    border: `1px solid ${val ? 'var(--app-accent)' : 'var(--app-border)'}`,
                  }}
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--app-text)' }}>{label}</div>
                    <div className="text-xs" style={{ color: 'var(--app-muted)' }}>{desc}</div>
                  </div>
                  <div className="w-11 h-6 rounded-full relative transition-colors" style={{ background: val ? 'var(--app-accent)' : 'var(--app-border)' }}>
                    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: val ? '22px' : '2px' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specific content (optional) */}
        <div className="rounded-xl p-6" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--app-muted)' }}>
            5. Specific Content <span className="normal-case font-normal">(optional)</span>
          </h2>
          <textarea
            value={form.specificContent}
            onChange={e => setForm(f => ({ ...f, specificContent: e.target.value }))}
            placeholder="Any specific words, grammar points, or content you want included? e.g. 'Include the words: cat, dog, bird, fish, horse' or 'Focus on was/were in past simple'"
            rows={3}
            className="w-full px-4 py-3 rounded-lg text-sm resize-none outline-none"
            style={{
              background: 'var(--app-bg)',
              color: 'var(--app-text)',
              border: '1px solid var(--app-border)',
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: canSubmit && !loading ? 'var(--app-accent)' : 'var(--app-border)' }}
        >
          {loading ? loadingMsg : '✨ Generate Lesson'}
        </button>
      </form>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6" style={{ background: 'rgba(15,23,42,0.92)' }}>
          <div className="text-6xl animate-bounce">🎓</div>
          <div className="text-xl font-semibold text-white text-center px-8">{loadingMsg}</div>
          <div className="text-sm" style={{ color: 'var(--app-muted)' }}>This usually takes 15–25 seconds</div>
          <div className="flex gap-2 mt-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--app-accent)', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
