import type { Messages } from '@/i18n'
import type { Scenario } from './calculator'
import type { Formatters } from './format'
import type { Currency } from './kamba'

export function summaryText(s: Scenario, currency: Currency, url: string, t: Messages, f: Formatters): string {
  return [
    t.share.purchase(f.money(s.amount, currency)),
    t.share.rate(f.rate(s.rate)),
    ``,
    `${t.share.load}: ${f.kz(s.load)}`,
    `${t.share.total}: ${f.kz(s.total)}`,
    ``,
    `${t.share.link}: ${url}`,
  ].join('\n')
}

/** Partilha pelo menu nativo (telemóvel) ou copia para a área de transferência. */
export async function shareOrCopy(text: string, url: string): Promise<'shared' | 'copied' | 'cancelled'> {
  if (navigator.share) {
    try {
      await navigator.share({ text, url })
      return 'shared'
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'cancelled'
    }
  }
  await navigator.clipboard.writeText(text)
  return 'copied'
}

/** Partilha um ficheiro pelo menu nativo, ou faz download se não for suportado. */
export async function shareOrDownload(file: File, title: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title })
      return 'shared'
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'cancelled'
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}
