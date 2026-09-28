import { createContext, useContext } from 'react'
import { PATHS, type PageId } from '@/content/routes'
import { formatters, type Formatters, type Locale } from '@/lib/format'
import { en } from './en'
import { pt, type Messages } from './pt'

export type { Messages }

export const MESSAGES: Record<Locale, Messages> = { pt, en }

export interface I18n {
  locale: Locale
  page: PageId
  t: Messages
  f: Formatters
  /** URL de uma página no idioma actual. */
  href: (page: PageId) => string
}

export function createI18n(locale: Locale, page: PageId): I18n {
  return {
    locale,
    page,
    t: MESSAGES[locale],
    f: formatters(locale),
    href: (target) => PATHS[locale][target],
  }
}

export const I18nContext = createContext<I18n>(createI18n('pt', 'calculator'))

export const useI18n = () => useContext(I18nContext)
