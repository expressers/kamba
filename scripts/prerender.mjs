// Injeta o HTML renderizado no servidor e o JSON-LD em dist/index.html,
// para que motores de busca e pré-visualizações vejam o conteúdo sem JavaScript.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const serverEntry = new URL('../dist-server/entry-server.js', import.meta.url)
const indexPath = `${root}dist/index.html`

const { render, structuredData } = await import(serverEntry.href)

const jsonLd = structuredData()
  .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`)
  .join('\n    ')

const html = (await readFile(indexPath, 'utf8'))
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
  .replace('<!--structured-data-->', jsonLd)

if (!html.includes('application/ld+json')) throw new Error('Marcador <!--structured-data--> em falta no index.html')

await writeFile(indexPath, html)
await rm(`${root}dist-server`, { recursive: true, force: true })
console.log('✓ dist/index.html pré-renderizado')
