import type { ReactNode } from 'react'

interface ItemTitleProps {
  children: ReactNode
}

export function ItemTitle({ children }: ItemTitleProps) {
  return <h1 className="item-title">{children}</h1>
}

interface ItemTitleWithBadgeProps {
  badge: ReactNode
  children: ReactNode
}

export function ItemTitleWithBadge({
  badge,
  children,
}: ItemTitleWithBadgeProps) {
  return (
    <div className="item-title-with-badge">
      <h1 className="item-title">{children}</h1>
      {badge}
    </div>
  )
}

interface ItemContentProps {
  children: ReactNode
}

export function ItemContent({ children }: ItemContentProps) {
  return <div className="item-content">{children}</div>
}
