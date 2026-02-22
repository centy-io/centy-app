import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { Providers } from '@/components/providers/Providers'
import { DaemonDisconnectedOverlay } from '@/components/layout/DaemonDisconnectedOverlay'
import { DemoModeIndicator } from '@/components/layout/DemoModeIndicator'
import { LegacyUrlRedirect } from '@/components/layout/LegacyUrlRedirect'
import { MobileNotSupportedOverlay } from '@/components/layout/MobileNotSupportedOverlay'
import { Header } from '@/components/layout/Header'
import { ClientRouteHandler } from '@/components/layout/ClientRouteHandler'
import '@/styles/globals.css'
import { GOOGLE_ANALYTICS_URL } from '@/lib/constants/urls'

const notoSans = localFont({
  src: [
    {
      path: '../public/fonts/noto-sans/noto-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/noto-sans/noto-sans-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/noto-sans/noto-sans-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/noto-sans/noto-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Centy',
  description: 'Local-first issue and documentation tracker',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`root-html ${notoSans.variable}`}
    >
      <head className="root-head">
        <Script src={GOOGLE_ANALYTICS_URL} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZV5SD70Z2D');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="root-body">
        <Providers>
          <DaemonDisconnectedOverlay />
          <DemoModeIndicator />
          <LegacyUrlRedirect />
          <MobileNotSupportedOverlay />
          <div className="app">
            <Header />
            <main className="app-main">
              <ClientRouteHandler>{children}</ClientRouteHandler>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
