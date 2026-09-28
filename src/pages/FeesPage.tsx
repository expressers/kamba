import { ExternalLink } from 'lucide-react'
import { CalculateCta } from '@/components/site/CalculateCta'
import { PageHeader } from '@/components/site/PageHeader'
import { useI18n } from '@/i18n'
import { FEES, MONTHLY_LOAD_LIMIT_USD, PRICING_SOURCE } from '@/lib/kamba'

export function FeesPage() {
  const { t, f } = useI18n()
  const { rows, plusVat } = t.fees

  const items = [
    { ...rows.load, value: f.pct(FEES.load), vat: true },
    { ...rows.purchase, value: f.pct(FEES.purchase), vat: true },
    { ...rows.withdrawal, value: f.pct(FEES.withdrawal), vat: true },
    { ...rows.issuance, value: f.kz(FEES.issuance), vat: true },
    { ...rows.cancellation, value: f.kz(FEES.cancellation), vat: true },
    { ...rows.limit, value: `${MONTHLY_LOAD_LIMIT_USD} USD`, vat: false },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t.pages.fees.heading}>{t.pages.fees.intro}</PageHeader>
      <dl className="divide-y rounded-2xl border bg-card">
        {items.map((item) => {
          const note = [item.vat && plusVat, 'note' in item && item.note].filter(Boolean).join(' · ')
          return (
            <div key={item.label} className="flex items-baseline justify-between gap-4 px-4 py-3.5 sm:px-5">
              <dt className="text-sm">
                {item.label}
                {note && <span className="block text-xs text-muted-foreground">{note}</span>}
              </dt>
              <dd className="shrink-0 font-semibold tabular-nums">{item.value}</dd>
            </div>
          )
        })}
      </dl>
      <a
        href={PRICING_SOURCE.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        {PRICING_SOURCE.label} (PDF)
        <ExternalLink className="size-3" aria-hidden />
      </a>
      <CalculateCta />
    </div>
  )
}
