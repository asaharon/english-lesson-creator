'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LessonFormData, LessonType, getGradeBandLabel, Presentation } from '@/types/lesson';

const GRADE_COLORS = ['', '#10b981','#10b981','#3b82f6','#3b82f6','#f59e0b','#f59e0b','#c8202b','#c8202b'];
const GRADE_BG     = ['', '#ecfdf5','#ecfdf5','#eff6ff','#eff6ff','#fffbeb','#fffbeb','#fff0f0','#fff0f0'];

const LESSON_TYPES: { id: LessonType; label: string; emoji: string; desc: string; color: string }[] = [
  { id: 'vocabulary', label: 'Vocabulary', emoji: '📚', desc: 'New words, meanings & examples',    color: '#3b82f6' },
  { id: 'grammar',    label: 'Grammar',    emoji: '📝', desc: 'Rules, structures & patterns',       color: '#8b5cf6' },
  { id: 'reading',    label: 'Reading',    emoji: '📖', desc: 'Short texts & comprehension',         color: '#10b981' },
  { id: 'speaking',   label: 'Speaking',   emoji: '💬', desc: 'Dialogues & conversation practice',  color: '#f59e0b' },
];

const TOPIC_SUGGESTIONS = [
  'Farm Animals', 'My Family', 'Food & Drinks', 'Colors & Shapes', 'Weather',
  'School Supplies', 'Body Parts', 'Numbers 1–20', 'Feelings & Emotions', 'Clothes',
  'Present Continuous', 'Past Simple', 'There is / There are', 'Can / Can\'t',
  'Adjectives', 'Prepositions of Place', 'Daily Routine', 'Sports & Hobbies',
];

const LOADING_MSGS = [
  '🤔 Designing your lesson plan...',
  '📚 Selecting vocabulary and content...',
  '🎨 Building interactive slides...',
  '✨ Adding Zoom-friendly activities...',
  '🇮🇱 Adapting for Israeli curriculum...',
  '🎉 Almost ready!',
];

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<LessonFormData>({
    grade: 0, topic: '', lessonTypes: [],
    specificContent: '', includeGames: false, includeSongs: false, includeHomework: false,
  });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showSuggestions, setShowSugg]  = useState(false);
  const [loadingMsg, setLoadingMsg]     = useState('');

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
    if (!form.grade)              { setError('Please select a grade.'); return; }
    if (!form.topic.trim())       { setError('Please enter a lesson topic.'); return; }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');

      const presentation: Presentation = data;
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

  /* ── Step label helper ───────────────────────────────────────────────────── */
  function StepLabel({ n, label }: { n: number; label: string }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.1rem' }}>
        <span style={{ background: 'var(--app-accent)', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>{n}</span>
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--app-text)', letterSpacing: '-0.01em' }}>{label}</span>
      </div>
    );
  }

  return (
    <>
      {/* ── Page header strip ─────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(150deg, #0a2440 0%, #163d6f 55%, #0d3057 100%)', padding: '2.2rem 1.5rem 2.5rem', textAlign: 'center', borderBottom: '3px solid var(--app-accent)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(246,201,14,0.15)', border: '1px solid rgba(246,201,14,0.3)', color: 'var(--app-yellow)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.9rem', marginBottom: '1rem', letterSpacing: '0.04em' }}>
          ✨ AI LESSON GENERATOR
        </div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Create a New Lesson
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
          Fill in the details below — Claude generates a complete 45-minute presentation.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* ── 1. Grade ───────────────────────────────────────────────── */}
          <div style={{ background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', borderRadius: '14px', padding: '1.4rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <StepLabel n={1} label="Choose Grade" />
            <div className="grid grid-cols-8 gap-2 mb-3">
              {[1,2,3,4,5,6,7,8].map(g => (
                <button key={g} type="button" onClick={() => setForm(f => ({ ...f, grade: g }))}
                  className="h-12 rounded-xl font-bold text-base transition-all"
                  style={{
                    background: form.grade === g ? GRADE_COLORS[g] : 'var(--app-input-bg)',
                    color: form.grade === g ? '#fff' : 'var(--app-muted)',
                    border: `2px solid ${form.grade === g ? GRADE_COLORS[g] : 'var(--app-border)'}`,
                    transform: form.grade === g ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: form.grade === g ? `0 4px 12px ${GRADE_COLORS[g]}55` : 'none',
                  }}>
                  {g}
                </button>
              ))}
            </div>
            {form.grade > 0 ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: GRADE_BG[form.grade], border: `1.5px solid ${GRADE_COLORS[form.grade]}55`, borderRadius: '8px', padding: '0.4rem 0.9rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: GRADE_COLORS[form.grade], flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: GRADE_COLORS[form.grade] }}>
                  Grade {form.grade} · {getGradeBandLabel(form.grade)}
                </span>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--app-muted)' }}>Select a grade level (1–8)</p>
            )}
          </div>

          {/* ── 2. Topic ───────────────────────────────────────────────── */}
          <div style={{ background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', borderRadius: '14px', padding: '1.4rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <StepLabel n={2} label="Lesson Topic" />
            <div className="relative">
              <input
                type="text"
                value={form.topic}
                onChange={e => { setForm(f => ({ ...f, topic: e.target.value })); setShowSugg(false); }}
                onFocus={() => setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 150)}
                placeholder="e.g. Farm Animals, Present Continuous, My Family…"
                style={{
                  width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.95rem',
                  border: '1.5px solid var(--app-border)', outline: 'none', background: 'var(--app-input-bg)',
                  color: 'var(--app-text)',
                }}
              />
              {showSuggestions && !form.topic && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 20, maxHeight: '220px', overflowY: 'auto' }}>
                  {TOPIC_SUGGESTIONS.map(s => (
                    <button key={s} type="button"
                      style={{ width: '100%', textAlign: 'left', padding: '0.7rem 1rem', fontSize: '0.88rem', color: 'var(--app-text)', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--app-border)' }}
                      onMouseDown={() => { setForm(f => ({ ...f, topic: s })); setShowSugg(false); }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── 3. Lesson types ────────────────────────────────────────── */}
          <div style={{ background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', borderRadius: '14px', padding: '1.4rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <StepLabel n={3} label="Lesson Focus" />
            <p style={{ fontSize: '0.82rem', color: 'var(--app-muted)', marginBottom: '0.9rem', marginTop: '-0.6rem' }}>Select all that apply</p>
            <div className="grid grid-cols-2 gap-3">
              {LESSON_TYPES.map(({ id, label, emoji, desc, color }) => {
                const selected = form.lessonTypes.includes(id);
                return (
                  <button key={id} type="button" onClick={() => toggleType(id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '0.95rem 1rem',
                      borderRadius: '12px', textAlign: 'left', border: `2px solid ${selected ? color : 'var(--app-border)'}`,
                      background: selected ? `${color}12` : 'var(--app-input-bg)', cursor: 'pointer',
                    }}>
                    <span style={{ fontSize: '1.6rem', flexShrink: 0, lineHeight: 1 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: selected ? color : 'var(--app-text)', marginBottom: '0.15rem' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--app-muted)', lineHeight: 1.4 }}>{desc}</div>
                    </div>
                    {selected && (
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 4. Extras ──────────────────────────────────────────────── */}
          <div style={{ background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', borderRadius: '14px', padding: '1.4rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <StepLabel n={4} label="Extras" />
            <p style={{ fontSize: '0.82rem', color: 'var(--app-muted)', marginBottom: '0.9rem', marginTop: '-0.6rem' }}>Optional additions to your lesson</p>
            <div className="flex flex-col gap-3">
              {[
                { key: 'includeGames',    label: 'Include a game',        emoji: '🎮', desc: 'Zoom-friendly competitive activity' },
                { key: 'includeSongs',    label: 'Include a song or chant', emoji: '🎵', desc: 'Catchy repetition for vocabulary' },
                { key: 'includeHomework', label: 'Include homework',       emoji: '📋', desc: 'Short practice assignment slide' },
              ].map(({ key, label, emoji, desc }) => {
                const val = form[key as keyof LessonFormData] as boolean;
                return (
                  <button key={key} type="button"
                    onClick={() => setForm(f => ({ ...f, [key]: !val }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1rem',
                      borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                      border: `1.5px solid ${val ? 'var(--app-accent)' : 'var(--app-border)'}`,
                      background: val ? 'var(--app-accent-light)' : 'var(--app-input-bg)',
                    }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0, lineHeight: 1 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--app-text)' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--app-muted)' }}>{desc}</div>
                    </div>
                    {/* Toggle pill */}
                    <div style={{ width: '44px', height: '24px', borderRadius: '999px', background: val ? 'var(--app-accent)' : '#d1d5db', position: 'relative', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s', left: val ? '22px' : '2px' }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 5. Specific content ────────────────────────────────────── */}
          <div style={{ background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', borderRadius: '14px', padding: '1.4rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <StepLabel n={5} label="Specific Content" />
            <p style={{ fontSize: '0.82rem', color: 'var(--app-muted)', marginBottom: '0.9rem', marginTop: '-0.6rem' }}>Optional — any specific words or grammar points to include</p>
            <textarea
              value={form.specificContent}
              onChange={e => setForm(f => ({ ...f, specificContent: e.target.value }))}
              placeholder="e.g. 'Include the words: cat, dog, bird, fish, horse' or 'Focus on was/were in past simple'"
              rows={3}
              style={{
                width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.88rem',
                border: '1.5px solid var(--app-border)', outline: 'none', background: 'var(--app-input-bg)',
                color: 'var(--app-text)', resize: 'none',
              }}
            />
          </div>

          {/* ── Error ──────────────────────────────────────────────────── */}
          {error && (
            <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: '#fff0f0', border: '1.5px solid #fca5a5', color: '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── Submit ─────────────────────────────────────────────────── */}
          <button type="submit" disabled={!canSubmit || loading}
            style={{
              width: '100%', padding: '1.05rem', borderRadius: '12px', border: 'none', cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
              background: canSubmit && !loading ? 'var(--app-accent)' : '#e2e8f0',
              color: canSubmit && !loading ? '#fff' : '#94a3b8',
              fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.01em',
              boxShadow: canSubmit && !loading ? '0 4px 16px rgba(200,32,43,0.35)' : 'none',
            }}>
            {loading ? loadingMsg : '✨ Generate Lesson'}
          </button>

        </form>
      </div>

      {/* ── Loading overlay ───────────────────────────────────────────── */}
      {loading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'rgba(26,29,59,0.93)', backdropFilter: 'blur(6px)' }}>
          <div style={{ fontSize: '4.5rem', animation: 'bounce 1s infinite' }}>🎓</div>
          <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, textAlign: 'center', maxWidth: '400px', lineHeight: 1.4 }}>{loadingMsg}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>This usually takes 15–25 seconds</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--app-accent)', animation: `pulse 1s infinite ${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
