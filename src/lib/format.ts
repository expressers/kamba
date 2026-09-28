import { CURRENCIES, type Currency } from './kamba'

const kz = new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rate = new Intl.NumberFormat('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
const pct = new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 2 })
const date = new Intl.DateTimeFormat('pt-AO', { day: 'numeric', month: 'short', year: 'numeric' })

const safe = (n: number) => (Number.isFinite(n) ? n : 0)

export const formatKz = (n: number) => `${kz.format(safe(n))} Kz`

export const formatMoney = (n: number, currency: Currency) =>
  `${CURRENCIES[currency].symbol}${kz.format(safe(n))}`

export const formatRate = (n: number) => rate.format(safe(n))

export const formatPct = (n: number) => `${pct.format(n)}%`

/** Recebe uma data ISO (AAAA-MM-DD). */
export const formatDate = (iso: string) => date.format(new Date(`${iso}T12:00:00`))

/** Troca espaços especiais do Intl por espaços normais (fontes base do PDF). */
export const plain = (text: string) => text.replace(/[\u00a0\u202f]/g, ' ')
