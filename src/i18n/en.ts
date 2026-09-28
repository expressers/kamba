import { formatters } from '@/lib/format'
import { DEFAULT_MARGIN, FEES, MONTHLY_LOAD_LIMIT_USD } from '@/lib/kamba'
import type { Messages } from './pt'

const f = formatters('en')
const vat = f.pct(FEES.vat)
const withVat = (pct: number) => f.pct(Math.round(pct * (1 + FEES.vat / 100) * 100) / 100)

export const en: Messages = {
  meta: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    siteName: 'Kamba Calculator',
    appDescription:
      'Work out how much to load onto the BAI Kamba prepaid card for purchases in dollars or euros, with fees and VAT included.',
  },

  pages: {
    calculator: {
      label: 'Calculator',
      hint: 'How much to load and spend',
      title: 'BAI Kamba Card Calculator — How much to load in Kwanzas',
      description:
        'Find out how much to load onto the BAI Kamba prepaid card for purchases in dollars or euros. BAI fees, VAT and exchange rate included. Share a PDF.',
      heading: 'How much to load on your Kamba card?',
      intro:
        'Work out in seconds how many Kwanzas you need for purchases in dollars or euros, with BAI fees and VAT already included.',
    },
    howto: {
      label: 'How to load',
      hint: 'Step by step on BAI Directo',
      title: 'How to load the BAI Kamba card — Step by step',
      description:
        'How to load the BAI Kamba card on BAI Directo: how many Kwanzas to deposit, how to top up the card and how to pay safely online.',
      heading: 'How to load the Kamba card',
      intro: 'From calculation to purchase, in four steps.',
    },
    fees: {
      label: 'Fees',
      hint: 'Fees, VAT and limits',
      title: 'BAI Kamba card fees in 2026 — Charges and VAT',
      description: `BAI Kamba card fees: ${f.pct(FEES.load)} to load, ${f.pct(FEES.purchase)} on purchases and withdrawals, plus ${vat} VAT. Card issuance cost and monthly limit.`,
      heading: 'Kamba card fees',
      intro: 'Based on the official BAI price list for personal customers (April 16, 2026).',
    },
    faq: {
      label: 'FAQ',
      hint: 'Questions about Kamba',
      title: 'BAI Kamba card — Frequently asked questions',
      description:
        'Answers about the BAI Kamba card: costs, exchange rate, loading limits, how to get the card and how to pay for someone else’s purchase.',
      heading: 'Frequently asked questions',
      intro: 'The essentials on Kamba card costs, exchange rates and limits.',
    },
  },

  header: {
    openMenu: 'Open menu',
    menu: 'Menu',
    menuDescription: 'Calculator pages and information',
    mainNav: 'Main',
    installApp: 'Install app',
    installPhone: 'Install on your phone',
    language: 'Language',
    footnote: (rateDate: string, pricingDate: string) =>
      `Exchange rate from ${rateDate} · Price list from ${pricingDate}. Independent tool, not affiliated with BAI.`,
  },

  footer: {
    disclaimer:
      'Independent tool, not affiliated with Banco BAI. Figures are estimates; always check on BAI Directo before loading.',
    sources: 'Sources:',
    pricing: 'BAI price list',
    rates: 'BAI exchange rates',
    poweredBy: 'Powered by',
  },

  form: {
    tabPay: 'How much to load?',
    tabBudget: 'How much can I spend?',
    purchase: 'Purchase amount',
    quickAmounts: 'Quick amounts',
    currency: 'Purchase currency',
    budget: 'Kwanzas available in your BAI account',
    budgetPlaceholder: '100,000',
    rate: (currency: string) => `BAI rate (${currency})`,
    rateSell: (date: string) => `Sell · ${date}`,
    rateReset: (rate: string) => `Reset to ${rate}`,
    more: 'More options',
    balance: 'Balance already on the card',
    margin: 'Safety margin',
    marginAria: 'Exchange rate safety margin',
    marginHint: `The rate may rise before the purchase settles (1 to 3 business days). We recommend ${f.pct(DEFAULT_MARGIN)}; whatever is left stays on the card.`,
  },

  result: {
    aria: 'Result',
    load: 'Load onto Kamba',
    need: 'Needed in your BAI account',
    canSpend: 'You can spend up to',
    fees: 'Fees + VAT',
    pdf: 'Create PDF to send',
    share: 'Share summary',
    barNeed: 'Needed in your account',
    overLimit: (amount: string) =>
      `You would load about ${amount}, above the ${MONTHLY_LOAD_LIMIT_USD} USD monthly limit announced by BAI. Check your limit on BAI Directo.`,
  },

  breakdown: {
    title: 'See full breakdown',
    purchaseFee: `Purchase fee ${f.pct(FEES.purchase)}`,
    vat: `${vat} VAT on the fee`,
    margin: (pct: string) => `Safety margin ${pct}`,
    existing: 'Balance already on the card',
    load: 'Load onto Kamba',
    loadFee: `Loading fee ${f.pct(FEES.load)}`,
    total: 'Total debited from account',
  },

  pdfDrawer: {
    title: 'Send to whoever is paying',
    description: (total: string) =>
      `The PDF shows that ${total} must be handed to the cardholder, with the full calculation. The fields below are optional.`,
    description_label: 'What is the purchase for?',
    description_placeholder: 'E.g. Netflix subscription',
    cardholder_label: 'Kamba cardholder',
    cardholder_placeholder: 'Who receives the money',
    payer_label: 'Paid by',
    payer_placeholder: 'Who hands over the money',
    submit: 'Create and share PDF',
  },

  toast: {
    copied: 'Summary copied',
    pdfDownloaded: 'PDF downloaded',
    pdfError: 'Could not create the PDF. Please try again.',
    installed: 'App installed',
  },

  install: {
    title: 'Install the Kamba app',
    subtitle: 'Quick access, even offline.',
    install: 'Install',
    dismiss: 'Dismiss',
    iosTitle: 'Install on iPhone',
    iosDescription: 'In Safari, it takes two taps:',
    iosShare: ['Tap', 'Share', 'in the Safari toolbar.'],
    iosAdd: ['Choose', 'Add to Home Screen', '.'],
    ok: 'Got it',
  },

  cta: {
    question: 'How much do you need for your purchase?',
    button: 'Calculate now',
  },

  howto: [
    {
      title: 'Calculate the amount',
      text: `Enter the purchase in dollars or euros. The calculator adds the fees, VAT and a ${f.pct(DEFAULT_MARGIN)} exchange rate margin.`,
    },
    {
      title: 'Have the Kwanzas in your account',
      text: 'Deposit at least the "Needed in your BAI account" amount into your BAI current account. Cards can only be loaded from Kwanzas.',
    },
    {
      title: 'Load on BAI Directo',
      text: 'In the BAI Directo app, choose the Kamba card and load the amount shown under "Load onto Kamba".',
    },
    {
      title: 'Make the purchase',
      text: 'Pay online or at a card terminal. If asked for a code, confirm with the OTP sent by SMS or email (Verified by Visa).',
    },
  ],

  fees: {
    plusVat: `+ ${vat} VAT`,
    rows: {
      load: { label: 'Loading' },
      purchase: { label: 'Purchases and payments', note: 'online, terminals, ATM' },
      withdrawal: { label: 'Cash withdrawals', note: 'Angola and abroad' },
      issuance: { label: 'Card issuance', note: 'physical or virtual' },
      cancellation: { label: 'Cancellation' },
      limit: { label: 'Monthly limit', note: 'announced June 2024' },
    },
  },

  faq: [
    {
      question: 'How much does it cost to load the BAI Kamba card?',
      answer: `BAI charges ${f.pct(FEES.load)} on the amount loaded, plus ${vat} VAT on that fee — ${withVat(FEES.load)} in practice. To load 100,000 Kz onto the card you need ${f.kz(100_000 * (1 + (FEES.load / 100) * (1 + FEES.vat / 100)))} in your current account.`,
    },
    {
      question: 'What is the fee for international purchases with Kamba?',
      answer: `Each purchase or payment (online or at a terminal, in Angola or abroad) is charged a ${f.pct(FEES.purchase)} fee plus ${vat} VAT on that fee — ${withVat(FEES.purchase)} in total. ATM withdrawals are also charged ${f.pct(FEES.withdrawal)} + VAT.`,
    },
    {
      question: 'How do I load the Kamba card?',
      answer:
        'Deposit Kwanzas into your BAI current account and load the card on BAI Directo, entering the amount. Loading is done only from Kwanzas; if you hold foreign currency, convert it to Kz first.',
    },
    {
      question: 'Which exchange rate applies to purchases in dollars or euros?',
      answer:
        'BAI converts the purchase at its sell rate on the day the purchase settles, usually 1 to 3 business days later. The calculator uses the latest sell rate published by BAI, which may change.',
    },
    {
      question: 'Why should I load a little more than the exact amount?',
      answer: `If the exchange rate rises between purchase and settlement, a purchase with no buffer can be declined for insufficient balance. A ${f.pct(DEFAULT_MARGIN)} margin avoids that, and any leftover stays available on the card.`,
    },
    {
      question: 'What is the Kamba loading limit?',
      answer: `In June 2024 BAI reduced the Kamba monthly loading limit to ${MONTHLY_LOAD_LIMIT_USD} USD. Limits can change; check the current amount on BAI Directo or at a branch.`,
    },
    {
      question: 'How much does the Kamba card cost?',
      answer: `Issuing the Kamba card (physical or virtual) costs ${f.kz(FEES.issuance)} plus VAT, i.e. ${f.kz(FEES.issuance * (1 + FEES.vat / 100))}, according to the BAI price list of April 16, 2026. You must be a BAI customer aged 18 or over.`,
    },
    {
      question: 'Can I ask someone with a Kamba card to pay for me?',
      answer:
        'Yes. Calculate the amount, tap "Create PDF to send" and share the document: it shows how much to hand the cardholder to cover the purchase, fees and VAT.',
    },
  ],

  share: {
    purchase: (amount: string) => `BAI Kamba card — ${amount} purchase`,
    rate: (rate: string) => `Exchange rate: ${rate} Kz`,
    load: 'Load onto Kamba',
    total: 'Total in BAI account',
    link: 'Simulation',
    pdfTitle: 'Kamba loading request',
  },

  pdf: {
    brand: 'BAI KAMBA CARD',
    title: 'Loading request',
    amountLabel: 'Amount to hand to the cardholder',
    forPurchase: (amount: string) => `For a ${amount} purchase, including all fees and VAT.`,
    purchase: 'Purchase',
    cardholder: 'Cardholder',
    payer: 'Paid by',
    detailsTitle: 'How we got to this amount',
    base: (amount: string, rate: string) => `Purchase ${amount} x ${rate} Kz`,
    purchaseFee: `Purchase fee (${f.pct(FEES.purchase)})`,
    vat: `VAT on the fee (${vat})`,
    margin: (pct: string) => `Exchange rate safety margin (${pct})`,
    existing: 'Balance already on the card',
    load: 'Amount to load onto Kamba',
    loadFee: `Loading fee (${f.pct(FEES.load)})`,
    total: 'Total to hand over',
    noteRate: (date: string) =>
      `BAI sell rate from ${date}. The bank applies the rate of the day the purchase settles (1 to 3 business days).`,
    noteMargin: (amount: string) =>
      `The ${amount} margin covers exchange rate changes; anything unused stays on the card.`,
    noteNoMargin: 'No safety margin: if the exchange rate rises, the purchase may be declined for insufficient balance.',
    noteDisclaimer: 'Estimates based on the current BAI price list. This document is not issued by BAI.',
    madeAt: 'Calculated at',
    open: 'Tap to open and adjust',
    poweredBy: 'Powered by Expressers',
    fileName: 'kamba',
  },
}
