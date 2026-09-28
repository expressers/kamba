/**
 * Router mínimo (4 páginas estáticas) sobre a History API.
 * No pré-render, `setServerPath` define a página a renderizar.
 */

const listeners = new Set<() => void>()
let serverPath = '/'

export function setServerPath(path: string) {
  serverPath = path
}

export const subscribeRoute = (listener: () => void) => {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

export const getRoute = () => window.location.pathname

/** No cliente, a hidratação usa o caminho actual — o mesmo que foi pré-renderizado. */
export const getServerRoute = () => (typeof window === 'undefined' ? serverPath : window.location.pathname)

export function navigate(path: string) {
  if (path === window.location.pathname) {
    window.scrollTo({ top: 0 })
    return
  }
  window.history.pushState(null, '', path)
  window.scrollTo({ top: 0 })
  listeners.forEach((l) => l())
}
