import { formatPct } from '@/lib/format'
import { DEFAULT_MARGIN } from '@/lib/kamba'

const STEPS = [
  {
    title: 'Calcule o valor',
    text: `Indique a compra em dólares ou euros. A calculadora junta as comissões, o IVA e uma margem de ${formatPct(DEFAULT_MARGIN)} para o câmbio.`,
  },
  {
    title: 'Tenha os Kwanzas na conta',
    text: 'Deposite na conta à ordem BAI pelo menos o valor "Precisa ter na conta". O carregamento é feito só a partir de Kwanzas.',
  },
  {
    title: 'Carregue no BAI Directo',
    text: 'Na app BAI Directo, escolha o cartão Kamba e carregue o valor indicado em "Carregue no Kamba".',
  },
  {
    title: 'Faça a compra',
    text: 'Pague online ou em TPA. Se pedir um código, confirme com o OTP enviado por SMS ou e-mail (Verified by Visa).',
  },
]

export function HowToSection() {
  return (
    <section id="como-carregar" aria-labelledby="como-carregar-titulo" className="scroll-mt-20 space-y-4">
      <h2 id="como-carregar-titulo" className="text-lg font-semibold tracking-tight lg:text-xl">
        Como carregar o cartão Kamba
      </h2>
      <ol className="space-y-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3 rounded-xl border bg-card p-4">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-gold-foreground"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
