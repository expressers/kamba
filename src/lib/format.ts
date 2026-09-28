import { CURRENCIES, type Currency } from './kamba'

export type Locale = 'pt' | 'en'

const INTL_LOCALE: Record<Locale, string> = { pt: 'pt-AO', en: 'en-US' }

export interface Formatters {
  kz: (n: number) => string
  money: (n: number, currency: Currency) => string
  rate: (n: number) => string
  pct: (n: number) => string
  /** Data ISO (AAAA-MM-DD) → "28/09/2026" ou "Sep 28, 2026". */
  date: (iso: string) => string
}

const safe = (n: number) => (Number.isFinite(n) ? n : 0)
const cache = new Map<Locale, Formatters>()

export function formatters(locale: Locale): Formatters {
  const cached = cache.get(locale)
  if (cached) return cached

  const tag = INTL_LOCALE[locale]
  const amount = new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const rate = new Intl.NumberFormat(tag, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  const pct = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 })
  const date = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short', year: 'numeric' })

  const f: Formatters = {
    kz: (n) => `${amount.format(safe(n))} Kz`,
    money: (n, currency) => `${CURRENCIES[currency].symbol}${amount.format(safe(n))}`,
    rate: (n) => rate.format(safe(n)),
    pct: (n) => `${pct.format(n)}%`,
    date: (iso) => date.format(new Date(`${iso}T12:00:00`)),
  }
  cache.set(locale, f)
  return f
}

/** Troca espaços especiais do Intl por espaços normais (fontes base do PDF). */
export const plain = (text: string) => text.replace(/[\u00a0\u202f]/g, ' ')
