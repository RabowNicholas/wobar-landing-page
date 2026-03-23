'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

const ACTS = [
  { label: 'ACT I',   subtitle: 'RIFT',        color: '#6B21A8' },
  { label: 'ACT II',  subtitle: 'DESCENSION',  color: '#0891B2' },
  { label: 'ACT III', subtitle: 'ENCOUNTER',   color: '#831843' },
  { label: 'ACT IV',  subtitle: 'RELEASE',     color: '#D97706' },
  { label: 'ACT V',   subtitle: 'INTEGRATION', color: '#4B0082' },
]

// How far (as fraction of viewport height) you need to drag for full transition
const DRAG_FULL_RATIO = 0.4
// Minimum progress to auto-complete on release
const COMPLETE_THRESHOLD = 0.35
// Minimum velocity (px/ms) to auto-complete regardless of progress
const VELOCITY_THRESHOLD = 0.4

export default function ScrollTest() {
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Active drag state — lives in a ref so event handlers always see current value
  const drag = useRef<{
    startY: number
    lastY: number
    lastT: number
    direction: 1 | -1
    targetIdx: number
    tl: gsap.core.Timeline
    snapTween: gsap.core.Tween | null
  } | null>(null)

  // Keep currentRef in sync
  useEffect(() => {
    currentRef.current = current
  }, [current])

  // Reset all sections to clean state when current changes
  useEffect(() => {
    sectionRefs.current.forEach((el, i) => {
      if (!el) return
      const visible = i === current
      gsap.set(el, { opacity: visible ? 1 : 0, zIndex: visible ? 1 : 0 })
      gsap.set(el.querySelector('.layer-bg'), { scale: 1, filter: 'blur(0px)', opacity: visible ? 1 : 0 })
      gsap.set(el.querySelector('.layer-content'), { scale: 1, opacity: visible ? 1 : 0 })
    })
  }, [current])

  // Build a paused timeline between two sections
  const buildTimeline = useCallback((fromIdx: number, toIdx: number, dir: 1 | -1) => {
    const outEl = sectionRefs.current[fromIdx]
    const inEl = sectionRefs.current[toIdx]
    if (!outEl || !inEl) return null

    const outBg = outEl.querySelector<HTMLElement>('.layer-bg')
    const outContent = outEl.querySelector<HTMLElement>('.layer-content')
    const inBg = inEl.querySelector<HTMLElement>('.layer-bg')
    const inContent = inEl.querySelector<HTMLElement>('.layer-content')

    // Stage incoming section
    gsap.set(inEl, { opacity: 1, scale: 1, zIndex: 2 })
    gsap.set(inBg, { scale: dir > 0 ? 0.3 : 2.2, filter: 'blur(24px)', opacity: 0 })
    gsap.set(inContent, { scale: dir > 0 ? 0.7 : 1.3, opacity: 0 })

    gsap.set(outEl, { zIndex: 3 })
    gsap.set(outBg, { scale: 1, filter: 'blur(0px)', opacity: 1 })
    gsap.set(outContent, { scale: 1, opacity: 1 })

    const tl = gsap.timeline({ paused: true })

    // Outgoing BG — blasts away (far plane)
    tl.to(outBg, {
      scale: dir > 0 ? 2.4 : 0.3,
      filter: 'blur(48px)',
      opacity: 0,
      ease: 'none',
      duration: 1,
    }, 0)

    // Outgoing content — subtle drift (near plane, barely moves)
    tl.to(outContent, {
      scale: dir > 0 ? 1.12 : 0.9,
      opacity: 0,
      ease: 'none',
      duration: 1,
    }, 0)

    // Incoming BG — rockets in from deep
    tl.to(inBg, {
      scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      ease: 'none',
      duration: 1,
    }, 0)

    // Incoming content — lags behind BG, floats in last
    tl.to(inContent, {
      scale: 1,
      opacity: 1,
      ease: 'none',
      duration: 1,
    }, 0.12)

    return tl
  }, [])

  // Finalize after a completed or cancelled transition
  const finalize = useCallback((completed: boolean) => {
    const d = drag.current
    if (!d) return

    const fromIdx = currentRef.current
    const toIdx = d.targetIdx
    const outEl = sectionRefs.current[fromIdx]
    const inEl = sectionRefs.current[toIdx]

    const resetEl = (el: HTMLElement | null, visible: boolean) => {
      if (!el) return
      gsap.set(el, { opacity: visible ? 1 : 0, zIndex: visible ? 1 : 0 })
      gsap.set(el.querySelector('.layer-bg'), { scale: 1, filter: 'blur(0px)', opacity: visible ? 1 : 0 })
      gsap.set(el.querySelector('.layer-content'), { scale: 1, opacity: visible ? 1 : 0 })
    }

    if (completed) {
      resetEl(outEl, false)
      resetEl(inEl, true)
      currentRef.current = toIdx
      setCurrent(toIdx)
    } else {
      resetEl(outEl, true)
      resetEl(inEl, false)
    }

    drag.current = null
  }, [])

  // Snap timeline to 0 or 1 with easing, then finalize
  const snapTo = useCallback((tl: gsap.core.Timeline, targetProgress: 0 | 1) => {
    const completed = targetProgress === 1
    gsap.to(tl, {
      progress: targetProgress,
      duration: 0.45,
      ease: 'power3.out',
      onComplete: () => finalize(completed),
    })
  }, [finalize])

  // Touch events
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      // Block new drag if one is already settling
      if (drag.current) return

      drag.current = {
        startY: e.touches[0].clientY,
        lastY: e.touches[0].clientY,
        lastT: Date.now(),
        direction: 1,     // placeholder, set on first move
        targetIdx: -1,
        tl: null!,
        snapTween: null,
      }
    }

    function onTouchMove(e: TouchEvent) {
      const d = drag.current
      if (!d) return

      const y = e.touches[0].clientY
      const dy = d.startY - y // positive = swiping up = going forward

      // On first meaningful movement, lock direction and build timeline
      if (!d.tl && Math.abs(dy) > 6) {
        const dir: 1 | -1 = dy > 0 ? 1 : -1
        const targetIdx = currentRef.current + dir

        // Dead end — cancel drag
        if (targetIdx < 0 || targetIdx >= ACTS.length) {
          drag.current = null
          return
        }

        const tl = buildTimeline(currentRef.current, targetIdx, dir)
        if (!tl) { drag.current = null; return }

        d.direction = dir
        d.targetIdx = targetIdx
        d.tl = tl
      }

      if (!d.tl) return

      // Map drag distance to timeline progress (0–1)
      const DRAG_FULL = window.innerHeight * DRAG_FULL_RATIO
      const progress = Math.max(0, Math.min(1, Math.abs(dy) / DRAG_FULL))
      d.tl.progress(progress)

      d.lastY = y
      d.lastT = Date.now()
    }

    function onTouchEnd(e: TouchEvent) {
      const d = drag.current
      if (!d || !d.tl) { drag.current = null; return }

      const endY = e.changedTouches[0].clientY
      const dt = Math.max(Date.now() - d.lastT, 1)
      const velocity = Math.abs(d.lastY - endY) / dt
      const progress = d.tl.progress()

      const shouldComplete = progress >= COMPLETE_THRESHOLD || velocity >= VELOCITY_THRESHOLD
      snapTo(d.tl, shouldComplete ? 1 : 0)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [buildTimeline, snapTo])

  // Wheel — desktop: each wheel tick triggers a full transition
  useEffect(() => {
    let locked = false

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (locked || drag.current) return

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1
      const targetIdx = currentRef.current + dir
      if (targetIdx < 0 || targetIdx >= ACTS.length) return

      const tl = buildTimeline(currentRef.current, targetIdx, dir)
      if (!tl) return

      locked = true
      // Temporarily put in drag so touchstart is blocked during wheel animation
      drag.current = { startY: 0, lastY: 0, lastT: 0, direction: dir, targetIdx, tl, snapTween: null }
      snapTo(tl, 1)
      setTimeout(() => { locked = false }, 800)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [buildTimeline, snapTo])

  // Dot nav — jump to any act
  const goTo = useCallback((idx: number) => {
    if (drag.current || idx === currentRef.current) return
    const dir: 1 | -1 = idx > currentRef.current ? 1 : -1
    const tl = buildTimeline(currentRef.current, idx, dir)
    if (!tl) return

    drag.current = { startY: 0, lastY: 0, lastT: 0, direction: dir, targetIdx: idx, tl, snapTween: null }
    snapTo(tl, 1)
  }, [buildTimeline, snapTo])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#050508' }}>
      {ACTS.map((act, i) => (
        <div
          key={i}
          ref={el => { sectionRefs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === 0 ? 1 : 0,
          }}
        >
          {/* Far plane — background color, scales dramatically */}
          <div
            className="layer-bg"
            style={{
              position: 'absolute',
              inset: 0,
              background: act.color,
              willChange: 'transform, opacity, filter',
            }}
          />

          {/* Near plane — content, scales subtly, floats in front */}
          <div
            className="layer-content"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              willChange: 'transform, opacity',
            }}
          >
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.3em',
            }}>
              {act.label}
            </p>
            <h1 style={{
              fontFamily: 'monospace',
              fontSize: 'clamp(3rem, 15vw, 6rem)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.1em',
            }}>
              {act.subtitle}
            </h1>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '0.625rem',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '32px',
              letterSpacing: '0.2em',
            }}>
              {i < ACTS.length - 1 ? '↓ drag' : '↑ drag back'}
            </p>
          </div>
        </div>
      ))}

      {/* Dot nav */}
      <div style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 50,
      }}>
        {ACTS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 8 : 6,
              height: i === current ? 8 : 6,
              borderRadius: '50%',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s',
            }}
            aria-label={`Go to ${ACTS[i].label}`}
          />
        ))}
      </div>
    </div>
  )
}
