import { parseNumber } from './calculator'
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

/** Câmbio em formato de input, com vírgula decimal (ex: "992,5156"). */
export const rateInput = (rate: number) => String(rate).replace('.', ',')

export const DEFAULT_STATE: CalculatorState = {
  mode: 'pay',
  currency: 'USD',
  amount: '50',
  budget: '',
  rate: rateInput(EXCHANGE_RATES.USD),
  balance: '',
  margin: DEFAULT_MARGIN,
}

/** Lê uma simulação partilhada via URL (?v=50&m=USD&c=992.5&s=0&mg=2). */
export function stateFromSearch(search: string): CalculatorState | null {
  const params = new URLSearchParams(search)
  if (!params.has('v') && !params.has('k')) return null

  const currency: Currency = params.get('m') === 'EUR' ? 'EUR' : 'USD'
  const margin = parseNumber(params.get('mg') ?? '', DEFAULT_MARGIN)

  return {
    mode: params.has('k') ? 'budget' : 'pay',
    currency,
    amount: params.get('v') ?? DEFAULT_STATE.amount,
    budget: params.get('k') ?? '',
    rate: params.get('c') ?? rateInput(EXCHANGE_RATES[currency]),
    balance: params.get('s') ?? '',
    margin: Math.min(10, margin),
  }
}

/** Link que reabre exactamente esta simulação. */
export function shareUrl(state: CalculatorState, amount: number): string {
  const params = new URLSearchParams({ v: String(Math.round(amount * 100) / 100), m: state.currency })
  params.set('c', String(parseNumber(state.rate, EXCHANGE_RATES[state.currency])))
  if (parseNumber(state.balance) > 0) params.set('s', state.balance)
  if (state.margin !== DEFAULT_MARGIN) params.set('mg', String(state.margin))
  return `${SITE_URL}/?${params}`
}
