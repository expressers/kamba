import { PATHS } from '@/content/routes'
import { parseNumber } from './calculator'
import type { Locale } from './format'
import { DEFAULT_MARGIN, EXCHANGE_RATES, SITE_URL, type Currency } from './kamba'

export type Mode = 'pay' | 'budget'

export interface CalculatorState {
  mode: Mode
  currency: Currency
  /** Valor da compra na moeda estrangeira (modo "pay"). */
  amount: string
  /** Kz disponíveis na conta (modo "budget"). */
  budget: string
  rate: string
  balance: string
  margin: number
}

/** Câmbio em formato de input: "992,5156" (pt) ou "992.5156" (en). */
export const rateInput = (rate: number, locale: Locale) =>
  locale === 'pt' ? String(rate).replace('.', ',') : String(rate)

export const defaultState = (locale: Locale): CalculatorState => ({
  mode: 'pay',
  currency: 'USD',
  amount: '50',
  budget: '',
  rate: rateInput(EXCHANGE_RATES.USD, locale),
  balance: '',
  margin: DEFAULT_MARGIN,
})

/** Lê uma simulação partilhada via URL (?v=50&m=USD&c=992.5&s=0&mg=2). Números com ponto decimal. */
export function stateFromSearch(search: string, locale: Locale): CalculatorState | null {
  const params = new URLSearchParams(search)
  if (!params.has('v')) return null

  const currency: Currency = params.get('m') === 'EUR' ? 'EUR' : 'USD'
  const num = (key: string, fallback: number) => parseNumber(params.get(key) ?? '', fallback, 'en')
  const show = (n: number) => rateInput(n, locale)

  return {
    ...defaultState(locale),
    currency,
    amount: show(num('v', 50)),
    rate: show(num('c', EXCHANGE_RATES[currency])),
    balance: params.has('s') ? show(num('s', 0)) : '',
    margin: Math.min(10, num('mg', DEFAULT_MARGIN)),
  }
}

/** Link que reabre exactamente esta simulação, no mesmo idioma. */
export function shareUrl(state: CalculatorState, amount: number, locale: Locale): string {
  const rate = parseNumber(state.rate, EXCHANGE_RATES[state.currency], locale)
  const balance = parseNumber(state.balance, 0, locale)
  const params = new URLSearchParams({ v: String(Math.round(amount * 100) / 100), m: state.currency })
  params.set('c', String(rate))
  if (balance > 0) params.set('s', String(balance))
  if (state.margin !== DEFAULT_MARGIN) params.set('mg', String(state.margin))
  return `${SITE_URL}${PATHS[locale].calculator}?${params}`
}
