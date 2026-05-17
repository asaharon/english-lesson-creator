'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Presentation } from '@/types/lesson';

const BAND_COLORS = ['', 'grade-badge-1', 'grade-badge-2', 'grade-badge-3', 'grade-badge-4'];
const BAND_OF = (g: number) => g <= 2 ? 1 : g <= 4 ? 2 : g <= 6 ? 3 : 4;

const TYPE_ICONS: Record<string, string> = {
  vocabulary: '📚', grammar: '📝', reading: '📖', speaking: '💬',
};

export default function Dashboard() {
  const [lessons, setLessons] = useState<Presentation[]>([]);
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--app-text)' }}>
          English Lesson Creator
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--app-muted)' }}>
          AI-powered interactive presentations · Israeli Curriculum · Grades 1–8
        </p>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-base no-underline"
          style={{ background: 'var(--app-accent)' }}
        >
          ✨ Create New Lesson
        </Link>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {['📚 Vocabulary', '📝 Grammar', '📖 Reading', '💬 Speaking', '🎮 Games', '🎵 Songs', '🖥 Zoom-Ready', '📊 PPTX Export'].map(f => (
          <span key={f} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'var(--app-surface)', color: 'var(--app-muted)', border: '1px solid var(--app-border)' }}>
            {f}
          </span>
        ))}
      </div>

      {/* Saved lessons */}
      {lessons.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--app-text)' }}>
            Saved Lessons <span className="font-normal text-sm" style={{ color: 'var(--app-muted)' }}>({lessons.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...lessons].reverse().map(lesson => (
              <div key={lesson.id} className="rounded-xl p-5 flex flex-col gap-3" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-lg ${BAND_COLORS[BAND_OF(lesson.grade)]}`}>
                    Grade {lesson.grade}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--app-muted)' }}>
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base leading-snug" style={{ color: 'var(--app-text)' }}>{lesson.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--app-muted)' }}>{lesson.topic}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {lesson.lessonTypes.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--app-bg)', color: 'var(--app-muted)' }}>
                      {TYPE_ICONS[t]} {t}
                    </span>
                  ))}
                  <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--app-bg)', color: 'var(--app-muted)' }}>
                    🗂 {lesson.slides.length} slides
                  </span>
                </div>
                <div className="flex gap-2 mt-auto pt-1">
                  <Link href={`/lesson/${lesson.id}`} className="flex-1 text-center py-2 rounded-lg text-sm font-semibold text-white no-underline" style={{ background: 'var(--app-accent)' }}>
                    ▶ Present
                  </Link>
                  <button onClick={() => setDeleteId(lesson.id)} className="px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--app-bg)', color: '#ef4444', border: '1px solid var(--app-border)' }}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lessons.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{ border: '2px dashed var(--app-border)' }}>
          <div className="text-5xl mb-4">📋</div>
          <p className="text-xl font-semibold mb-2" style={{ color: 'var(--app-text)' }}>No lessons yet</p>
          <p className="mb-7 text-base" style={{ color: 'var(--app-muted)' }}>Create your first AI-powered English lesson!</p>
          <Link href="/create" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold no-underline" style={{ background: 'var(--app-accent)' }}>
            ✨ Create First Lesson
          </Link>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="rounded-2xl p-7 max-w-sm w-full" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--app-text)' }}>Delete this lesson?</h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--app-muted)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--app-bg)', color: 'var(--app-text)', border: '1px solid var(--app-border)' }}>
                Cancel
              </button>
              <button onClick={doDelete} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#ef4444' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
