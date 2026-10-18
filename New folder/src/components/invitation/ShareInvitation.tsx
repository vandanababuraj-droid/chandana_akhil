import { Copy, Download, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { wedding } from '@/config/wedding'

/** The public invitation address — the configured site, or wherever we're hosted. */
export function invitationUrl() {
  if (wedding.share.siteUrl) return wedding.share.siteUrl.replace(/\/$/, '') + '/'
  return typeof window === 'undefined' ? '' : window.location.origin + '/'
}

function shareMessage(url: string) {
  return wedding.share.message.replace('{url}', url)
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }
  // Older browsers: select a temporary textarea.
  const area = document.createElement('textarea')
  area.value = value
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  if (!ok) throw new Error('copy failed')
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.82.83-3-.2-.31a8.2 8.2 0 1 1 6.95 3.82Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.96-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.38.1-.5.12-.12.26-.3.38-.45.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.67.31c-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.16 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.15-1.18-.07-.1-.23-.17-.48-.29Z" />
    </svg>
  )
}

/** WhatsApp, native share and copy-link actions, plus the cover image download. */
export function ShareInvitation({ showDownload = true }: { showDownload?: boolean }) {
  const [canShare, setCanShare] = useState(false)
  const [url, setUrl] = useState<string>(wedding.share.siteUrl)

  useEffect(() => {
    setCanShare(typeof navigator.share === 'function')
    setUrl(invitationUrl())
  }, [])

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareMessage(url))}`

  const nativeShare = async () => {
    try {
      await navigator.share({ title: wedding.share.title, text: shareMessage(url).replace(url, '').trim(), url })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      try {
        await copyText(shareMessage(url))
        toast.success('Sharing isn’t available here, so the invitation link was copied instead.')
      } catch {
        toast.error('Couldn’t share the invitation. Please copy the address from your browser.')
      }
    }
  }

  const copyLink = async () => {
    try {
      await copyText(url)
      toast.success('Invitation link copied')
    } catch {
      toast.error(`Couldn’t copy automatically. The link is ${url}`)
    }
  }

  return (
    <div className="share">
      <a className="gold-button gold-button--solid" href={whatsappHref} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
        Share on WhatsApp
        <span className="sr-only">(opens WhatsApp)</span>
      </a>
      <div className="share__row">
        {canShare && (
          <button type="button" className="ghost-button" onClick={nativeShare}>
            <Share2 aria-hidden="true" />
            Share
          </button>
        )}
        <button type="button" className="ghost-button" onClick={copyLink}>
          <Copy aria-hidden="true" />
          Copy link
        </button>
        {showDownload && (
          <a className="ghost-button" href={wedding.share.coverImage.src} download="Chandana-Akhil-invitation.jpg">
            <Download aria-hidden="true" />
            Cover image
          </a>
        )}
      </div>
    </div>
  )
}
