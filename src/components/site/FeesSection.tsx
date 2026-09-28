import { formatDate, formatKz, formatPct } from '@/lib/format'
import { FEES, MONTHLY_LOAD_LIMIT_USD, PRICING_SOURCE } from '@/lib/kamba'

const vat = `+ IVA ${formatPct(FEES.vat)}`

const ROWS: { label: string; value: string; note?: string }[] = [
  { label: 'Carregamento', value: formatPct(FEES.load), note: vat },
  { label: 'Compras e pagamentos', value: formatPct(FEES.purchase), note: `${vat} · online, TPA, ATM` },
  { label: 'Levantamentos', value: formatPct(FEES.withdrawal), note: `${vat} · Angola e estrangeiro` },
  { label: 'Emissão do cartão', value: formatKz(FEES.issuance), note: `${vat} · físico ou virtual` },
  { label: 'Cancelamento', value: formatKz(FEES.cancellation), note: vat },
  { label: 'Limite mensal', value: `${MONTHLY_LOAD_LIMIT_USD} USD`, note: 'comunicado em Jun. 2024' },
]

export function FeesSection() {
  return (
    <section id="taxas" aria-labelledby="taxas-titulo" className="scroll-mt-20 space-y-4">
      <div>
        <h2 id="taxas-titulo" className="text-lg font-semibold tracking-tight lg:text-xl">
          Taxas do cartão Kamba
        </h2>
        <p className="text-sm text-muted-foreground">
          Segundo o{' '}
          <a
            href={PRICING_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {PRICING_SOURCE.label}
          </a>{' '}
          de {formatDate(PRICING_SOURCE.date)}.
        </p>
      </div>
      <dl className="divide-y rounded-xl border bg-card">
        {ROWS.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <dt className="text-sm">
              {r.label}
              {r.note && <span className="block text-xs text-muted-foreground">{r.note}</span>}
            </dt>
            <dd className="shrink-0 font-semibold tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
