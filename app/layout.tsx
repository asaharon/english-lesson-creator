import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'English Lesson Creator',
  description: 'AI-powered English lessons for Israeli elementary school students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">

        {/* ── Top announcement bar (EC101-style) ─────────────────────────── */}
        <div style={{ background: 'var(--app-accent)', color: '#fff', textAlign: 'center', fontSize: '0.8rem', padding: '0.45rem 1rem', fontWeight: 600, letterSpacing: '0.02em' }}>
          🇮🇱 Designed for Israeli Elementary School Teachers · Grades 1–8 · Powered by Claude AI
        </div>

        {/* ── Main dark-navy header ────────────────────────────────────────── */}
        <header style={{ background: 'linear-gradient(90deg, #0a2440 0%, #163d6f 100%)', borderBottom: '3px solid var(--app-accent)' }} className="sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <div style={{ background: 'var(--app-accent)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', flexShrink: 0 }}>
                🇬🇧
              </div>
              <div>
                <div className="text-base font-bold" style={{ color: '#fff', letterSpacing: '-0.01em' }}>
                  EnglishLesson<span style={{ color: 'var(--app-yellow)' }}>101</span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  AI-Powered · Israeli Curriculum
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6">
              {[
                { href: '/', label: 'My Lessons' },
                { href: '/create', label: 'Create Lesson' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-sm font-semibold no-underline"
                  style={{ color: 'rgba(255,255,255,0.72)' }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <Link
              href="/create"
              className="btn-red px-4 py-2 text-sm no-underline"
              style={{ borderRadius: '8px' }}
            >
              ＋ New Lesson
            </Link>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer style={{ background: 'linear-gradient(90deg, #0a2440 0%, #163d6f 100%)', borderTop: '3px solid var(--app-accent)', padding: '2rem 1.5rem' }}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div style={{ background: 'var(--app-accent)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🇬🇧</div>
              <div>
                <div className="text-sm font-bold" style={{ color: '#fff' }}>
                  EnglishLesson<span style={{ color: 'var(--app-yellow)' }}>101</span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Powered by Claude AI</div>
              </div>
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              AI-generated lessons for Israeli elementary school teachers · Grades 1–8
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
