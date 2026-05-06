'use client'

const SOCIALS = [
  {
    label: 'instagram',
    href: 'https://www.instagram.com/wobar.exe/',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'tiktok',
    href: 'https://www.tiktok.com/@wobar1',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
  {
    label: 'spotify',
    href: 'https://open.spotify.com/search/wobar',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: 'soundcloud',
    href: 'https://soundcloud.com/wobar',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M1.175 12.225c-.015.12.023.234.09.315l.02.025a.44.44 0 0 0 .315.135.44.44 0 0 0 .315-.135.44.44 0 0 0 .135-.315v-4.92a.44.44 0 0 0-.135-.315.44.44 0 0 0-.315-.135.44.44 0 0 0-.315.135.44.44 0 0 0-.135.315v4.92zm2.565 1.44a.44.44 0 0 0 .315.135.44.44 0 0 0 .315-.135.44.44 0 0 0 .135-.315V9.21a.44.44 0 0 0-.135-.315.44.44 0 0 0-.315-.135.44.44 0 0 0-.315.135.44.44 0 0 0-.135.315v4.14c0 .12.045.225.135.315zm2.565.36a.44.44 0 0 0 .315.135.44.44 0 0 0 .315-.135.44.44 0 0 0 .135-.315V8.49a.44.44 0 0 0-.135-.315.44.44 0 0 0-.315-.135.44.44 0 0 0-.315.135.44.44 0 0 0-.135.315v5.22c0 .12.045.225.135.315zm2.52.27a.44.44 0 0 0 .315.135.44.44 0 0 0 .315-.135.44.44 0 0 0 .135-.315V7.83a.44.44 0 0 0-.135-.315.44.44 0 0 0-.315-.135.44.44 0 0 0-.315.135.44.44 0 0 0-.135.315v5.88c0 .12.045.225.135.315zm2.52 0a.44.44 0 0 0 .315.135.44.44 0 0 0 .315-.135.44.44 0 0 0 .135-.315V7.11a.44.44 0 0 0-.135-.315.44.44 0 0 0-.315-.135.44.44 0 0 0-.315.135.44.44 0 0 0-.135.315v6.6c0 .12.045.225.135.315zm2.52 0a.44.44 0 0 0 .315.135.44.44 0 0 0 .315-.135.44.44 0 0 0 .135-.315V6.99a.44.44 0 0 0-.135-.315.44.44 0 0 0-.315-.135.44.44 0 0 0-.315.135.44.44 0 0 0-.135.315v6.72c0 .12.045.225.135.315zM22.59 9.885C22.26 7.2 20.01 5.1 17.25 5.1c-.81 0-1.575.195-2.25.54V13.5c0 .12.045.225.135.315a.44.44 0 0 0 .315.135h7.065C23.565 13.95 24 13.425 24 12.825c0-1.44-1.17-2.655-2.685-2.7-.24 0-.48.03-.72.09.03-.105.045-.21.045-.33 0-.9-.765-1.665-1.665-1.665-.09 0-.18.015-.27.03.105-.315.165-.645.165-.99 0-1.665-1.35-3-3.015-3-.435 0-.855.09-1.23.255.51.81.81 1.77.81 2.79"/>
      </svg>
    ),
  },
  {
    label: 'youtube',
    href: 'https://www.youtube.com/@wobar_music',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
]

const BOOKING_EMAIL = 'bookings@wobar.live'

export default function ConnectSection() {
  return (
    <section id="section-connect" data-portal-section aria-labelledby="connect-label">
      <div className="layer-bg" style={{ position: 'absolute', inset: 0, background: 'transparent', willChange: 'transform, opacity' }} />
      <div
        className="layer-content"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 24px',
          paddingBottom: 'max(40px, calc(env(safe-area-inset-bottom) + 24px))',
          willChange: 'transform, opacity',
        }}
      >
        <div />

        <div
          style={{
            maxWidth: '360px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <h2
            id="connect-label"
            data-entrance
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              lineHeight: 1.05,
            }}
          >
            FOLLOW.
          </h2>

          <ul
            data-entrance
            aria-label="Social links"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
            {SOCIALS.map(({ label, href, icon }) => (
              <li key={label} style={{ display: 'flex' }}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    flex: 1,
                    minHeight: 64,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    color: 'var(--color-white)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-purple-bright)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-white)' }}
                >
                  {icon}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.1em',
                    textTransform: 'lowercase',
                    color: 'var(--color-white-dim)',
                  }}>
                    {label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            data-entrance
            href={`mailto:${BOOKING_EMAIL}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-white-dim)',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              transition: 'color 0.15s',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-white)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-white-dim)' }}
          >
            bookings — {BOOKING_EMAIL}
          </a>
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          color: 'var(--color-white-dim)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          © 2026 WOBAR
        </p>
      </div>
    </section>
  )
}
