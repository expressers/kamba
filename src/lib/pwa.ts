/**
 * Estado de instalação da PWA, partilhado com o React via useSyncExternalStore.
 * O evento `beforeinstallprompt` pode disparar antes da hidratação, por isso
 * é capturado aqui, em `initPwa()`, chamado no arranque (main.tsx).
 */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface PwaState {
  /** O navegador permite mostrar o diálogo nativo de instalação (Android/Chrome/Edge). */
  canPrompt: boolean
  /** iPhone/iPad no Safari: instalação manual via "Adicionar ao ecrã principal". */
  ios: boolean
  /** A app já está a correr instalada. */
  standalone: boolean
  /** O utilizador dispensou o convite recentemente. */
  dismissed: boolean
}

const DISMISS_KEY = 'kamba:install-dismissed'
const DISMISS_DAYS = 14

const SERVER_STATE: PwaState = { canPrompt: false, ios: false, standalone: false, dismissed: true }

let deferred: BeforeInstallPromptEvent | null = null
let state: PwaState = SERVER_STATE
const listeners = new Set<() => void>()

function readDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY))
    return Boolean(at) && Date.now() - at < DISMISS_DAYS * 86_400_000
  } catch {
    return false
  }
}

function refresh() {
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent)
  state = { canPrompt: deferred !== null, ios, standalone, dismissed: readDismissed() }
  listeners.forEach((l) => l())
}

export function initPwa() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
    refresh()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    refresh()
  })
  refresh()

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  }
}

export const subscribePwa = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const getPwaState = () => state
export const getServerPwaState = () => SERVER_STATE

/** Mostra o diálogo nativo de instalação. Devolve true se o utilizador aceitou. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false
  await deferred.prompt()
  const { outcome } = await deferred.userChoice
  deferred = null
  refresh()
  return outcome === 'accepted'
}

export function dismissInstall() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // Sem armazenamento (modo privado): dispensa só nesta sessão.
  }
  state = { ...state, dismissed: true }
  listeners.forEach((l) => l())
}
