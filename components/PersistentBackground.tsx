'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// The 5 act backgrounds stacked — opacity driven by scroll position
const layers: React.CSSProperties[] = [
  // Act 1 — RIFT
  {
    background:
      'radial-gradient(ellipse 60% 60% at 50% 50%, #6B21A8 0%, #1A0533 50%, #050508 100%)',
    animation: 'pulse-glow 4s ease-in-out infinite',
  },
  // Act 2 — DESCENSION
  {
    background: [
      'radial-gradient(ellipse 80% 40% at 20% 80%, #0891B2 0%, transparent 60%)',
      'radial-gradient(ellipse 60% 60% at 80% 20%, #6B21A8 0%, transparent 50%)',
      'radial-gradient(ellipse 100% 100% at 50% 50%, #1A0533 0%, #050508 80%)',
    ].join(', '),
  },
  // Act 3 — ENCOUNTER
  {
    background: '#050508',
    backgroundImage: [
      'radial-gradient(circle at 50% 50%, transparent calc(15% - 1px), rgba(131,24,67,0.12) 15%, transparent calc(15% + 1px))',
      'radial-gradient(circle at 50% 50%, transparent calc(30% - 1px), rgba(131,24,67,0.09) 30%, transparent calc(30% + 1px))',
      'radial-gradient(circle at 50% 50%, transparent calc(45% - 1px), rgba(131,24,67,0.06) 45%, transparent calc(45% + 1px))',
      'radial-gradient(circle at 50% 50%, transparent calc(60% - 1px), rgba(131,24,67,0.04) 60%, transparent calc(60% + 1px))',
      'radial-gradient(circle at 50% 50%, transparent calc(75% - 1px), rgba(131,24,67,0.03) 75%, transparent calc(75% + 1px))',
    ].join(', '),
  },
  // Act 4 — RELEASE
  {
    background: [
      'radial-gradient(circle at 50% 50%, #7C3AED 0%, transparent 35%)',
      'radial-gradient(circle at 50% 50%, #0891B2 0%, transparent 55%)',
      'radial-gradient(circle at 50% 50%, #D97706 0%, transparent 75%)',
      '#050508',
    ].join(', '),
    animation: 'burst-rings 3s ease-in-out infinite',
  },
  // Act 5 — INTEGRATION
  {
    background:
      'radial-gradient(ellipse 60% 60% at 50% 50%, #6B21A8 0%, #1A0533 50%, #050508 100%)',
    animation: 'pulse-close 6s ease-in-out infinite',
  },
]

// Section IDs in order — must match id attributes on each section
const SECTION_IDS = [
  'section-hero',
  'section-transmission',
  'section-tour',
  'section-music',
  'section-capture',
]

export default function PersistentBackground() {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Wait one tick for sections to be in the DOM
    const ctx = gsap.context(() => {
      SECTION_IDS.forEach((id, i) => {
        if (i === 0) return // layer 0 starts visible, no trigger needed

        const section = document.getElementById(id)
        const prevLayer = layerRefs.current[i - 1]
        const currLayer = layerRefs.current[i]
        if (!section || !prevLayer || !currLayer) return

        // Crossfade: prev fades out, current fades in as section enters viewport
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 15%',
            scrub: 1.5,
          },
        })
          .to(prevLayer, { opacity: 0, ease: 'none' }, 0)
          .to(currLayer, { opacity: 1, ease: 'none' }, 0)
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      {layers.map((style, i) => (
        <div
          key={i}
          ref={el => { layerRefs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === 0 ? 1 : 0,
            willChange: 'opacity',
            ...style,
          }}
        />
      ))}
    </div>
  )
}
