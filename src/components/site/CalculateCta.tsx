import { ArrowRight, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n'
import { Link } from './Link'

/** Remate das páginas informativas: volta à calculadora. */
export function CalculateCta() {
  const { t, href } = useI18n()
  return (
    <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-brand p-5 text-brand-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Calculator className="size-5 shrink-0 text-gold" aria-hidden />
        <p className="text-sm font-medium">{t.cta.question}</p>
      </div>
      <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
        <Link href={href('calculator')}>
          {t.cta.button}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </div>
  )
}
