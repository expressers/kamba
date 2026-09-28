import { FEES } from './kamba'

export interface ScenarioInput {
  /** Valor da compra na moeda estrangeira. */
  amount: number
  /** Kz por unidade da moeda estrangeira. */
  rate: number
  /** Saldo já existente no cartão, em Kz. */
  existingBalance: number
  /** Margem cambial de segurança, em %. */
  margin: number
}

export interface Scenario {
  amount: number
  rate: number
  baseKz: number
  purchaseFee: number
  purchaseVat: number
  marginKz: number
  /** Saldo que o cartão precisa de ter para a compra passar. */
  cardNeeded: number
  existingUsed: number
  /** Valor a carregar no Kamba. */
  load: number
  loadFee: number
  loadVat: number
  /** Débito total na conta à ordem. */
  total: number
  /** Comissões + IVA (compra e carregamento). */
  fees: number
}

const withVat = (pct: number) => (pct / 100) * (1 + FEES.vat / 100)

/** Custo por cada Kz de compra no cartão: comissão de compra + IVA. */
const PURCHASE_FACTOR = 1 + withVat(FEES.purchase)
/** Custo por cada Kz carregado: comissão de carregamento + IVA. */
const LOAD_FACTOR = 1 + withVat(FEES.load)

export function computeScenario({ amount, rate, existingBalance, margin }: ScenarioInput): Scenario {
  const baseKz = amount * rate
  const purchaseFee = baseKz * (FEES.purchase / 100)
  const purchaseVat = purchaseFee * (FEES.vat / 100)
  const subtotal = baseKz + purchaseFee + purchaseVat
  const marginKz = subtotal * (margin / 100)
  const cardNeeded = subtotal + marginKz

  const existingUsed = Math.min(existingBalance, cardNeeded)
  const load = cardNeeded - existingUsed
  const loadFee = load * (FEES.load / 100)
  const loadVat = loadFee * (FEES.vat / 100)

  return {
    amount,
    rate,
    baseKz,
    purchaseFee,
    purchaseVat,
    marginKz,
    cardNeeded,
    existingUsed,
    load,
    loadFee,
    loadVat,
    total: load + loadFee + loadVat,
    fees: purchaseFee + purchaseVat + loadFee + loadVat,
  }
}

/** Valor máximo de compra (moeda estrangeira) que um orçamento em Kz na conta cobre. */
export function maxAmountForBudget(
  budgetKz: number,
  { rate, existingBalance, margin }: Omit<ScenarioInput, 'amount'>,
): number {
  if (rate <= 0) return 0
  const cardAvailable = budgetKz / LOAD_FACTOR + existingBalance
  return cardAvailable / (rate * PURCHASE_FACTOR * (1 + margin / 100))
}

/** Converte o texto de um input numérico ("1.000,50", "100.000", "1000,5" ou "1000.5"). */
export function parseNumber(value: string, fallback = 0): number {
  let text = value.replace(/\s/g, '')
  // Com vírgula, ou com pontos em grupos de 3 dígitos, o ponto é separador de milhares.
  if (text.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(text)) {
    text = text.replace(/\./g, '').replace(',', '.')
  }
  const n = parseFloat(text)
  return Number.isFinite(n) && n >= 0 ? n : fallback
}
