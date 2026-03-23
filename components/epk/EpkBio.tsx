'use client'

import { useState } from 'react'

interface EpkBioProps {
  bioShort?: string
  bioMedium?: string
  bioLong?: string
}

const FALLBACK_SHORT = `WOBAR is an electronic producer and DJ. Their music operates at the intersection of club pressure and structural experimentation.`

const FALLBACK_MEDIUM = `WOBAR is an electronic producer and DJ whose music operates at the intersection of club pressure and structural experimentation. Drawing from techno, industrial, and experimental traditions, their sets move between hypnotic repetition and sudden rupture — building pressure through carefully calibrated frequency relationships.`

const FALLBACK_LONG = `WOBAR is an electronic producer and DJ whose music operates at the intersection of club pressure and structural experimentation. Drawing from techno, industrial, and experimental traditions, their sets move between hypnotic repetition and sudden rupture — building pressure through carefully calibrated frequency relationships.

Their productions resist easy categorization: releases have appeared on [labels] and received support from [artists/publications]. Live and DJ sets balance technical precision with an intuitive understanding of dancefloor dynamics.

Available for bookings worldwide. Contact for festival, club, and special event inquiries.`

type BioLength = 'short' | 'medium' | 'long'

export default function EpkBio({ bioShort, bioMedium, bioLong }: EpkBioProps) {
  const [active, setActive] = useState<BioLength>('medium')
  const [copied, setCopied] = useState(false)

  const bios: Record<BioLength, string> = {
    short: bioShort ?? FALLBACK_SHORT,
    medium: bioMedium ?? FALLBACK_MEDIUM,
    long: bioLong ?? FALLBACK_LONG,
  }

  async function copyBio() {
    await navigator.clipboard.writeText(bios[active])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="epk-bio"
      style={{ padding: 'var(--section-padding)' }}
    >
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.02em',
              color: 'var(--color-white)',
            }}
          >
            BIO
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {(['short', 'medium', 'long'] as BioLength[]).map(len => (
              <button
                key={len}
                onClick={() => setActive(len)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.4rem 0.75rem',
                  background: active === len ? 'var(--color-purple)' : 'transparent',
                  color: active === len ? 'var(--color-white)' : 'var(--color-white-dim)',
                  border: active === len ? '1px solid var(--color-purple)' : 'var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            background: 'var(--color-off-black)',
            padding: '2rem',
            border: 'var(--border-subtle)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--color-white-dim)',
              whiteSpace: 'pre-line',
            }}
          >
            {bios[active]}
          </p>

          <button
            onClick={copyBio}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.75rem',
              background: 'transparent',
              color: copied ? 'var(--color-purple)' : 'var(--color-white-dim)',
              border: 'var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>
      </div>
    </section>
  )
}
