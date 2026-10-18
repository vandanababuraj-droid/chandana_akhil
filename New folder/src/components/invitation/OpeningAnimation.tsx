import { useEffect, useRef, useState } from 'react'
import { InvitationCover } from './InvitationCover'
import { Petals } from './Ornaments'

type Props = {
  /** Called synchronously inside the tap, so music may start with the gesture. */
  onOpenStart: () => void
  /** Called once the gatefold has fully opened and the overlay can go. */
  onOpenEnd: () => void
  reducedMotion: boolean
}

const OPEN_MS = 1900
const OPEN_MS_REDUCED = 400

/**
 * Full-screen opening scene. Holds the cover, then plays the gatefold
 * opening — seal lifts, doors swing open, a soft light blooms and a few
 * petals drift — before handing over to the inner invitation.
 */
export function OpeningAnimation({ onOpenStart, onOpenEnd, reducedMotion }: Props) {
  const [opening, setOpening] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const open = () => {
    if (opening) return
    setOpening(true)
    onOpenStart()
    timer.current = window.setTimeout(onOpenEnd, reducedMotion ? OPEN_MS_REDUCED : OPEN_MS)
  }

  return (
    <div
      className="opening"
      data-phase={opening ? 'opening' : 'closed'}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation cover"
    >
      <div className="opening__light" aria-hidden="true" />
      <InvitationCover onOpen={open} opening={opening} />
      {opening && !reducedMotion && <Petals count={10} mode="drift" className="opening__petals" />}
    </div>
  )
}
