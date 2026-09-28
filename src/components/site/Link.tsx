import type { ComponentProps, MouseEvent } from 'react'
import { navigate } from '@/lib/router'

/** <a> interno: navega sem recarregar, mas continua a ser um link real para SEO. */
export function Link({ href, onClick, ...props }: ComponentProps<'a'> & { href: string }) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handleClick} {...props} />
}
