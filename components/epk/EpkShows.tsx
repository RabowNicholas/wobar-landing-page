interface NotableShow {
  date: string
  venue: string
  city: string
  note?: string
}

interface EpkShowsProps {
  shows?: NotableShow[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(d).toUpperCase()
}

export default function EpkShows({ shows }: EpkShowsProps) {
  const items = shows ?? []

  return (
    <section
      id="epk-shows"
      style={{ padding: 'var(--section-padding)' }}
    >
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            letterSpacing: '-0.02em',
            marginBottom: '3rem',
            color: 'var(--color-white)',
          }}
        >
          NOTABLE SHOWS
        </h2>

        {items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {['FABRIC — LONDON, UK', 'BERGHAIN — BERLIN, DE', 'TRESOR — BERLIN, DE'].map((label, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  gap: '2rem',
                  padding: '1.25rem 0',
                  borderTop: i === 0 ? 'var(--border-subtle)' : 'none',
                  borderBottom: 'var(--border-subtle)',
                  opacity: 0.4,
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-purple)', letterSpacing: '0.06em' }}>
                  [DATE]
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-white)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {items.map((show, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '2rem',
                  alignItems: 'center',
                  padding: '1.25rem 0',
                  borderTop: i === 0 ? 'var(--border-subtle)' : 'none',
                  borderBottom: 'var(--border-subtle)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-purple)', letterSpacing: '0.06em' }}>
                  {formatDate(show.date)}
                </span>
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-white)', display: 'block' }}>
                    {show.venue}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-white-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {show.city}
                  </span>
                </div>
                {show.note && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(240,240,240,0.3)', letterSpacing: '0.04em' }}>
                    {show.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
