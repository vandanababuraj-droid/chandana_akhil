import type { CSSProperties } from 'react'
import { imageSrcSet, imageUrl, wedding } from '@/config/wedding'

/** Fine gold rule with a diamond at its centre. */
export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <span className={`gold-divider ${className}`} aria-hidden="true">
      <span className="gold-divider__line" />
      <svg viewBox="0 0 20 20" width="12" height="12">
        <path d="M10 1 L19 10 L10 19 L1 10 Z" fill="currentColor" />
        <path d="M10 5 L15 10 L10 15 L5 10 Z" fill="var(--ivory)" />
        <circle cx="10" cy="10" r="1.6" fill="currentColor" />
      </svg>
      <span className="gold-divider__line" />
    </span>
  )
}

type FloralProps = {
  variant: 'corner' | 'garland'
  className?: string
  /** Rendered width in CSS px at the largest breakpoint — picks the srcset. */
  sizes?: string
  eager?: boolean
  style?: CSSProperties
}

/** Watercolor florals (transparent PNG, served as WebP via the Image CDN). */
export function Floral({ variant, className = '', sizes = '320px', eager = false, style }: FloralProps) {
  const img = variant === 'corner' ? wedding.images.floralCorner : wedding.images.floralGarland
  const widths = variant === 'corner' ? [240, 360, 520, 800] : [360, 640, 960, 1296]
  return (
    <img
      className={`floral floral--${variant} ${className}`}
      src={imageUrl(img.src, widths[1])}
      srcSet={imageSrcSet(img.src, widths)}
      sizes={sizes}
      width={img.width}
      height={img.height}
      alt=""
      aria-hidden="true"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      style={style}
    />
  )
}

/** Hand-drawn gold botanical sprig used as a small accent. */
export function GoldSprig({ className = '' }: { className?: string }) {
  return (
    <svg className={`gold-sprig ${className}`} viewBox="0 0 120 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
        <path d="M4 20 C 30 20, 50 20, 116 20" />
        <path d="M60 20 c -6 -8 -14 -11 -22 -10 c 5 6 13 10 22 10 Z" />
        <path d="M60 20 c -6 8 -14 11 -22 10 c 5 -6 13 -10 22 -10 Z" />
        <path d="M60 20 c 6 -8 14 -11 22 -10 c -5 6 -13 10 -22 10 Z" />
        <path d="M60 20 c 6 8 14 11 22 10 c -5 -6 -13 -10 -22 -10 Z" />
        <path d="M30 20 c -3 -5 -8 -7 -13 -6 c 3 4 8 6 13 6 Z" />
        <path d="M90 20 c 3 -5 8 -7 13 -6 c -3 4 -8 6 -13 6 Z" />
      </g>
      <circle cx="60" cy="20" r="2.2" fill="currentColor" />
    </svg>
  )
}

type PetalsProps = {
  count?: number
  /** "drift" falls gently through the scene; "burst" scatters from the centre once. */
  mode?: 'drift' | 'burst'
  gold?: number
  className?: string
}

// Deterministic pseudo-random so server and client render identically.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** A handful of CSS-animated rose petals (and optional gold flecks). */
export function Petals({ count = 8, mode = 'drift', gold = 0, className = '' }: PetalsProps) {
  const petals = Array.from({ length: count }, (_, i) => {
    const r1 = seeded(i, 1)
    const r2 = seeded(i, 2)
    const r3 = seeded(i, 3)
    const angle = (i / count) * Math.PI * 2 + r1 * 0.6
    const dist = 90 + r2 * 120
    return {
      key: `p${i}`,
      style: {
        '--x': `${(r1 * 100).toFixed(1)}%`,
        '--delay': `${(mode === 'burst' ? r3 * 0.25 : r3 * 7).toFixed(2)}s`,
        '--dur': `${(mode === 'burst' ? 1.8 + r2 * 1.2 : 9 + r2 * 7).toFixed(2)}s`,
        '--size': `${(10 + r2 * 10).toFixed(1)}px`,
        '--rot': `${Math.round(r3 * 360)}deg`,
        '--sway': `${Math.round((r1 - 0.5) * 120)}px`,
        '--dx': `${Math.round(Math.cos(angle) * dist)}px`,
        '--dy': `${Math.round(Math.sin(angle) * dist * 0.8)}px`,
      } as CSSProperties,
    }
  })
  const flecks = Array.from({ length: gold }, (_, i) => {
    const r1 = seeded(i, 7)
    const r2 = seeded(i, 8)
    const angle = (i / gold) * Math.PI * 2 + r2
    const dist = 60 + r1 * 150
    return {
      key: `g${i}`,
      style: {
        '--dx': `${Math.round(Math.cos(angle) * dist)}px`,
        '--dy': `${Math.round(Math.sin(angle) * dist)}px`,
        '--delay': `${(r2 * 0.3).toFixed(2)}s`,
        '--size': `${(2 + r1 * 3).toFixed(1)}px`,
      } as CSSProperties,
    }
  })

  return (
    <div className={`petals petals--${mode} ${className}`} aria-hidden="true">
      {petals.map((p) => (
        <span key={p.key} className="petal" style={p.style}>
          <svg viewBox="0 0 20 24">
            <path d="M10 0 C 18 5, 20 15, 10 24 C 0 15, 2 5, 10 0 Z" fill="url(#petal-fill)" />
          </svg>
        </span>
      ))}
      {flecks.map((f) => (
        <span key={f.key} className="fleck" style={f.style} />
      ))}
    </div>
  )
}

/** Shared SVG gradients, rendered once on the page. */
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="petal-fill" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fbe3df" />
          <stop offset="0.6" stopColor="#efbcb6" />
          <stop offset="1" stopColor="#d99a95" />
        </radialGradient>
        <linearGradient id="gold-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8c6a2f" />
          <stop offset="0.45" stopColor="#e3c98a" />
          <stop offset="0.7" stopColor="#b8924a" />
          <stop offset="1" stopColor="#8c6a2f" />
        </linearGradient>
      </defs>
    </svg>
  )
}
