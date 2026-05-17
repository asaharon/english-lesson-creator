'use client';

import {
  Slide, GradeBand,
  TitleContent, BulletsContent, VocabularyContent,
  GrammarContent, ReadingContent, ActivityContent,
} from '@/types/lesson';

interface Theme {
  headerGrad: string;
  headerText: string;
  bg: string;
  card: string;
  border: string;
  accent: string;
  accentText: string;
  text: string;
  muted: string;
  pill: string;
  fontSize: { title: string; heading: string; body: string; small: string };
}

const THEMES: Record<GradeBand, Theme> = {
  1: {
    headerGrad: 'linear-gradient(135deg, #a855f7, #ec4899)',
    headerText: '#fff',
    bg: '#faf5ff',
    card: '#fff',
    border: '#e9d5ff',
    accent: '#a855f7',
    accentText: '#fff',
    text: '#4c1d95',
    muted: '#7c3aed',
    pill: '#f3e8ff',
    fontSize: { title: '3rem', heading: '1.6rem', body: '1.25rem', small: '1.05rem' },
  },
  2: {
    headerGrad: 'linear-gradient(135deg, #1d4ed8, #0891b2)',
    headerText: '#fff',
    bg: '#eff6ff',
    card: '#fff',
    border: '#bfdbfe',
    accent: '#2563eb',
    accentText: '#fff',
    text: '#1e3a8a',
    muted: '#3b82f6',
    pill: '#dbeafe',
    fontSize: { title: '2.5rem', heading: '1.5rem', body: '1.15rem', small: '1rem' },
  },
  3: {
    headerGrad: 'linear-gradient(135deg, #0d9488, #059669)',
    headerText: '#fff',
    bg: '#f0fdf4',
    card: '#fff',
    border: '#bbf7d0',
    accent: '#0d9488',
    accentText: '#fff',
    text: '#064e3b',
    muted: '#0f766e',
    pill: '#d1fae5',
    fontSize: { title: '2.2rem', heading: '1.4rem', body: '1.1rem', small: '0.95rem' },
  },
  4: {
    headerGrad: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
    headerText: '#fff',
    bg: '#f8fafc',
    card: '#fff',
    border: '#e2e8f0',
    accent: '#1e3a8a',
    accentText: '#fff',
    text: '#0f172a',
    muted: '#475569',
    pill: '#e0e7ff',
    fontSize: { title: '2rem', heading: '1.3rem', body: '1rem', small: '0.9rem' },
  },
};

function Header({ title, emoji, theme, duration }: { title: string; emoji?: string; theme: Theme; duration: number }) {
  return (
    <div style={{ background: theme.headerGrad, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexShrink: 0 }}>
      <h2 style={{ margin: 0, color: theme.headerText, fontSize: theme.fontSize.heading, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {emoji && <span>{emoji}</span>}
        {title}
      </h2>
      {duration > 0 && (
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
          ⏱ {duration} min
        </span>
      )}
    </div>
  );
}

function TitleSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as TitleContent;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme.headerGrad, padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{c.emoji ?? '🎓'}</div>
      <h1 style={{ color: '#fff', fontSize: theme.fontSize.title, fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: theme.fontSize.body, marginBottom: '1rem' }}>
          {slide.subtitle}
        </p>
      )}
      {slide.duration > 0 && (
        <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.9rem' }}>
          ⏱ {slide.duration} min
        </span>
      )}
    </div>
  );
}

function BulletsSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as BulletsContent;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? c.emoji} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem', overflowY: 'auto' }}>
        {(c.bullets ?? []).map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '0.85rem 1.1rem', borderLeft: `4px solid ${theme.accent}` }}>
            <span style={{ background: theme.accent, color: theme.accentText, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 700 }}>{i + 1}</span>
            <span style={{ color: theme.text, fontSize: theme.fontSize.body, lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VocabularySlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as VocabularyContent;
  const words = c.words ?? [];
  const cols = words.length <= 2 ? words.length : words.length <= 4 ? 2 : 3;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? '📚'} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '1rem', display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.75rem', overflowY: 'auto' }}>
        {words.map((w, i) => (
          <div key={i} style={{ background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '14px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ background: theme.pill, padding: '0.5rem 0.75rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {w.emoji && <span style={{ fontSize: theme.fontSize.heading }}>{w.emoji}</span>}
              <span style={{ fontWeight: 800, color: theme.accent, fontSize: theme.fontSize.body }}>{w.word}</span>
            </div>
            <div style={{ padding: '0.6rem 0.75rem', flex: 1 }}>
              <p style={{ margin: '0 0 0.4rem', color: theme.muted, fontSize: theme.fontSize.small, fontStyle: 'italic' }}>{w.definition}</p>
              {w.example && (
                <p style={{ margin: 0, color: theme.text, fontSize: theme.fontSize.small, borderTop: `1px dashed ${theme.border}`, paddingTop: '0.4rem' }}>
                  &ldquo;{w.example}&rdquo;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as GrammarContent;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? '📝'} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto' }}>
        {/* Rule */}
        <div style={{ background: theme.pill, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '0.85rem 1.1rem', borderLeft: `5px solid ${theme.accent}` }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.accent, textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>Rule</div>
          <p style={{ margin: 0, color: theme.text, fontSize: theme.fontSize.body, fontWeight: 600 }}>{c.rule}</p>
        </div>
        {/* Structure */}
        {c.structure && (
          <div style={{ background: theme.headerGrad, borderRadius: '12px', padding: '0.85rem 1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>Structure</div>
            <code style={{ color: '#fff', fontSize: theme.fontSize.heading, fontWeight: 800, letterSpacing: '0.03em' }}>{c.structure}</code>
          </div>
        )}
        {/* Examples */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.accent, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Examples</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {(c.examples ?? []).map((ex, i) => (
              <div key={i} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '0.6rem 0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: theme.accent, fontSize: '1.1rem' }}>→</span>
                <span style={{ color: theme.text, fontSize: theme.fontSize.body }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadingSlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as ReadingContent;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={slide.emoji ?? '📖'} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto' }}>
        {/* Reading text */}
        <div style={{ background: theme.card, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '1rem 1.2rem', flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.accent, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Read</div>
          <p style={{ margin: 0, color: theme.text, fontSize: theme.fontSize.body, lineHeight: 1.7 }}>{c.text}</p>
        </div>
        {/* Questions */}
        {(c.questions ?? []).length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.accent, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Questions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {c.questions.map((q, i) => (
                <div key={i} style={{ background: theme.pill, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '0.55rem 0.9rem', display: 'flex', gap: '0.6rem' }}>
                  <span style={{ background: theme.accent, color: '#fff', minWidth: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: theme.text, fontSize: theme.fontSize.small }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivitySlide({ slide, theme }: { slide: Slide; theme: Theme }) {
  const c = slide.content as ActivityContent;
  const typeEmoji: Record<string, string> = { game: '🎮', song: '🎵', discussion: '💬', exercise: '✏️' };
  const emoji = slide.emoji ?? typeEmoji[c.activityType] ?? '⭐';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg }}>
      <Header title={slide.title} emoji={emoji} theme={theme} duration={slide.duration} />
      <div style={{ flex: 1, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto' }}>
        {/* Instructions */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.accent, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Instructions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {(c.instructions ?? []).map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '0.6rem 0.9rem' }}>
                <span style={{ background: theme.headerGrad, color: '#fff', minWidth: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ color: theme.text, fontSize: theme.fontSize.body, paddingTop: '3px' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Content (song lyrics, game content, etc.) */}
        {c.content && (
          <div style={{ background: theme.pill, border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '0.9rem 1.1rem' }}>
            <p style={{ margin: 0, color: theme.text, fontSize: theme.fontSize.body, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SlideRenderer({ slide, band }: { slide: Slide; band: GradeBand }) {
  const theme = THEMES[band];
  const ct = slide.content?.type;

  if (slide.type === 'title' || ct === 'title') return <TitleSlide slide={slide} theme={theme} />;
  if (ct === 'vocabulary') return <VocabularySlide slide={slide} theme={theme} />;
  if (ct === 'grammar') return <GrammarSlide slide={slide} theme={theme} />;
  if (ct === 'reading') return <ReadingSlide slide={slide} theme={theme} />;
  if (ct === 'activity') return <ActivitySlide slide={slide} theme={theme} />;
  return <BulletsSlide slide={slide} theme={theme} />;
}
