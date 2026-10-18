import { useEffect, useRef, useState } from 'react'

/** Flags an element once it scrolls into view (and stays flagged). */
export function useInView<T extends Element>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return [ref, inView] as const
}
