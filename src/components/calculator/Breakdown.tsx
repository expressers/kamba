import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Scenario } from '@/lib/calculator'
import { formatKz, formatMoney, formatPct, formatRate } from '@/lib/format'
import { FEES, type Currency } from '@/lib/kamba'

interface BreakdownProps {
  scenario: Scenario
  currency: Currency
  margin: number
}

export function Breakdown({ scenario: s, currency, margin }: BreakdownProps) {
  return (
    <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
      <AccordionItem value="detalhe" className="border-0">
        <AccordionTrigger className="py-3.5 hover:no-underline">Ver cálculo detalhado</AccordionTrigger>
        <AccordionContent>
          <dl className="divide-y text-sm">
            <Row
              label={`${formatMoney(s.amount, currency)} × ${formatRate(s.rate)} Kz`}
              value={formatKz(s.baseKz)}
            />
            <Row label={`Comissão de compra ${formatPct(FEES.purchase)}`} value={formatKz(s.purchaseFee)} />
            <Row label={`IVA ${formatPct(FEES.vat)} da comissão`} value={formatKz(s.purchaseVat)} />
            {s.marginKz > 0 && (
              <Row label={`Margem de segurança ${formatPct(margin)}`} value={formatKz(s.marginKz)} />
            )}
            {s.existingUsed > 0 && (
              <Row label="Saldo já no cartão" value={`− ${formatKz(s.existingUsed)}`} />
            )}
            <Row label="Carregar no Kamba" value={formatKz(s.load)} strong />
            <Row label={`Comissão de carregamento ${formatPct(FEES.load)}`} value={formatKz(s.loadFee)} />
            <Row label={`IVA ${formatPct(FEES.vat)} da comissão`} value={formatKz(s.loadVat)} />
            <Row label="Total debitado da conta" value={formatKz(s.total)} strong />
          </dl>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-2 ${strong ? 'font-semibold' : 'text-muted-foreground'}`}>
      <dt>{label}</dt>
      <dd className="shrink-0 text-foreground tabular-nums">{value}</dd>
    </div>
  )
}
