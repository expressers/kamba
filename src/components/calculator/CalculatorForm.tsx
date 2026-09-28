import { ChevronDown, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { parseNumber } from '@/lib/calculator'
import { formatDate, formatPct, formatRate } from '@/lib/format'
import { CURRENCIES, DEFAULT_MARGIN, EXCHANGE_RATES, EXCHANGE_SOURCE, type Currency } from '@/lib/kamba'
import { rateInput, type CalculatorState, type Mode } from '@/lib/state'
import { AmountField } from './AmountField'

const QUICK_AMOUNTS = [10, 25, 50, 100, 250]

interface CalculatorFormProps {
  state: CalculatorState
  onChange: (patch: Partial<CalculatorState>) => void
}

export function CalculatorForm({ state, onChange }: CalculatorFormProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const { symbol } = CURRENCIES[state.currency]
  const defaultRate = EXCHANGE_RATES[state.currency]
  const rateEdited = parseNumber(state.rate) !== defaultRate

  const currencyToggle = (
    <ToggleGroup
      type="single"
      size="sm"
      variant="outline"
      value={state.currency}
      aria-label="Moeda da compra"
      onValueChange={(v) => {
        if (!v) return
        const currency = v as Currency
        onChange({ currency, rate: rateInput(EXCHANGE_RATES[currency]) })
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
      <Tabs value={state.mode} onValueChange={(v) => onChange({ mode: v as Mode })}>
        <TabsList className="w-full">
          <TabsTrigger value="pay">Quanto carregar?</TabsTrigger>
          <TabsTrigger value="budget">Quanto posso gastar?</TabsTrigger>
        </TabsList>
      </Tabs>

      {state.mode === 'pay' ? (
        <AmountField
          id="amount"
          label="Valor da compra"
          prefix={symbol}
          value={state.amount}
          onChange={(amount) => onChange({ amount })}
          action={currencyToggle}
        >
          <div className="flex flex-wrap gap-2" role="group" aria-label="Valores rápidos">
            {QUICK_AMOUNTS.map((v) => (
              <Button
                key={v}
                type="button"
                size="sm"
                variant={parseNumber(state.amount) === v ? 'default' : 'secondary'}
                className="rounded-full tabular-nums"
                onClick={() => onChange({ amount: String(v) })}
              >
                {symbol}
                {v}
              </Button>
            ))}
          </div>
        </AmountField>
      ) : (
        <AmountField
          id="budget"
          label="Kwanzas disponíveis na conta BAI"
          suffix="Kz"
          placeholder="100 000"
          value={state.budget}
          onChange={(budget) => onChange({ budget })}
          action={currencyToggle}
        />
      )}

      <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/60 px-3 py-2.5">
        <div className="min-w-0">
          <Label htmlFor="rate" className="text-sm">
            Câmbio BAI ({state.currency})
          </Label>
          <p className="text-xs text-muted-foreground">
            {rateEdited ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 underline underline-offset-2"
                onClick={() => onChange({ rate: rateInput(defaultRate) })}
              >
                <RotateCcw className="size-3" aria-hidden />
                Repor {formatRate(defaultRate)}
              </button>
            ) : (
              <>Venda · {formatDate(EXCHANGE_SOURCE.date)}</>
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
            onChange={(e) => onChange({ rate: e.target.value.replace(/[^\d.,]/g, '') })}
          />
          <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-muted-foreground">
            Kz
          </span>
        </div>
      </div>

      <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            Mais opções
            <ChevronDown
              className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-5 pt-3">
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo que já tem no cartão</Label>
            <div className="relative">
              <Input
                id="balance"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                className="pr-9 tabular-nums"
                value={state.balance}
                onChange={(e) => onChange({ balance: e.target.value.replace(/[^\d.,]/g, '') })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                Kz
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="margin">Margem de segurança</Label>
              <span className="text-sm font-semibold tabular-nums">{formatPct(state.margin)}</span>
            </div>
            <Slider
              id="margin"
              min={0}
              max={5}
              step={0.5}
              value={[state.margin]}
              onValueChange={([margin]) => onChange({ margin })}
              aria-label="Margem de segurança cambial"
            />
            <p className="text-xs text-muted-foreground">
              O câmbio pode subir até a compra ser liquidada (1 a 3 dias úteis). Recomendamos{' '}
              {formatPct(DEFAULT_MARGIN)}; o que sobrar fica no cartão.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
