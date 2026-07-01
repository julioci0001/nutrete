// ══════════════════════════════════════════════════════════════
// src/app/layout.tsx — Root Layout
// ══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { defaultMetadata } from '@/lib/seo/metadata'
import { generateOrganizationSchema } from '@/lib/seo/metadata'
import './globals.css'

// ── Fonts ─────────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const orgSchema = generateOrganizationSchema()

  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        {/* Org Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="font-body bg-white text-gray-900 antialiased">
        {/* Analytics — loads after hydration */}
        <Analytics />

        {children}

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#14532d',
              color: '#fff',
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
      </body>
    </html>
  )
}

// ── Analytics Component ────────────────────────────────────────
function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

  if (!gaId) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { page_path: window.location.pathname });
          `,
        }}
      />
      {metaPixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${metaPixelId}');fbq('track','PageView');
            `,
          }}
        />
      )}
    </>
  )
}
