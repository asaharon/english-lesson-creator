'use client';

import { useState, useEffect, useRef } from 'react';

const CODE        = (process.env.NEXT_PUBLIC_ACCESS_CODE ?? 'english101').toLowerCase().trim();
const STORAGE_KEY = 'elc_access_v1';

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus]   = useState<'loading' | 'locked' | 'unlocked'>('loading');
  const [input, setInput]     = useState('');
  const [error, setError]     = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Check localStorage on mount */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setStatus(stored === CODE ? 'unlocked' : 'locked');
  }, []);

  /* Focus input when lock screen appears */
  useEffect(() => {
    if (status === 'locked') setTimeout(() => inputRef.current?.focus(), 100);
  }, [status]);

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().toLowerCase() === CODE) {
      localStorage.setItem(STORAGE_KEY, CODE);
      setStatus('unlocked');
    } else {
      setError('Incorrect access code. Please try again.');
      setShaking(true);
      setInput('');
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(''), 3000);
      inputRef.current?.focus();
    }
  }

  /* Still checking localStorage */
  if (status === 'loading') return null;

  /* Already unlocked */
  if (status === 'unlocked') return <>{children}</>;

  /* ── Lock screen ─────────────────────────────────────────────────────────── */
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(150deg, #0a2440 0%, #163d6f 55%, #0d3057 100%)',
      padding: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background radial glow */}
      <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(56,132,220,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Floating decorative emojis */}
      {['📚','✏️','🎓','💬','📝','🌍'].map((em, i) => (
        <div key={i} style={{
          position: 'absolute', fontSize: '2.2rem', opacity: 0.07,
          top: `${[8,15,70,80,20,65][i]}%`,
          left: `${[5,88,4,90,45,50][i]}%`,
          transform: `rotate(${[-15,20,10,-20,5,-10][i]}deg)`,
          pointerEvents: 'none', userSelect: 'none',
        }}>{em}</div>
      ))}

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '24px',
        padding: '2.8rem 2.5rem 2.5rem',
        width: '100%', maxWidth: '420px',
        position: 'relative', zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        animation: shaking ? 'shake 0.45s ease' : 'none',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#c8202b', borderRadius: '16px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem' }}>
            🇬🇧
          </div>
          <div style={{ color: '#fff', fontSize: '1.55rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            EnglishLesson<span style={{ color: '#f6c90e' }}>101</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            AI-Powered · Israeli Curriculum
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
            🔒 Enter Access Code
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            This site is for authorised teachers only.<br />Enter the code to get started.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={tryUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Access code…"
            autoComplete="off"
            spellCheck={false}
            style={{
              width: '100%', padding: '0.95rem 1.1rem',
              borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
              textAlign: 'center', letterSpacing: '0.12em', textTransform: 'lowercase',
              background: 'rgba(255,255,255,0.12)',
              border: `2px solid ${error ? '#f87171' : 'rgba(255,255,255,0.2)'}`,
              color: '#fff', outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Error message */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '0.65rem 0.9rem', color: '#fca5a5', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={!input.trim()}
            style={{
              width: '100%', padding: '0.95rem', borderRadius: '12px',
              background: input.trim() ? '#c8202b' : 'rgba(255,255,255,0.15)',
              color: input.trim() ? '#fff' : 'rgba(255,255,255,0.4)',
              fontWeight: 900, fontSize: '1rem', border: 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              letterSpacing: '0.02em',
              boxShadow: input.trim() ? '0 4px 16px rgba(200,32,43,0.45)' : 'none',
            }}>
            Unlock →
          </button>
        </form>

        {/* Footer hint */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
          Don&apos;t have a code? Contact the site admin.
        </p>
      </div>

      {/* Shake keyframes */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-10px); }
          40%      { transform: translateX(10px); }
          60%      { transform: translateX(-8px); }
          80%      { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
