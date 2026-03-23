import PlaceholderBlock from '@/components/shared/PlaceholderBlock'

interface PressPhoto {
  _key: string
  asset?: { url?: string }
  caption?: string
}

interface PressQuote {
  _key: string
  quote: string
  attribution: string
}

interface EpkPressProps {
  photos?: PressPhoto[]
  quotes?: PressQuote[]
}

export default function EpkPress({ photos, quotes }: EpkPressProps) {
  return (
    <section
      id="epk-press"
      style={{ padding: 'var(--section-padding)' }}
    >
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {/* Press Photos */}
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
              color: 'var(--color-white)',
            }}
          >
            PRESS PHOTOS
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {(photos && photos.length > 0 ? photos : [{ _key: '1' }, { _key: '2' }, { _key: '3' }]).map((photo) => (
              <div key={photo._key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {photo.asset?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.asset.url}
                    alt={(photo as PressPhoto).caption ?? 'Press photo'}
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <PlaceholderBlock label="Press Photo" height="auto" className="aspect-[4/3]" />
                )}
                {(photo as PressPhoto).caption && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-white-dim)', letterSpacing: '0.04em' }}>
                    {(photo as PressPhoto).caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Press Quotes */}
        {quotes && quotes.length > 0 && (
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                letterSpacing: '-0.02em',
                marginBottom: '2rem',
                color: 'var(--color-white)',
              }}
            >
              PRESS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {quotes.map(q => (
                <blockquote
                  key={q._key}
                  style={{
                    borderLeft: '2px solid var(--color-purple)',
                    paddingLeft: '1.5rem',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.05rem',
                      fontStyle: 'italic',
                      color: 'var(--color-white-dim)',
                      lineHeight: 1.7,
                      marginBottom: '0.75rem',
                    }}
                  >
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <cite
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--color-purple)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontStyle: 'normal',
                    }}
                  >
                    — {q.attribution}
                  </cite>
                </blockquote>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
