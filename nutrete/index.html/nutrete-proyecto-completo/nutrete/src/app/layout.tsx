import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { defaultMetadata } from '@/lib/seo/metadata'
import './globals.css'
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['400','600','700','900'] })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap', weight: ['300','400','500','600','700'] })
export const metadata: Metadata = defaultMetadata
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body bg-white text-gray-900 antialiased">
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#14532d', color: '#fff', borderRadius: '12px' } }} />
      </body>
    </html>
  )
}