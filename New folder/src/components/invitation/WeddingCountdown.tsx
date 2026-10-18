import { memo, useEffect, useState } from 'react'
import { wedding } from '@/config/wedding'
import { FadeIn } from './FadeIn'

const { event, countdown } = wedding

/** Instant (ms since epoch) of a wall-clock time at the venue. */
function venueInstant(date: string, time: string) {
  return Date.parse(`${date}T${time}:00${event.utcOffset}`)
}

const dayStart = venueInstant(event.date, '00:00')
const dayEnd = dayStart + 24 * 60 * 60 * 1000
const target = countdown.ceremonyStart ? venueInstant(event.date, countdown.ceremonyStart) : dayStart

type Phase = 'before' | 'today' | 'after'

function phaseAt(now: number): Phase {
  if (now < target) return 'before'
  if (now < dayEnd) return 'today'
  return 'after'
}

/** Seconds remaining, ticking once per second aligned to the clock. */
function useCountdown() {
  const [state, setState] = useState<{ seconds: number; phase: Phase } | null>(null)
  useEffect(() => {
    let timer: number
    const tick = () => {
      const now = Date.now()
      const seconds = Math.max(0, Math.floor((target - now) / 1000))
      const phase = phaseAt(now)
      setState((prev) => (prev && prev.seconds === seconds && prev.phase === phase ? prev : { seconds, phase }))
      if (phase === 'after') return
      timer = window.setTimeout(tick, 1000 - (now % 1000) + 5)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [])
  return state
}

const Unit = memo(function Unit({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="countdown__unit">
      <span className="countdown__value">{value === null ? '––' : String(value).padStart(2, '0')}</span>
      <span className="countdown__label">{label}</span>
    </div>
  )
})

/** Live countdown to the wedding in the venue's time zone (Asia/Kolkata). */
export function WeddingCountdown() {
  const state = useCountdown()
  const seconds = state?.seconds ?? null
  const phase = state?.phase ?? null

  const days = seconds === null ? null : Math.floor(seconds / 86400)
  const hours = seconds === null ? null : Math.floor((seconds % 86400) / 3600)
  const minutes = seconds === null ? null : Math.floor((seconds % 3600) / 60)
  const secs = seconds === null ? null : seconds % 60

  return (
    <section className="section countdown-section" aria-labelledby="countdown-title">
      <FadeIn>
        <p className="eyebrow" id="countdown-title">
          {wedding.text.countdownEyebrow}
        </p>
      </FadeIn>

      <FadeIn delay={120}>
        {phase === 'today' || phase === 'after' ? (
          <p className="countdown__message" role="status">
            {phase === 'today' ? countdown.weddingDayMessage : countdown.afterMessage}
          </p>
        ) : (
          <div className="countdown" role="timer" aria-live="off">
            <Unit value={days} label="Days" />
            <span className="countdown__sep" aria-hidden="true" />
            <Unit value={hours} label="Hours" />
            <span className="countdown__sep" aria-hidden="true" />
            <Unit value={minutes} label="Minutes" />
            <span className="countdown__sep" aria-hidden="true" />
            <Unit value={secs} label="Seconds" />
          </div>
        )}
      </FadeIn>

      <FadeIn delay={220}>
        <p className="countdown__caption">
          {phase === 'before' || phase === null
            ? countdown.ceremonyStart
              ? countdown.labelBeforeCeremony
              : countdown.labelBeforeDay
            : null}
          {(phase === 'before' || phase === null) && (
            <span className="countdown__tz">
              {event.displayDate} · {event.displayTime} · India Standard Time
            </span>
          )}
        </p>
      </FadeIn>
    </section>
  )
}
