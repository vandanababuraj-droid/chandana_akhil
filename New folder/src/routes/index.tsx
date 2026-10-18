import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { wedding } from '@/config/wedding'
import { useMusic } from '@/hooks/useMusic'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { OpeningAnimation } from '@/components/invitation/OpeningAnimation'
import { RevealScene } from '@/components/invitation/RevealScene'
import { CoupleIntroduction } from '@/components/invitation/CoupleIntroduction'
import { ScratchReveal } from '@/components/invitation/ScratchReveal'
import { WeddingCountdown } from '@/components/invitation/WeddingCountdown'
import { VenueSection } from '@/components/invitation/VenueSection'
import { ClosingSection } from '@/components/invitation/ClosingSection'
import { MusicPlayer } from '@/components/invitation/MusicPlayer'
import { SvgDefs } from '@/components/invitation/Ornaments'

export const Route = createFileRoute('/')({
  component: Invitation,
})

type Stage = 'cover' | 'opening' | 'open'

function Invitation() {
  const reducedMotion = useReducedMotion()
  const music = useMusic(wedding.music.src, wedding.music.volume)
  const [stage, setStage] = useState<Stage>('cover')

  // Guests arriving on a deep link (e.g. /#our-story) or ?open skip the cover.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (window.location.hash || params.has('open')) setStage('open')
  }, [])

  // Hold the page still while the cover is showing.
  useEffect(() => {
    if (stage === 'open') return
    const root = document.documentElement
    root.classList.add('is-locked')
    return () => root.classList.remove('is-locked')
  }, [stage])

  const { play, muted } = music
  const onOpenStart = useCallback(() => {
    window.scrollTo(0, 0)
    setStage('opening')
    if (wedding.music.playOnOpen && !muted) play()
  }, [play, muted])

  const onOpenEnd = useCallback(() => setStage('open'), [])

  return (
    <>
      <SvgDefs />
      {stage !== 'open' && (
        <OpeningAnimation onOpenStart={onOpenStart} onOpenEnd={onOpenEnd} reducedMotion={reducedMotion} />
      )}
      <MusicPlayer music={music} visible={stage === 'open'} />
      <main className="invitation" data-stage={stage} aria-hidden={stage === 'cover' || undefined}>
        <RevealScene active={stage !== 'cover'} reducedMotion={reducedMotion} />
        <CoupleIntroduction />
        <ScratchReveal reducedMotion={reducedMotion} />
        <WeddingCountdown />
        <VenueSection />
        <ClosingSection reducedMotion={reducedMotion} />
      </main>
    </>
  )
}
