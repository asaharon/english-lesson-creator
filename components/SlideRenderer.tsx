'use client';

import { useState, useEffect, Fragment, type CSSProperties } from 'react';
import {
  Slide, GradeBand,
  TitleContent, BulletsContent, VocabularyContent,
  GrammarContent, ReadingContent, ActivityContent,
} from '@/types/lesson';

// ─── Theme ───────────────────────────────────────────────────────────────────

interface Theme {
  headerGrad: string;
  bg: string;
  card: string;
  border: string;
  accent: string;
  text: string;
  muted: string;
  pill: string;
  emojiRing: string;
  fs: { title: string; heading: string; body: string; sm: string; xs: string };
}

const THEMES: Record<GradeBand, Theme> = {
  1: {
    headerGrad: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    bg: '#fdf4ff', card: '#fff', border: '#e9d5ff',
    accent: '#a855f7', text: '#4c1d95', muted: '#7c3aed',
    pill: '#f3e8ff', emojiRing: '#ede9fe',
    fs: { title: '3rem', heading: '1.55rem', body: '1.2rem', sm: '1rem', xs: '0.75rem' },
  },
  2: {
    headerGrad: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)',
    bg: '#eff6ff', card: '#fff', border: '#bfdbfe',
    accent: '#2563eb', text: '#1e3a8a', muted: '#3b82f6',
    pill: '#dbeafe', emojiRing: '#dbeafe',
    fs: { title: '2.6rem', heading: '1.45rem', body: '1.1rem', sm: '0.95rem', xs: '0.73rem' },
  },
  3: {
    headerGrad: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
    bg: '#f0fdf4', card: '#fff', border: '#bbf7d0',
    accent: '#0d9488', text: '#064e3b', muted: '#0f766e',
    pill: '#d1fae5', emojiRing: '#d1fae5',
    fs: { title: '2.3rem', heading: '1.35rem', body: '1.05rem', sm: '0.9rem', xs: '0.72rem' },
  },
  4: {
    headerGrad: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    bg: '#f8fafc', card: '#fff', border: '#e2e8f0',
    accent: '#1e3a8a', text: '#0f172a', muted: '#475569',
    pill: '#e0e7ff', emojiRing: '#e0e7ff',
    fs: { title: '2rem', heading: '1.28rem', body: '1rem', sm: '0.88rem', xs: '0.70rem' },
  },
};

// ─── Twemoji CDN image (crisp SVG at any size, falls back to native) ─────────

function EmojiImg({ emoji, size, style }: { emoji: string; size: number; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false);

  const path = [...emoji]
    .map(c => c.codePointAt(0))
    .filter((cp): cp is number => cp !== undefined && cp !== 0xFE0F)
    .map(cp => cp.toString(16).toLowerCase())
    .join('-');

  const fallback = (
    <span style={{ fontSize: size, lineHeight: 1, display: 'inline-block', ...style }}>{emoji}</span>
  );

  if (failed || !path) return fallback;

  return (
    <img
      src={`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${path}.svg`}
      width={size} height={size} alt={emoji}
      onError={() => setFailed(true)}
      style={{ objectFit: 'contain', display: 'inline-block', flexShrink: 0, ...style }}
    />
  );
}

// ─── Scattered decorative emoji background (native for performance) ───────────

const SCATTER = [
  { t: '5%',  l: '3%',  s: 34, op: 0.13, rot: -15 },
  { t: '7%',  r: '4%',  s: 28, op: 0.10, rot:  20 },
  { t: '36%', l: '1%',  s: 38, op: 0.09, rot:   8 },
  { t: '58%', r: '2%',  s: 32, op: 0.11, rot: -10 },
  { b: '18%', l: '5%',  s: 36, op: 0.10, rot:  15 },
  { b: '5%',  r: '7%',  s: 26, op: 0.09, rot: -22 },
  { t: '47%', l: '45%', s: 22, op: 0.07, rot:  45 },
  { b: '30%', r: '22%', s: 24, op: 0.08, rot: -30 },
] as Array<{ t?: string; b?: string; l?: string; r?: string; s: number; op: number; rot: number }>;

function EmojiPattern({ emoji }: { emoji: string }) {
  return (
    <>
      {SCATTER.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: p.t, bottom: p.b, left: p.l, right: p.r,
          fontSize: p.s, opacity: p.op, transform: `rotate(${p.rot}deg)`,
          pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
        }}>
          {emoji}
        </div>
      ))}
    </>
  );
}

// ─── Wikipedia photo component ───────────────────────────────────────────────

type WikiStatus = 'loading' | 'ready' | 'error';

function WikiImage({
  topic, width, height, style, rounded = true, overlay = true,
}: {
  topic: string;
  width?: string | number;
  height?: string | number;
  style?: CSSProperties;
  rounded?: boolean;
  overlay?: boolean;
}) {
  const [src, setSrc]       = useState<string | null>(null);
  const [status, setStatus] = useState<WikiStatus>('loading');

  useEffect(() => {
    if (!topic) { setStatus('error'); return; }
    let cancelled = false;
    setStatus('loading');
    setSrc(null);

    // Try Wikimedia Commons featured image first via Wikipedia summary API
    const encoded = encodeURIComponent(topic.trim());
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (cancelled) return;
        const url = data?.thumbnail?.source ?? data?.originalimage?.source ?? null;
        if (url) { setSrc(url); setStatus('ready'); }
        else setStatus('error');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [topic]);

  const containerStyle: CSSProperties = {
    width: width ?? '100%',
    height: height ?? '100%',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: rounded ? '12px' : 0,
    background: '#e2e8f0',
    flexShrink: 0,
    ...style,
  };

  if (status === 'loading') {
    return (
      <div style={containerStyle}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg,#e2e8f0 25%,#f8fafc 50%,#e2e8f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
      </div>
    );
  }

  if (status === 'error' || !src) return null;

  return (
    <div style={containerStyle}>
      <img
        src={src}
        alt={topic}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={() => setStatus('error')}
      />
      {overlay && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.18) 100%)' }} />
      )}
    </div>
  );
}

// ─── Shared header bar ────────────────────────────────────────────────────────

function Header({ title, emoji, theme, duration }:
  { title: string; emoji?: string; theme: Theme; duration: number }) {
  return (
    <div style={{
      background: theme.headerGrad, padding: '0.65rem 1.1rem', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
        {emoji && (
          <div style={{ background: 'rgba(255,255,255,0.22)', borderRadius: '10px', padding: '0.3rem 0.35rem', display: 'flex', alignItems: 'center' }}>
            <EmojiImg emoji={emoji} size={30} />
          </div>
        )}
        <h2 style={{ margin: 0, color: '#fff', fontSize: theme.fs.heading, fontWeight: 700 }}>{title}</h2>
      </div>
      {duration > 0 && (
        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.22)', padding: '0.18rem 0.55rem', borderRadius: '999px', flexShrink: 0 }}>
          ⏱ {duration} min
        </span>
      )}
    </div>
  );
}

// ─── Extract leading emoji from a string ─────────────────────────────────────

function splitLeadEmoji(text: string): { lead: string | null; rest: string } {
  const m = text.match(/^([\p{Emoji}‍️]+)\s*/u);
  if (!m) return { lead: null, rest: text };
  return { lead: m[1], rest: text.slice(m[0].length) };
}

// ─── TITLE SLIDE ─────────────────────────────────────────────────────────────

function TitleSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as TitleContent;
  const mainEmoji = c.emoji ?? slide.emoji ?? '🎓';
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme.headerGrad, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Wikipedia photo as full-bleed background with heavy gradient overlay */}
      {slide.imageTopic && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <WikiImage topic={slide.imageTopic} rounded={false} overlay={false}
            style={{ width: '100%', height: '100%', borderRadius: 0, opacity: 0.28 }} />
          <div style={{ position: 'absolute', inset: 0, background: theme.headerGrad, opacity: 0.78 }} />
        </div>
      )}

      {!slide.imageTopic && <EmojiPattern emoji={mainEmoji} />}

      {/* Glowing illustration circle */}
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '1.1rem', marginBottom: '1.1rem', backdropFilter: 'blur(6px)', boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 0 0 6px rgba(255,255,255,0.12)' }}>
        <EmojiImg emoji={mainEmoji} size={110} />
      </div>

      <h1 style={{ position: 'relative', zIndex: 1, color: '#fff', fontSize: theme.fs.title, fontWeight: 900, lineHeight: 1.15, marginBottom: '0.65rem', textShadow: '0 3px 14px rgba(0,0,0,0.28)', maxWidth: '88%' }}>
        {slide.title}
      </h1>

      {slide.subtitle && (
        <p style={{ position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.87)', fontSize: theme.fs.body, marginBottom: '1.2rem', maxWidth: '78%' }}>
          {slide.subtitle}
        </p>
      )}

      {slide.duration > 0 && (
        <span style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 600 }}>
          ⏱ {slide.duration} min
        </span>
      )}
    </div>
  );
}

// ─── BULLETS SLIDE ────────────────────────────────────────────────────────────

function BulletsSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as BulletsContent;
  const headerEmoji = slide.emoji ?? c.emoji;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={headerEmoji} theme={theme} duration={slide.duration} />

      {/* Illustration ribbon — photo on right + emoji cascade on left */}
      <div style={{ background: theme.pill, borderBottom: `1px solid ${theme.border}`, padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.7rem', minHeight: '56px' }}>
        {headerEmoji && <EmojiImg emoji={headerEmoji} size={44} />}
        <div style={{ height: '2px', flex: 1, background: `linear-gradient(90deg, ${theme.accent}55, transparent)`, borderRadius: 999 }} />
        {headerEmoji && <EmojiImg emoji={headerEmoji} size={32} style={{ opacity: 0.45 }} />}
        {headerEmoji && <EmojiImg emoji={headerEmoji} size={20} style={{ opacity: 0.22 }} />}
        {slide.imageTopic && (
          <WikiImage topic={slide.imageTopic}
            style={{ width: '72px', height: '48px', borderRadius: '8px', border: `2px solid ${theme.border}`, flexShrink: 0 }}
            rounded={true} overlay={false} />
        )}
      </div>

      <div style={{ flex: 1, padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.55rem', overflowY: 'auto' }}>
        {(c.bullets ?? []).map((b, i) => {
          const { lead, rest } = splitLeadEmoji(b);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '0.7rem 1rem', boxShadow: '0 1px 5px rgba(0,0,0,0.05)', borderLeft: `4px solid ${theme.accent}` }}>
              {lead
                ? <EmojiImg emoji={lead} size={32} style={{ flexShrink: 0 }} />
                : <span style={{ background: theme.headerGrad, color: '#fff', minWidth: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 700 }}>{i + 1}</span>
              }
              <span style={{ color: theme.text, fontSize: theme.fs.body, lineHeight: 1.55 }}>{rest || b}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VOCABULARY SLIDE (flashcard layout) ─────────────────────────────────────

function VocabularySlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as VocabularyContent;
  const words = c.words ?? [];
  const cols  = words.length <= 2 ? words.length : words.length <= 4 ? 2 : 3;
  const imgSz = words.length <= 2 ? 100 : words.length <= 4 ? 84 : 64;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? '📚'} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '0.75rem', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.65rem', overflowY: 'auto' }}>
        {words.map((w, i) => (
          <div key={i} style={{ background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '18px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>

            {/* Photo/Emoji panel */}
            <div style={{ borderBottom: `1px solid ${theme.border}`, position: 'relative', overflow: 'hidden', height: words.length <= 2 ? '130px' : words.length <= 4 ? '110px' : '90px', background: theme.pill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Wikipedia photo behind emoji */}
              {w.wikiTopic && (
                <div style={{ position: 'absolute', inset: 0 }}>
                  <WikiImage topic={w.wikiTopic} rounded={false}
                    style={{ width: '100%', height: '100%', borderRadius: 0, opacity: 1 }} />
                  {/* gradient fade at bottom so text is readable */}
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(255,255,255,0) 40%, ${theme.pill} 100%)` }} />
                </div>
              )}
              {/* Faint ghost emoji (behind photo or alone) */}
              {w.emoji && !w.wikiTopic && (
                <span style={{ position: 'absolute', fontSize: imgSz * 1.4, opacity: 0.07, transform: 'rotate(-10deg) translate(-15%, 10%)', pointerEvents: 'none', lineHeight: 1 }}>
                  {w.emoji}
                </span>
              )}
              {/* Emoji badge */}
              <div style={{ background: w.wikiTopic ? 'rgba(255,255,255,0.92)' : theme.emojiRing, borderRadius: '50%', padding: '0.45rem', boxShadow: `0 6px 20px ${theme.accent}35`, display: 'inline-flex', position: 'relative', zIndex: 2, border: w.wikiTopic ? `2px solid ${theme.border}` : 'none' }}>
                {w.emoji
                  ? <EmojiImg emoji={w.emoji} size={w.wikiTopic ? Math.round(imgSz * 0.6) : imgSz} />
                  : <span style={{ fontSize: imgSz, lineHeight: 1 }}>📝</span>
                }
              </div>
            </div>

            {/* Word */}
            <div style={{ padding: '0.55rem 0.75rem 0.2rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 900, color: theme.accent, fontSize: theme.fs.body, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {w.word}
              </div>
            </div>

            {/* Definition */}
            <div style={{ padding: '0.15rem 0.75rem', textAlign: 'center' }}>
              <p style={{ margin: 0, color: theme.muted, fontSize: theme.fs.sm, fontStyle: 'italic', lineHeight: 1.4 }}>
                {w.definition}
              </p>
            </div>

            {/* Example */}
            {w.example && (
              <div style={{ margin: '0.35rem 0.55rem 0.65rem', background: theme.pill, borderRadius: '10px', padding: '0.35rem 0.65rem', textAlign: 'center', borderTop: `1px dashed ${theme.border}` }}>
                <p style={{ margin: 0, color: theme.text, fontSize: theme.fs.sm, lineHeight: 1.45 }}>
                  ❝ {w.example} ❞
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GRAMMAR SLIDE ────────────────────────────────────────────────────────────

const PILL_COLORS = ['#6366f1', '#0891b2', '#059669', '#f59e0b', '#ec4899'];

function GrammarSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as GrammarContent;
  const parts = c.structure ? c.structure.split(/\s*\+\s*/) : [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? '📝'} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '0.9rem 1.15rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', overflowY: 'auto' }}>

        {/* Rule */}
        <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '14px', padding: '0.7rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
          <EmojiImg emoji="💡" size={26} style={{ flexShrink: 0, marginTop: 3 }} />
          <div>
            <div style={{ fontSize: theme.fs.xs, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>Rule</div>
            <p style={{ margin: 0, color: '#451a03', fontSize: theme.fs.body, fontWeight: 600, lineHeight: 1.45 }}>{c.rule}</p>
          </div>
        </div>

        {/* Visual structure formula */}
        {parts.length > 0 && (
          <div style={{ background: '#fff', border: `2px solid ${theme.border}`, borderRadius: '14px', padding: '0.7rem 1rem' }}>
            <div style={{ fontSize: theme.fs.xs, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.55rem' }}>
              📐 Structure
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {parts.map((part, i) => (
                <Fragment key={i}>
                  <span style={{ background: PILL_COLORS[i % PILL_COLORS.length], color: '#fff', borderRadius: '10px', padding: '0.45rem 0.9rem', fontSize: theme.fs.body, fontWeight: 800, boxShadow: `0 4px 10px ${PILL_COLORS[i % PILL_COLORS.length]}55`, letterSpacing: '0.02em' }}>
                    {part}
                  </span>
                  {i < parts.length - 1 && (
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: theme.accent }}>＋</span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        <div>
          <div style={{ fontSize: theme.fs.xs, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.4rem' }}>Examples</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {(c.examples ?? []).map((ex, i) => (
              <div key={i} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '0.48rem 0.85rem', display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
                <EmojiImg emoji="✅" size={20} style={{ flexShrink: 0 }} />
                <span style={{ color: theme.text, fontSize: theme.fs.body }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── READING SLIDE ────────────────────────────────────────────────────────────

function ReadingSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as ReadingContent;
  const hasPhoto = !!slide.imageTopic;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? '📖'} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '0.9rem 1.1rem', display: 'flex', gap: '0.8rem', overflowY: 'auto' }}>

        {/* Reading passage */}
        <div style={{ flex: '0 0 57%', background: '#fffef7', border: '2px solid #fde68a', borderRadius: '16px', padding: '0.9rem 1.1rem', display: 'flex', flexDirection: 'column', boxShadow: '3px 4px 14px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.55rem', borderBottom: '1px dashed #fde68a', paddingBottom: '0.45rem' }}>
            <EmojiImg emoji="📖" size={22} />
            <span style={{ fontSize: theme.fs.xs, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Read</span>
          </div>
          <p style={{ margin: 0, color: '#1c1917', fontSize: theme.fs.body, lineHeight: 1.8 }}>{c.text}</p>
        </div>

        {/* Right column: photo + questions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Wikipedia photo for the reading topic */}
          {hasPhoto && (
            <WikiImage topic={slide.imageTopic!}
              style={{ width: '100%', height: '110px', borderRadius: '12px', border: `2px solid ${theme.border}`, flexShrink: 0 }}
              rounded={true} overlay={true} />
          )}

          {/* Questions */}
          {(c.questions ?? []).length > 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.1rem' }}>
                <EmojiImg emoji="🤔" size={22} />
                <span style={{ fontSize: theme.fs.xs, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Questions</span>
              </div>
              {c.questions.map((q, i) => (
                <div key={i} style={{ background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '0.5rem 0.8rem', display: 'flex', gap: '0.55rem', alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <span style={{ background: theme.headerGrad, color: '#fff', minWidth: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: theme.text, fontSize: theme.fs.sm, lineHeight: 1.5 }}>{q}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── ACTIVITY / GAME / SONG SLIDE ─────────────────────────────────────────────

function ActivitySlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as ActivityContent;
  const typeEmoji: Record<string, string> = { game: '🎮', song: '🎵', discussion: '💬', exercise: '✏️' };
  const mainEmoji = slide.emoji ?? typeEmoji[c.activityType] ?? '⭐';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={mainEmoji} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '0.75rem 1.05rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto' }}>

        {/* Central illustrated banner */}
        <div style={{ background: theme.pill, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', left: '-10px', fontSize: 70, opacity: 0.08, transform: 'rotate(-15deg)', lineHeight: 1, pointerEvents: 'none' }}>{mainEmoji}</span>
          <EmojiImg emoji={mainEmoji} size={68} />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: theme.fs.body, fontWeight: 800, color: theme.accent, textTransform: 'capitalize' }}>{c.activityType}</div>
            <div style={{ fontSize: theme.fs.xs, color: theme.muted }}>Follow the steps below</div>
          </div>
          <EmojiImg emoji={mainEmoji} size={42} style={{ opacity: 0.5 }} />
          {/* Wikipedia photo pill on the right of banner */}
          {slide.imageTopic && (
            <WikiImage topic={slide.imageTopic}
              style={{ width: '80px', height: '56px', borderRadius: '10px', border: `2px solid ${theme.border}`, flexShrink: 0, position: 'relative', zIndex: 2 }}
              rounded={true} overlay={false} />
          )}
          <span style={{ position: 'absolute', right: '-10px', fontSize: 70, opacity: 0.08, transform: 'rotate(15deg)', lineHeight: 1, pointerEvents: 'none' }}>{mainEmoji}</span>
        </div>

        {/* Instructions */}
        <div>
          <div style={{ fontSize: theme.fs.xs, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.38rem' }}>Instructions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
            {(c.instructions ?? []).map((step, i) => {
              const { lead, rest } = splitLeadEmoji(step);
              return (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '0.5rem 0.85rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  {lead
                    ? <EmojiImg emoji={lead} size={26} style={{ flexShrink: 0 }} />
                    : <span style={{ background: theme.headerGrad, color: '#fff', minWidth: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  }
                  <span style={{ color: theme.text, fontSize: theme.fs.body, lineHeight: 1.5 }}>{rest || step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Song lyrics / game content */}
        {c.content && (
          <div style={{ background: 'rgba(255,255,255,0.9)', border: `2px dashed ${theme.border}`, borderRadius: '14px', padding: '0.7rem 1rem', flexShrink: 0 }}>
            <p style={{ margin: 0, color: theme.text, fontSize: theme.fs.sm, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{c.content}</p>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function SlideRenderer({ slide, band }: { slide: Slide; band: GradeBand }) {
  const theme = THEMES[band];
  const ct = slide.content?.type;

  if (slide.type === 'title' || ct === 'title') return <TitleSlide slide={slide} theme={theme} />;
  if (ct === 'vocabulary')                       return <VocabularySlide slide={slide} theme={theme} />;
  if (ct === 'grammar')                          return <GrammarSlide slide={slide} theme={theme} />;
  if (ct === 'reading')                          return <ReadingSlide slide={slide} theme={theme} />;
  if (ct === 'activity')                         return <ActivitySlide slide={slide} theme={theme} />;
  return <BulletsSlide slide={slide} theme={theme} />;
}
