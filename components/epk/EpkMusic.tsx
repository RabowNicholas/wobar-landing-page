import PlaceholderBlock from '@/components/shared/PlaceholderBlock'

interface EpkTrack {
  title: string
  act_label?: string
  cover_art?: { asset?: { url?: string } }
  smart_link_url?: string
}

interface EpkMusicProps {
  tracks?: EpkTrack[]
}

export default function EpkMusic({ tracks }: EpkMusicProps) {
  const items = tracks ?? []

  return (
    <section
      id="epk-music"
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
          MUSIC
        </h2>

        {items.length === 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '2rem',
            }}
          >
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <PlaceholderBlock label={`Track ${i}`} height="auto" className="aspect-square" />
                <div>
                  <div style={{ height: '1rem', background: 'rgba(123,47,255,0.1)', borderRadius: 2, marginBottom: '0.5rem' }} />
                  <div style={{ height: '0.7rem', width: '50%', background: 'rgba(123,47,255,0.05)', borderRadius: 2, marginBottom: '0.75rem' }} />
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--color-purple)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    STREAM →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '2rem',
            }}
          >
            {items.map((track, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {track.cover_art?.asset?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.cover_art.asset.url}
                    alt={track.title}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                  />
                ) : (
                  <PlaceholderBlock label="Cover" height="auto" className="aspect-square" />
                )}
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--color-white)' }}>
                    {track.title}
                  </p>
                  {track.act_label && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-white-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.25rem' }}>
                      {track.act_label}
                    </p>
                  )}
                  {track.smart_link_url && (
                    <a
                      href={track.smart_link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--color-purple)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      STREAM →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
