import Link from 'next/link'

// Utility legal pages (privacy, SMS terms) — plain, readable, dark. Not part of
// the portal/scroll experience: these exist to be crawled (10DLC vetting names
// the LLC here) and read straight through. Normal vertical scroll, max-width text.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <main
      style={{
        minHeight: '100dvh',
        maxWidth: '680px',
        margin: '0 auto',
        padding: 'clamp(2rem, 8vw, 5rem) clamp(1.25rem, 5vw, 2rem) 6rem',
        color: 'var(--color-white)',
        lineHeight: 1.7,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-white-dim)',
          textDecoration: 'none',
        }}
      >
        ← wobar
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
          textTransform: 'uppercase',
          margin: '2rem 0 0.5rem',
          lineHeight: 1.05,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--color-white-dim)',
          letterSpacing: '0.05em',
          marginBottom: '2.5rem',
        }}
      >
        Last updated {updated}
      </p>

      <div className="legal-body">{children}</div>

      <style>{`
        .legal-body h2 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin: 2.25rem 0 0.75rem;
          color: var(--color-white);
        }
        .legal-body p { margin: 0 0 1rem; color: #D4D4D8; }
        .legal-body ul { margin: 0 0 1rem 1.25rem; color: #D4D4D8; }
        .legal-body li { margin: 0 0 0.4rem; }
        .legal-body a { color: var(--color-purple-bright); text-decoration: underline; }
        .legal-body strong { color: var(--color-white); }
        .legal-body code {
          font-family: var(--font-mono);
          background: rgba(124, 58, 237, 0.14);
          padding: 0.1em 0.4em;
          border-radius: 3px;
        }
      `}</style>
    </main>
  )
}
