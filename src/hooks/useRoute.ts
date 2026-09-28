import { useEffect, useSyncExternalStore } from 'react'
import { absoluteUrl, findRoute } from '@/content/routes'
import { MESSAGES } from '@/i18n'
import { getRoute, getServerRoute, subscribeRoute } from '@/lib/router'

/** Página e idioma actuais; mantém <html lang>, título, descrição e canonical ao navegar. */
export function useRoute() {
  const pathname = useSyncExternalStore(subscribeRoute, getRoute, getServerRoute)
  const route = findRoute(pathname)

  useEffect(() => {
    const t = MESSAGES[route.locale]
    const page = t.pages[route.page]
    document.documentElement.lang = t.meta.htmlLang
    document.title = page.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', absoluteUrl(route.path))
  }, [route.locale, route.page, route.path])

  return route
}
