import LogoMark from '@/components/shared/LogoMark'
import PlaceholderBlock from '@/components/shared/PlaceholderBlock'

export default function EpkHero() {
  return (
    <section
      id="epk-hero"
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--section-padding)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <LogoMark size={80} />
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                color: 'var(--color-white)',
              }}
            >
              WOBAR
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-white-dim)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '1rem',
              }}
            >
              ELECTRONIC PRESS KIT · {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <PlaceholderBlock label="EPK Hero Image" height="400px" />
      </div>
    </section>
  )
}
