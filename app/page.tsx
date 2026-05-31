'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Presentation } from '@/types/lesson';

const BAND_CSS   = ['', 'grade-badge-1', 'grade-badge-2', 'grade-badge-3', 'grade-badge-4'];
const BAND_OF    = (g: number) => g <= 2 ? 1 : g <= 4 ? 2 : g <= 6 ? 3 : 4;
const BAND_LABEL = ['', 'Young Learners', 'Elementary', 'Pre-Intermediate', 'Intermediate'];
const TYPE_ICONS: Record<string, string> = {
  vocabulary: '📚', grammar: '📝', reading: '📖', speaking: '💬',
};

const FEATURES = [
  { icon: '📚', label: 'Vocabulary', color: '#3b82f6' },
  { icon: '📝', label: 'Grammar',    color: '#8b5cf6' },
  { icon: '📖', label: 'Reading',    color: '#10b981' },
  { icon: '💬', label: 'Speaking',   color: '#f59e0b' },
  { icon: '🎮', label: 'Games',      color: '#ec4899' },
  { icon: '🎵', label: 'Songs',      color: '#06b6d4' },
  { icon: '🖥',  label: 'Zoom-Ready', color: '#6366f1' },
  { icon: '📊', label: 'PPTX Export',color: '#c8202b' },
];

const LEVEL_FEATURES = [
  { icon: '🌱', band: 'Young Learners', grade: 'Gr 1–2', cefr: 'A1',       color: '#10b981', bg: '#ecfdf5' },
  { icon: '📘', band: 'Elementary',     grade: 'Gr 3–4', cefr: 'A1–A2',    color: '#3b82f6', bg: '#eff6ff' },
  { icon: '📗', band: 'Pre-Intermediate',grade:'Gr 5–6', cefr: 'A2',       color: '#f59e0b', bg: '#fffbeb' },
  { icon: '📙', band: 'Intermediate',   grade: 'Gr 7–8', cefr: 'A2–B1',    color: '#c8202b', bg: '#fff0f0' },
];

export default function Dashboard() {
  const [lessons, setLessons]   = useState<Presentation[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lessons');
      if (raw) setLessons(JSON.parse(raw));
    } catch { /* empty */ }
  }, []);

  function doDelete() {
    if (!deleteId) return;
    const updated = lessons.filter(l => l.id !== deleteId);
    setLessons(updated);
    localStorage.setItem('lessons', JSON.stringify(updated));
    localStorage.removeItem(`lesson_${deleteId}`);
    setDeleteId(null);
  }

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(150deg, #0a2440 0%, #163d6f 55%, #0d3057 100%)', padding: '4rem 1.5rem 4.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* subtle radial highlight */}
        <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(56,132,220,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="max-w-5xl mx-auto text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(246,201,14,0.15)', border: '1px solid rgba(246,201,14,0.35)',
            color: 'var(--app-yellow)', borderRadius: '999px',
            fontSize: '0.8rem', fontWeight: 700, padding: '0.35rem 1rem', marginBottom: '1.5rem',
            letterSpacing: '0.04em',
          }}>
            ✨ AI-POWERED ENGLISH LESSONS
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.1rem', letterSpacing: '-0.02em' }}>
            Create Engaging English Lessons<br />
            <span style={{ color: 'var(--app-yellow)' }}>for Every Grade Level</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', marginBottom: '2.2rem', maxWidth: '600px', margin: '0 auto 2.2rem', lineHeight: 1.7 }}>
            Generate complete 45-minute interactive presentations tailored to Israeli curriculum standards.
            Vocabulary, grammar, reading, speaking — all in one click.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/create" className="btn-red no-underline px-8 py-3.5 text-base" style={{ borderRadius: '10px', fontSize: '1rem', fontWeight: 800 }}>
              ✨ Create a Lesson — It&apos;s Free
            </Link>
            {lessons.length > 0 && (
              <a href="#lessons"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2rem', borderRadius: '10px', border: '2px solid rgba(147,197,253,0.45)', color: '#93c5fd', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', background: 'rgba(147,197,253,0.08)' }}>
                📂 My Lessons ({lessons.length})
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Level cards strip (EC101-style CEFR bands) ──────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #ddeef9 0%, var(--app-surface) 100%)', borderTop: '1px solid var(--app-border)', borderBottom: '1px solid var(--app-border)', padding: '0' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {LEVEL_FEATURES.map(({ icon, band, grade, cefr, color, bg }) => (
              <Link href="/create" key={band}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.4rem 1rem', gap: '0.3rem', textDecoration: 'none', borderRight: '1px solid var(--app-border)', background: 'transparent' }}
                className="hover:bg-blue-100"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.1rem' }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--app-text)' }}>{band}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--app-muted)' }}>{grade}</div>
                <span style={{ background: bg, color, borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.65rem', marginTop: '0.3rem', letterSpacing: '0.04em' }}>{cefr}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature chips ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--app-bg)', padding: '2rem 1.5rem 1.5rem' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2.5">
            {FEATURES.map(({ icon, label, color }) => (
              <span key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                background: '#ddeef9', border: '1.5px solid var(--app-border)',
                borderRadius: '999px', padding: '0.45rem 1.1rem',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--app-text)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <span style={{ fontSize: '1rem' }}>{icon}</span>
                <span>{label}</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Saved lessons ────────────────────────────────────────────────── */}
      <section id="lessons" style={{ padding: '2rem 1.5rem 4rem', background: 'var(--app-bg)' }}>
        <div className="max-w-5xl mx-auto">

          {lessons.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--app-text)', marginBottom: '0.15rem' }}>
                    My Lessons
                  </h2>
                  <p style={{ color: 'var(--app-muted)', fontSize: '0.9rem' }}>
                    {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
                <Link href="/create" className="btn-red no-underline px-4 py-2 text-sm">
                  ＋ New Lesson
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...lessons].reverse().map(lesson => {
                  const band = BAND_OF(lesson.grade);
                  return (
                    <div key={lesson.id} className="lesson-card rounded-xl flex flex-col overflow-hidden"
                      style={{ background: 'var(--app-surface)', border: '1.5px solid var(--app-border)', boxShadow: '0 2px 10px rgba(30,60,100,0.08)' }}>

                      {/* Card colour strip */}
                      <div style={{ height: '5px', background: band === 1 ? '#10b981' : band === 2 ? '#3b82f6' : band === 3 ? '#f59e0b' : '#c8202b' }} />

                      <div style={{ padding: '1.1rem 1.1rem 0.8rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-lg ${BAND_CSS[band]}`}>
                            Gr {lesson.grade} · {BAND_LABEL[band]}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--app-muted)' }}>
                            {new Date(lesson.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--app-text)', lineHeight: 1.3, marginBottom: '0.2rem' }}>
                            {lesson.title}
                          </h3>
                          <p style={{ fontSize: '0.82rem', color: 'var(--app-muted)' }}>{lesson.topic}</p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {lesson.lessonTypes.map(t => (
                            <span key={t} style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'var(--app-surface)', color: 'var(--app-muted)', border: '1px solid var(--app-border)', fontWeight: 600 }}>
                              {TYPE_ICONS[t]} {t}
                            </span>
                          ))}
                          <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '6px', background: 'var(--app-surface)', color: 'var(--app-muted)', border: '1px solid var(--app-border)', fontWeight: 600 }}>
                            🗂 {lesson.slides.length} slides
                          </span>
                        </div>

                        {/* Progress bar (total duration visual) */}
                        <div style={{ height: '4px', background: 'var(--app-border)', borderRadius: '999px', marginTop: 'auto' }}>
                          <div style={{ height: '100%', width: `${Math.min((lesson.totalDuration / 45) * 100, 100)}%`, background: 'var(--app-accent)', borderRadius: '999px' }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--app-muted)', marginTop: '-0.4rem' }}>
                          ⏱ {lesson.totalDuration} min
                        </div>
                      </div>

                      {/* Card footer */}
                      <div style={{ padding: '0.75rem 1.1rem', borderTop: '1px solid var(--app-border)', display: 'flex', gap: '0.6rem' }}>
                        <Link href={`/lesson/${lesson.id}`}
                          className="btn-red no-underline flex-1 text-center py-2.5 text-sm">
                          ▶ Present
                        </Link>
                        <button onClick={() => setDeleteId(lesson.id)}
                          style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--app-border)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Empty state */}
          {lessons.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem', background: 'var(--app-surface)', borderRadius: '20px', border: '2px dashed var(--app-border)', boxShadow: '0 2px 12px rgba(30,60,100,0.06)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--app-text)', marginBottom: '0.6rem' }}>
                Ready to create your first lesson?
              </h3>
              <p style={{ color: 'var(--app-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
                Pick a grade, choose a topic, and Claude will build<br />a complete 45-minute interactive lesson in seconds.
              </p>
              <Link href="/create" className="btn-red no-underline px-8 py-3.5 text-base" style={{ borderRadius: '10px', fontWeight: 800 }}>
                ✨ Create First Lesson
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Delete modal ─────────────────────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(22,32,53,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="rounded-2xl p-7 max-w-sm w-full" style={{ background: 'var(--app-surface)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid var(--app-border)' }}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--app-text)', textAlign: 'center', marginBottom: '0.5rem' }}>Delete this lesson?</h3>
            <p style={{ color: 'var(--app-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1.5px solid var(--app-border)', background: 'transparent', color: 'var(--app-text)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                Cancel
              </button>
              <button onClick={doDelete}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
