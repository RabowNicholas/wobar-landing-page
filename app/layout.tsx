import type { Metadata, Viewport } from 'next'
import './globals.css'
import { display, mono, body } from './fonts'

export const metadata: Metadata = {
  title: 'WOBAR',
  description: 'Wobar opens portals through bass music. Dubstep, halftime, drum & bass, and experimental bass. Based in Salt Lake City.',
  openGraph: {
    title: 'WOBAR',
    description: 'Wobar opens portals through bass music.',
    type: 'music.album',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOBAR',
    description: 'Wobar opens portals through bass music.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
