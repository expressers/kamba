import { Calculator, CircleHelp, ListChecks, Receipt, type LucideIcon } from 'lucide-react'
import type { Locale } from '@/lib/format'
import { SITE_URL } from '@/lib/kamba'

export type PageId = 'calculator' | 'howto' | 'fees' | 'faq'

export const PAGE_IDS: PageId[] = ['calculator', 'howto', 'fees', 'faq']
export const LOCALES: Locale[] = ['pt', 'en']

export const PAGE_ICONS: Record<PageId, LucideIcon> = {
  calculator: Calculator,
  howto: ListChecks,
  fees: Receipt,
  faq: CircleHelp,
}

/** URLs de cada página por idioma (português na raiz, inglês em /en). */
export const PATHS: Record<Locale, Record<PageId, string>> = {
  pt: { calculator: '/', howto: '/como-carregar', fees: '/taxas', faq: '/perguntas' },
  en: { calculator: '/en', howto: '/en/how-to-load', fees: '/en/fees', faq: '/en/faq' },
}

export interface Route {
  locale: Locale
  page: PageId
  path: string
}

export const ROUTES: Route[] = LOCALES.flatMap((locale) =>
  PAGE_IDS.map((page) => ({ locale, page, path: PATHS[locale][page] })),
)

export function findRoute(pathname: string): Route {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return (
    ROUTES.find((r) => r.path === clean) ?? {
      locale: clean.startsWith('/en') ? 'en' : 'pt',
      page: 'calculator',
      path: clean.startsWith('/en') ? PATHS.en.calculator : PATHS.pt.calculator,
    }
  )
}

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`
