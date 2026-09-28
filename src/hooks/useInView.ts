import { useEffect, useRef, useState } from 'react'

/** Indica se o elemento está visível no ecrã (true até ser medido, para o SSR). */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '-56px 0px 0px 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}
