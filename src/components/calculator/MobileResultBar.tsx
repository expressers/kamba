import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Scenario } from '@/lib/calculator'
import { formatKz, formatMoney } from '@/lib/format'
import type { Currency } from '@/lib/kamba'
import type { Mode } from '@/lib/state'

interface MobileResultBarProps {
  visible: boolean
  scenario: Scenario
  mode: Mode
  currency: Currency
  onPdf: () => void
}

/** Barra fixa no telemóvel com o resultado, visível quando o cartão de resultado sai do ecrã. */
export function MobileResultBar({ visible, scenario, mode, currency, onPdf }: MobileResultBarProps) {
  const [label, value] =
    mode === 'pay'
      ? ['Precisa ter na conta', formatKz(scenario.total)]
      : ['Pode gastar até', formatMoney(scenario.amount, currency)]

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-20 border-t bg-brand text-brand-foreground shadow-[0_-8px_24px_rgb(0_0_0/0.15)] transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a href="#calculadora" className="min-w-0 flex-1">
          <span className="block text-xs text-white/70">{label}</span>
          <span className="block truncate text-lg font-bold tabular-nums">{value}</span>
        </a>
        <Button onClick={onPdf} className="bg-gold text-gold-foreground hover:bg-gold/90">
          <FileText aria-hidden />
          PDF
        </Button>
      </div>
    </div>
  )
}
