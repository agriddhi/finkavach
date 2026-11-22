// Generates PWA icons (favicon-192.png, favicon-512.png) — navy shield + marigold tick.
// Run: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

// ---------- minimal PNG encoder (RGBA, no deps) ----------
function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let n = 0; n < buf.length; n++) {
    let c = (crc ^ buf[n]) & 0xFF
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    crc = (crc >>> 8) ^ c
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const t = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}

function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc(h * (1 + w * 4))
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0 // filter: none
    rgba.copy(raw, y * (1 + w * 4) + 1, y * w * 4, (y + 1) * w * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- artwork ----------
const NAVY = [20, 32, 58] // #14203A
const MARIGOLD = [255, 201, 60] // #FFC93C

// Shield in normalized icon coords (0..1), centered, inside the maskable safe zone.
function inShield(x, y) {
  const cx = 0.5
  const top = 0.2
  const mid = 0.54
  const bottom = 0.8
  const W = 0.25
  const r = 0.07
  if (y < top || y > bottom) return false
  const dx = Math.abs(x - cx)
  if (y < top + r) {
    return dx <= (W - r) + Math.sqrt(Math.max(0, r * r - (y - (top + r)) ** 2))
  }
  if (y <= mid) return dx <= W
  return dx <= W * (1 - (y - mid) / (bottom - mid))
}

// Navy check mark polyline inside the shield
function distToSeg(px, py, ax, ay, bx, by) {
  const vx = bx - ax
  const vy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)))
  return Math.hypot(px - (ax + t * vx), py - (ay + t * vy))
}
function inTick(x, y) {
  const th = 0.034
  return (
    distToSeg(x, y, 0.395, 0.46, 0.455, 0.535) < th ||
    distToSeg(x, y, 0.455, 0.535, 0.61, 0.365) < th
  )
}

function render(size) {
  const S = 3 // supersampling for smooth edges
  const rgba = Buffer.alloc(size * size * 4)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let n = 0
      const acc = [0, 0, 0]
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const x = (px + (sx + 0.5) / S) / size
          const y = (py + (sy + 0.5) / S) / size
          const c = inShield(x, y) ? (inTick(x, y) ? NAVY : MARIGOLD) : NAVY
          acc[0] += c[0]
          acc[1] += c[1]
          acc[2] += c[2]
          n++
        }
      }
      const i = (py * size + px) * 4
      rgba[i] = Math.round(acc[0] / n)
      rgba[i + 1] = Math.round(acc[1] / n)
      rgba[i + 2] = Math.round(acc[2] / n)
      rgba[i + 3] = 255
    }
  }
  return encodePNG(size, size, rgba)
}

mkdirSync(OUT, { recursive: true })
for (const size of [192, 512]) {
  const file = join(OUT, `favicon-${size}.png`)
  writeFileSync(file, render(size))
  console.log('wrote', file)
}
