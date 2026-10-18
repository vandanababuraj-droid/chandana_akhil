import { useCallback, useEffect, useRef, useState } from 'react'
import { wedding } from '@/config/wedding'
import { FadeIn } from './FadeIn'
import { GoldDivider, Petals } from './Ornaments'

const BRUSH = 22 // brush radius in CSS px
const GRID_X = 24
const GRID_Y = 14
const REVEAL_AT = 0.5 // share of the surface scratched before auto-reveal

/**
 * A gold foil card the guest scratches with a finger or mouse to uncover the
 * wedding date. The date is always in the page underneath (readable by screen
 * readers), and a button reveals it without scratching.
 */
export function ScratchReveal({ reducedMotion }: { reducedMotion: boolean }) {
  const { event, text } = wedding
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grid = useRef<Uint8Array>(new Uint8Array(GRID_X * GRID_Y))
  const scratched = useRef(0)
  const last = useRef<{ x: number; y: number } | null>(null)
  const pointerId = useRef<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [started, setStarted] = useState(false)

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const w = rect.width
    const h = rect.height

    const foil = ctx.createLinearGradient(0, 0, w, h)
    foil.addColorStop(0, '#c9a35c')
    foil.addColorStop(0.28, '#ecd7a2')
    foil.addColorStop(0.5, '#d6b46f')
    foil.addColorStop(0.72, '#f3e3b8')
    foil.addColorStop(1, '#b8914b')
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = foil
    ctx.fillRect(0, 0, w, h)

    // Fine brushed-metal grain, deterministic so repaints look identical.
    let seed = 7
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < Math.round((w * h) / 90); i++) {
      ctx.fillStyle = rand() > 0.5 ? 'rgba(255,248,225,0.22)' : 'rgba(120,88,36,0.12)'
      ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 6, 0.7)
    }

    // Inner gold rule.
    ctx.strokeStyle = 'rgba(255, 246, 220, 0.75)'
    ctx.lineWidth = 1
    ctx.strokeRect(10.5, 10.5, w - 21, h - 21)
    ctx.strokeStyle = 'rgba(122, 90, 40, 0.35)'
    ctx.strokeRect(14.5, 14.5, w - 29, h - 29)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(78, 56, 22, 0.88)'
    ctx.font = `italic 500 ${Math.round(Math.min(34, w / 10))}px "Cormorant Garamond", Georgia, serif`
    ctx.fillText(text.scratchPrompt, w / 2, h / 2 - 10)
    ctx.fillStyle = 'rgba(78, 56, 22, 0.7)'
    ctx.font = `500 ${Math.round(Math.min(11, w / 32))}px Montserrat, system-ui, sans-serif`
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '3px'
    ctx.fillText(text.scratchHint.toUpperCase(), w / 2, h / 2 + 26)

    grid.current.fill(0)
    scratched.current = 0
  }, [text.scratchPrompt, text.scratchHint])

  // Paint once fonts are ready, and again if the card's width changes.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return
    let width = 0
    let cancelled = false
    const repaint = () => {
      const w = canvas.getBoundingClientRect().width
      if (w && w !== width) {
        width = w
        paint()
      }
    }
    repaint()
    document.fonts?.ready.then(() => {
      if (!cancelled && scratched.current === 0) {
        width = 0
        repaint()
      }
    })
    const ro = new ResizeObserver(repaint)
    ro.observe(canvas)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [paint, revealed])

  const reveal = useCallback(() => {
    setRevealed(true)
    if (!reducedMotion) {
      setCelebrate(true)
      navigator.vibrate?.(12)
    }
  }, [reducedMotion])

  useEffect(() => {
    if (!celebrate) return
    const t = window.setTimeout(() => setCelebrate(false), 3200)
    return () => window.clearTimeout(t)
  }, [celebrate])

  const scratchTo = (x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    const from = last.current ?? { x, y }
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = BRUSH * 2
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    last.current = { x, y }

    // Mark coarse grid cells under the stroke to estimate coverage cheaply.
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (BRUSH / 2)))
    const cw = rect.width / GRID_X
    const ch = rect.height / GRID_Y
    for (let s = 0; s <= steps; s++) {
      const px = from.x + ((x - from.x) * s) / steps
      const py = from.y + ((y - from.y) * s) / steps
      const gx0 = Math.max(0, Math.floor((px - BRUSH) / cw))
      const gx1 = Math.min(GRID_X - 1, Math.floor((px + BRUSH) / cw))
      const gy0 = Math.max(0, Math.floor((py - BRUSH) / ch))
      const gy1 = Math.min(GRID_Y - 1, Math.floor((py + BRUSH) / ch))
      for (let gy = gy0; gy <= gy1; gy++) {
        for (let gx = gx0; gx <= gx1; gx++) {
          const cx = (gx + 0.5) * cw
          const cy = (gy + 0.5) * ch
          const idx = gy * GRID_X + gx
          if (!grid.current[idx] && Math.hypot(cx - px, cy - py) <= BRUSH) {
            grid.current[idx] = 1
            scratched.current++
          }
        }
      }
    }
    if (scratched.current / (GRID_X * GRID_Y) >= REVEAL_AT) reveal()
  }

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed || pointerId.current !== null) return
    e.preventDefault()
    pointerId.current = e.pointerId
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setStarted(true)
    last.current = null
    const p = point(e)
    scratchTo(p.x, p.y)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed || e.pointerId !== pointerId.current) return
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]
    const rect = e.currentTarget.getBoundingClientRect()
    for (const ev of events) scratchTo(ev.clientX - rect.left, ev.clientY - rect.top)
  }

  const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerId !== pointerId.current) return
    pointerId.current = null
    last.current = null
  }

  return (
    <section className="section scratch-section" aria-labelledby="scratch-title">
      <FadeIn>
        <p className="eyebrow" id="scratch-title">
          {text.scratchEyebrow}
        </p>
      </FadeIn>

      <FadeIn delay={120} className="scratch" >
        <div className="scratch__card" data-revealed={revealed || undefined}>
          <div className="scratch__date" aria-live="polite">
            <span className="scratch__weekday">{event.displayWeekday}</span>
            <span className="scratch__day">{event.displayDate.toUpperCase()}</span>
            <GoldDivider />
            <span className="scratch__time">{event.displayTime.toUpperCase()}</span>
          </div>
          {!revealed || celebrate ? (
            <canvas
              ref={canvasRef}
              className="scratch__canvas"
              data-started={started || undefined}
              data-gone={revealed || undefined}
              aria-hidden="true"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onLostPointerCapture={endStroke}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null}
          {celebrate && <Petals count={10} gold={16} mode="burst" className="scratch__burst" />}
        </div>
      </FadeIn>

      <div className="scratch__alt">
        {revealed ? (
          <p className="scratch__thanks">We can’t wait to celebrate with you.</p>
        ) : (
          <button type="button" className="text-button" onClick={reveal}>
            Reveal the date without scratching
          </button>
        )}
      </div>
    </section>
  )
}
