'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'

export interface Release {
  name: string
  releaseType: string
  coverArt?: any
  soundcloudUrl?: string
  spotifyUrl?: string
  youtubeUrl?: string
}

interface MusicSectionProps {
  featured: Release | null
  catalog: Release[]
}

// ── Cover art ─────────────────────────────────────────────────────────────────

function CoverArt({ release, size }: { release: Release; size: number }) {
  if (release.coverArt) {
    return (
      <div style={{ width: size, height: size, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <Image
          src={urlFor(release.coverArt).width(size * 2).height(size * 2).url()}
          alt={release.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        background: 'linear-gradient(135deg, #1A0533 0%, #2D0F4A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/logo-white.png"
        alt=""
        width={size}
        height={size}
        style={{ width: '55%', height: '55%', objectFit: 'contain', opacity: 0.18 }}
      />
    </div>
  )
}

// ── Catalog row ───────────────────────────────────────────────────────────────

function CatalogRow({ release }: { release: Release }) {
  const [hovered, setHovered] = useState(false)
  const streamingUrl = release.spotifyUrl ?? release.soundcloudUrl ?? release.youtubeUrl

  const inner = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '44px', padding: '10px 0', width: '100%' }}>
      <CoverArt release={release} size={44} />
      <p style={{
        flex: 1,
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        color: hovered ? 'var(--color-white)' : 'rgba(248,248,248,0.75)',
        lineHeight: 1.2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}>
        {release.name}
      </p>
    </div>
  )

  return (
    <li
      style={{ listStyle: 'none', borderTop: '1px solid rgba(161,161,170,0.1)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {streamingUrl ? (
        <Link href={streamingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          {inner}
        </Link>
      ) : inner}
    </li>
  )
}

// ── Featured release ──────────────────────────────────────────────────────────

function FeaturedRelease({ release }: { release: Release }) {
  const streamingUrl = release.spotifyUrl ?? release.soundcloudUrl ?? release.youtubeUrl

  const coverArtContent = release.coverArt ? (
    <Image
      src={urlFor(release.coverArt).width(720).height(720).url()}
      alt={release.name}
      fill
      style={{ objectFit: 'cover' }}
      priority
    />
  ) : (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1A0533 0%, #2D0F4A 50%, #1A0533 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image
        src="/logo-white.png"
        alt=""
        width={360}
        height={360}
        style={{ width: '50%', height: '50%', objectFit: 'contain', opacity: 0.15 }}
      />
    </div>
  )

  const coverStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    aspectRatio: '1',
    position: 'relative',
    overflow: 'hidden',
  }

  return (
    <div data-entrance style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {streamingUrl ? (
        <Link href={streamingUrl} target="_blank" rel="noopener noreferrer" style={{ ...coverStyle, cursor: 'pointer' }}>
          {coverArtContent}
        </Link>
      ) : (
        <div style={coverStyle}>
          {coverArtContent}
        </div>
      )}

      <div style={{ padding: '12px 0 0' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 6vw, 1.8rem)',
          textTransform: 'uppercase',
          color: 'var(--color-white)',
          lineHeight: 1.05,
        }}>
          {release.name}
        </h2>
      </div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function MusicSection({ featured, catalog }: MusicSectionProps) {
  return (
    <section id="section-music" data-portal-section aria-labelledby="music-label">
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
            position: 'relative',
          }}
        >
          <span
            id="music-label"
            data-entrance
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--color-white-dim)',
              letterSpacing: '0.2em',
              textTransform: 'lowercase',
            }}
          >
            catalog
          </span>

          {featured && <FeaturedRelease release={featured} />}

          {catalog && catalog.length > 0 && (
            <div style={{ position: 'relative' }}>
              <ul
                data-entrance
                aria-label="Catalog"
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  borderBottom: '1px solid rgba(161,161,170,0.1)',
                  overflowY: 'auto',
                  maxHeight: 'calc(100dvh - 320px)',
                  scrollbarWidth: 'none',
                }}
              >
                {catalog.map((release, i) => (
                  <CatalogRow key={i} release={release} />
                ))}
              </ul>
              {/* Bottom fade — indicates scrollable content below */}
              {catalog.length > 3 && (
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 56,
                    background: 'linear-gradient(to bottom, transparent, rgba(3,2,10,0.95))',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
