import { EXCHANGE_SOURCE, PRICING_SOURCE } from '@/lib/kamba'

const link = 'underline underline-offset-2 hover:text-foreground'

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-xl space-y-2 px-4 py-8 text-xs lg:max-w-6xl lg:px-8 text-muted-foreground">
        <p>
          Ferramenta independente, sem ligação ao Banco BAI. Os valores são estimativas; confirme sempre
          no BAI Directo antes de carregar.
        </p>
        <p>
          Fontes:{' '}
          <a href={PRICING_SOURCE.url} target="_blank" rel="noopener noreferrer" className={link}>
            Preçário BAI
          </a>{' '}
          ·{' '}
          <a href={EXCHANGE_SOURCE.url} target="_blank" rel="noopener noreferrer" className={link}>
            Câmbios BAI
          </a>
        </p>
        <p>
          Feito por{' '}
          <a href="https://expressers.ao" className={link}>
            Expressers
          </a>
        </p>
      </div>
    </footer>
  )
}
