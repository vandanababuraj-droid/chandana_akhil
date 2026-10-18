/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — edit this one file to change the invitation.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Names, date, time, venue, messages, images, music, links and countdown
 *  settings all live here. Every scene of the invitation reads from it.
 *
 *  Images and audio live in /public. Replace a file and keep its name, or
 *  point the path below at your new file:
 *    public/img/couple-portrait.jpg        main couple photograph
 *    public/img/floral-corner.png          watercolor floral spray (transparent)
 *    public/img/floral-garland.png         watercolor floral garland (transparent)
 *    public/img/share/og-preview.jpg       1200 × 630 link-preview image
 *    public/img/share/invitation-cover.jpg 1080 × 1350 cover to send as an image
 *    public/audio/wedding-music.mp3        background music
 */

export const wedding = {
  couple: {
    bride: 'Chandana',
    groom: 'Akhil',
    /** Shown as a monogram on the wax seal. */
    monogram: 'C & A',
  },

  event: {
    /** Calendar date of the wedding, in YYYY-MM-DD form (venue's local date). */
    date: '2026-11-15',
    /** The date exactly as printed on the invitation. */
    displayDate: 'November 15, 2026',
    displayWeekday: 'Sunday',
    /** The time exactly as printed on the invitation. */
    displayTime: '9:30 onwards',
    /** IANA time zone of the venue. Kerala, India. */
    timeZone: 'Asia/Kolkata',
    /** UTC offset of the time zone above. India has no daylight saving. */
    utcOffset: '+05:30',
  },

  countdown: {
    /**
     * The exact moment the countdown counts towards, as 24-hour "HH:MM" in the
     * venue's time zone.
     *
     * The invitation says "9:30 onwards" without AM or PM, so this is left
     * unset (null) and the countdown runs to the START of the wedding day
     * (00:00 in Kerala). Set it to '09:30' for 9:30 AM, or '21:30' for 9:30 PM,
     * and the countdown will run to the ceremony itself.
     */
    ceremonyStart: null as string | null,
    labelBeforeDay: 'until our wedding day',
    labelBeforeCeremony: 'until we say “I do”',
    /** Shown once the countdown reaches zero, for the rest of the wedding day. */
    weddingDayMessage: 'The celebration begins today',
    /** Shown after the wedding day has passed. */
    afterMessage: 'Thank you for celebrating with us',
  },

  venue: {
    name: 'Trinita Casa',
    locality: 'Cheranallore, Ernakulam',
    region: 'Kerala, India',
    mapsUrl: 'https://maps.app.goo.gl/5uMVhfJh4WDJrGcz6',
  },

  text: {
    coverEyebrow: 'The wedding of',
    coverInstruction: 'Tap to open your invitation',
    revealEyebrow: 'Together with their families',
    revealLine: 'join us as we begin our forever',
    introEyebrow: 'Our story, our forever',
    invitationMessage:
      'With hearts full of love and gratitude, we invite you to be part of the beginning of our forever. Your presence and blessings would mean the world to us as we celebrate this beautiful new chapter together.',
    introSignature: 'With love,',
    scratchEyebrow: 'Save the date',
    scratchPrompt: 'A special day awaits',
    scratchHint: 'Scratch the gold to reveal',
    countdownEyebrow: 'Counting the moments',
    venueEyebrow: 'Where we celebrate',
    closingMessage: 'Together with your love and blessings, our forever begins.',
    closingEyebrow: 'With love & gratitude',
  },

  images: {
    /** Main couple photograph — used on the reveal and introduction scenes. */
    couplePortrait: {
      src: '/img/couple-portrait.jpg',
      width: 1085,
      height: 1450,
      alt: 'Watercolor portrait of Chandana in a rose silk saree and Akhil in a blue shirt and mundu, standing beneath a banyan tree beside a temple',
    },
    /** Closing photograph. Point this at a second photo when you have one. */
    closingPortrait: {
      src: '/img/couple-portrait.jpg',
      width: 1085,
      height: 1450,
      alt: 'Chandana and Akhil together',
    },
    floralCorner: { src: '/img/floral-corner.png', width: 815, height: 961 },
    floralGarland: { src: '/img/floral-garland.png', width: 1296, height: 250 },
  },

  music: {
    /** Set to null to remove music entirely. */
    src: '/audio/wedding-music.mp3' as string | null,
    title: 'Sada Nannu — slow version',
    /** 0 to 1. */
    volume: 0.55,
    /** Start playing when the guest opens the invitation (a tap is required by browsers). */
    playOnOpen: true,
  },

  share: {
    /**
     * Public address of the invitation. Used for link previews and the
     * WhatsApp / copy-link message. Update this if you add a custom domain.
     */
    siteUrl: 'https://cinematic-wedding-3efaf1.netlify.app',
    title: 'Chandana & Akhil · Wedding Invitation',
    description:
      'You are warmly invited to celebrate the wedding of Chandana & Akhil on November 15, 2026 at Trinity Casa, Cheranallore, Ernakulam.',
    /** {url} is replaced with the invitation address. */
    message:
      'You are warmly invited to celebrate the wedding of Chandana & Akhil on November 15, 2026. Open your invitation here: {url}',
    ogImage: { src: '/img/share/og-preview.jpg', width: 1200, height: 630 },
    coverImage: { src: '/img/share/invitation-cover.jpg', width: 1080, height: 1350 },
  },
} as const

export type WeddingConfig = typeof wedding

/** Absolute URL for a public asset, for Open Graph tags. */
export function absoluteUrl(path: string) {
  return new URL(path, wedding.share.siteUrl).toString()
}

/**
 * Optimised image URL via the Netlify Image CDN. Keeps transparency for PNGs
 * when served as WebP.
 */
export function imageUrl(src: string, width: number, quality = 78) {
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&fm=webp&q=${quality}`
}

export function imageSrcSet(src: string, widths: number[], quality = 78) {
  return widths.map((w) => `${imageUrl(src, w, quality)} ${w}w`).join(', ')
}
