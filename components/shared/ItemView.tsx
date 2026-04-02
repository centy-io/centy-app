import type { ReactNode } from 'react'

interface ItemTitleProps {
  children: ReactNode
}

export function ItemTitle({ children }: ItemTitleProps) {
  return <h1 className="item-title">{children}</h1>
}

interface ItemContentProps {
  children: ReactNode
}

export function ItemContent({ children }: ItemContentProps) {
  return <div className="item-content">{children}</div>
}
