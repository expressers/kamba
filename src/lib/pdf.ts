import type { Scenario } from './calculator'
import { formatDate, formatKz, formatMoney, formatPct, formatRate, plain } from './format'
import { EXCHANGE_SOURCE, FEES, type Currency } from './kamba'

export interface PdfDetails {
  scenario: Scenario
  currency: Currency
  margin: number
  url: string
  /** Titular do cartão Kamba (quem recebe o dinheiro). */
  cardholder?: string
  /** Quem paga / entrega o dinheiro. */
  payer?: string
  /** Para que é a compra (ex: "Subscrição Netflix"). */
  description?: string
}

const NAVY: [number, number, number] = [10, 53, 86]
const GOLD: [number, number, number] = [212, 160, 23]
const MUTED: [number, number, number] = [100, 116, 139]
const TEXT: [number, number, number] = [30, 41, 59]
const LINE: [number, number, number] = [226, 232, 240]

/** Gera o PDF de "pedido de carregamento" (A5), carregando o jsPDF sob pedido. */
export async function createRequestPdf(d: PdfDetails): Promise<File> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  const s = d.scenario
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const X = 12
  const R = W - 12
  const t = (text: string) => plain(text)
  const now = new Date()
  const issued = now.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' })

  // Cabeçalho
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 30, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...GOLD)
  doc.text('CARTÃO BAI KAMBA', X, 12)
  doc.setFontSize(15)
  doc.setTextColor(255, 255, 255)
  doc.text('Pedido de carregamento', X, 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(issued, R, 12, { align: 'right' })

  // Valor principal
  let y = 44
  doc.setTextColor(...MUTED)
  doc.setFontSize(9)
  doc.text('Valor a entregar ao titular do cartão', X, y)
  y += 11
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...NAVY)
  doc.text(t(formatKz(s.total)), X, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...TEXT)
  doc.text(
    t(`Para uma compra de ${formatMoney(s.amount, d.currency)}, incluindo todas as comissões e IVA.`),
    X,
    y,
  )

  // Partes envolvidas
  const parties = [
    ['Compra', d.description],
    ['Titular do cartão', d.cardholder],
    ['Pago por', d.payer],
  ].filter((p): p is [string, string] => Boolean(p[1]?.trim()))

  if (parties.length) {
    y += 6
    const boxH = parties.length * 6 + 4
    doc.setFillColor(248, 250, 252)
    doc.setDrawColor(...LINE)
    doc.roundedRect(X, y, R - X, boxH, 2, 2, 'FD')
    y += 6.5
    for (const [label, value] of parties) {
      doc.setTextColor(...MUTED)
      doc.text(label, X + 4, y)
      doc.setTextColor(...TEXT)
      doc.setFont('helvetica', 'bold')
      doc.text(t(value.trim()).slice(0, 60), X + 34, y)
      doc.setFont('helvetica', 'normal')
      y += 6
    }
    y += 2
  }

  // Detalhe
  y += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...NAVY)
  doc.text('Como chegámos a este valor', X, y)
  y += 3

  const row = (label: string, value: string, strong = false) => {
    y += 7
    doc.setFont('helvetica', strong ? 'bold' : 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...(strong ? NAVY : TEXT))
    doc.text(t(label), X, y)
    doc.text(t(value), R, y, { align: 'right' })
    doc.setDrawColor(...LINE)
    doc.line(X, y + 2.5, R, y + 2.5)
  }

  row(`Compra ${formatMoney(s.amount, d.currency)} x ${formatRate(s.rate)} Kz`, formatKz(s.baseKz))
  row(`Comissão de compra (${formatPct(FEES.purchase)})`, formatKz(s.purchaseFee))
  row(`IVA sobre a comissão (${formatPct(FEES.vat)})`, formatKz(s.purchaseVat))
  if (s.marginKz > 0) row(`Margem de segurança cambial (${formatPct(d.margin)})`, formatKz(s.marginKz))
  if (s.existingUsed > 0) row('Saldo já existente no cartão', `- ${formatKz(s.existingUsed)}`)
  row('Valor a carregar no Kamba', formatKz(s.load), true)
  row(`Comissão de carregamento (${formatPct(FEES.load)})`, formatKz(s.loadFee))
  row(`IVA sobre a comissão (${formatPct(FEES.vat)})`, formatKz(s.loadVat))

  y += 9
  doc.setFillColor(...NAVY)
  doc.roundedRect(X, y - 5.5, R - X, 9, 1.5, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text('Total a entregar', X + 3, y)
  doc.text(t(formatKz(s.total)), R - 3, y, { align: 'right' })

  // Notas
  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  const notes = [
    `Câmbio de venda BAI de ${formatDate(EXCHANGE_SOURCE.date)}. O banco aplica o câmbio do dia em que a compra é liquidada (1 a 3 dias úteis).`,
    s.marginKz > 0
      ? `A margem de ${formatKz(s.marginKz)} protege contra variações do câmbio; o que não for usado fica no cartão.`
      : 'Sem margem de segurança: se o câmbio subir, a compra pode ser recusada por saldo insuficiente.',
    'Valores estimados com base no preçário BAI em vigor. Este documento não é emitido pelo BAI.',
  ]
  for (const note of notes) {
    const lines = doc.splitTextToSize(t(`• ${note}`), R - X)
    doc.text(lines, X, y)
    y += lines.length * 3.6 + 1.5
  }

  // Rodapé
  doc.setDrawColor(...LINE)
  doc.line(X, H - 16, R, H - 16)
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('Simulação feita em', X, H - 10)
  doc.setTextColor(...NAVY)
  doc.textWithLink('kamba.expressers.ao', X + 26, H - 10, { url: d.url })
  doc.setTextColor(...MUTED)
  doc.text('Toque para abrir e ajustar', R, H - 10, { align: 'right' })
  doc.link(0, H - 16, W, 16, { url: d.url })

  const stamp = now.toISOString().slice(0, 10)
  const name = `kamba-${Math.round(s.amount)}${d.currency.toLowerCase()}-${stamp}.pdf`
  return new File([doc.output('blob')], name, { type: 'application/pdf' })
}
