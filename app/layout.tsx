import type { Metadata } from 'next'
import Script from 'next/script'
import { Providers } from '@/components/providers/Providers'
import { DaemonDisconnectedOverlay } from '@/components/layout/DaemonDisconnectedOverlay'
import { DemoModeIndicator } from '@/components/layout/DemoModeIndicator'
import { LegacyUrlRedirect } from '@/components/layout/LegacyUrlRedirect'
import { MobileNotSupportedOverlay } from '@/components/layout/MobileNotSupportedOverlay'
import { Header } from '@/components/layout/Header'
import { ClientRouteHandler } from '@/components/layout/ClientRouteHandler'
import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans/500.css'
import '@fontsource/noto-sans/600.css'
import '@fontsource/noto-sans/700.css'
import '@/styles/globals.css'
import { GOOGLE_ANALYTICS_URL } from '@/lib/constants/urls'

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
    <html lang="en" suppressHydrationWarning className="root-html">
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
