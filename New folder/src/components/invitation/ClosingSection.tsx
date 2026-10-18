import { imageSrcSet, imageUrl, wedding } from '@/config/wedding'
import { FadeIn } from './FadeIn'
import { Floral, GoldSprig, Petals } from './Ornaments'
import { ShareInvitation } from './ShareInvitation'

/** The final scene: a closing blessing, the couple once more, and sharing. */
export function ClosingSection({ reducedMotion }: { reducedMotion: boolean }) {
  const { couple, event, text, images } = wedding
  const photo = images.closingPortrait
  return (
    <section className="section closing" aria-labelledby="closing-title">
      {!reducedMotion && <Petals count={5} mode="drift" className="closing__petals" />}
      <FadeIn className="closing__photo">
        <img
          src={imageUrl(photo.src, 720)}
          srcSet={imageSrcSet(photo.src, [420, 640, 860, 1085])}
          sizes="(min-width: 640px) 440px, 86vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      </FadeIn>

      <FadeIn className="closing__text" delay={100}>
        <p className="eyebrow">{text.closingEyebrow}</p>
        <p className="closing__message">{text.closingMessage}</p>
        <h2 id="closing-title" className="display-names display-names--small">
          {couple.bride} <span className="amp">&amp;</span> {couple.groom}
        </h2>
        <p className="closing__date">{event.displayDate}</p>
        <GoldSprig />
      </FadeIn>

      <FadeIn delay={200} className="closing__share">
        <p className="closing__share-label">Share the invitation</p>
        <ShareInvitation />
      </FadeIn>

      <Floral variant="garland" className="closing__garland" sizes="(min-width: 640px) 480px, 90vw" />
      <footer className="closing__footer">
        Made with love for {couple.bride} &amp; {couple.groom} · {event.displayDate}
      </footer>
    </section>
  )
}
