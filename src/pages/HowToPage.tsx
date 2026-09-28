import { CalculateCta } from '@/components/site/CalculateCta'
import { PageHeader } from '@/components/site/PageHeader'
import { useI18n } from '@/i18n'

export function HowToPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t.pages.howto.heading}>{t.pages.howto.intro}</PageHeader>
      <ol className="space-y-3">
        {t.howto.map((step, i) => (
          <li key={step.title} className="flex gap-4 rounded-2xl border bg-card p-4 sm:p-5">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-gold-foreground"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="space-y-1">
              <h2 className="font-semibold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <CalculateCta />
    </div>
  )
}
