import { useI18n } from '@/i18n'
import { EXCHANGE_SOURCE, PRICING_SOURCE } from '@/lib/kamba'
import { PoweredBy } from './PoweredBy'

const link = 'underline underline-offset-2 hover:text-foreground'

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-8 text-xs text-muted-foreground lg:max-w-6xl lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="space-y-2 lg:max-w-xl">
          <p>{t.footer.disclaimer}</p>
          <p>
            {t.footer.sources}{' '}
            <a href={PRICING_SOURCE.url} target="_blank" rel="noopener noreferrer" className={link}>
              {t.footer.pricing}
            </a>{' '}
            ·{' '}
            <a href={EXCHANGE_SOURCE.url} target="_blank" rel="noopener noreferrer" className={link}>
              {t.footer.rates}
            </a>
          </p>
        </div>
        <PoweredBy className="self-start lg:self-auto" />
      </div>
    </footer>
  )
}
