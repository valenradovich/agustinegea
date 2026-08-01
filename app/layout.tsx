import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const serif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' })

export const metadata: Metadata = {
  title: 'Agustin Egea — Professional-ish',
  description: 'The deeply unserious portfolio of a completely fictional professional.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f3f0e8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${sans.variable} ${mono.variable} ${serif.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
