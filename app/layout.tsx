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
        <header style={{ background: 'var(--app-surface)', borderBottom: '1px solid var(--app-border)' }} className="sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <span className="text-2xl">🇬🇧</span>
              <div>
                <div className="text-base font-bold" style={{ color: 'var(--app-text)' }}>English Lesson Creator</div>
                <div className="text-xs" style={{ color: 'var(--app-muted)' }}>AI-Powered · Grades 1–8 · Israeli Curriculum</div>
              </div>
            </Link>
            <Link
              href="/create"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white no-underline"
              style={{ background: 'var(--app-accent)' }}
            >
              <span>＋</span> New Lesson
            </Link>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="py-4 text-center text-xs" style={{ color: 'var(--app-muted)', borderTop: '1px solid var(--app-border)' }}>
          English Lesson Creator · Powered by Claude AI
        </footer>
      </body>
    </html>
  );
}
