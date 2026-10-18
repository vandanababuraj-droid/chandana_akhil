import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'
import { absoluteUrl, wedding } from '@/config/wedding'

import '../styles.css'

const { share } = wedding
const fonts =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@400;500&display=swap'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#fbf6ec' },
      { title: share.title },
      { name: 'description', content: share.description },
      { property: 'og:site_name', content: `${wedding.couple.bride} & ${wedding.couple.groom}` },
      { property: 'og:title', content: share.title },
      { property: 'og:description', content: share.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: absoluteUrl('/') },
      { property: 'og:image', content: absoluteUrl(share.ogImage.src) },
      { property: 'og:image:secure_url', content: absoluteUrl(share.ogImage.src) },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: String(share.ogImage.width) },
      { property: 'og:image:height', content: String(share.ogImage.height) },
      { property: 'og:image:alt', content: `Wedding invitation of ${wedding.couple.bride} & ${wedding.couple.groom}` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: share.title },
      { name: 'twitter:description', content: share.description },
      { name: 'twitter:image', content: absoluteUrl(share.ogImage.src) },
    ],
    links: [
      { rel: 'canonical', href: absoluteUrl('/') },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: fonts },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" />
        <Scripts />
      </body>
    </html>
  )
}
