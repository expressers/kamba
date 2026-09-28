import { describe, expect, test } from 'bun:test'
import { computeScenario, maxAmountForBudget, parseNumber } from './calculator'

describe('parseNumber', () => {
  test.each([
    ['1.000,50', 1000.5],
    ['992,5156', 992.5156],
    ['992.5156', 992.5156],
    ['1 000', 1000],
    ['100.000', 100_000],
    ['1.250.000', 1_250_000],
    ['12.5', 12.5],
  ])('pt: %s → %d', (input, expected) => {
    expect(parseNumber(input, 0, 'pt')).toBeCloseTo(expected, 4)
  })

  test.each([
    ['1,000.50', 1000.5],
    ['100,000', 100_000],
    ['992.5156', 992.5156],
    ['992,5156', 992.5156],
    ['12,5', 12.5],
  ])('en: %s → %d', (input, expected) => {
    expect(parseNumber(input, 0, 'en')).toBeCloseTo(expected, 4)
  })

  test('usa o fallback para texto inválido ou negativo', () => {
    expect(parseNumber('abc', 7)).toBe(7)
    expect(parseNumber('-5', 0)).toBe(0)
  })
})

describe('computeScenario', () => {
  test('compra de $300 a 1 000 Kz com margem de 2%', () => {
    const s = computeScenario({ amount: 300, rate: 1000, existingBalance: 0, margin: 2 })
    expect(s.baseKz).toBeCloseTo(300_000, 2)
    expect(s.purchaseFee).toBeCloseTo(9_000, 2)
    expect(s.purchaseVat).toBeCloseTo(1_260, 2)
    expect(s.load).toBeCloseTo(316_465.2, 2)
    expect(s.total).toBeCloseTo(323_680.61, 2)
  })

  test('abate o saldo existente e nunca fica negativo', () => {
    const partial = computeScenario({ amount: 100, rate: 1000, existingBalance: 50_000, margin: 0 })
    expect(partial.load).toBeCloseTo(103_420 - 50_000, 2)

    const covered = computeScenario({ amount: 10, rate: 1000, existingBalance: 1e9, margin: 2 })
    expect(covered.load).toBe(0)
    expect(covered.total).toBe(0)
  })
})

describe('maxAmountForBudget', () => {
  test('é o inverso exacto de computeScenario', () => {
    const inputs = { rate: 992.5156, existingBalance: 5_000, margin: 2 }
    const amount = maxAmountForBudget(100_000, inputs)
    expect(computeScenario({ amount, ...inputs }).total).toBeCloseTo(100_000, 2)
  })

  test('devolve 0 sem câmbio válido', () => {
    expect(maxAmountForBudget(100_000, { rate: 0, existingBalance: 0, margin: 2 })).toBe(0)
  })
})
