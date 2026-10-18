import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
}

/** Gently fades and lifts its content in as it enters the viewport. */
export function FadeIn({ children, className = '', delay = 0 }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`fade-in ${className}`}
      data-in={inView || undefined}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
