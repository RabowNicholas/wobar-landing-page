'use client'

import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { id: 'epk-hero', label: 'HOME' },
  { id: 'epk-bio', label: 'BIO' },
  { id: 'epk-music', label: 'MUSIC' },
  { id: 'epk-shows', label: 'SHOWS' },
  { id: 'epk-press', label: 'PRESS' },
  { id: 'epk-contact', label: 'CONTACT' },
]

export default function EpkNav() {
  const [active, setActive] = useState('epk-hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { threshold: 0.4 }
    )
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: 'var(--border-subtle)',
        padding: '0 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          gap: '0',
        }}
      >
        {NAV_ITEMS.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '1rem 1.5rem',
              whiteSpace: 'nowrap',
              color: active === item.id ? 'var(--color-purple)' : 'var(--color-white-dim)',
              borderBottom: active === item.id ? '2px solid var(--color-purple)' : '2px solid transparent',
              transition: 'color 0.3s, border-color 0.3s',
              flexShrink: 0,
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
