import { TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Breakdown } from '@/components/calculator/Breakdown'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { MobileResultBar } from '@/components/calculator/MobileResultBar'
import { PdfDrawer, type PdfFields } from '@/components/calculator/PdfDrawer'
import { ResultCard } from '@/components/calculator/ResultCard'
import { FaqSection } from '@/components/site/FaqSection'
import { FeesSection } from '@/components/site/FeesSection'
import { HowToSection } from '@/components/site/HowToSection'
import { InstallBanner } from '@/components/site/InstallBanner'
import { IosInstallDrawer } from '@/components/site/IosInstallDrawer'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { useInView } from '@/hooks/useInView'
import { usePwa } from '@/hooks/usePwa'
import { computeScenario, maxAmountForBudget, parseNumber } from '@/lib/calculator'
import { formatMoney } from '@/lib/format'
import { EXCHANGE_RATES, MONTHLY_LOAD_LIMIT_USD } from '@/lib/kamba'
import { dismissInstall, promptInstall } from '@/lib/pwa'
import { shareOrCopy, shareOrDownload, summaryText } from '@/lib/share'
import { DEFAULT_STATE, shareUrl, type CalculatorState } from '@/lib/state'

interface AppProps {
  initialState?: CalculatorState
}

export default function App({ initialState = DEFAULT_STATE }: AppProps) {
  const [state, setState] = useState(initialState)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [iosHelpOpen, setIosHelpOpen] = useState(false)
  const [resultRef, resultInView] = useInView<HTMLDivElement>()
  const pwa = usePwa()

  const update = (patch: Partial<CalculatorState>) => setState((s) => ({ ...s, ...patch }))

  const scenario = useMemo(() => {
    const rate = parseNumber(state.rate, EXCHANGE_RATES[state.currency])
    const existingBalance = parseNumber(state.balance)
    const inputs = { rate, existingBalance, margin: state.margin }
    const amount =
      state.mode === 'pay'
        ? parseNumber(state.amount)
        : maxAmountForBudget(parseNumber(state.budget), inputs)
    return computeScenario({ amount, ...inputs })
  }, [state])

  const url = shareUrl(state, scenario.amount)
  const loadUsd = scenario.load / EXCHANGE_RATES.USD
  const overLimit = loadUsd > MONTHLY_LOAD_LIMIT_USD
  const hasResult = scenario.amount > 0

  const install = async () => {
    if (pwa.canPrompt) {
      if (await promptInstall()) toast.success('App instalada')
    } else {
      setIosHelpOpen(true)
    }
  }

  const share = async () => {
    const result = await shareOrCopy(summaryText(scenario, state.currency, url), url)
    if (result === 'copied') toast.success('Resumo copiado')
  }

  const generatePdf = async (fields: PdfFields) => {
    try {
      const { createRequestPdf } = await import('@/lib/pdf')
      const file = await createRequestPdf({
        scenario,
        currency: state.currency,
        margin: state.margin,
        url,
        ...fields,
      })
      const result = await shareOrDownload(file, 'Pedido de carregamento Kamba')
      if (result === 'downloaded') toast.success('PDF descarregado')
      if (result !== 'cancelled') setPdfOpen(false)
    } catch {
      toast.error('Não foi possível gerar o PDF. Tente novamente.')
    }
  }

  return (
    <>
      <SiteHeader installable={pwa.installable} onInstall={install} />

      <main className="mx-auto max-w-xl px-4 pt-5 pb-28 lg:max-w-6xl lg:px-8 lg:pt-12 lg:pb-16">
        {pwa.installable && !pwa.dismissed && (
          <div className="mb-5">
            <InstallBanner onInstall={install} onDismiss={dismissInstall} />
          </div>
        )}

        <section id="calculadora" aria-labelledby="titulo" className="scroll-mt-20">
          <div className="mb-5 space-y-1.5 lg:mb-8 lg:max-w-2xl">
            <h1 id="titulo" className="text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl">
              Quanto carregar no cartão Kamba?
            </h1>
            <p className="text-sm text-pretty text-muted-foreground lg:text-base">
              Calcule em segundos quanto precisa em Kwanzas para compras em dólares ou euros, com as
              comissões e o IVA do BAI já incluídos.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8">
            <div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5 lg:p-7">
              <CalculatorForm state={state} onChange={update} />
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

              {overLimit && (
                <Alert>
                  <TriangleAlert aria-hidden />
                  <AlertDescription>
                    Vai carregar cerca de {formatMoney(loadUsd, 'USD')}, acima do limite mensal de{' '}
                    {MONTHLY_LOAD_LIMIT_USD} USD comunicado pelo BAI. Confirme o seu limite no BAI Directo.
                  </AlertDescription>
                </Alert>
              )}

              {hasResult && (
                <Breakdown scenario={scenario} currency={state.currency} margin={state.margin} />
              )}
            </div>
          </div>
        </section>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-10">
          <HowToSection />
          <FeesSection />
        </div>

        <div className="mt-12 lg:mx-auto lg:mt-20 lg:max-w-3xl">
          <FaqSection />
        </div>
      </main>

      <SiteFooter />

      <MobileResultBar
        visible={hasResult && !resultInView && !pdfOpen}
        scenario={scenario}
        mode={state.mode}
        currency={state.currency}
        onPdf={() => setPdfOpen(true)}
      />
      <PdfDrawer open={pdfOpen} onOpenChange={setPdfOpen} total={scenario.total} onGenerate={generatePdf} />
      <IosInstallDrawer open={iosHelpOpen} onOpenChange={setIosHelpOpen} />
      <Toaster position="top-center" />
    </>
  )
}
