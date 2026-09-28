import { FileText, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Scenario } from '@/lib/calculator'
import { formatKz, formatMoney } from '@/lib/format'
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
  const empty = scenario.amount <= 0

  const [main, second] =
    mode === 'pay'
      ? [
          { label: 'Carregue no Kamba', value: formatKz(scenario.load) },
          { label: 'Precisa ter na conta BAI', value: formatKz(scenario.total) },
        ]
      : [
          { label: 'Pode gastar até', value: formatMoney(scenario.amount, currency) },
          { label: 'Carregue no Kamba', value: formatKz(scenario.load) },
        ]

  return (
    <section className={`${styles.card} p-5 shadow-lg sm:p-6`} aria-live="polite" aria-label="Resultado">
      <p className="text-sm text-white/70">{main.label}</p>
      <p className={styles.value}>{main.value}</p>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/15 pt-4">
        <div>
          <p className="text-xs text-white/70">{second.label}</p>
          <p className={styles.secondary}>{second.value}</p>
        </div>
        <p className="text-right text-xs text-white/60">
          Comissões + IVA
          <br />
          <span className="font-medium text-white/85 tabular-nums">{formatKz(scenario.fees)}</span>
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
          Gerar PDF para enviar
        </Button>
        <Button
          type="button"
          size="lg"
          variant="ghost"
          disabled={empty}
          onClick={onShare}
          className="bg-white/10 text-white hover:bg-white/20 hover:text-white"
          aria-label="Partilhar resumo"
        >
          <Share2 aria-hidden />
        </Button>
      </div>
    </section>
  )
}
