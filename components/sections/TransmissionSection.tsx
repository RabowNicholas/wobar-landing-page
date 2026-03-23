'use client'

export default function TransmissionSection() {
  return (
    <section id="section-transmission" data-portal-section aria-labelledby="transmission-label">
      <div className="layer-bg" style={{ position: 'absolute', inset: 0, background: 'transparent', willChange: 'transform, opacity' }} />
      <div
        className="layer-content"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          willChange: 'transform, opacity',
        }}
      >
      <div
        style={{
          maxWidth: '360px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <span
          id="transmission-label"
          data-entrance
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            color: 'var(--color-white-dim)',
            letterSpacing: '0.2em',
            textTransform: 'lowercase',
          }}
        >
          transmission
        </span>

        <blockquote
          data-entrance
          style={{
            borderLeft: '2px solid var(--color-purple-bright)',
            paddingLeft: '16px',
            margin: 0,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--color-white)',
            }}
          >
            Wobar opens portals through bass music. Dubstep, halftime, drum & bass, and experimental bass structured around the 5-Act Portal Framework — a journey architecture built on shadow work and somatic release. Based in Salt Lake City.
          </p>
        </blockquote>
      </div>
      </div>
    </section>
  )
}
