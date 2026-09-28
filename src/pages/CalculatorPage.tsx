import { TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Breakdown } from '@/components/calculator/Breakdown'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { MobileResultBar } from '@/components/calculator/MobileResultBar'
import { PdfDrawer, type PdfFields } from '@/components/calculator/PdfDrawer'
import { ResultCard } from '@/components/calculator/ResultCard'
import { InstallBanner } from '@/components/site/InstallBanner'
import { PageHeader } from '@/components/site/PageHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useInView } from '@/hooks/useInView'
import { useI18n } from '@/i18n'
import { computeScenario, maxAmountForBudget, parseNumber } from '@/lib/calculator'
import { EXCHANGE_RATES, MONTHLY_LOAD_LIMIT_USD } from '@/lib/kamba'
import { dismissInstall } from '@/lib/pwa'
import { shareOrCopy, shareOrDownload, summaryText } from '@/lib/share'
import { shareUrl, type CalculatorState } from '@/lib/state'

interface CalculatorPageProps {
  state: CalculatorState
  onChange: (patch: Partial<CalculatorState>) => void
  showInstall: boolean
  onInstall: () => void
}

export function CalculatorPage({ state, onChange, showInstall, onInstall }: CalculatorPageProps) {
  const { t, f, locale } = useI18n()
  const [pdfOpen, setPdfOpen] = useState(false)
  const [resultRef, resultInView] = useInView<HTMLDivElement>()

  const scenario = useMemo(() => {
    const num = (v: string, fallback = 0) => parseNumber(v, fallback, locale)
    const inputs = {
      rate: num(state.rate, EXCHANGE_RATES[state.currency]),
      existingBalance: num(state.balance),
      margin: state.margin,
    }
    const amount = state.mode === 'pay' ? num(state.amount) : maxAmountForBudget(num(state.budget), inputs)
    return computeScenario({ amount, ...inputs })
  }, [state, locale])

  const url = shareUrl(state, scenario.amount, locale)
  const loadUsd = scenario.load / EXCHANGE_RATES.USD
  const hasResult = scenario.amount > 0

  const share = async () => {
    const result = await shareOrCopy(summaryText(scenario, state.currency, url, t, f), url)
    if (result === 'copied') toast.success(t.toast.copied)
  }

  const generatePdf = async (fields: PdfFields) => {
    try {
      const { createRequestPdf } = await import('@/lib/pdf')
      const file = await createRequestPdf({
        locale,
        t: t.pdf,
        f,
        scenario,
        currency: state.currency,
        margin: state.margin,
        url,
        ...fields,
      })
      const result = await shareOrDownload(file, t.share.pdfTitle)
      if (result === 'downloaded') toast.success(t.toast.pdfDownloaded)
      if (result !== 'cancelled') setPdfOpen(false)
    } catch {
      toast.error(t.toast.pdfError)
    }
  }

  return (
    <>
      {showInstall && (
        <div className="mb-5">
          <InstallBanner onInstall={onInstall} onDismiss={dismissInstall} />
        </div>
      )}

      <PageHeader title={t.pages.calculator.heading}>{t.pages.calculator.intro}</PageHeader>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8">
        <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5 lg:p-7">
          <CalculatorForm state={state} onChange={onChange} />
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <div ref={resultRef}>
            <ResultCard
              scenario={scenario}
              mode={state.mode}
              currency={state.currency}
              onPdf={() => setPdfOpen(true)}
              onShare={share}
            />
          </div>

          {loadUsd > MONTHLY_LOAD_LIMIT_USD && (
            <Alert>
              <TriangleAlert aria-hidden />
              <AlertDescription>{t.result.overLimit(f.money(loadUsd, 'USD'))}</AlertDescription>
            </Alert>
          )}

          {hasResult && <Breakdown scenario={scenario} currency={state.currency} margin={state.margin} />}
        </div>
      </div>

      <MobileResultBar
        visible={hasResult && !resultInView && !pdfOpen}
        scenario={scenario}
        mode={state.mode}
        currency={state.currency}
        onPdf={() => setPdfOpen(true)}
      />
      <PdfDrawer open={pdfOpen} onOpenChange={setPdfOpen} total={scenario.total} onGenerate={generatePdf} />
    </>
  )
}
