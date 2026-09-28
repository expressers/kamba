import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { IosInstallDrawer } from '@/components/site/IosInstallDrawer'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Toaster } from '@/components/ui/sonner'
import { usePwa } from '@/hooks/usePwa'
import { useRoute } from '@/hooks/useRoute'
import { createI18n, I18nContext } from '@/i18n'
import { parseNumber } from '@/lib/calculator'
import type { Locale } from '@/lib/format'
import { promptInstall } from '@/lib/pwa'
import { defaultState, rateInput, type CalculatorState } from '@/lib/state'
import { CalculatorPage } from '@/pages/CalculatorPage'
import { FaqPage } from '@/pages/FaqPage'
import { FeesPage } from '@/pages/FeesPage'
import { HowToPage } from '@/pages/HowToPage'

interface AppProps {
  initialState?: CalculatorState
}

/** Reescreve os valores digitados no formato numérico do novo idioma. */
function convertState(state: CalculatorState, from: Locale, to: Locale): CalculatorState {
  const convert = (v: string) => (v.trim() ? rateInput(parseNumber(v, 0, from), to) : v)
  return {
    ...state,
    amount: convert(state.amount),
    budget: convert(state.budget),
    rate: convert(state.rate),
    balance: convert(state.balance),
  }
}

export default function App({ initialState }: AppProps) {
  const route = useRoute()
  const i18n = useMemo(() => createI18n(route.locale, route.page), [route.locale, route.page])
  const pwa = usePwa()
  const [iosHelpOpen, setIosHelpOpen] = useState(false)

  // O estado da calculadora sobrevive à navegação entre páginas e à troca de idioma.
  const [store, setStore] = useState(() => ({
    locale: route.locale,
    state: initialState ?? defaultState(route.locale),
  }))
  if (store.locale !== route.locale) {
    setStore({ locale: route.locale, state: convertState(store.state, store.locale, route.locale) })
  }
  const update = (patch: Partial<CalculatorState>) =>
    setStore((s) => ({ ...s, state: { ...s.state, ...patch } }))

  const install = async () => {
    if (pwa.canPrompt) {
      if (await promptInstall()) toast.success(i18n.t.toast.installed)
    } else {
      setIosHelpOpen(true)
    }
  }

  return (
    <I18nContext.Provider value={i18n}>
      <SiteHeader installable={pwa.installable} onInstall={install} />

      <main className="mx-auto min-h-[calc(100dvh-10rem)] max-w-xl px-4 pt-5 pb-28 lg:max-w-6xl lg:px-8 lg:pt-12 lg:pb-16">
        {route.page === 'calculator' && (
          <CalculatorPage
            state={store.state}
            onChange={update}
            showInstall={pwa.installable && !pwa.dismissed}
            onInstall={install}
          />
        )}
        {route.page === 'howto' && <HowToPage />}
        {route.page === 'fees' && <FeesPage />}
        {route.page === 'faq' && <FaqPage />}
      </main>

      <SiteFooter />
      <IosInstallDrawer open={iosHelpOpen} onOpenChange={setIosHelpOpen} />
      <Toaster position="top-center" />
    </I18nContext.Provider>
  )
}
