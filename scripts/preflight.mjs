import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

/**
 * Preflight para evitar dos problemas comunes:
 * 1) /favicon.ico devuelve 500 si existe app/favicon.ico (route especial de Next) y el archivo queda corrupto.
 *    Solución: forzar que el favicon venga de /public (archivo estático) y eliminar el de /app.
 * 2) Si alguien deja artefactos viejos en public/data, dejamos todo consistente.
 */

async function rmIfExists(p) {
  try {
    await fsp.rm(p)
    // eslint-disable-next-line no-console
    console.log(`OK: removed ${p}`)
  } catch (e) {
    if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return
    // eslint-disable-next-line no-console
    console.warn(`WARN: could not remove ${p}:`, e?.message ?? e)
  }
}

async function ensurePublicFavicon() {
  const pub = path.join(process.cwd(), 'public', 'favicon.ico')
  if (fs.existsSync(pub)) return

  // Si no existe, intentamos copiar desde app (si existe)
  const app = path.join(process.cwd(), 'app', 'favicon.ico')
  if (fs.existsSync(app)) {
    await fsp.mkdir(path.dirname(pub), { recursive: true })
    await fsp.copyFile(app, pub)
    // eslint-disable-next-line no-console
    console.log('OK: copied app/favicon.ico -> public/favicon.ico')
  }
}

async function main() {
  // Preferimos public/favicon.ico para evitar 500 raros en dev
  await ensurePublicFavicon()
  await rmIfExists(path.join(process.cwd(), 'app', 'favicon.ico'))
}

await main()
