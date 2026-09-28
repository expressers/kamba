import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useI18n } from '@/i18n'
import type { Scenario } from '@/lib/calculator'
import type { Currency } from '@/lib/kamba'

interface BreakdownProps {
  scenario: Scenario
  currency: Currency
  margin: number
}

export function Breakdown({ scenario: s, currency, margin }: BreakdownProps) {
  const { t, f } = useI18n()
  const b = t.breakdown
  return (
    <Accordion type="single" collapsible className="rounded-xl border bg-card px-4">
      <AccordionItem value="detalhe" className="border-0">
        <AccordionTrigger className="py-3.5 hover:no-underline">{b.title}</AccordionTrigger>
        <AccordionContent>
          <dl className="divide-y text-sm">
            <Row label={`${f.money(s.amount, currency)} × ${f.rate(s.rate)} Kz`} value={f.kz(s.baseKz)} />
            <Row label={b.purchaseFee} value={f.kz(s.purchaseFee)} />
            <Row label={b.vat} value={f.kz(s.purchaseVat)} />
            {s.marginKz > 0 && <Row label={b.margin(f.pct(margin))} value={f.kz(s.marginKz)} />}
            {s.existingUsed > 0 && <Row label={b.existing} value={`− ${f.kz(s.existingUsed)}`} />}
            <Row label={b.load} value={f.kz(s.load)} strong />
            <Row label={b.loadFee} value={f.kz(s.loadFee)} />
            <Row label={b.vat} value={f.kz(s.loadVat)} />
            <Row label={b.total} value={f.kz(s.total)} strong />
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
