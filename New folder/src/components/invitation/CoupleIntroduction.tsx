import { imageSrcSet, imageUrl, wedding } from '@/config/wedding'
import { FadeIn } from './FadeIn'
import { Floral, GoldDivider } from './Ornaments'

/** Editorial introduction: the couple's portrait and their invitation message. */
export function CoupleIntroduction() {
  const { couple, text, images } = wedding
  const photo = images.couplePortrait
  return (
    <section id="our-story" className="section intro" aria-labelledby="intro-title">
      <FadeIn className="intro__photo-wrap">
        <figure className="arch-frame">
          <img
            className="arch-frame__img"
            src={imageUrl(photo.src, 720)}
            srcSet={imageSrcSet(photo.src, [420, 640, 860, 1085])}
            sizes="(min-width: 960px) 420px, (min-width: 640px) 380px, 78vw"
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>
        <Floral variant="corner" className="intro__floral" sizes="(min-width: 640px) 220px, 40vw" />
      </FadeIn>

      <div className="intro__text">
        <FadeIn>
          <p className="eyebrow">{text.introEyebrow}</p>
        </FadeIn>
        <FadeIn delay={120}>
          <h2 id="intro-title" className="display-names">
            {couple.bride} <span className="amp">&amp;</span> {couple.groom}
          </h2>
        </FadeIn>
        <FadeIn delay={220}>
          <GoldDivider />
        </FadeIn>
        <FadeIn delay={300}>
          <p className="intro__message">{text.invitationMessage}</p>
        </FadeIn>
        <FadeIn delay={400}>
          <p className="intro__signature">
            <span>{text.introSignature}</span>
            <span className="script">
              {couple.bride} &amp; {couple.groom}
            </span>
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
