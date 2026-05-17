'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Presentation, getGradeBand } from '@/types/lesson';
import { SlideRenderer } from '@/components/SlideRenderer';

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title: '🎓 Title', warmup: '🌅 Warm-up', objectives: '🎯 Objectives',
  vocabulary: '📚 Vocabulary', grammar: '📝 Grammar', reading: '📖 Reading',
  speaking: '💬 Speaking', activity: '⭐ Activity', game: '🎮 Game',
  song: '🎵 Song', practice: '✏️ Practice', wrapup: '🏁 Wrap-up', homework: '📋 Homework',
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(`lesson_${id}`);
      if (raw) {
        setPresentation(JSON.parse(raw));
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [id, router]);

  const goTo = useCallback((idx: number) => {
    if (!presentation) return;
    setCurrent(Math.max(0, Math.min(idx, presentation.slides.length - 1)));
  }, [presentation]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goTo(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes(s => !s);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, goTo]);

  async function handleExport() {
    if (!presentation) return;
    setExporting(true);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presentation),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentation.title}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setExporting(false);
    }
  }

  if (!presentation) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--app-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  const band = getGradeBand(presentation.grade);
  const slide = presentation.slides[current];
  const total = presentation.slides.length;
  const isFirst = current === 0;
  const isLast = current === total - 1;
  const progress = ((current + 1) / total) * 100;

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--app-surface)', borderBottom: '1px solid var(--app-border)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: 'var(--app-muted)', textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          ← Dashboard
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: 'var(--app-text)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{presentation.title}</div>
          <div style={{ color: 'var(--app-muted)', fontSize: '0.75rem' }}>
            Grade {presentation.grade} · {SLIDE_TYPE_LABELS[slide?.type] ?? slide?.type}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowNotes(s => !s)}
            style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--app-border)', background: showNotes ? 'var(--app-accent)' : 'var(--app-bg)', color: showNotes ? '#fff' : 'var(--app-muted)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            📝 Notes {showNotes ? '▼' : '▲'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--app-border)', background: 'var(--app-bg)', color: 'var(--app-muted)', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', opacity: exporting ? 0.6 : 1 }}
          >
            {exporting ? '⏳ Exporting…' : '⬇ PPTX'}
          </button>
        </div>
        <span style={{ color: 'var(--app-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          {current + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'var(--app-border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: 'var(--app-accent)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Slide thumbnails sidebar */}
        <div style={{ width: '140px', background: 'var(--app-surface)', borderRight: '1px solid var(--app-border)', overflowY: 'auto', flexShrink: 0 }} className="hidden md:block">
          {presentation.slides.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{
                width: '100%', padding: '0.5rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: i === current ? 'rgba(99,102,241,0.2)' : 'transparent',
                borderLeft: i === current ? '3px solid var(--app-accent)' : '3px solid transparent',
              }}
            >
              <div style={{ fontSize: '0.65rem', color: i === current ? '#a5b4fc' : 'var(--app-muted)', fontWeight: i === current ? 700 : 400, marginBottom: '0.1rem' }}>
                {i + 1}. {SLIDE_TYPE_LABELS[s.type]?.split(' ')[1] ?? s.type}
              </div>
              <div style={{ fontSize: '0.7rem', color: i === current ? 'var(--app-text)' : 'var(--app-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.title}
              </div>
            </button>
          ))}
        </div>

        {/* Slide + navigation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', background: '#0a0a0a', gap: '0.75rem' }}>
            {/* Prev arrow */}
            <button onClick={() => goTo(current - 1)} disabled={isFirst}
              style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--app-border)', background: isFirst ? 'transparent' : 'var(--app-surface)', color: isFirst ? 'var(--app-border)' : 'var(--app-text)', fontSize: '1.2rem', cursor: isFirst ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ‹
            </button>

            {/* Slide */}
            <div style={{ flex: 1, maxWidth: 'min(calc(100% - 120px), calc((100vh - 220px) * 16 / 9))', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.8)', position: 'relative' }}>
              {slide && <SlideRenderer slide={slide} band={band} />}
            </div>

            {/* Next arrow */}
            <button onClick={() => goTo(current + 1)} disabled={isLast}
              style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--app-border)', background: isLast ? 'transparent' : 'var(--app-surface)', color: isLast ? 'var(--app-border)' : 'var(--app-text)', fontSize: '1.2rem', cursor: isLast ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ›
            </button>
          </div>

          {/* Teacher notes panel */}
          {showNotes && slide?.teacherNotes && (
            <div style={{ background: '#1a1a2e', borderTop: '2px solid #6366f1', padding: '0.75rem 1.25rem', flexShrink: 0, maxHeight: '140px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                📝 Teacher Notes
              </div>
              <p style={{ margin: 0, color: '#c7d2fe', fontSize: '0.88rem', lineHeight: 1.6 }}>{slide.teacherNotes}</p>
            </div>
          )}
          {showNotes && !slide?.teacherNotes && (
            <div style={{ background: '#1a1a2e', borderTop: '2px solid #6366f1', padding: '0.75rem 1.25rem', flexShrink: 0 }}>
              <p style={{ margin: 0, color: 'var(--app-muted)', fontSize: '0.85rem' }}>No teacher notes for this slide.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation dots + keyboard hint */}
      <div style={{ background: 'var(--app-surface)', borderTop: '1px solid var(--app-border)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        {/* Dot navigation */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '60%' }}>
          {presentation.slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{ width: i === current ? '20px' : '8px', height: '8px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: i === current ? 'var(--app-accent)' : 'var(--app-border)', transition: 'all 0.2s', padding: 0, flexShrink: 0 }}
            />
          ))}
        </div>
        <div style={{ color: 'var(--app-muted)', fontSize: '0.72rem' }}>
          ← → arrows · N = notes
        </div>
      </div>

      {/* Mobile slide menu toggle */}
      {showMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column' }} onClick={() => setShowMenu(false)}>
          <div style={{ background: 'var(--app-surface)', maxHeight: '70vh', overflowY: 'auto', borderRadius: '0 0 16px 16px' }} onClick={e => e.stopPropagation()}>
            {presentation.slides.map((s, i) => (
              <button key={i} onClick={() => { goTo(i); setShowMenu(false); }}
                style={{ width: '100%', padding: '0.85rem 1.25rem', border: 'none', borderBottom: '1px solid var(--app-border)', cursor: 'pointer', textAlign: 'left', background: i === current ? 'rgba(99,102,241,0.15)' : 'transparent', color: 'var(--app-text)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--app-muted)', marginRight: '0.5rem' }}>{i + 1}.</span>
                {SLIDE_TYPE_LABELS[s.type] ?? s.type} — {s.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
