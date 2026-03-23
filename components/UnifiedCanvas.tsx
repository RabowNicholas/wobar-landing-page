'use client'

import { useEffect, useRef } from 'react'
import { createNoise3D } from 'simplex-noise'

interface ActParams {
  ringCount: number
  ringSpread: number
  ringOpacity: number
  ringRotationSpeed: number
  ringRotationErratic: number
  flowScale: number
  flowSpeed: number
  flowTurbulence: number
  flowDirection: 'vortex' | 'radial-in' | 'radial-out' | 'laminar' | 'turbulent'
  particleCount: number
  trailAlpha: number
  luminanceMultiplier: number
  ringCompressionFactor: number
}

const ACT_PARAMS: ActParams[] = [
  // Act 1 — Rift: calm inward pull, wide rings
  { ringCount: 8,  ringSpread: 0.85, ringOpacity: 0.06, ringRotationSpeed: 0.0008, ringRotationErratic: 0,      flowScale: 0.003, flowSpeed: 0.003, flowTurbulence: 0,   flowDirection: 'laminar',    particleCount: 60, trailAlpha: 0.018, luminanceMultiplier: 1.0, ringCompressionFactor: 0   },
  // Act 2 — Descension: vortex spiral tightening
  { ringCount: 10, ringSpread: 0.80, ringOpacity: 0.10, ringRotationSpeed: 0.0015, ringRotationErratic: 0,      flowScale: 0.004, flowSpeed: 0.005, flowTurbulence: 0,   flowDirection: 'vortex',     particleCount: 70, trailAlpha: 0.013, luminanceMultiplier: 0.85, ringCompressionFactor: 0.3 },
  // Act 3 — Encounter: turbulent, chaotic, compressed
  { ringCount: 12, ringSpread: 0.70, ringOpacity: 0.18, ringRotationSpeed: 0.002,  ringRotationErratic: 0.0008, flowScale: 0.006, flowSpeed: 0.009, flowTurbulence: 0.8, flowDirection: 'turbulent',  particleCount: 50, trailAlpha: 0.008, luminanceMultiplier: 0.65, ringCompressionFactor: 0.7 },
  // Act 4 — Release: radial explosion outward
  { ringCount: 10, ringSpread: 0.88, ringOpacity: 0.12, ringRotationSpeed: 0.003,  ringRotationErratic: 0,      flowScale: 0.004, flowSpeed: 0.007, flowTurbulence: 0,   flowDirection: 'radial-out', particleCount: 80, trailAlpha: 0.030, luminanceMultiplier: 1.3, ringCompressionFactor: 0.1 },
  // Act 5 — Integration: back to calm, settled
  { ringCount: 8,  ringSpread: 0.85, ringOpacity: 0.06, ringRotationSpeed: 0.0008, ringRotationErratic: 0,      flowScale: 0.003, flowSpeed: 0.003, flowTurbulence: 0,   flowDirection: 'laminar',    particleCount: 60, trailAlpha: 0.018, luminanceMultiplier: 1.0, ringCompressionFactor: 0   },
]

const COLORS = {
  bg:           { r: 3,   g: 2,  b: 10  },
  ringBase:     { r: 38,  g: 0,  b: 140 },
  particleBase: { r: 80,  g: 20, b: 200 },
  act3Cold:     { r: 20,  g: 10, b: 90  },
  act4Bright:   { r: 110, g: 50, b: 210 },
}

// Perspective tunnel constants
const TILT_Y     = 0.50  // Y-axis compression — how tilted the tunnel plane appears
const VERT_SHIFT = 0     // portal center at true screen center
const WOBBLE_AMT = 0.025 // portal mouth drifts (tear in reality, not a constructed shape)
const VOID_RADIUS = 0.22 // fraction of d — how large the center darkness is

const MAX_PARTICLES = 80

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function lerpParams(a: ActParams, b: ActParams, t: number): ActParams {
  return {
    ringCount:            Math.round(lerp(a.ringCount, b.ringCount, t)),
    ringSpread:           lerp(a.ringSpread, b.ringSpread, t),
    ringOpacity:          lerp(a.ringOpacity, b.ringOpacity, t),
    ringRotationSpeed:    lerp(a.ringRotationSpeed, b.ringRotationSpeed, t),
    ringRotationErratic:  lerp(a.ringRotationErratic, b.ringRotationErratic, t),
    flowScale:            lerp(a.flowScale, b.flowScale, t),
    flowSpeed:            lerp(a.flowSpeed, b.flowSpeed, t),
    flowTurbulence:       lerp(a.flowTurbulence, b.flowTurbulence, t),
    flowDirection:        t < 0.5 ? a.flowDirection : b.flowDirection,
    particleCount:        Math.round(lerp(a.particleCount, b.particleCount, t)),
    trailAlpha:           lerp(a.trailAlpha, b.trailAlpha, t),
    luminanceMultiplier:  lerp(a.luminanceMultiplier, b.luminanceMultiplier, t),
    ringCompressionFactor:lerp(a.ringCompressionFactor, b.ringCompressionFactor, t),
  }
}

function getParams(progress: number): ActParams {
  const scaled = Math.max(0, Math.min(4, progress * 4))
  const idx = Math.min(Math.floor(scaled), 3)
  return lerpParams(ACT_PARAMS[idx], ACT_PARAMS[idx + 1], scaled - idx)
}

interface Particle {
  angle: number
  vAngle: number
  noiseOffset: number
  r: number  // normalized radial position 0..1 (0 = center, 1 = outer edge)
}

function initParticles(): Particle[] {
  return Array.from({ length: MAX_PARTICLES }, () => ({
    angle:       Math.random() * Math.PI * 2,
    vAngle:      0,
    noiseOffset: Math.random() * 1000,
    r:           0.15 + Math.random() * 0.80,
  }))
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  rgb: [number, number, number], alpha: number
) {
  ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
  ctx.globalAlpha = alpha * 0.07
  ctx.beginPath(); ctx.arc(x, y, r * 7, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = alpha * 0.18
  ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = alpha * 0.55
  ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = alpha
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
}

// Project a polar coordinate (angle, r) to canvas coords with perspective tilt + wobble
function project(
  cx: number, cy: number, d: number,
  angle: number, r: number,
  wobX: number, wobY: number
): [number, number] {
  const rad = r * d * 0.58
  return [
    cx + wobX + Math.cos(angle) * rad,
    cy + wobY + d * VERT_SHIFT + Math.sin(angle) * rad * TILT_Y,
  ]
}

export default function UnifiedCanvas({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bloomRef  = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const bloom  = bloomRef.current
    if (!canvas || !bloom) return
    const ctx  = canvas.getContext('2d')
    const bctx = bloom.getContext('2d')
    if (!ctx || !bctx) return

    const noise3D = createNoise3D()
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width = w
    canvas.height = h

    bloom.width = w
    bloom.height = h

    let cx = w / 2, cy = h / 2, d = Math.max(w, h)
    let frame = 0
    let rafId: number
    let smoothProgress = 0  // lags behind progressRef for dreamy transitions

    const particles: Particle[] = initParticles()
    const posX = new Float32Array(MAX_PARTICLES)
    const posY = new Float32Array(MAX_PARTICLES)
    const posR = new Float32Array(MAX_PARTICLES)

    ctx.fillStyle = `rgb(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b})`
    ctx.fillRect(0, 0, w, h)

    function handleResize() {
      w = window.innerWidth; h = window.innerHeight
      canvas!.width = w; canvas!.height = h
      bloom!.width  = w; bloom!.height  = h
      cx = w / 2; cy = h / 2; d = Math.max(w, h)
      ctx!.fillStyle = `rgb(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b})`
      ctx!.fillRect(0, 0, w, h)
    }
    window.addEventListener('resize', handleResize)

    // ── Reduced motion tick: static rings with slow opacity pulse ─────────────
    function tickReduced() {
      frame++
      // Very slow pulse ~20s cycle — gentle life without motion
      const pulseAlpha = 0.55 + 0.25 * Math.sin(frame * 0.004)
      const params = ACT_PARAMS[0]

      ctx!.fillStyle = `rgb(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b})`
      ctx!.fillRect(0, 0, w, h)

      ctx!.strokeStyle = `rgb(${COLORS.ringBase.r},${COLORS.ringBase.g},${COLORS.ringBase.b})`
      ctx!.lineWidth = 0.7

      for (let i = 0; i < params.ringCount; i++) {
        const t = i / Math.max(params.ringCount - 1, 1)
        const perspT = Math.pow(t, 0.65)
        const r = (0.04 + perspT * params.ringSpread) * d * 0.60
        ctx!.globalAlpha = params.ringOpacity * (0.35 + 0.65 * t) * pulseAlpha
        ctx!.save()
        ctx!.translate(cx, cy)
        ctx!.beginPath()
        ctx!.ellipse(0, 0, r, r * TILT_Y, 0, 0, Math.PI * 2)
        ctx!.stroke()
        ctx!.restore()
      }
      ctx!.globalAlpha = 1

      // Void overlay
      const voidGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, d * VOID_RADIUS)
      voidGrad.addColorStop(0,    `rgba(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b},1)`)
      voidGrad.addColorStop(0.55, `rgba(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b},0.75)`)
      voidGrad.addColorStop(1,    `rgba(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b},0)`)
      ctx!.fillStyle = voidGrad
      ctx!.globalAlpha = 0.88
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalAlpha = 1

      // Bloom — soft ring glow
      bctx!.clearRect(0, 0, w, h)
      bctx!.strokeStyle = `rgb(${COLORS.ringBase.r},${COLORS.ringBase.g},${COLORS.ringBase.b})`
      bctx!.lineWidth = 3
      bctx!.filter = 'blur(8px)'
      for (let i = 0; i < params.ringCount; i++) {
        const t = i / Math.max(params.ringCount - 1, 1)
        const perspT = Math.pow(t, 0.65)
        const r = (0.04 + perspT * params.ringSpread) * d * 0.60
        bctx!.globalAlpha = params.ringOpacity * (0.4 + 0.6 * t) * 2.5 * pulseAlpha
        bctx!.save()
        bctx!.translate(cx, cy)
        bctx!.beginPath()
        bctx!.ellipse(0, 0, r, r * TILT_Y, 0, 0, Math.PI * 2)
        bctx!.stroke()
        bctx!.restore()
      }
      bctx!.filter = 'none'
      bctx!.globalAlpha = 1

      rafId = requestAnimationFrame(tickReduced)
    }

    if (prefersReduced) {
      rafId = requestAnimationFrame(tickReduced)
      return () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', handleResize)
      }
    }

    function tick() {
      frame++
      smoothProgress += (progressRef.current - smoothProgress) * 0.032
      const progress = smoothProgress
      const params = getParams(progress)

      // ── Wobble: portal mouth slowly drifts ───────────────────────────────────
      const wobX = noise3D(frame * 0.0018, 0, 0) * d * WOBBLE_AMT
      const wobY = noise3D(0, frame * 0.0018, 77) * d * WOBBLE_AMT
      // Projected center (for void overlay + ring draw)
      const pcx = cx + wobX
      const pcy = cy + wobY + d * VERT_SHIFT

      // ── Color interpolation ───────────────────────────────────────────────────
      const coldT   = Math.max(0, 1 - Math.abs(progress - 0.5)  / 0.15)
      const brightT = Math.max(0, 1 - Math.abs(progress - 0.75) / 0.15)
      const lm = params.luminanceMultiplier

      const pr = Math.min(255, Math.round(lerp(lerp(COLORS.particleBase.r, COLORS.act3Cold.r, coldT), COLORS.act4Bright.r, brightT) * lm))
      const pg = Math.min(255, Math.round(lerp(lerp(COLORS.particleBase.g, COLORS.act3Cold.g, coldT), COLORS.act4Bright.g, brightT) * lm))
      const pb = Math.min(255, Math.round(lerp(lerp(COLORS.particleBase.b, COLORS.act3Cold.b, coldT), COLORS.act4Bright.b, brightT) * lm))
      const particleRgb: [number, number, number] = [pr, pg, pb]

      const rr = Math.min(255, Math.round(lerp(lerp(COLORS.ringBase.r, COLORS.act3Cold.r, coldT), COLORS.act4Bright.r, brightT) * lm))
      const rg = Math.min(255, Math.round(lerp(lerp(COLORS.ringBase.g, COLORS.act3Cold.g, coldT), COLORS.act4Bright.g, brightT) * lm))
      const rb = Math.min(255, Math.round(lerp(lerp(COLORS.ringBase.b, COLORS.act3Cold.b, coldT), COLORS.act4Bright.b, brightT) * lm))

      // ── Trail clear ───────────────────────────────────────────────────────────
      ctx!.fillStyle = `rgb(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b})`
      ctx!.globalAlpha = params.trailAlpha
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalAlpha = 1

      // ── Perspective rings ─────────────────────────────────────────────────────
      {
        const erratic = params.ringRotationErratic > 0
          ? params.ringRotationErratic * Math.sin(frame * 0.07) : 0
        const pulse = params.ringOpacity + params.ringOpacity * 0.5 * Math.sin(frame * 0.012)

        ctx!.strokeStyle = `rgb(${rr},${rg},${rb})`
        ctx!.lineWidth = 0.7

        for (let i = 0; i < params.ringCount; i++) {
          const t = i / Math.max(params.ringCount - 1, 1)
          const spread = params.ringSpread * (1 - params.ringCompressionFactor * (1 - t))
          // perspective spacing: outer rings spread more, inner rings cluster
          const perspT = Math.pow(t, 0.65)
          const r = (0.04 + perspT * spread) * d * 0.60
          const spin = frame * (params.ringRotationSpeed + erratic) * (i % 2 === 0 ? 1 : -1)

          ctx!.globalAlpha = pulse * (0.35 + 0.65 * t)
          ctx!.save()
          ctx!.translate(pcx, pcy)
          ctx!.beginPath()
          ctx!.ellipse(0, 0, r, r * TILT_Y, spin, 0, Math.PI * 2)
          ctx!.stroke()
          ctx!.restore()
        }
        ctx!.globalAlpha = 1
      }

      // ── Particle update ───────────────────────────────────────────────────────
      const activeCount = Math.min(params.particleCount, MAX_PARTICLES)
      const noiseTime = frame * params.flowSpeed * 0.01
      const isRadialOut = params.flowDirection === 'radial-out'
      // Radial drift speed: particles stream inward (or outward for act4)
      const radialDrift = 0.0005 + params.flowSpeed * 0.08

      for (let i = 0; i < activeCount; i++) {
        const p = particles[i]

        // ── Radial streaming (the "going through" effect) ──────────────────────
        if (isRadialOut) {
          // Act 4: particles erupt outward from center
          p.r += radialDrift * (0.5 + p.r * 0.5)
          if (p.r > 1.0) {
            p.r = 0.02 + Math.random() * 0.06   // respawn at void center
            p.angle = Math.random() * Math.PI * 2
            p.vAngle = 0
          }
        } else {
          // All other acts: particles pulled inward
          const pullStrength = params.flowDirection === 'radial-in' ? 2.2 : 1.0
          p.r -= radialDrift * pullStrength * (0.3 + p.r * 0.7)
          if (p.r < 0.04) {
            p.r = 0.80 + Math.random() * 0.18   // respawn at outer edge
            p.angle = Math.random() * Math.PI * 2
            p.vAngle = 0
          }
        }

        // ── Speed gradient: faster near center (angular momentum) ─────────────
        const speedMult = isRadialOut
          ? (0.4 + p.r * 1.6)              // faster at outer edge when exploding out
          : 1 / (p.r * 0.65 + 0.35)        // faster near center when pulled in

        // ── Flow field influence ───────────────────────────────────────────────
        const [px, py] = project(cx, cy, d, p.angle, p.r, wobX, wobY)
        const { flowDirection, flowScale, flowTurbulence } = params
        let flowAngle = 0

        if (flowDirection === 'laminar') {
          flowAngle = noise3D(px * flowScale, py * flowScale, noiseTime + p.noiseOffset * 0.01) * Math.PI * 2
        } else if (flowDirection === 'vortex') {
          const dx = cx - px, dy = cy - py
          flowAngle = Math.atan2(dy, dx) + Math.PI / 2 + noise3D(px * flowScale, py * flowScale, noiseTime) * 0.6
        } else if (flowDirection === 'turbulent') {
          const n1 = noise3D(px * flowScale, py * flowScale, noiseTime)
          const n2 = noise3D(px * flowScale + 100, py * flowScale, noiseTime + 50)
          flowAngle = n1 * Math.PI * 2 * flowTurbulence + n2 * Math.PI
        } else if (flowDirection === 'radial-out') {
          const dx = px - cx, dy = py - cy
          flowAngle = Math.atan2(dy, dx) + noise3D(px * flowScale, py * flowScale, noiseTime) * 0.4
        } else {
          const dx = cx - px, dy = cy - py
          flowAngle = Math.atan2(dy, dx) + noise3D(px * flowScale, py * flowScale, noiseTime) * 0.4
        }

        const tangential = Math.cos(flowAngle - p.angle - Math.PI / 2)
        p.vAngle += tangential * params.flowSpeed * 0.003
        p.vAngle *= 0.90
        const dir = (Math.floor(p.noiseOffset) % 2 === 0) ? 1 : -1
        p.angle += (p.vAngle + params.ringRotationSpeed * dir) * speedMult

        const [sx, sy] = project(cx, cy, d, p.angle, p.r, wobX, wobY)
        posX[i] = sx
        posY[i] = sy
        posR[i] = p.r

        // ── Draw: size and alpha scale with depth (r) ──────────────────────────
        const depthScale = 0.25 + p.r * 0.75
        const size = (1.2 + 2.2 * p.r) * depthScale
        const alpha = depthScale * (0.4 + 0.55 * Math.abs(Math.sin(p.noiseOffset * 0.1 + frame * 0.016)))
        drawGlow(ctx!, sx, sy, size, particleRgb, alpha)
      }

      // ── Connection lines (particles with similar r values) ────────────────────
      ctx!.lineWidth = 0.5
      for (let i = 0; i < activeCount - 1; i++) {
        for (let j = i + 1; j < activeCount; j++) {
          if (Math.abs(posR[i] - posR[j]) > 0.12) continue
          const dx = posX[i] - posX[j]
          const dy = posY[i] - posY[j]
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 60) {
            const depthAlpha = (posR[i] + posR[j]) * 0.5  // fade connections near void
            ctx!.globalAlpha = (1 - dist / 60) * 0.12 * depthAlpha
            ctx!.strokeStyle = `rgb(${particleRgb[0]},${particleRgb[1]},${particleRgb[2]})`
            ctx!.beginPath()
            ctx!.moveTo(posX[i], posY[i])
            ctx!.lineTo(posX[j], posY[j])
            ctx!.stroke()
          }
        }
      }
      ctx!.globalAlpha = 1

      // ── Center void overlay ───────────────────────────────────────────────────
      // Drawn last so it naturally consumes everything near center
      {
        const voidR = d * VOID_RADIUS * (isRadialOut ? 0.5 : 1.0)  // smaller void for act4 burst
        const voidGrad = ctx!.createRadialGradient(pcx, pcy, 0, pcx, pcy, voidR)
        voidGrad.addColorStop(0,    `rgba(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b},1)`)
        voidGrad.addColorStop(0.55, `rgba(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b},0.75)`)
        voidGrad.addColorStop(1,    `rgba(${COLORS.bg.r},${COLORS.bg.g},${COLORS.bg.b},0)`)
        ctx!.fillStyle = voidGrad
        ctx!.globalAlpha = 0.88
        ctx!.fillRect(0, 0, w, h)
        ctx!.globalAlpha = 1
      }

      // ── Bloom pass (luma blur) ────────────────────────────────────────────────
      // Second canvas with mix-blend-mode:screen — only bright blurred halos add
      // light, black pixels are invisible. This is luma-selective blur without WebGL.
      bctx!.clearRect(0, 0, w, h)

      // Bloom rings — soft outer glow on each ring
      {
        const erratic = params.ringRotationErratic > 0
          ? params.ringRotationErratic * Math.sin(frame * 0.07) : 0
        bctx!.strokeStyle = `rgb(${rr},${rg},${rb})`
        bctx!.lineWidth = 3
        bctx!.filter = 'blur(8px)'
        for (let i = 0; i < params.ringCount; i++) {
          const t = i / Math.max(params.ringCount - 1, 1)
          const spread = params.ringSpread * (1 - params.ringCompressionFactor * (1 - t))
          const perspT = Math.pow(t, 0.65)
          const r = (0.04 + perspT * spread) * d * 0.60
          const spin = frame * (params.ringRotationSpeed + erratic) * (i % 2 === 0 ? 1 : -1)
          bctx!.globalAlpha = params.ringOpacity * (0.4 + 0.6 * t) * 2.5
          bctx!.save()
          bctx!.translate(pcx, pcy)
          bctx!.beginPath()
          bctx!.ellipse(0, 0, r, r * TILT_Y, spin, 0, Math.PI * 2)
          bctx!.stroke()
          bctx!.restore()
        }
        bctx!.filter = 'none'
        bctx!.globalAlpha = 1
      }

      // Bloom particles — large soft halos on each particle
      bctx!.filter = 'blur(20px)'
      for (let i = 0; i < activeCount; i++) {
        const depthScale = 0.25 + posR[i] * 0.75
        const bloomAlpha = depthScale * 0.55
        const bloomSize  = (3 + 8 * posR[i]) * depthScale
        bctx!.globalAlpha = bloomAlpha
        bctx!.fillStyle = `rgb(${particleRgb[0]},${particleRgb[1]},${particleRgb[2]})`
        bctx!.beginPath()
        bctx!.arc(posX[i], posY[i], bloomSize, 0, Math.PI * 2)
        bctx!.fill()
      }
      bctx!.filter = 'none'
      bctx!.globalAlpha = 1

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [progressRef])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <canvas
        ref={bloomRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
    </>
  )
}
