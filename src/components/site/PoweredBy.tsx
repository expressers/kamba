import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

const EXPRESSERS_URL = 'https://expressers.ao'

/** Assinatura "Powered by Expressers". */
export function PoweredBy({ className }: { className?: string }) {
  const { t } = useI18n()
  return (
    <a
      href={EXPRESSERS_URL}
      target="_blank"
      rel="noopener"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground',
        className,
      )}
    >
      {t.footer.poweredBy}
      <span className="font-semibold tracking-tight text-foreground">Expressers</span>
    </a>
  )
}
