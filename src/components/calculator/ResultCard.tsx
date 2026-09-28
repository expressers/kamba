import { FileText, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'
import type { Scenario } from '@/lib/calculator'
import type { Currency } from '@/lib/kamba'
import type { Mode } from '@/lib/state'
import styles from './ResultCard.module.scss'

interface ResultCardProps {
  scenario: Scenario
  mode: Mode
  currency: Currency
  onPdf: () => void
  onShare: () => void
}

export function ResultCard({ scenario, mode, currency, onPdf, onShare }: ResultCardProps) {
  const { t, f } = useI18n()
  const empty = scenario.amount <= 0

  const [main, second] =
    mode === 'pay'
      ? [
          { label: t.result.load, value: f.kz(scenario.load) },
          { label: t.result.need, value: f.kz(scenario.total) },
        ]
      : [
          { label: t.result.canSpend, value: f.money(scenario.amount, currency) },
          { label: t.result.load, value: f.kz(scenario.load) },
        ]

  return (
    <section className={`${styles.card} p-5 shadow-lg sm:p-6`} aria-live="polite" aria-label={t.result.aria}>
      <p className="text-sm text-white/70">{main.label}</p>
      <p className={styles.value}>{main.value}</p>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/15 pt-4">
        <div>
          <p className="text-xs text-white/70">{second.label}</p>
          <p className={styles.secondary}>{second.value}</p>
        </div>
        <p className="text-right text-xs text-white/60">
          {t.result.fees}
          <br />
          <span className="font-medium text-white/85 tabular-nums">{f.kz(scenario.fees)}</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <Button
          type="button"
          size="lg"
          disabled={empty}
          onClick={onPdf}
          className="bg-gold text-gold-foreground hover:bg-gold/90"
        >
          <FileText aria-hidden />
          {t.result.pdf}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="ghost"
          disabled={empty}
          onClick={onShare}
          className="bg-white/10 text-white hover:bg-white/20 hover:text-white"
          aria-label={t.result.share}
        >
          <Share2 aria-hidden />
        </Button>
      </div>
    </section>
  )
}
