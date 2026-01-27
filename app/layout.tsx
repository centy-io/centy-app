import type { Metadata } from 'next'
import Script from 'next/script'
import { Noto_Sans } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import { DaemonDisconnectedOverlay } from '@/components/layout/DaemonDisconnectedOverlay'
import { DemoModeIndicator } from '@/components/layout/DemoModeIndicator'
import { LegacyUrlRedirect } from '@/components/layout/LegacyUrlRedirect'
import { MobileNotSupportedOverlay } from '@/components/layout/MobileNotSupportedOverlay'
import { Header } from '@/components/layout/Header'
import { ClientRouteHandler } from '@/components/layout/ClientRouteHandler'
import '@/styles/globals.css'

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
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
    <html lang="en" suppressHydrationWarning className={notoSans.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZV5SD70Z2D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZV5SD70Z2D');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <DaemonDisconnectedOverlay />
          <DemoModeIndicator />
          <LegacyUrlRedirect />
          <MobileNotSupportedOverlay />
          <div className="app">
            <Header />
            <main>
              <ClientRouteHandler>{children}</ClientRouteHandler>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
