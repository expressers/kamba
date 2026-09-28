// Service worker da Calculadora Kamba: abre sem rede e mantém os ficheiros em cache.
// Incremente a versão para forçar a limpeza da cache antiga.
const CACHE = 'kamba-v2'
const PAGES = ['/', '/como-carregar', '/taxas', '/perguntas', '/en', '/en/how-to-load', '/en/fees', '/en/faq']
const PRECACHE = [...PAGES, '/site.webmanifest', '/favicon.svg', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Páginas: rede primeiro (câmbio e taxas actualizados), cache se estiver offline.
  // A chave ignora a query (?v=...) para uma simulação partilhada abrir sem rede.
  if (request.mode === 'navigate') {
    const key = url.pathname.replace(/\/+$/, '') || '/'
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(key, copy))
          }
          return response
        })
        .catch(() => caches.match(key).then((cached) => cached || caches.match(key.startsWith('/en') ? '/en' : '/'))),
    )
    return
  }

  // Ficheiros com hash no nome nunca mudam: cache primeiro.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
            return response
          }),
      ),
    )
    return
  }

  // Restantes: responde da cache e actualiza em segundo plano.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})
