// Gera um HTML completo por página e idioma (dist/<caminho>/index.html) e o sitemap,
// para que motores de busca e pré-visualizações vejam o conteúdo sem JavaScript.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const serverDir = fileURLToPath(new URL('../dist-server/', import.meta.url))
const { ROUTES, render, head, htmlLang, sitemap } = await import(`${serverDir}entry-server.js`)

const template = await readFile(`${dist}index.html`, 'utf8')
for (const marker of ['<!--page-head-->', '<div id="root"></div>', '<html lang="pt-AO">']) {
  if (!template.includes(marker)) throw new Error(`Marcador em falta no index.html: ${marker}`)
}

for (const { path } of ROUTES) {
  const html = template
    .replace('<html lang="pt-AO">', `<html lang="${htmlLang(path)}">`)
    .replace('<!--page-head-->', head(path))
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)

  const dir = path === '/' ? dist : `${dist}${path.slice(1)}/`
  await mkdir(dir, { recursive: true })
  await writeFile(`${dir}index.html`, html)
  console.log(`✓ ${path}`)
}

await writeFile(`${dist}sitemap.xml`, sitemap(new Date().toISOString().slice(0, 10)))
await rm(serverDir, { recursive: true, force: true })
console.log(`✓ sitemap.xml (${ROUTES.length} páginas)`)
