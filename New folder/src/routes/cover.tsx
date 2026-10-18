import { Link, createFileRoute } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { absoluteUrl, imageSrcSet, imageUrl, wedding } from '@/config/wedding'
import { ShareInvitation } from '@/components/invitation/ShareInvitation'
import { SvgDefs } from '@/components/invitation/Ornaments'

export const Route = createFileRoute('/cover')({
  head: () => ({
    meta: [
      { title: `Invitation cover · ${wedding.share.title}` },
      { property: 'og:image', content: absoluteUrl(wedding.share.coverImage.src) },
      { property: 'og:image:width', content: String(wedding.share.coverImage.width) },
      { property: 'og:image:height', content: String(wedding.share.coverImage.height) },
      { property: 'og:url', content: absoluteUrl('/cover') },
    ],
  }),
  component: CoverPage,
})

/**
 * The portrait invitation cover on its own: a clickable card that opens the
 * invitation, plus a download for sending the image directly.
 */
function CoverPage() {
  const cover = wedding.share.coverImage
  return (
    <main className="cover-page">
      <SvgDefs />
      <Link to="/" className="cover-card" aria-label={`Open the wedding invitation of ${wedding.couple.bride} and ${wedding.couple.groom}`}>
        <img
          src={imageUrl(cover.src, 720, 85)}
          srcSet={imageSrcSet(cover.src, [480, 720, 1080], 85)}
          sizes="(min-width: 640px) 440px, 88vw"
          width={cover.width}
          height={cover.height}
          alt={`Invitation cover: the wedding of ${wedding.couple.bride} and ${wedding.couple.groom}, ${wedding.event.displayDate}, ${wedding.venue.name}`}
        />
        <span className="cover-card__hint">{wedding.text.coverInstruction}</span>
      </Link>
      <div className="cover-page__actions">
        <a className="gold-button" href={cover.src} download="Chandana-Akhil-invitation.jpg">
          <Download aria-hidden="true" />
          Download cover image
        </a>
        <ShareInvitation showDownload={false} />
        <p className="cover-page__note">
          Send the cover image and the invitation link together — the image is a keepsake, and the link opens the
          full invitation.
        </p>
      </div>
    </main>
  )
}
