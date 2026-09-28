import { formatters } from '@/lib/format'
import { DEFAULT_MARGIN, FEES, MONTHLY_LOAD_LIMIT_USD, PRICING_SOURCE } from '@/lib/kamba'

const f = formatters('pt')
const vat = f.pct(FEES.vat)
const withVat = (pct: number) => f.pct(Math.round(pct * (1 + FEES.vat / 100) * 100) / 100)

export const pt = {
  meta: {
    htmlLang: 'pt-AO',
    ogLocale: 'pt_AO',
    siteName: 'Calculadora Kamba',
    appDescription:
      'Calcule quanto carregar no cartão pré-pago BAI Kamba para compras em dólares ou euros, com comissões e IVA incluídos.',
  },

  pages: {
    calculator: {
      label: 'Calculadora',
      hint: 'Quanto carregar e gastar',
      title: 'Calculadora Kamba BAI — Quanto carregar em Kwanzas',
      description:
        'Saiba quanto carregar no cartão pré-pago BAI Kamba para compras em dólares ou euros. Comissões, IVA e câmbio do BAI incluídos. Gere um PDF para enviar.',
      heading: 'Quanto carregar no cartão Kamba?',
      intro:
        'Calcule em segundos quanto precisa em Kwanzas para compras em dólares ou euros, com as comissões e o IVA do BAI já incluídos.',
    },
    howto: {
      label: 'Como carregar',
      hint: 'Passo a passo no BAI Directo',
      title: 'Como carregar o cartão Kamba do BAI — Passo a passo',
      description:
        'Como carregar o cartão BAI Kamba pelo BAI Directo: quanto depositar em Kwanzas, como fazer o carregamento e como pagar compras online com segurança.',
      heading: 'Como carregar o cartão Kamba',
      intro: 'Do cálculo à compra, em quatro passos.',
    },
    fees: {
      label: 'Taxas',
      hint: 'Comissões, IVA e limites',
      title: 'Taxas do cartão Kamba BAI em 2026 — Comissões e IVA',
      description: `Comissões do cartão BAI Kamba: ${f.pct(FEES.load)} no carregamento, ${f.pct(FEES.purchase)} nas compras e levantamentos, mais ${vat} de IVA. Custo de emissão e limite mensal.`,
      heading: 'Taxas do cartão Kamba',
      intro: `Segundo o ${PRICING_SOURCE.label} de ${f.date(PRICING_SOURCE.date)}.`,
    },
    faq: {
      label: 'Perguntas frequentes',
      hint: 'Dúvidas sobre o Kamba',
      title: 'Perguntas frequentes sobre o cartão Kamba do BAI',
      description:
        'Respostas sobre o cartão BAI Kamba: custos, câmbio aplicado, limites de carregamento, como pedir o cartão e como pagar compras de outra pessoa.',
      heading: 'Perguntas frequentes',
      intro: 'O essencial sobre custos, câmbio e limites do cartão Kamba.',
    },
  },

  header: {
    openMenu: 'Abrir menu',
    menu: 'Menu',
    menuDescription: 'Páginas e informações da calculadora',
    mainNav: 'Principal',
    installApp: 'Instalar app',
    installPhone: 'Instalar no telemóvel',
    language: 'Idioma',
    footnote: (rateDate: string, pricingDate: string) =>
      `Câmbio de ${rateDate} · Preçário de ${pricingDate}. Ferramenta independente, sem ligação ao BAI.`,
  },

  footer: {
    disclaimer:
      'Ferramenta independente, sem ligação ao Banco BAI. Os valores são estimativas; confirme sempre no BAI Directo antes de carregar.',
    sources: 'Fontes:',
    pricing: 'Preçário BAI',
    rates: 'Câmbios BAI',
    poweredBy: 'Powered by',
  },

  form: {
    tabPay: 'Quanto carregar?',
    tabBudget: 'Quanto posso gastar?',
    purchase: 'Valor da compra',
    quickAmounts: 'Valores rápidos',
    currency: 'Moeda da compra',
    budget: 'Kwanzas disponíveis na conta BAI',
    budgetPlaceholder: '100 000',
    rate: (currency: string) => `Câmbio BAI (${currency})`,
    rateSell: (date: string) => `Venda · ${date}`,
    rateReset: (rate: string) => `Repor ${rate}`,
    more: 'Mais opções',
    balance: 'Saldo que já tem no cartão',
    margin: 'Margem de segurança',
    marginAria: 'Margem de segurança cambial',
    marginHint: `O câmbio pode subir até a compra ser liquidada (1 a 3 dias úteis). Recomendamos ${f.pct(DEFAULT_MARGIN)}; o que sobrar fica no cartão.`,
  },

  result: {
    aria: 'Resultado',
    load: 'Carregue no Kamba',
    need: 'Precisa ter na conta BAI',
    canSpend: 'Pode gastar até',
    fees: 'Comissões + IVA',
    pdf: 'Gerar PDF para enviar',
    share: 'Partilhar resumo',
    barNeed: 'Precisa ter na conta',
    overLimit: (amount: string) =>
      `Vai carregar cerca de ${amount}, acima do limite mensal de ${MONTHLY_LOAD_LIMIT_USD} USD comunicado pelo BAI. Confirme o seu limite no BAI Directo.`,
  },

  breakdown: {
    title: 'Ver cálculo detalhado',
    purchaseFee: `Comissão de compra ${f.pct(FEES.purchase)}`,
    vat: `IVA ${vat} da comissão`,
    margin: (pct: string) => `Margem de segurança ${pct}`,
    existing: 'Saldo já no cartão',
    load: 'Carregar no Kamba',
    loadFee: `Comissão de carregamento ${f.pct(FEES.load)}`,
    total: 'Total debitado da conta',
  },

  pdfDrawer: {
    title: 'Enviar a quem vai pagar',
    description: (total: string) =>
      `O PDF mostra que é preciso entregar ${total} ao titular do cartão, com o cálculo completo. Os campos abaixo são opcionais.`,
    description_label: 'Para que é a compra?',
    description_placeholder: 'Ex: Subscrição Netflix',
    cardholder_label: 'Titular do cartão Kamba',
    cardholder_placeholder: 'Quem recebe o dinheiro',
    payer_label: 'Quem paga',
    payer_placeholder: 'Quem entrega o dinheiro',
    submit: 'Gerar e partilhar PDF',
  },

  toast: {
    copied: 'Resumo copiado',
    pdfDownloaded: 'PDF descarregado',
    pdfError: 'Não foi possível gerar o PDF. Tente novamente.',
    installed: 'App instalada',
  },

  install: {
    title: 'Instale a app Kamba',
    subtitle: 'Acesso rápido, mesmo sem internet.',
    install: 'Instalar',
    dismiss: 'Dispensar',
    iosTitle: 'Instalar no iPhone',
    iosDescription: 'No Safari, são só dois toques:',
    iosShare: ['Toque em', 'Partilhar', 'na barra do Safari.'],
    iosAdd: ['Escolha', 'Adicionar ao ecrã principal', '.'],
    ok: 'Entendi',
  },

  cta: {
    question: 'Quanto precisa para a sua compra?',
    button: 'Calcular agora',
  },

  howto: [
    {
      title: 'Calcule o valor',
      text: `Indique a compra em dólares ou euros. A calculadora junta as comissões, o IVA e uma margem de ${f.pct(DEFAULT_MARGIN)} para o câmbio.`,
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
  ],

  fees: {
    plusVat: `+ IVA ${vat}`,
    rows: {
      load: { label: 'Carregamento' },
      purchase: { label: 'Compras e pagamentos', note: 'online, TPA, ATM' },
      withdrawal: { label: 'Levantamentos', note: 'Angola e estrangeiro' },
      issuance: { label: 'Emissão do cartão', note: 'físico ou virtual' },
      cancellation: { label: 'Cancelamento' },
      limit: { label: 'Limite mensal', note: 'comunicado em Jun. 2024' },
    },
  },

  faq: [
    {
      question: 'Quanto custa carregar o cartão Kamba do BAI?',
      answer: `O BAI cobra ${f.pct(FEES.load)} sobre o valor carregado, mais ${vat} de IVA sobre essa comissão — na prática ${withVat(FEES.load)}. Para carregar 100 000 Kz no cartão precisa de ter ${f.kz(100_000 * (1 + (FEES.load / 100) * (1 + FEES.vat / 100)))} na conta à ordem.`,
    },
    {
      question: 'Qual é a comissão das compras internacionais com o Kamba?',
      answer: `Cada compra ou pagamento (online ou TPA, em Angola ou no estrangeiro) paga ${f.pct(FEES.purchase)} de comissão, mais ${vat} de IVA sobre a comissão — ${withVat(FEES.purchase)} no total. Levantamentos em ATM também pagam ${f.pct(FEES.withdrawal)} + IVA.`,
    },
    {
      question: 'Como carregar o cartão Kamba?',
      answer:
        'Deposite Kwanzas na sua conta à ordem BAI e faça o carregamento no BAI Directo, indicando o valor. O carregamento é feito exclusivamente a partir de Kwanzas; se tiver divisas, converta-as primeiro para Kz.',
    },
    {
      question: 'Que câmbio é usado nas compras em dólares ou euros?',
      answer:
        'O BAI converte a compra ao seu câmbio de venda do dia em que a compra é liquidada, normalmente 1 a 3 dias úteis depois. A calculadora usa o último câmbio de venda publicado pelo BAI, que pode alterar.',
    },
    {
      question: 'Porque devo carregar um pouco mais do que o valor exacto?',
      answer: `Se o câmbio subir entre a compra e a liquidação, uma compra sem folga pode ser recusada por saldo insuficiente. Uma margem de ${f.pct(DEFAULT_MARGIN)} evita isso, e o valor que sobrar continua disponível no cartão.`,
    },
    {
      question: 'Qual é o limite de carregamento do Kamba?',
      answer: `Em Junho de 2024 o BAI reduziu o limite mensal de carregamento do Kamba para ${MONTHLY_LOAD_LIMIT_USD} USD. Os limites podem mudar; confirme o valor em vigor no BAI Directo ou numa agência.`,
    },
    {
      question: 'Quanto custa pedir o cartão Kamba?',
      answer: `A emissão do cartão Kamba (físico ou virtual) custa ${f.kz(FEES.issuance)} mais IVA, ou seja ${f.kz(FEES.issuance * (1 + FEES.vat / 100))}, segundo o ${PRICING_SOURCE.label} de ${f.date(PRICING_SOURCE.date)}. É preciso ser cliente BAI e ter pelo menos 18 anos.`,
    },
    {
      question: 'Posso pedir a alguém com Kamba para pagar por mim?',
      answer:
        'Sim. Calcule o valor, toque em "Gerar PDF para enviar" e partilhe o documento: ele mostra quanto entregar ao titular do cartão para cobrir a compra, as comissões e o IVA.',
    },
  ],

  share: {
    purchase: (amount: string) => `Cartão BAI Kamba — compra de ${amount}`,
    rate: (rate: string) => `Câmbio: ${rate} Kz`,
    load: 'Carregar no Kamba',
    total: 'Total na conta BAI',
    link: 'Simulação',
    pdfTitle: 'Pedido de carregamento Kamba',
  },

  pdf: {
    brand: 'CARTÃO BAI KAMBA',
    title: 'Pedido de carregamento',
    amountLabel: 'Valor a entregar ao titular do cartão',
    forPurchase: (amount: string) => `Para uma compra de ${amount}, incluindo todas as comissões e IVA.`,
    purchase: 'Compra',
    cardholder: 'Titular do cartão',
    payer: 'Pago por',
    detailsTitle: 'Como chegámos a este valor',
    base: (amount: string, rate: string) => `Compra ${amount} x ${rate} Kz`,
    purchaseFee: `Comissão de compra (${f.pct(FEES.purchase)})`,
    vat: `IVA sobre a comissão (${vat})`,
    margin: (pct: string) => `Margem de segurança cambial (${pct})`,
    existing: 'Saldo já existente no cartão',
    load: 'Valor a carregar no Kamba',
    loadFee: `Comissão de carregamento (${f.pct(FEES.load)})`,
    total: 'Total a entregar',
    noteRate: (date: string) =>
      `Câmbio de venda BAI de ${date}. O banco aplica o câmbio do dia em que a compra é liquidada (1 a 3 dias úteis).`,
    noteMargin: (amount: string) =>
      `A margem de ${amount} protege contra variações do câmbio; o que não for usado fica no cartão.`,
    noteNoMargin:
      'Sem margem de segurança: se o câmbio subir, a compra pode ser recusada por saldo insuficiente.',
    noteDisclaimer: 'Valores estimados com base no preçário BAI em vigor. Este documento não é emitido pelo BAI.',
    madeAt: 'Simulação feita em',
    open: 'Toque para abrir e ajustar',
    poweredBy: 'Powered by Expressers',
    fileName: 'kamba',
  },
}

export type Messages = typeof pt
