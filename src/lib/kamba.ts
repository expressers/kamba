/**
 * Dados oficiais do Cartão Pré-Pago BAI Kamba.
 * Actualize aqui quando o BAI publicar novo preçário ou câmbio.
 */

export type Currency = 'USD' | 'EUR'

export const CURRENCIES: Record<Currency, { symbol: string; label: string }> = {
  USD: { symbol: '$', label: 'Dólar' },
  EUR: { symbol: '€', label: 'Euro' },
}

/** Preçário BAI Clientes Particulares, secções 3.3 e 3.4.3 (em %, excepto valores em Kz). */
export const FEES = {
  /** Carregamento de saldo no cartão (BAI Directo / balcão). */
  load: 2,
  /** Compras e pagamentos (TPA / online), em Angola ou no estrangeiro. */
  purchase: 3,
  /** Levantamento em ATM ou balcão, em Angola ou no estrangeiro. */
  withdrawal: 3,
  /** IVA sobre as comissões. */
  vat: 14,
  /** Emissão do cartão físico ou virtual (Kz, sem IVA). */
  issuance: 25_000,
  /** Cancelamento do cartão físico (Kz, sem IVA). */
  cancellation: 1_000,
} as const

export const PRICING_SOURCE = {
  label: 'Preçário BAI — Clientes Particulares',
  date: '2026-04-16',
  url: 'https://www.bancobai.ao/media/vrni4lni/bai-pre-clientes-particulares.pdf',
}

/** Câmbio de venda de divisas do BAI (Kz por unidade). */
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 992.5156,
  EUR: 1129.1849,
}

export const EXCHANGE_SOURCE = {
  label: 'BAI — Câmbios e Valores',
  date: '2026-09-28',
  url: 'https://www.bancobai.ao/pt/cambios-e-valores',
}

/** Limite mensal de carregamento comunicado pelo BAI em Junho de 2024. */
export const MONTHLY_LOAD_LIMIT_USD = 250

export const DEFAULT_MARGIN = 2

export const SITE_URL = 'https://kamba.expressers.ao'
