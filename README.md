# Calculadora Kamba

Calcula quanto carregar no cartão pré-pago **BAI Kamba** para compras em dólares ou euros, com as comissões, o IVA e o câmbio do BAI incluídos. Gera um PDF para enviar a quem vai pagar a compra com o cartão de outra pessoa.

**Produção:** https://kamba.expressers.ao

## Páginas

| Português | English | Conteúdo |
| --- | --- | --- |
| `/` | `/en` | Calculadora |
| `/como-carregar` | `/en/how-to-load` | Passo a passo |
| `/taxas` | `/en/fees` | Comissões, IVA e limites |
| `/perguntas` | `/en/faq` | Perguntas frequentes |

Cada página é pré-renderizada no build para `dist/<caminho>/index.html`, com título, descrição, `canonical`, `hreflang` e JSON-LD próprios. Todos os textos estão em [`src/i18n/pt.ts`](src/i18n/pt.ts) e [`src/i18n/en.ts`](src/i18n/en.ts) — o inglês é tipado a partir do português, por isso o build falha se faltar uma tradução. As rotas estão em [`src/content/routes.ts`](src/content/routes.ts).

## Funcionalidades

- **Quanto carregar?** — valor da compra (USD/EUR) → quanto carregar no Kamba e quanto ter na conta.
- **Quanto posso gastar?** — Kwanzas disponíveis → compra máxima possível.
- **PDF "Pedido de carregamento"** — valor a entregar ao titular do cartão, com o cálculo completo; partilha pelo menu nativo do telemóvel.
- **Link partilhável** — `?v=50&m=USD&c=992.5156` reabre a mesma simulação.
- **PWA instalável** — funciona offline; convite de instalação no Android e instruções no iPhone.
- **Português e inglês** — troca de idioma em qualquer página, mantendo os valores digitados.
- **SEO** — HTML pré-renderizado por página e idioma, `hreflang`, JSON-LD (`WebApplication`, `FAQPage`, `BreadcrumbList`), Open Graph e sitemap gerado no build.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui (Radix) · SCSS modules · jsPDF · Bun

> O Tailwind v4 não suporta pré-processadores, por isso `src/index.css` (Tailwind + tema shadcn) é CSS puro e o SCSS é usado em módulos de componentes (`*.module.scss`) e em `src/styles/app.scss`.

## Desenvolvimento

```bash
bun install
bun run dev        # http://localhost:5173
bun test           # testes do cálculo
bun run lint
bun run build      # build + pré-renderização em dist/
bun run preview    # serve dist/ (inclui service worker)
```

## Actualizar taxas e câmbio

Tudo está em [`src/lib/kamba.ts`](src/lib/kamba.ts):

| Dado | Fonte |
| --- | --- |
| Comissões (`FEES`) | [Preçário BAI — Clientes Particulares](https://www.bancobai.ao/media/vrni4lni/bai-pre-clientes-particulares.pdf), secções 3.3 e 3.4.3 |
| Câmbio (`EXCHANGE_RATES`) | [BAI — Câmbios e Valores](https://www.bancobai.ao/pt/cambios-e-valores), coluna *Venda* de Divisas |
| Limite mensal | Comunicado do BAI de Junho de 2024 (250 USD) |

Actualize também as datas em `PRICING_SOURCE` / `EXCHANGE_SOURCE` (o `sitemap.xml` é gerado no build). O site do BAI bloqueia pedidos automáticos, por isso o câmbio não é obtido em tempo real — o utilizador pode editá-lo na app.

## Gitflow

| Ramo | Uso |
| --- | --- |
| `main` | Produção — cada merge é publicado no Render |
| `develop` | Integração |
| `feature/*` | Novas funcionalidades, a partir de `develop` |
| `release/x.y.z` | Preparação de versão, de `develop` para `main` + tag |
| `hotfix/x.y.z` | Correcções urgentes, de `main` |

```bash
git flow feature start nome
git flow feature finish nome
git flow release start 1.1.0
git flow release finish 1.1.0
git push origin main develop --tags
```

O CI (`.github/workflows/ci.yml`) corre lint, testes e build em `main`, `develop` e nos PRs.

## Deploy (Render)

O [`render.yaml`](render.yaml) define um *Static Site* que publica `main` depois de o CI passar.

1. No Render: **New → Blueprint** e escolha este repositório.
2. Em **Settings → Custom Domains** confirme `kamba.expressers.ao`.
3. No DNS de `expressers.ao`, crie um `CNAME` de `kamba` para o endereço `*.onrender.com` do serviço.

---

Ferramenta independente, sem ligação ao Banco BAI. Os valores são estimativas.
