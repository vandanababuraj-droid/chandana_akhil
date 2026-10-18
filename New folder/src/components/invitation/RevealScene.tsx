import { wedding } from '@/config/wedding'
import { Floral, GoldSprig, Petals } from './Ornaments'
import { ScrollCue } from './ScrollCue'

/**
 * The inner card revealed by the opening: an illuminated paper surface, a
 * gold line that draws itself, and the couple's names fading in.
 */
export function RevealScene({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const { couple, event, text } = wedding
  return (
    <section className="reveal-scene" data-active={active || undefined} aria-labelledby="reveal-title">
      <div className="reveal-scene__glow" aria-hidden="true" />
      <Floral variant="garland" className="reveal-scene__garland" sizes="(min-width: 640px) 560px, 92vw" eager />

      <div className="reveal-scene__content">
        <p className="eyebrow reveal-step" style={{ '--i': 0 } as React.CSSProperties}>
          {text.revealEyebrow}
        </p>

        <h1 id="reveal-title" className="reveal-scene__names">
          <span className="reveal-name reveal-step" style={{ '--i': 1 } as React.CSSProperties}>
            {couple.bride}
          </span>
          <span className="reveal-scene__amp reveal-step" style={{ '--i': 2 } as React.CSSProperties}>
            &amp;
          </span>
          <span className="reveal-name reveal-step" style={{ '--i': 3 } as React.CSSProperties}>
            {couple.groom}
          </span>
        </h1>

        <svg className="draw-line" viewBox="0 0 320 24" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <path
            pathLength={1}
            d="M4 12 C 60 12, 100 12, 140 12 C 150 12, 152 4, 160 4 C 168 4, 170 12, 180 12 C 220 12, 260 12, 316 12"
          />
          <path pathLength={1} d="M160 4 C 152 4, 150 20, 160 20 C 170 20, 168 4, 160 4 Z" />
        </svg>

        <p className="reveal-scene__line reveal-step" style={{ '--i': 4 } as React.CSSProperties}>
          {text.revealLine}
        </p>
        <p className="reveal-scene__date reveal-step" style={{ '--i': 5 } as React.CSSProperties}>
          <span>{event.displayWeekday}</span>
          <span className="dot" aria-hidden="true" />
          <span>{event.displayDate}</span>
        </p>
        <GoldSprig className="reveal-scene__sprig reveal-step" />
      </div>

      {active && !reducedMotion && <Petals count={6} mode="drift" className="reveal-scene__petals" />}
      <ScrollCue />
    </section>
  )
}
