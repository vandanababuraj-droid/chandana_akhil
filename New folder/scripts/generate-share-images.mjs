/**
 * Regenerates the share artwork in public/img/share/ from the couple portrait
 * and the watercolor florals:
 *   - og-preview.jpg      1200 × 630  (WhatsApp / social link preview)
 *   - invitation-cover.jpg 1080 × 1350 (4:5 portrait cover to send as an image)
 *
 * Usage:
 *   pnpm add -D sharp            (one-time)
 *   node scripts/generate-share-images.mjs
 * For the intended look, install the free Google fonts Cormorant Garamond,
 * Great Vibes and Montserrat on your machine first.
 * Keep the TEXT values below in sync with src/config/wedding.ts.
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const TEXT = {
  bride: 'Chandana',
  groom: 'Akhil',
  time: '9:30 onwards',
  venue: 'Trinity Casa',
  place: 'Cheranallore, Ernakulam',
  url: 'cinematic-wedding-3efaf1.netlify.app',
}

const PORTRAIT = 'public/img/couple-portrait.jpg'
const CORNER = 'public/img/floral-corner.png'
const GARLAND = 'public/img/floral-garland.png'
const OUT = 'public/img/share'
mkdirSync(OUT, { recursive: true })

const IVORY = '#fbf6ec'
const INK = '#3d3428'
const GREEN = '#3f5b48'

const defs = `
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8c6a2f"/><stop offset=".35" stop-color="#d8b770"/>
      <stop offset=".55" stop-color="#f2dfa8"/><stop offset=".75" stop-color="#b58d45"/>
      <stop offset="1" stop-color="#8a6730"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".42" r=".75">
      <stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#f3ead8"/>
    </radialGradient>
    <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/>
      <feColorMatrix values="0 0 0 0 .55  0 0 0 0 .47  0 0 0 0 .35  0 0 0 .06 0"/></filter>
  </defs>`

const esc = (s) => s.replace(/&/g, '&amp;')

async function paper(w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${defs}
    <rect width="100%" height="100%" fill="url(#glow)"/><rect width="100%" height="100%" filter="url(#paper)"/></svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function floral(src, width, { rotate = 0, flop = false, opacity = 1 } = {}) {
  let img = sharp(src).resize({ width })
  if (flop) img = img.flop()
  if (rotate) img = img.rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
  let buf = await img.png().toBuffer()
  if (opacity < 1) {
    buf = await sharp(buf).ensureAlpha().composite([{ input: Buffer.from([255, 255, 255, Math.round(255 * opacity)]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: 'dest-in' }]).png().toBuffer()
  }
  return buf
}

async function ogPreview() {
  const W = 1200, H = 630
  const photoW = 470, photoH = 630
  const photo = await sharp(PORTRAIT).resize(photoW, photoH, { fit: 'cover', position: 'top' }).toBuffer()
  const tx = 470 + (W - 470) / 2
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${defs}
    <rect x="${photoW}" y="0" width="2" height="${H}" fill="url(#gold)"/>
    <rect x="${photoW + 22}" y="22" width="${W - photoW - 44}" height="${H - 44}" fill="none" stroke="url(#gold)" stroke-width="1.6"/>
    <rect x="${photoW + 30}" y="30" width="${W - photoW - 60}" height="${H - 60}" fill="none" stroke="url(#gold)" stroke-width=".7" opacity=".7"/>
    <rect x="24" y="24" width="${photoW - 48}" height="${H - 48}" fill="none" stroke="#fff6dd" stroke-width="1.4" opacity=".85"/>
    <text x="${tx}" y="178" text-anchor="middle" font-family="Montserrat" font-weight="500" font-size="15" letter-spacing="6" fill="${GREEN}">TOGETHER WITH THEIR FAMILIES</text>
    <text x="${tx}" y="282" text-anchor="middle" font-family="Cormorant Garamond" font-weight="500" font-size="92" fill="${INK}">${TEXT.bride}</text>
    <text x="${tx}" y="345" text-anchor="middle" font-family="Great Vibes" font-size="66" fill="url(#gold)">&amp;</text>
    <text x="${tx}" y="430" text-anchor="middle" font-family="Cormorant Garamond" font-weight="500" font-size="92" fill="${INK}">${TEXT.groom}</text>
    <line x1="${tx - 130}" y1="468" x2="${tx - 20}" y2="468" stroke="#c4a364" stroke-width="1.2"/>
    <path d="M${tx} 461 l7 7 -7 7 -7 -7z" fill="url(#gold)"/>
    <line x1="${tx + 20}" y1="468" x2="${tx + 130}" y2="468" stroke="#c4a364" stroke-width="1.2"/>
    <text x="${tx}" y="512" text-anchor="middle" font-family="Montserrat" font-weight="500" font-size="19" letter-spacing="5" fill="${INK}">15 NOVEMBER 2026 · ${TEXT.time.toUpperCase()}</text>
    <text x="${tx}" y="548" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="25" fill="${GREEN}">${esc(TEXT.venue)}, ${esc(TEXT.place)}</text>
  </svg>`
  const garland = await floral(GARLAND, 420)
  const gm = await sharp(garland).metadata()
  await sharp(await paper(W, H))
    .composite([
      { input: photo, left: 0, top: 0 },
      { input: garland, left: Math.round(tx - gm.width / 2), top: 52 },
      { input: Buffer.from(overlay), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT}/og-preview.jpg`)
}

async function cover() {
  const W = 1080, H = 1350
  const aw = 470, ah = 600, ax = (W - aw) / 2, ay = 250
  const r = aw / 2
  const arch = `M0 ${ah} V${r} A${r} ${r} 0 0 1 ${aw} ${r} V${ah} Z`
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${aw}" height="${ah}"><path d="${arch}" fill="#fff"/></svg>`
  const photo = await sharp(PORTRAIT).resize(aw, ah, { fit: 'cover', position: 'top' })
    .composite([{ input: Buffer.from(mask), blend: 'dest-in' }]).png().toBuffer()
  const c = W / 2
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${defs}
    <rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="url(#gold)" stroke-width="2.2"/>
    <rect x="46" y="46" width="${W - 92}" height="${H - 92}" fill="none" stroke="url(#gold)" stroke-width="1" opacity=".75"/>
    <path transform="translate(${ax - 12} ${ay - 12})" d="M0 ${ah + 24} V${r + 12} A${r + 12} ${r + 12} 0 0 1 ${aw + 24} ${r + 12} V${ah + 24} Z" fill="none" stroke="url(#gold)" stroke-width="2"/>
    <path transform="translate(${ax - 22} ${ay - 22})" d="M0 ${ah + 34} V${r + 22} A${r + 22} ${r + 22} 0 0 1 ${aw + 44} ${r + 22} V${ah + 34} Z" fill="none" stroke="url(#gold)" stroke-width=".9" opacity=".7"/>
    <text x="${c}" y="170" text-anchor="middle" font-family="Montserrat" font-weight="500" font-size="21" letter-spacing="9" fill="${GREEN}">THE WEDDING OF</text>
    <text x="${c}" y="980" text-anchor="middle" font-family="Cormorant Garamond" font-weight="500" font-size="104" fill="${INK}">${TEXT.bride} <tspan font-family="Great Vibes" font-size="92" fill="url(#gold)">&amp;</tspan> ${TEXT.groom}</text>
    <line x1="${c - 170}" y1="1030" x2="${c - 24}" y2="1030" stroke="#c4a364" stroke-width="1.4"/>
    <path d="M${c} 1022 l8 8 -8 8 -8 -8z" fill="url(#gold)"/>
    <line x1="${c + 24}" y1="1030" x2="${c + 170}" y2="1030" stroke="#c4a364" stroke-width="1.4"/>
    <text x="${c}" y="1086" text-anchor="middle" font-family="Montserrat" font-weight="500" font-size="22" letter-spacing="5" fill="${INK}">15 NOVEMBER 2026 · ${TEXT.time.toUpperCase()}</text>
    <text x="${c}" y="1128" text-anchor="middle" font-family="Cormorant Garamond" font-style="italic" font-size="31" fill="${GREEN}">${esc(TEXT.venue)} · ${esc(TEXT.place)}</text>
    <text x="${c}" y="1226" text-anchor="middle" font-family="Great Vibes" font-size="40" fill="url(#gold)">Tap the link to open your invitation</text>
    <text x="${c}" y="1266" text-anchor="middle" font-family="Montserrat" font-weight="500" font-size="17" letter-spacing="3" fill="${INK}" opacity=".75">${TEXT.url}</text>
  </svg>`
  const tl = await floral(CORNER, 330)
  const br = await floral(CORNER, 220, { rotate: 180 })
  const brm = await sharp(br).metadata()
  await sharp(await paper(W, H))
    .composite([
      { input: photo, left: ax, top: ay },
      { input: Buffer.from(overlay), left: 0, top: 0 },
      { input: tl, left: 18, top: 18 },
      { input: br, left: W - brm.width - 18, top: H - brm.height - 18 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${OUT}/invitation-cover.jpg`)
}

await ogPreview()
await cover()
console.log('Share images written to', OUT)
