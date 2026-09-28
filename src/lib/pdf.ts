import type { Messages } from '@/i18n'
import type { Scenario } from './calculator'
import { plain, type Formatters, type Locale } from './format'
import { EXCHANGE_SOURCE, type Currency } from './kamba'

export interface PdfDetails {
  locale: Locale
  t: Messages['pdf']
  f: Formatters
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
  const { t: m, f, scenario: s } = d
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const X = 12
  const R = W - 12
  const t = (text: string) => plain(text)
  const now = new Date()
  const issued = now.toLocaleDateString(d.locale === 'pt' ? 'pt-AO' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  // Cabeçalho
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 30, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...GOLD)
  doc.text(m.brand, X, 12)
  doc.setFontSize(15)
  doc.setTextColor(255, 255, 255)
  doc.text(m.title, X, 20)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(issued, R, 12, { align: 'right' })

  // Valor principal
  let y = 44
  doc.setTextColor(...MUTED)
  doc.setFontSize(9)
  doc.text(m.amountLabel, X, y)
  y += 11
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...NAVY)
  doc.text(t(f.kz(s.total)), X, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...TEXT)
  doc.text(t(m.forPurchase(f.money(s.amount, d.currency))), X, y)

  // Partes envolvidas
  const parties = [
    [m.purchase, d.description],
    [m.cardholder, d.cardholder],
    [m.payer, d.payer],
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
  doc.text(m.detailsTitle, X, y)
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

  row(m.base(f.money(s.amount, d.currency), f.rate(s.rate)), f.kz(s.baseKz))
  row(m.purchaseFee, f.kz(s.purchaseFee))
  row(m.vat, f.kz(s.purchaseVat))
  if (s.marginKz > 0) row(m.margin(f.pct(d.margin)), f.kz(s.marginKz))
  if (s.existingUsed > 0) row(m.existing, `- ${f.kz(s.existingUsed)}`)
  row(m.load, f.kz(s.load), true)
  row(m.loadFee, f.kz(s.loadFee))
  row(m.vat, f.kz(s.loadVat))

  y += 9
  doc.setFillColor(...NAVY)
  doc.roundedRect(X, y - 5.5, R - X, 9, 1.5, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text(m.total, X + 3, y)
  doc.text(t(f.kz(s.total)), R - 3, y, { align: 'right' })

  // Notas
  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  const notes = [
    m.noteRate(f.date(EXCHANGE_SOURCE.date)),
    s.marginKz > 0 ? m.noteMargin(f.kz(s.marginKz)) : m.noteNoMargin,
    m.noteDisclaimer,
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
  doc.text(m.madeAt, X, H - 10.5)
  doc.setTextColor(...NAVY)
  doc.textWithLink('kamba.expressers.ao', X + doc.getTextWidth(m.madeAt) + 1.5, H - 10.5, { url: d.url })
  doc.setTextColor(...MUTED)
  doc.text(m.open, R, H - 10.5, { align: 'right' })
  doc.link(0, H - 16, W, 9, { url: d.url })
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...GOLD)
  doc.textWithLink(m.poweredBy, (W - doc.getTextWidth(m.poweredBy)) / 2, H - 5, { url: 'https://expressers.ao' })

  const stamp = now.toISOString().slice(0, 10)
  const name = `${m.fileName}-${Math.round(s.amount)}${d.currency.toLowerCase()}-${stamp}.pdf`
  return new File([doc.output('blob')], name, { type: 'application/pdf' })
}
