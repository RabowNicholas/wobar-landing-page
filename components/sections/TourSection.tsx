'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SetDate {
  date: string
  venue: string
  city: string
  ticketUrl?: string
}

interface TourSectionProps {
  sets: SetDate[]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()
  const currentYear = new Date().getFullYear()
  if (d.getFullYear() !== currentYear) {
    return `${formatted} '${String(d.getFullYear()).slice(2)}`
  }
  return formatted
}

function TourRow({ set }: { set: SetDate }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div>
      <hr style={{ border: 'none', borderTop: '1px solid rgba(161,161,170,0.15)', margin: 0 }} />
      <Link
        href={set.ticketUrl || '#'}
        target={set.ticketUrl ? '_blank' : undefined}
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '44px',
          padding: '14px 0',
          cursor: set.ticketUrl ? 'pointer' : 'default',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: hovered ? 'var(--color-white)' : 'var(--color-white)',
          minWidth: '80px',
          transition: 'color 0.15s',
        }}>
          {formatDate(set.date)}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: hovered ? 'var(--color-white)' : 'var(--color-white-dim)',
          flex: 1,
          transition: 'color 0.15s',
        }}>
          {set.venue}
        </span>
        {set.ticketUrl && (
          <span style={{ color: 'var(--color-purple-bright)', fontSize: '0.9rem' }}>→</span>
        )}
      </Link>
    </div>
  )
}

export default function TourSection({ sets }: TourSectionProps) {
  const hasSets = sets && sets.length > 0

  return (
    <section id="section-tour" data-portal-section aria-labelledby="tour-label">
      <div className="layer-bg" style={{ position: 'absolute', inset: 0, background: 'transparent', willChange: 'transform, opacity, filter' }} />
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
          gap: '16px',
        }}
      >
        <span
          id="tour-label"
          data-entrance
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            color: 'var(--color-white-dim)',
            letterSpacing: '0.2em',
            textTransform: 'lowercase',
          }}
        >
          sets
        </span>

        <hr
          data-entrance
          style={{
            border: 'none',
            borderTop: `1px solid rgba(131, 24, 67, 0.3)`,
            margin: '4px 0',
          }}
        />

        {!hasSets ? (
          <div data-entrance style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-white-dim)' }}>
              no upcoming sets.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-white-dim)', fontStyle: 'italic' }}>
              the portal opens when it opens.
            </p>
          </div>
        ) : (
          <div data-entrance>
            {sets.map((set, i) => (
              <TourRow key={i} set={set} />
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  )
}
