import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import type { Music } from '@/hooks/useMusic'
import { wedding } from '@/config/wedding'

/** Discreet floating music control: play / pause, and mute / unmute. */
export function MusicPlayer({ music, visible }: { music: Music; visible: boolean }) {
  if (music.status === 'unavailable') return null
  const playing = music.status === 'playing'
  return (
    <div className="music" data-visible={visible || undefined} data-playing={playing || undefined}>
      <button
        type="button"
        className="music__btn music__btn--main"
        onClick={playing ? music.pause : music.play}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={wedding.music.title}
      >
        {playing ? (
          <span className="music__bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        ) : null}
        {playing ? <Pause aria-hidden="true" className="music__icon music__icon--pause" /> : <Play aria-hidden="true" className="music__icon" />}
      </button>
      {music.status !== 'idle' && (
        <button
          type="button"
          className="music__btn"
          onClick={music.toggleMute}
          aria-label={music.muted ? 'Unmute music' : 'Mute music'}
          aria-pressed={music.muted}
        >
          {music.muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      )}
    </div>
  )
}
