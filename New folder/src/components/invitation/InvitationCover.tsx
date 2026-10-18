import { wedding } from '@/config/wedding'
import { Floral, GoldDivider } from './Ornaments'

type Props = {
  onOpen: () => void
  opening: boolean
}

/**
 * The invitation's printed front: a gatefold card with watercolor florals,
 * gold borders and a wax seal. Tapping, clicking, or pressing Enter/Space
 * anywhere on it opens the invitation.
 */
export function InvitationCover({ onOpen, opening }: Props) {
  const { couple, event, text } = wedding
  return (
    <div className="cover" data-opening={opening || undefined}>
      <div className="cover__panel cover__panel--left" aria-hidden="true">
        <span className="cover__frame" />
        <Floral variant="corner" className="cover__floral cover__floral--tl" sizes="(min-width: 640px) 300px, 58vw" eager />
        <span className="cover__shade" />
      </div>
      <div className="cover__panel cover__panel--right" aria-hidden="true">
        <span className="cover__frame" />
        <Floral variant="corner" className="cover__floral cover__floral--br" sizes="(min-width: 640px) 260px, 48vw" eager />
        <span className="cover__shade" />
      </div>

      <button
        type="button"
        className="cover__face"
        onClick={onOpen}
        disabled={opening}
        aria-label={`Open the wedding invitation of ${couple.bride} and ${couple.groom}`}
      >
        <span className="cover__eyebrow">{text.coverEyebrow}</span>
        <span className="cover__names">
          <span className="cover__name shimmer-text">{couple.bride}</span>
          <span className="cover__amp">&amp;</span>
          <span className="cover__name shimmer-text">{couple.groom}</span>
        </span>
        <GoldDivider className="cover__divider" />
        <span className="cover__date">{event.displayDate}</span>

        <span className="seal" aria-hidden="true">
          <span className="seal__inner">{couple.monogram}</span>
        </span>

        <span className="cover__cta">
          <span className="cover__cta-dot" aria-hidden="true" />
          {text.coverInstruction}
        </span>
      </button>
    </div>
  )
}
