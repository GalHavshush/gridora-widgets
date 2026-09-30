// Collects widgets/*/manifest.json into catalog.json with absolute entry URLs.
// Gridora validates every manifest again on install; this only catches mistakes early.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const siteUrl = process.env.SITE_URL ?? 'http://localhost:4000/'

const catalog = readdirSync('widgets', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map(({ name: dir }) => {
    const manifest = JSON.parse(readFileSync(`widgets/${dir}/manifest.json`, 'utf8'))
    const fail = (why) => {
      throw new Error(`widgets/${dir}/manifest.json: ${why}`)
    }
    if (manifest.id !== dir) fail('"id" must match the folder name')
    if (!/^[a-z0-9-]{1,40}$/.test(dir)) fail('the folder name must be 1–40 lowercase letters, digits or dashes')
    for (const key of ['name', 'version', 'entry', 'defaultSize']) if (!manifest[key]) fail(`"${key}" is required`)
    return { ...manifest, entry: new URL(`widgets/${dir}/${manifest.entry}`, siteUrl).href }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

writeFileSync('catalog.json', JSON.stringify(catalog, null, 2) + '\n')
console.log(`catalog.json: ${catalog.length} widget(s)`)
