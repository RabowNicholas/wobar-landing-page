'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import LogoMark from '@/components/shared/LogoMark'

export default function HeroSection() {
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const scrollRef = useRef<HTMLSpanElement>(null)
  const [logoSize, setLogoSize] = useState(360)

  useEffect(() => {
    function updateLogoSize() {
      setLogoSize(Math.min(360, window.innerWidth - 32))
    }
    updateLogoSize()
    window.addEventListener('resize', updateLogoSize)
    return () => window.removeEventListener('resize', updateLogoSize)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const tl = gsap.timeline()

    tl.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)

    const letters = titleRef.current?.querySelectorAll('span')
    if (letters) {
      tl.fromTo(
        letters,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08 },
        0.2
      )
    }

    tl.fromTo(taglineRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.7)
    tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 0.6, duration: 0.4 }, 1.2)

    // Pulse between 0.6 and 0.4 — never drops below WCAG-safe contrast
    tl.to(scrollRef.current, {
      opacity: 0.4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  const titleLetters = 'WOBAR'.split('')

  return (
    <section id="section-hero" data-portal-section>
      <div className="layer-bg" style={{ position: 'absolute', inset: 0, background: 'transparent', willChange: 'transform, opacity' }} />
      <div
        className="layer-content"
        style={{
          position: 'absolute',
          inset: 0,
          willChange: 'transform, opacity',
        }}
      >
        {/* Logo — absolutely centered */}
        <div
          ref={logoRef}
          data-entrance
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <LogoMark size={logoSize} />
        </div>

        {/* Text — anchored below center */}
        <div
          style={{
            position: 'absolute',
            top: `calc(50% + ${logoSize / 2 + 30}px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <h1
            ref={titleRef}
            data-entrance
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 20vw, 8rem)',
              letterSpacing: '0.1em',
              lineHeight: 1,
              color: 'var(--color-white)',
              display: 'flex',
            }}
          >
            {titleLetters.map((letter, i) => (
              <span key={i} style={{ display: 'inline-block' }}>
                {letter}
              </span>
            ))}
          </h1>

          <p
            ref={taglineRef}
            data-entrance
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-white-dim)',
              letterSpacing: '0.05em',
            }}
          >
            the portal goes inward.
          </p>

          <span
            ref={scrollRef}
            data-entrance
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-white-dim)',
              marginTop: '16px',
              display: 'block',
            }}
          >
            ↓ enter
          </span>
        </div>
      </div>
    </section>
  )
}
