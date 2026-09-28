import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from '@/App'
import { FAQ } from '@/content/faq'
import { SITE_URL } from '@/lib/kamba'

/** HTML inicial da página, gerado no build (scripts/prerender.mjs). */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/** Dados estruturados (schema.org) para os motores de busca. */
export function structuredData(): object[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Calculadora Kamba',
      url: `${SITE_URL}/`,
      description:
        'Calcule quanto carregar no cartão pré-pago BAI Kamba para compras em dólares ou euros, com comissões e IVA incluídos.',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      inLanguage: 'pt-AO',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'AOA' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]
}
