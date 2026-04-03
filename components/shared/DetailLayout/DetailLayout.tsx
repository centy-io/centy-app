import type { ReactNode } from 'react'

interface DetailLayoutProps {
  main: ReactNode
  sidebar: ReactNode
}

export function DetailLayout({ main, sidebar }: DetailLayoutProps) {
  return (
    <div className="detail-layout">
      <div className="detail-layout-main">{main}</div>
      <aside className="detail-layout-sidebar">{sidebar}</aside>
    </div>
  )
}
