'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import UnifiedCanvas from '@/components/UnifiedCanvas'

const DRAG_FULL_RATIO = 0.4
const COMPLETE_THRESHOLD = 0.35
const VELOCITY_THRESHOLD = 0.4

// ── Section dots ──────────────────────────────────────────────────────────────

function SectionDots({ total, active, onNavigate }: {
  total: number
  active: number
  onNavigate: (i: number) => void
}) {
  if (total === 0) return null
  return (
    <div
      role="navigation"
      aria-label="Sections"
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto',
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          aria-label={`Section ${i + 1}`}
          aria-current={i === active ? 'true' : undefined}
          style={{
            width: 44,
            height: 44,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <div style={{
            width: i === active ? 8 : 5,
            height: i === active ? 8 : 5,
            borderRadius: '50%',
            background: i === active ? 'var(--color-purple-bright)' : 'rgba(248,248,248,0.22)',
            transition: 'width 0.3s ease, height 0.3s ease, background 0.3s ease',
          }} />
        </button>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PortalContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const sectionEls = useRef<HTMLElement[]>([])
  const progressRef = useRef<number>(0)
  const [activeSection, setActiveSection] = useState(0)
  const [sectionCount, setSectionCount] = useState(0)

  const drag = useRef<{
    startY: number
    lastY: number
    lastT: number
    direction: 1 | -1
    targetIdx: number
    tl: gsap.core.Timeline
    snapTween: gsap.core.Tween | null
  } | null>(null)

  // ── Timeline builder ──────────────────────────────────────────────────────
  function buildTimeline(fromIdx: number, toIdx: number, dir: 1 | -1) {
    const outEl = sectionEls.current[fromIdx]
    const inEl = sectionEls.current[toIdx]
    if (!outEl || !inEl) return null

    const outBg = outEl.querySelector<HTMLElement>('.layer-bg')
    const outContent = outEl.querySelector<HTMLElement>('.layer-content')
    const inBg = inEl.querySelector<HTMLElement>('.layer-bg')
    const inContent = inEl.querySelector<HTMLElement>('.layer-content')

    gsap.set(inEl, { zIndex: 2 })
    gsap.set(inBg, { scale: dir > 0 ? 0.3 : 2.2, filter: 'blur(24px)', opacity: 0 })
    gsap.set(inContent, { scale: dir > 0 ? 0.7 : 1.3, opacity: 0 })

    gsap.set(outEl, { zIndex: 3 })
    gsap.set(outBg, { scale: 1, filter: 'blur(0px)', opacity: 1 })
    gsap.set(outContent, { scale: 1, opacity: 1 })

    const tl = gsap.timeline({ paused: true })

    tl.to(outBg, { scale: dir > 0 ? 2.4 : 0.3, filter: 'blur(48px)', opacity: 0, ease: 'none', duration: 1 }, 0)
    tl.to(outContent, { scale: dir > 0 ? 1.12 : 0.9, opacity: 0, ease: 'none', duration: 1 }, 0)
    tl.to(inBg, { scale: 1, filter: 'blur(0px)', opacity: 1, ease: 'none', duration: 1 }, 0)
    tl.to(inContent, { scale: 1, opacity: 1, ease: 'none', duration: 1 }, 0.12)

    return tl
  }

  // ── Finalize ──────────────────────────────────────────────────────────────
  function finalize(completed: boolean) {
    const d = drag.current
    if (!d) return

    const fromIdx = currentRef.current
    const toIdx = d.targetIdx

    function resetSection(el: HTMLElement, visible: boolean) {
      gsap.set(el, { zIndex: visible ? 1 : 0 })
      gsap.set(el.querySelector('.layer-bg'), { scale: 1, filter: 'blur(0px)', opacity: visible ? 1 : 0 })
      gsap.set(el.querySelector('.layer-content'), { scale: 1, opacity: visible ? 1 : 0 })
      if (visible) {
        el.removeAttribute('inert')
      } else {
        el.setAttribute('inert', '')
      }
    }

    if (completed) {
      resetSection(sectionEls.current[fromIdx], false)
      resetSection(sectionEls.current[toIdx], true)
      currentRef.current = toIdx
      progressRef.current = toIdx / (sectionEls.current.length - 1)
      setActiveSection(toIdx)
    } else {
      resetSection(sectionEls.current[fromIdx], true)
      resetSection(sectionEls.current[toIdx], false)
      progressRef.current = fromIdx / (sectionEls.current.length - 1)
    }

    drag.current = null
  }

  function snapTo(tl: gsap.core.Timeline, target: 0 | 1) {
    const d = drag.current
    const fromIdx = currentRef.current
    gsap.to(tl, {
      progress: target,
      duration: 0.45,
      ease: 'power3.out',
      onUpdate() {
        if (d) {
          progressRef.current = (fromIdx + tl.progress() * d.direction) / (sectionEls.current.length - 1)
        }
      },
      onComplete: () => finalize(target === 1),
    })
  }

  // ── Dot navigation ────────────────────────────────────────────────────────
  function navigateTo(toIdx: number) {
    if (drag.current) return
    const fromIdx = currentRef.current
    if (toIdx === fromIdx) return
    const sections = sectionEls.current
    if (toIdx < 0 || toIdx >= sections.length) return

    const dir: 1 | -1 = toIdx > fromIdx ? 1 : -1
    const tl = buildTimeline(fromIdx, toIdx, dir)
    if (!tl) return

    const totalSections = sections.length - 1
    drag.current = { startY: 0, lastY: 0, lastT: 0, direction: dir, targetIdx: toIdx, tl, snapTween: null }

    gsap.to(tl, {
      progress: 1,
      duration: 0.45,
      ease: 'power3.out',
      onUpdate() {
        progressRef.current = (fromIdx + tl.progress() * (toIdx - fromIdx)) / totalSections
      },
      onComplete: () => finalize(true),
    })
  }

  // Re-query sections from DOM
  function getSections() {
    const els = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>('[data-portal-section]') ?? []
    )
    sectionEls.current = els
    return els
  }

  // ── Setup sections + events ───────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const raf = requestAnimationFrame(() => {
      const sections = getSections()

      sections.forEach((el, i) => {
        gsap.set(el, { position: 'absolute', inset: 0, zIndex: i === 0 ? 1 : 0 })
        gsap.set(el.querySelector('.layer-bg'), { opacity: i === 0 ? 1 : 0 })
        gsap.set(el.querySelector('.layer-content'), { opacity: i === 0 ? 1 : 0 })
        // Inactive sections are inert — keyboard/focus cannot reach hidden content
        if (i !== 0) el.setAttribute('inert', '')
      })

      setSectionCount(sections.length)
    })

    // ── Scroll conflict helper ────────────────────────────────────────────────
    function findScrollableAncestor(el: Element | null): HTMLElement | null {
      while (el && el !== document.documentElement) {
        const style = window.getComputedStyle(el)
        const overflowY = style.overflowY
        if ((overflowY === 'auto' || overflowY === 'scroll') &&
            (el as HTMLElement).scrollHeight > (el as HTMLElement).clientHeight) {
          return el as HTMLElement
        }
        el = el.parentElement
      }
      return null
    }

    // ── Touch ────────────────────────────────────────────────────────────────
    function onTouchStart(e: TouchEvent) {
      if (drag.current) return
      drag.current = {
        startY: e.touches[0].clientY,
        lastY: e.touches[0].clientY,
        lastT: Date.now(),
        direction: 1,
        targetIdx: -1,
        tl: null!,
        snapTween: null,
      }
    }

    function onTouchMove(e: TouchEvent) {
      const d = drag.current
      if (!d) return

      const y = e.touches[0].clientY
      const dy = d.startY - y

      if (!d.tl && Math.abs(dy) > 12) {
        const dir: 1 | -1 = dy > 0 ? 1 : -1

        // Yield to native scroll if inside a scrollable container with room
        const scrollable = findScrollableAncestor(e.target as Element)
        if (scrollable) {
          const { scrollTop, scrollHeight, clientHeight } = scrollable
          if (dir > 0 && scrollTop + clientHeight < scrollHeight - 1) { drag.current = null; return }
          if (dir < 0 && scrollTop > 0) { drag.current = null; return }
        }

        const targetIdx = currentRef.current + dir
        if (targetIdx < 0 || targetIdx >= sectionEls.current.length) { drag.current = null; return }

        const tl = buildTimeline(currentRef.current, targetIdx, dir)
        if (!tl) { drag.current = null; return }

        d.direction = dir
        d.targetIdx = targetIdx
        d.tl = tl
      }

      if (!d.tl) return

      const progress = Math.max(0, Math.min(1, Math.abs(dy) / (window.innerHeight * DRAG_FULL_RATIO)))
      d.tl.progress(progress)
      progressRef.current = (currentRef.current + progress * d.direction) / (sectionEls.current.length - 1)
      d.lastY = y
      d.lastT = Date.now()
    }

    function onTouchEnd(e: TouchEvent) {
      const d = drag.current
      if (!d || !d.tl) { drag.current = null; return }

      const dt = Math.max(Date.now() - d.lastT, 1)
      const velocity = Math.abs(d.lastY - e.changedTouches[0].clientY) / dt
      const progress = d.tl.progress()
      snapTo(d.tl, progress >= COMPLETE_THRESHOLD || velocity >= VELOCITY_THRESHOLD ? 1 : 0)
    }

    // ── Wheel ────────────────────────────────────────────────────────────────
    let wheelLocked = false
    function onWheel(e: WheelEvent) {
      // Yield to native scroll if inside a scrollable container with room
      const scrollable = findScrollableAncestor(e.target as Element)
      if (scrollable) {
        const { scrollTop, scrollHeight, clientHeight } = scrollable
        const wouldScrollDown = e.deltaY > 0 && scrollTop + clientHeight < scrollHeight - 1
        const wouldScrollUp   = e.deltaY < 0 && scrollTop > 0
        if (wouldScrollDown || wouldScrollUp) return
      }

      e.preventDefault()
      if (wheelLocked || drag.current) return

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1
      const targetIdx = currentRef.current + dir
      if (targetIdx < 0 || targetIdx >= sectionEls.current.length) return

      const tl = buildTimeline(currentRef.current, targetIdx, dir)
      if (!tl) return

      wheelLocked = true
      drag.current = { startY: 0, lastY: 0, lastT: 0, direction: dir, targetIdx, tl, snapTween: null }
      snapTo(tl, 1)
      setTimeout(() => { wheelLocked = false }, 800)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <UnifiedCanvas progressRef={progressRef} />
      {children}
      <SectionDots total={sectionCount} active={activeSection} onNavigate={navigateTo} />
    </div>
  )
}
