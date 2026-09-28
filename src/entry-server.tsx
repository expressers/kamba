import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from '@/App'
import { absoluteUrl, findRoute, LOCALES, PATHS, ROUTES } from '@/content/routes'
import { MESSAGES } from '@/i18n'
import { setServerPath } from '@/lib/router'

export { ROUTES }

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** HTML inicial de uma página, gerado no build (scripts/prerender.mjs). */
export function render(path: string): string {
  setServerPath(path)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/** <html lang> da página. */
export const htmlLang = (path: string) => MESSAGES[findRoute(path).locale].meta.htmlLang

/** Etiquetas de <head> específicas de cada página e idioma. */
export function head(path: string): string {
  const route = findRoute(path)
  const t = MESSAGES[route.locale]
  const page = t.pages[route.page]
  const url = absoluteUrl(route.path)
  const other = LOCALES.find((l) => l !== route.locale)!

  const tags = [
    `<title>${escape(page.title)}</title>`,
    `<meta name="description" content="${escape(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...LOCALES.map(
      (l) => `<link rel="alternate" hreflang="${MESSAGES[l].meta.htmlLang}" href="${absoluteUrl(PATHS[l][route.page])}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(PATHS.pt[route.page])}" />`,
    `<meta property="og:site_name" content="${escape(t.meta.siteName)}" />`,
    `<meta property="og:locale" content="${t.meta.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${MESSAGES[other].meta.ogLocale}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escape(page.title)}" />`,
    `<meta property="og:description" content="${escape(page.description)}" />`,
    `<meta property="og:image:alt" content="${escape(t.meta.siteName)}" />`,
    `<meta name="twitter:title" content="${escape(page.title)}" />`,
    `<meta name="twitter:description" content="${escape(page.description)}" />`,
    ...structuredData(path).map(
      (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  return tags.join('\n    ')
}

/** Dados estruturados (schema.org) para os motores de busca. */
function structuredData(path: string): object[] {
  const route = findRoute(path)
  const t = MESSAGES[route.locale]
  const home = absoluteUrl(PATHS[route.locale].calculator)
  const publisher = { '@type': 'Organization', name: 'Expressers', url: 'https://expressers.ao' }

  if (route.page === 'calculator') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: t.meta.siteName,
        url: home,
        description: t.meta.appDescription,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        inLanguage: t.meta.htmlLang,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'AOA' },
        publisher,
      },
    ]
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.pages.calculator.label, item: home },
      { '@type': 'ListItem', position: 2, name: t.pages[route.page].label, item: absoluteUrl(route.path) },
    ],
  }

  if (route.page === 'faq') {
    return [
      breadcrumb,
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: t.meta.htmlLang,
        mainEntity: t.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ]
  }

  return [breadcrumb]
}

/** sitemap.xml com as versões pt/en ligadas por hreflang. */
export function sitemap(lastmod: string): string {
  const urls = ROUTES.map((route) => {
    const alternates = LOCALES.map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${MESSAGES[l].meta.htmlLang}" href="${absoluteUrl(PATHS[l][route.page])}" />`,
    ).join('\n')
    return `  <url>\n    <loc>${absoluteUrl(route.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
}
