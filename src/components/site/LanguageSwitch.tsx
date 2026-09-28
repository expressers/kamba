import { LOCALES, PATHS } from '@/content/routes'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { Link } from './Link'

/** PT | EN — abre a mesma página no outro idioma. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, page, t } = useI18n()

  return (
    <div role="group" aria-label={t.header.language} className={cn('flex rounded-lg bg-muted p-0.5', className)}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={PATHS[l][page]}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors',
            l === locale ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  )
}
