import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from '@/App'
import { initPwa } from '@/lib/pwa'
import { stateFromSearch } from '@/lib/state'
import './index.css'
import './styles/app.scss'

initPwa()

const container = document.getElementById('root')!
const shared = stateFromSearch(window.location.search)
const app = (
  <StrictMode>
    <App initialState={shared ?? undefined} />
  </StrictMode>
)

// O HTML pré-renderizado usa os valores por omissão: hidrata-o, a menos que
// o link traga uma simulação partilhada (aí renderiza de raiz).
if (container.hasChildNodes() && !shared) {
  hydrateRoot(container, app)
} else {
  container.textContent = ''
  createRoot(container).render(app)
}
