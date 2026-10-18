import { useEffect, useState } from 'react'

/** A quiet "keep scrolling" hint that fades away once the guest scrolls. */
export function ScrollCue() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a href="#our-story" className="scroll-cue" data-hidden={hidden || undefined} aria-label="Scroll to continue">
      <span className="scroll-cue__label">Scroll</span>
      <span className="scroll-cue__track" aria-hidden="true">
        <span className="scroll-cue__dot" />
      </span>
    </a>
  )
}
