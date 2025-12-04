import type { Metadata } from 'next'
import { Providers } from '@/components/providers/Providers'
import { DaemonDisconnectedOverlay } from '@/components/layout/DaemonDisconnectedOverlay'
import { Header } from '@/components/layout/Header'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Centy',
  description: 'Local-first issue and documentation tracker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <DaemonDisconnectedOverlay />
          <div className="app">
            <Header />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
