'use client'

import { useEffect, useRef } from 'react'

export type Act = 1 | 2 | 3 | 4 | 5

// Brand palette — muted 30-40% per brand doc. Bioluminescence, not LED.
const PALETTES: Record<Act, string[]> = {
  1: ['#7B3FA1', '#9B5AC0', '#6B2E87', '#B380D4'],            // warm purple — opening
  2: ['#5A2478', '#7B3FA1', '#4A1D6E', '#8A4AB8', '#3A1558'], // deepening violet
  3: ['#4A7B9D', '#2A6A7A', '#1E5A6A', '#3A6B8A', '#1A4A3A'], // cold only — visible teal/cyan, NO purple
  4: ['#7B3FA1', '#8A2855', '#1A4A6A', '#1E4828', '#6A3820', '#B34E8F'], // full palette
  5: ['#8A3FA8', '#6B2E87', '#9B5AC0', '#5A2478'],            // returning — wider/warmer
}

// Trail persistence per act: lower = longer trails = more visible geometry
const FADE: Record<Act, number> = {
  1: 0.022, // very long — ring geometry becomes visible in the canvas
  2: 0.045, // medium — spiral arms traced in light
  3: 0.06,  // medium — cold light persists, tunnel walls visible
  4: 0.07,  // medium — burst traces
  5: 0.016, // longest — widest, most settled
}

interface Particle {
  x: number; y: number
  vx: number; vy: number
  angle: number; radius: number; speed: number
  size: number; alpha: number; color: string
  life: number; maxLife: number
}

function hex2rgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]
}

// Glow via layered circles — bioluminescent quality, no shadowBlur (expensive)
function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  rgb: [number,number,number], alpha: number
) {
  const col = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
  ctx.fillStyle = col
  ctx.globalAlpha = alpha * 0.08
  ctx.beginPath(); ctx.arc(x, y, r * 7, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = alpha * 0.2
  ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = alpha * 0.55
  ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = alpha
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
}

function initParticles(act: Act, w: number, h: number): Particle[] {
  const cx = w / 2, cy = h / 2
  const d = Math.min(w, h)
  const pal = PALETTES[act]
  const out: Particle[] = []

  if (act === 1 || act === 5) {
    // Concentric orbital rings — the sacred circle structure
    const rings = act === 1
      ? [{ r: 0.14, n: 7,  s: 0.007 }, { r: 0.27, n: 14, s: 0.0045 }, { r: 0.41, n: 10, s: 0.006 }]
      : [{ r: 0.16, n: 9,  s: 0.004 }, { r: 0.31, n: 18, s: 0.0028 }, { r: 0.47, n: 13, s: 0.0035 }, { r: 0.62, n: 8, s: 0.002 }]
    rings.forEach(({ r, n, s }, ri) => {
      const rad = r * d * 0.5
      const dir = ri % 2 === 0 ? 1 : -1
      const col = pal[ri % pal.length]
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2
        out.push({
          x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad,
          vx: 0, vy: 0, angle, radius: rad,
          speed: s * dir * (0.8 + Math.random() * 0.4),
          size: 1.8 + Math.random() * 2.2,
          alpha: 0.55 + Math.random() * 0.45,
          color: col, life: 1, maxLife: 1,
        })
      }
    })
  }

  else if (act === 2) {
    // 3 spiral arms pulling inward — the descent
    for (let arm = 0; arm < 3; arm++) {
      for (let i = 0; i < 22; i++) {
        const t = i / 22
        const angle = (arm / 3) * Math.PI * 2 + t * Math.PI * 2.8
        const rad = t * d * 0.5 * 0.95
        out.push({
          x: cx + Math.cos(angle) * rad, y: cy + Math.sin(angle) * rad,
          vx: 0, vy: 0, angle, radius: rad,
          speed: 0.0045 + Math.random() * 0.0025,
          size: 1.2 + t * 2.8 + Math.random(),
          alpha: 0.25 + t * 0.75,
          color: pal[arm % pal.length],
          life: t, maxLife: 1,
        })
      }
    }
  }

  else if (act === 3) {
    // Chaotic particles in cold colors — center is void (dark mirror), walls glow cold
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      // Concentrate toward outer ring (tunnel walls), avoid center void
      const r = d * 0.5 * (0.28 + Math.random() * 0.62)
      out.push({
        x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 2.2, vy: (Math.random() - 0.5) * 2.2,
        angle: 0, radius: r, speed: 0,
        size: 1.5 + Math.random() * 4,
        alpha: 0.5 + Math.random() * 0.5,
        color: pal[Math.floor(Math.random() * pal.length)],
        life: Math.random(), maxLife: 1,
      })
    }
  }

  else if (act === 4) {
    // Burst pool — staggered so they appear mid-flight on load
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 3.2
      const maxLife = 90 + Math.floor(Math.random() * 130)
      const startLife = Math.random()
      const elapsed = (1 - startLife) * maxLife
      const decay = Math.pow(0.976, elapsed)
      const col = pal[Math.floor((angle / (Math.PI * 2)) * pal.length)]
      out.push({
        x: cx + Math.cos(angle) * speed * elapsed * decay,
        y: cy + Math.sin(angle) * speed * elapsed * decay,
        vx: Math.cos(angle) * speed * decay,
        vy: Math.sin(angle) * speed * decay,
        angle, radius: 0, speed: 0,
        size: 1.8 + Math.random() * 2.8,
        alpha: startLife * 0.95,
        color: col, life: startLife, maxLife,
      })
    }
  }

  return out
}

export default function CanvasBackground({ act }: { act: Act }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.offsetWidth || window.innerWidth
    let h = canvas.offsetHeight || window.innerHeight
    canvas.width = w
    canvas.height = h

    let cx = w / 2, cy = h / 2, d = Math.min(w, h)
    let particles = initParticles(act, w, h)
    let frame = 0, rafId: number

    // Pre-compute all RGB values used by this act
    const rgbMap = new Map<string, [number,number,number]>()
    PALETTES[act].forEach(c => rgbMap.set(c, hex2rgb(c)))

    // Initial fill so canvas isn't transparent on first paint
    ctx.fillStyle = '#050508'
    ctx.fillRect(0, 0, w, h)

    function handleResize() {
      w = canvas!.offsetWidth || window.innerWidth
      h = canvas!.offsetHeight || window.innerHeight
      canvas!.width = w; canvas!.height = h
      cx = w / 2; cy = h / 2; d = Math.min(w, h)
      particles = initParticles(act, w, h)
      ctx!.fillStyle = '#050508'
      ctx!.fillRect(0, 0, w, h)
    }
    window.addEventListener('resize', handleResize)

    function tick() {
      frame++

      // Trailing clear — the core of the long-exposure effect
      ctx!.fillStyle = '#050508'
      ctx!.globalAlpha = FADE[act]
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalAlpha = 1

      // ── Sacred geometry ring substrate ───────────────────────────────────────
      {
        const ringRadii = act === 1 ? [0.14, 0.27, 0.41] :
                          act === 2 ? [0.14, 0.27, 0.41, 0.56] :
                          act === 3 ? [0.28, 0.44, 0.62, 0.80] :  // cold tunnel walls — outer rings
                          act === 4 ? [0.1, 0.22, 0.38] :
                                      [0.16, 0.31, 0.47, 0.62]
        const pulse = act === 3
          ? 0.12 + 0.08 * Math.sin(frame * 0.03)   // faster, more unsettled pulse for Act 3
          : 0.07 + 0.03 * Math.sin(frame * 0.012)
        ctx!.strokeStyle = act === 5 ? '#6B2E87' :
                           act === 2 ? '#5A2478' :
                           act === 3 ? '#2A6A7A' :   // cold teal rings
                                       '#7B3FA1'
        ctx!.lineWidth = act === 3 ? 0.8 : 0.6
        ringRadii.forEach(r => {
          ctx!.globalAlpha = pulse
          ctx!.beginPath()
          ctx!.arc(cx, cy, r * d * 0.5, 0, Math.PI * 2)
          ctx!.stroke()
        })
        ctx!.globalAlpha = 1
      }

      // ── Particle connections (acts 1, 2, 3, 5) ───────────────────────────────
      if (act === 1 || act === 2 || act === 3 || act === 5) {
        ctx!.lineWidth = 0.5
        for (let i = 0; i < particles.length - 1; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            if (particles[i].color !== particles[j].color) continue
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const threshold = act === 5 ? 75 : 58
            if (dist < threshold) {
              ctx!.globalAlpha = (1 - dist / threshold) * 0.18
              ctx!.strokeStyle = particles[i].color
              ctx!.beginPath()
              ctx!.moveTo(particles[i].x, particles[i].y)
              ctx!.lineTo(particles[j].x, particles[j].y)
              ctx!.stroke()
            }
          }
        }
        ctx!.globalAlpha = 1
      }

      // ── Update + draw particles ───────────────────────────────────────────────
      for (const p of particles) {
        if (act === 1 || act === 5) {
          p.angle += p.speed
          p.x = cx + Math.cos(p.angle) * p.radius
          p.y = cy + Math.sin(p.angle) * p.radius
        }

        else if (act === 2) {
          p.angle += p.speed
          p.radius -= 0.065
          p.x = cx + Math.cos(p.angle) * p.radius
          p.y = cy + Math.sin(p.angle) * p.radius
          if (p.radius <= 8) {
            p.radius = d * 0.5 * 0.95
            p.alpha = 0.12
          }
          if (p.alpha < 0.95) p.alpha += 0.0025
        }

        else if (act === 3) {
          // Random walk
          p.vx += (Math.random() - 0.5) * 0.2
          p.vy += (Math.random() - 0.5) * 0.2
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
          if (spd > 3) { p.vx *= 3 / spd; p.vy *= 3 / spd }
          // Void center — dark mirror repulsion
          const dx = p.x - cx, dy = p.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const minR = d * 0.2
          if (dist < minR && dist > 0) {
            const push = (minR - dist) / minR * 3
            p.vx += (dx / dist) * push
            p.vy += (dy / dist) * push
          }
          p.x += p.vx; p.y += p.vy
          if (p.x < 0 || p.x > w) { p.vx *= -0.85; p.x = Math.max(0, Math.min(w, p.x)) }
          if (p.y < 0 || p.y > h) { p.vy *= -0.85; p.y = Math.max(0, Math.min(h, p.y)) }
          p.alpha += (Math.random() - 0.5) * 0.07
          p.alpha = Math.max(0.12, Math.min(0.98, p.alpha))
        }

        else if (act === 4) {
          p.x += p.vx; p.y += p.vy
          p.vx *= 0.976; p.vy *= 0.976
          p.life -= 1 / p.maxLife
          p.alpha = Math.max(0, p.life * 0.95)
          if (p.life <= 0) {
            const angle = Math.random() * Math.PI * 2
            const speed = 1.5 + Math.random() * 3.2
            p.x = cx; p.y = cy
            p.vx = Math.cos(angle) * speed; p.vy = Math.sin(angle) * speed
            p.angle = angle; p.life = 1
            p.maxLife = 90 + Math.floor(Math.random() * 130)
            p.color = PALETTES[4][Math.floor((angle / (Math.PI * 2)) * PALETTES[4].length)]
            p.alpha = 0.95
            // Make sure rgb is cached
            if (!rgbMap.has(p.color)) rgbMap.set(p.color, hex2rgb(p.color))
          }
        }

        const rgb = rgbMap.get(p.color) ?? [123, 63, 161]
        drawGlow(ctx!, p.x, p.y, p.size, rgb as [number,number,number], p.alpha)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [act])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
