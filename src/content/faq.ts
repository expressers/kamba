import { formatDate, formatKz } from '@/lib/format'
import { EXCHANGE_SOURCE, FEES, MONTHLY_LOAD_LIMIT_USD, PRICING_SOURCE } from '@/lib/kamba'

export interface FaqItem {
  question: string
  answer: string
}

const withVat = (kz: number) => kz * (1 + FEES.vat / 100)

/** Perguntas frequentes — usadas na página e no JSON-LD (FAQPage). */
export const FAQ: FaqItem[] = [
  {
    question: 'Quanto custa carregar o cartão Kamba do BAI?',
    answer: `O BAI cobra ${FEES.load}% sobre o valor carregado, mais ${FEES.vat}% de IVA sobre essa comissão — na prática 2,28%. Para carregar 100 000 Kz no cartão precisa de ter ${formatKz(100_000 * (1 + (FEES.load / 100) * (1 + FEES.vat / 100)))} na conta à ordem.`,
  },
  {
    question: 'Qual é a comissão das compras internacionais com o Kamba?',
    answer: `Cada compra ou pagamento (online ou TPA, em Angola ou no estrangeiro) paga ${FEES.purchase}% de comissão, mais ${FEES.vat}% de IVA sobre a comissão — 3,42% no total. Levantamentos em ATM também pagam ${FEES.withdrawal}% + IVA.`,
  },
  {
    question: 'Como carregar o cartão Kamba?',
    answer:
      'Deposite Kwanzas na sua conta à ordem BAI e faça o carregamento no BAI Directo, indicando o valor. O carregamento é feito exclusivamente a partir de Kwanzas; se tiver divisas, converta-as primeiro para Kz.',
  },
  {
    question: 'Que câmbio é usado nas compras em dólares ou euros?',
    answer: `O BAI converte a compra ao seu câmbio de venda do dia em que a compra é liquidada, normalmente 1 a 3 dias úteis depois. A calculadora usa o câmbio de venda publicado pelo BAI em ${formatDate(EXCHANGE_SOURCE.date)}, que pode alterar.`,
  },
  {
    question: 'Porque devo carregar um pouco mais do que o valor exacto?',
    answer:
      'Se o câmbio subir entre a compra e a liquidação, uma compra sem folga pode ser recusada por saldo insuficiente. Uma margem de 2% evita isso, e o valor que sobrar continua disponível no cartão.',
  },
  {
    question: 'Qual é o limite de carregamento do Kamba?',
    answer: `Em Junho de 2024 o BAI reduziu o limite mensal de carregamento do Kamba para ${MONTHLY_LOAD_LIMIT_USD} USD. Os limites podem mudar; confirme o valor em vigor no BAI Directo ou numa agência.`,
  },
  {
    question: 'Quanto custa pedir o cartão Kamba?',
    answer: `A emissão do cartão Kamba (físico ou virtual) custa ${formatKz(FEES.issuance)} mais IVA, ou seja ${formatKz(withVat(FEES.issuance))}, segundo o ${PRICING_SOURCE.label} de ${formatDate(PRICING_SOURCE.date)}. É preciso ser cliente BAI e ter pelo menos 18 anos.`,
  },
  {
    question: 'Posso pedir a alguém com Kamba para pagar por mim?',
    answer:
      'Sim. Calcule o valor, toque em "Gerar PDF para enviar" e partilhe o documento: ele mostra quanto entregar ao titular do cartão para cobrir a compra, as comissões e o IVA.',
  },
]
