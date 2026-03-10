/**
 * Génère des icônes PNG simples pour la PWA.
 * Nécessite canvas (natif Node 18+).
 */
import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function createIcon(size) {
  const canvas  = createCanvas(size, size)
  const ctx     = canvas.getContext('2d')

  // Fond sombre
  ctx.fillStyle = '#161B22'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, size * 0.2)
  ctx.fill()

  // Emoji 📅 — dessiné en texte
  ctx.font      = `${size * 0.55}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('📅', size / 2, size / 2)

  return canvas.toBuffer('image/png')
}

try {
  const { createCanvas } = await import('canvas')
  writeFileSync(resolve(__dirname, '../public/icon-192.png'), createIcon(192))
  writeFileSync(resolve(__dirname, '../public/icon-512.png'), createIcon(512))
  console.log('[icons] ✓ icon-192.png et icon-512.png générés')
} catch {
  console.log('[icons] Module canvas non disponible — icônes SVG utilisées à la place')
}
