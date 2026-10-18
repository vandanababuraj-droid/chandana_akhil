import { useCallback, useEffect, useRef, useState } from 'react'

export type MusicStatus = 'idle' | 'playing' | 'paused' | 'unavailable'

const MUTE_KEY = 'invitation:muted'

/**
 * Background music that only starts after a guest gesture. The audio element
 * is created lazily on first play, so nothing downloads until it is needed.
 */
export function useMusic(src: string | null, volume: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const resumeOnVisible = useRef(false)
  const [status, setStatus] = useState<MusicStatus>(src ? 'idle' : 'unavailable')
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === '1')
    } catch {
      /* storage blocked — keep default */
    }
  }, [])

  const getAudio = useCallback(() => {
    if (!src) return null
    if (audioRef.current) return audioRef.current
    const audio = new Audio()
    audio.src = src
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = volume
    audio.addEventListener('playing', () => setStatus('playing'))
    audio.addEventListener('pause', () => setStatus((s) => (s === 'unavailable' ? s : 'paused')))
    audio.addEventListener('error', () => setStatus('unavailable'))
    audioRef.current = audio
    return audio
  }, [src, volume])

  const play = useCallback(() => {
    const audio = getAudio()
    if (!audio) return
    // An explicit play always means "I want to hear it".
    audio.muted = false
    setMuted(false)
    try {
      localStorage.setItem(MUTE_KEY, '0')
    } catch {
      /* ignore */
    }
    audio.play().catch((err: unknown) => {
      // NotSupportedError means the file can't be played at all. Anything else
      // (a blocked autoplay, an interrupted load) leaves the control available.
      if (err instanceof DOMException && err.name === 'NotSupportedError') setStatus('unavailable')
      else setStatus('paused')
    })
  }, [getAudio])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m
      if (audioRef.current) audioRef.current.muted = next
      try {
        localStorage.setItem(MUTE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  // Pause while the tab is hidden; resume when the guest returns.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        resumeOnVisible.current = !audio.paused
        audio.pause()
      } else if (resumeOnVisible.current) {
        resumeOnVisible.current = false
        audio.play().catch(() => setStatus('paused'))
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Release the audio resource on unmount.
  useEffect(
    () => () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
        audioRef.current = null
      }
    },
    [],
  )

  return { status, muted, play, pause, toggleMute }
}

export type Music = ReturnType<typeof useMusic>
