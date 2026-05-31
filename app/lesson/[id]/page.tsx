'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Presentation, VocabularyContent, ActivityContent, getGradeBand } from '@/types/lesson';
import { SlideRenderer } from '@/components/SlideRenderer';

// ─── Client-side image pre-fetcher ───────────────────────────────────────────
// Fetches all Wikipedia images in the browser (bypasses server network blocks)
// and attaches base64 data to a deep-cloned copy of the presentation.

async function fetchAsBase64(topic: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.trim())}`
    );
    if (!r.ok) return null;
    const data = await r.json() as { thumbnail?: { source: string } };
    const url = data?.thumbnail?.source;
    if (!url || url.toLowerCase().endsWith('.svg')) return null;

    const ir = await fetch(url);
    if (!ir.ok) return null;
    const blob = await ir.blob();
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

async function enrichWithImages(pres: Presentation): Promise<Presentation> {
  // Deep clone so we never mutate the localStorage copy
  const enriched: Presentation = JSON.parse(JSON.stringify(pres));
  const tasks: Promise<void>[] = [];

  for (const slide of enriched.slides) {
    // Slide-level image (title, bullets, reading, grammar, activity banners)
    if (slide.imageTopic && !slide._imgBase64) {
      tasks.push(fetchAsBase64(slide.imageTopic).then(img => {
        if (img) slide._imgBase64 = img;
      }));
    }
    // Vocabulary word images
    if (slide.content.type === 'vocabulary') {
      for (const word of (slide.content as VocabularyContent).words ?? []) {
        if (word.wikiTopic && !word._imgBase64) {
          const w = word;
          tasks.push(fetchAsBase64(w.wikiTopic!).then(img => {
            if (img) w._imgBase64 = img;
          }));
        }
      }
    }
    // Activity exercise per-instruction images
    if (slide.content.type === 'activity') {
      const ac = slide.content as ActivityContent;
      const topics = ac.instructionTopics ?? [];
      if (topics.some(Boolean) && !ac._instructionImgs?.length) {
        ac._instructionImgs = new Array(topics.length).fill(null);
        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i];
          const idx = i;
          if (topic) {
            tasks.push(fetchAsBase64(topic).then(img => {
              ac._instructionImgs![idx] = img;
            }));
          }
        }
      }
    }
  }

  await Promise.all(tasks);
  return enriched;
}

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
      // Step 1: fetch all Wikipedia images in the browser (avoids server network blocks)
      const enriched = await enrichWithImages(presentation);

      // Step 2: send enriched data (with embedded base64 images) to the export API
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
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
      {/* Top bar — light, EC101 style */}
      <div style={{ background: 'var(--app-surface)', borderBottom: '1px solid var(--app-border)', padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--app-muted)', textDecoration: 'none', fontSize: '0.82rem', whiteSpace: 'nowrap', fontWeight: 600, padding: '0.3rem 0.65rem', borderRadius: '7px', border: '1px solid var(--app-border)' }}>
          ← My Lessons
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: 'var(--app-text)', fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{presentation.title}</div>
          <div style={{ color: 'var(--app-muted)', fontSize: '0.72rem' }}>
            Grade {presentation.grade} · {SLIDE_TYPE_LABELS[slide?.type] ?? slide?.type}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowNotes(s => !s)}
            style={{ padding: '0.38rem 0.8rem', borderRadius: '8px', border: `1.5px solid ${showNotes ? 'var(--app-accent)' : 'var(--app-border)'}`, background: showNotes ? 'var(--app-accent)' : 'var(--app-surface)', color: showNotes ? '#fff' : 'var(--app-text)', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700 }}
          >
            📝 Notes {showNotes ? '▼' : '▲'}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{ padding: '0.38rem 0.8rem', borderRadius: '8px', border: '1.5px solid var(--app-border)', background: 'var(--app-surface)', color: 'var(--app-text)', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 700, opacity: exporting ? 0.6 : 1 }}
          >
            {exporting ? '⏳ Exporting…' : '⬇ PPTX'}
          </button>
        </div>
        <span style={{ color: 'var(--app-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap', fontWeight: 700 }}>
          {current + 1} / {total}
        </span>
      </div>

      {/* Progress bar — red accent */}
      <div style={{ height: '3px', background: 'var(--app-border)', flexShrink: 0 }}>
        <div style={{ height: '100%', background: 'var(--app-accent)', width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Slide thumbnails sidebar — light style */}
        <div style={{ width: '148px', background: 'var(--app-surface)', borderRight: '1px solid var(--app-border)', overflowY: 'auto', flexShrink: 0 }} className="hidden md:block">
          {presentation.slides.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{
                width: '100%', padding: '0.55rem 0.65rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: i === current ? 'var(--app-accent-light)' : 'transparent',
                borderLeft: `3px solid ${i === current ? 'var(--app-accent)' : 'transparent'}`,
                borderBottom: '1px solid var(--app-border)',
              }}
            >
              <div style={{ fontSize: '0.63rem', color: i === current ? 'var(--app-accent)' : 'var(--app-muted)', fontWeight: i === current ? 800 : 500, marginBottom: '0.1rem' }}>
                {i + 1}. {SLIDE_TYPE_LABELS[s.type]?.split(' ')[1] ?? s.type}
              </div>
              <div style={{ fontSize: '0.68rem', color: i === current ? 'var(--app-text)' : 'var(--app-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: i === current ? 700 : 400 }}>
                {s.title}
              </div>
            </button>
          ))}
        </div>

        {/* Slide + navigation */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', background: '#0d1520', gap: '0.75rem' }}>
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

          {/* Teacher notes panel — light, EC101-style */}
          {showNotes && slide?.teacherNotes && (
            <div style={{ background: 'var(--app-yellow-light)', borderTop: '2px solid var(--app-yellow)', padding: '0.75rem 1.25rem', flexShrink: 0, maxHeight: '140px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                📝 Teacher Notes
              </div>
              <p style={{ margin: 0, color: '#451a03', fontSize: '0.88rem', lineHeight: 1.65 }}>{slide.teacherNotes}</p>
            </div>
          )}
          {showNotes && !slide?.teacherNotes && (
            <div style={{ background: 'var(--app-yellow-light)', borderTop: '2px solid var(--app-yellow)', padding: '0.75rem 1.25rem', flexShrink: 0 }}>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.85rem' }}>No teacher notes for this slide.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation dots + keyboard hint */}
      <div style={{ background: 'var(--app-surface)', borderTop: '1px solid var(--app-border)', padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '60%' }}>
          {presentation.slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{ width: i === current ? '22px' : '8px', height: '8px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: i === current ? 'var(--app-accent)' : 'var(--app-border)', transition: 'all 0.2s', padding: 0, flexShrink: 0 }}
            />
          ))}
        </div>
        <div style={{ color: 'var(--app-muted)', fontSize: '0.7rem', fontWeight: 600 }}>
          ← → to navigate · N = notes
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
