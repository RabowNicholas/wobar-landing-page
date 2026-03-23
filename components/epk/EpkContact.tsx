'use client'

interface EpkContactProps {
  bookingEmail?: string
}

export default function EpkContact({ bookingEmail }: EpkContactProps) {
  return (
    <section
      id="epk-contact"
      style={{ padding: 'var(--section-padding)' }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-0.03em',
            color: 'var(--color-white)',
          }}
        >
          CONTACT
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-white-dim)',
            letterSpacing: '0.06em',
            lineHeight: 1.8,
          }}
        >
          FOR BOOKINGS, PRESS INQUIRIES, AND LICENSING — REACH OUT DIRECTLY.
        </p>

        <a
          href={`mailto:${bookingEmail ?? 'booking@wobar.com'}`}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: 'var(--color-purple)',
            letterSpacing: '-0.01em',
            padding: '1.5rem 3rem',
            border: 'var(--border-purple)',
            display: 'inline-block',
            transition: 'background 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-purple-glow)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
        >
          {bookingEmail ?? 'booking@wobar.com'}
        </a>

        <div style={{ borderTop: 'var(--border-subtle)', paddingTop: '2rem' }}>
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-white-dim)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            ← BACK TO WOBAR.COM
          </a>
        </div>
      </div>
    </section>
  )
}
