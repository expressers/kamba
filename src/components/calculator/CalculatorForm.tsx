import { ChevronDown, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useI18n } from '@/i18n'
import { parseNumber } from '@/lib/calculator'
import { focusAtEnd } from '@/lib/dom'
import { CURRENCIES, EXCHANGE_RATES, EXCHANGE_SOURCE, type Currency } from '@/lib/kamba'
import { rateInput, type CalculatorState, type Mode } from '@/lib/state'
import { AmountField } from './AmountField'

const QUICK_AMOUNTS = [10, 25, 50, 100, 250]
const numeric = (value: string) => value.replace(/[^\d.,]/g, '')

interface CalculatorFormProps {
  state: CalculatorState
  onChange: (patch: Partial<CalculatorState>) => void
}

export function CalculatorForm({ state, onChange }: CalculatorFormProps) {
  const { t, f, locale } = useI18n()
  const [moreOpen, setMoreOpen] = useState(false)
  const amountRef = useRef<HTMLInputElement>(null)
  const { symbol } = CURRENCIES[state.currency]
  const defaultRate = EXCHANGE_RATES[state.currency]
  const rateEdited = parseNumber(state.rate, 0, locale) !== defaultRate

  // Depois de tocar num atalho, o cursor volta ao campo principal.
  const refocus = () => requestAnimationFrame(() => focusAtEnd(amountRef.current))

  const currencyToggle = (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      value={state.currency}
      aria-label={t.form.currency}
      onValueChange={(v) => {
        if (!v) return
        const currency = v as Currency
        onChange({ currency, rate: rateInput(EXCHANGE_RATES[currency], locale) })
        refocus()
      }}
    >
      {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
        <ToggleGroupItem
          key={c}
          value={c}
          className="px-3 text-xs data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {c}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )

  return (
    <div className="space-y-6">
      <Tabs
        value={state.mode}
        onValueChange={(v) => {
          onChange({ mode: v as Mode })
          refocus()
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="pay">{t.form.tabPay}</TabsTrigger>
          <TabsTrigger value="budget">{t.form.tabBudget}</TabsTrigger>
        </TabsList>
      </Tabs>

      {state.mode === 'pay' ? (
        <AmountField
          key="amount"
          id="amount"
          label={t.form.purchase}
          prefix={symbol}
          value={state.amount}
          onChange={(amount) => onChange({ amount })}
          action={currencyToggle}
          inputRef={amountRef}
          autoFocus
        >
          <div className="flex flex-wrap gap-2" role="group" aria-label={t.form.quickAmounts}>
            {QUICK_AMOUNTS.map((v) => (
              <Button
                key={v}
                type="button"
                size="sm"
                variant={parseNumber(state.amount, 0, locale) === v ? 'default' : 'secondary'}
                className="rounded-full tabular-nums"
                onClick={() => {
                  onChange({ amount: String(v) })
                  refocus()
                }}
              >
                {symbol}
                {v}
              </Button>
            ))}
          </div>
        </AmountField>
      ) : (
        <AmountField
          key="budget"
          id="budget"
          label={t.form.budget}
          suffix="Kz"
          placeholder={t.form.budgetPlaceholder}
          value={state.budget}
          onChange={(budget) => onChange({ budget })}
          action={currencyToggle}
          inputRef={amountRef}
          autoFocus
        />
      )}

      <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/60 px-3 py-2.5">
        <div className="min-w-0">
          <Label htmlFor="rate" className="text-sm">
            {t.form.rate(state.currency)}
          </Label>
          <p className="text-xs text-muted-foreground">
            {rateEdited ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 underline underline-offset-2"
                onClick={() => onChange({ rate: rateInput(defaultRate, locale) })}
              >
                <RotateCcw className="size-3" aria-hidden />
                {t.form.rateReset(f.rate(defaultRate))}
              </button>
            ) : (
              t.form.rateSell(f.date(EXCHANGE_SOURCE.date))
            )}
          </p>
        </div>
        <div className="relative w-32 shrink-0">
          <Input
            id="rate"
            inputMode="decimal"
            autoComplete="off"
            className="pr-8 text-right font-medium tabular-nums"
            value={state.rate}
            onChange={(e) => onChange({ rate: numeric(e.target.value) })}
          />
          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
            Kz
          </span>
        </div>
      </div>

      <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            {t.form.more}
            <ChevronDown className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} aria-hidden />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-5 pt-3">
          <div className="space-y-2">
            <Label htmlFor="balance">{t.form.balance}</Label>
            <div className="relative">
              <Input
                id="balance"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                className="pr-9 tabular-nums"
                value={state.balance}
                onChange={(e) => onChange({ balance: numeric(e.target.value) })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                Kz
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="margin">{t.form.margin}</Label>
              <span className="text-sm font-semibold tabular-nums">{f.pct(state.margin)}</span>
            </div>
            <Slider
              id="margin"
              min={0}
              max={5}
              step={0.5}
              value={[state.margin]}
              onValueChange={([margin]) => onChange({ margin })}
              aria-label={t.form.marginAria}
            />
            <p className="text-xs text-muted-foreground">{t.form.marginHint}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
