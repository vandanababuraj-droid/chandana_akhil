# AGENTS.md

Guidance for developers and AI agents working on this codebase.

## Project Overview

A cinematic, mobile-first digital wedding invitation for **Chandana & Akhil** (15 November 2026, Trinity Casa, Cheranallore, Ernakulam). Guests open a link, tap a gatefold invitation cover, and scroll through a sequence of scenes: reveal, couple introduction, scratch-to-reveal date, live countdown, venue, and a closing scene with sharing. There is no backend, login, or data storage. It is a static, server-rendered experience.

### Tech Stack

| Layer      | Technology                                                       |
| ---------- | ---------------------------------------------------------------- |
| Framework  | TanStack Start (React 19 + Vite 8), server-rendered              |
| Language   | TypeScript (strict)                                              |
| Styling    | Hand-written CSS in `src/styles/invitation.css` (Tailwind is present from the base template but barely used) |
| Icons      | lucide-react                                                     |
| Toasts     | sonner (share/copy feedback)                                     |
| Images     | Netlify Image CDN (`/.netlify/images`) for resizing + WebP       |
| Deployment | Netlify via `@netlify/vite-plugin-tanstack-start`                |

## Key Files

```
src/config/wedding.ts            ← SINGLE SOURCE OF TRUTH for all wedding content
src/routes/__root.tsx            HTML shell, fonts, Open Graph / Twitter metadata
src/routes/index.tsx             The invitation: stage machine (cover → opening → open) + scenes
src/routes/cover.tsx             /cover: standalone clickable cover card + download
src/components/invitation/
  InvitationCover.tsx            Printed gatefold front (names, florals, wax seal)
  OpeningAnimation.tsx           Full-screen overlay; plays the gatefold opening
  RevealScene.tsx                Inner card: gold line draws, names fade in
  ScrollCue.tsx                  Animated scroll hint
  CoupleIntroduction.tsx         Portrait in an arch frame + invitation message
  ScratchReveal.tsx              Canvas scratch card for the date (+ accessible button)
  WeddingCountdown.tsx           Countdown in Asia/Kolkata
  VenueSection.tsx               Venue card + Google Maps link
  ClosingSection.tsx             Closing blessing, photo, share
  ShareInvitation.tsx            WhatsApp / Web Share / copy link / cover download
  MusicPlayer.tsx                Floating play/pause + mute control
  Ornaments.tsx                  GoldDivider, Floral, GoldSprig, Petals, SvgDefs
  FadeIn.tsx                     Viewport fade-in wrapper
src/hooks/                       useMusic, useInView, useReducedMotion
src/styles/invitation.css        All invitation styling and animation
public/img/                      Couple portrait, watercolor florals (transparent PNG)
public/img/share/                og-preview.jpg (1200×630), invitation-cover.jpg (1080×1350)
public/audio/wedding-music.mp3   Background music
scripts/generate-share-images.mjs Regenerates the share images (needs sharp)
```

## Conventions & Non-obvious Decisions

- **All content comes from `src/config/wedding.ts`.** Don't hard-code names, dates, or copy in components. The one exception is the text baked into the share images, which `scripts/generate-share-images.mjs` keeps in its own `TEXT` constant.
- **Countdown target.** The invitation says "9:30 onwards" with no AM/PM. `countdown.ceremonyStart` is `null` on purpose, so the countdown runs to 00:00 IST on the wedding day. Setting it to `'09:30'` or `'21:30'` makes it count to the ceremony. Times are converted with the fixed `utcOffset` (`+05:30`); India has no daylight saving time.
- **Open Graph URLs must be absolute.** `absoluteUrl()` builds them from `share.siteUrl`. If the domain changes, update `siteUrl`.
- **Music** is only created and played inside the tap that opens the cover, because browsers block autoplay. A guest's mute preference is saved in `localStorage`. If the file is missing or fails to load, the control hides itself.
- **The page is complete under the cover.** Deep links (`/#our-story`) or `?open` skip the cover.
- **Animation** is CSS-only (transforms and opacity). `Petals` uses deterministic pseudo-random values so server and client renders match. `prefers-reduced-motion` turns off drifting petals and bursts, turns the gatefold into a crossfade, and shortens all motion.
- **Scratch coverage** is estimated with a coarse 24×14 grid instead of `getImageData`, which keeps scratching smooth on mid-range phones. The canvas uses `touch-action: none`, so scratching doesn't scroll the page.
- Images go through `imageUrl()` / `imageSrcSet()`, which use the Netlify Image CDN (WebP, keeps alpha). Every image has width/height set to prevent layout shift.
- The florals were generated as watercolor art and converted to transparent PNGs. The couple portrait is the couple's own artwork, unaltered. Never replace the couple with generated or stock faces.

## Commands

```bash
pnpm install
pnpm dev          # Vite dev server on :3000 (or `netlify dev` for full emulation)
pnpm build        # production build → dist/client
pnpm typecheck
```
