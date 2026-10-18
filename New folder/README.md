# Chandana & Akhil — Digital Wedding Invitation

A cinematic, mobile-first wedding invitation for **Chandana & Akhil**, styled like a luxury printed card. Guests tap a gatefold cover with gold borders and watercolor florals. A wax seal lifts, the doors open, and the invitation unfolds in eight scenes:

1. **Invitation cover**: names, florals, gold shimmer, "Tap to open your invitation" (works with tap, click, or Enter/Space)
2. **The reveal**: soft light, a gold line drawing itself, petals, and the names fading in
3. **Couple introduction**: the couple's portrait in an arched gold frame and the invitation message
4. **Scroll cue**: a gentle hint to keep scrolling (no scroll hijacking)
5. **Scratch to reveal**: scratch the gold foil to uncover _November 15, 2026 · 9:30 onwards_, or use the button
6. **Countdown**: live countdown in India Standard Time (Asia/Kolkata)
7. **Venue**: Trinity Casa, Cheranallore, Ernakulam, with an **Open in Google Maps** button
8. **Closing**: a blessing, the couple once more, and share actions (WhatsApp, native share, copy link, cover download)

There's also a discreet music control. Music starts with the opening tap and can be paused or muted at any time.

**Live:** https://cinematic-wedding-3efaf1.netlify.app · **Cover card:** https://cinematic-wedding-3efaf1.netlify.app/cover

## Tech

React 19 + TypeScript on TanStack Start (Vite), server-rendered and deployed on Netlify. Animations are CSS-only. Images are resized and served as WebP by the Netlify Image CDN. No login, no cookies, no trackers.

## Run locally

```bash
pnpm install        # or npm install
pnpm dev            # http://localhost:3000
# or, with full Netlify emulation (Image CDN etc.):
netlify dev
```

## Editing the invitation

**Everything lives in [`src/config/wedding.ts`](src/config/wedding.ts)**: names, date, time, venue, Maps link, all messages, image paths, music, countdown settings, share text, and the public URL.

### Countdown time (please check)

The invitation says "9:30 onwards" without AM or PM, so the countdown currently runs to the **start of the wedding day** (midnight IST). To count to the ceremony itself, set:

```ts
countdown: { ceremonyStart: '09:30', ... }   // 9:30 AM IST  (or '21:30' for 9:30 PM)
```

The printed time ("9:30 onwards") is set separately in `event.displayTime`.

### Replacing images and music

| File                                     | What it is                                         |
| ---------------------------------------- | -------------------------------------------------- |
| `public/img/couple-portrait.jpg`         | Main couple photo (intro). Update width/height in the config if the size changes |
| `images.closingPortrait` in the config   | Closing photo. Currently the same portrait; point it at a second photo if you have one |
| `public/img/floral-corner.png`, `floral-garland.png` | Watercolor florals (transparent PNG)    |
| `public/audio/wedding-music.mp3`         | Background music. Replace it with any MP3 of the same name, or set `music.src: null` to turn music off |
| `public/img/share/og-preview.jpg`        | 1200×630 link-preview image                        |
| `public/img/share/invitation-cover.jpg`  | 1080×1350 portrait cover to send as an image       |

If you change names or details, regenerate the share images:

```bash
pnpm add -D sharp
node scripts/generate-share-images.mjs
```

## Sharing on WhatsApp

WhatsApp builds a preview from the link's metadata, so **sharing the URL shows the invitation preview image, title, and description**. Tapping the preview opens the full invitation.

An image attachment on its own can't open a website. The best way to send the invitation:

1. Send the **cover image** (`/img/share/invitation-cover.jpg`, also downloadable from the closing scene or `/cover`) as a keepsake.
2. In the same chat, send the **link**: https://cinematic-wedding-3efaf1.netlify.app. The **Share on WhatsApp** button fills in the message and link for you.

WhatsApp caches previews. If you change the preview image, test with a new link (for example `…netlify.app/?v=2`).

## Deploying

The site is on **Netlify** and deploys automatically from the `main` branch. The build runs `vite build` and publishes `dist/client` (see `netlify.toml`). The public URL is in your Netlify dashboard under _Project overview_.

If you add a custom domain, update `share.siteUrl` in the config so link previews use it.
