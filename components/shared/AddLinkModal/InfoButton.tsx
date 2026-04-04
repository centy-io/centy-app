'use client'

import { Info } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

interface InfoButtonProps {
  children: ReactNode
}

export function InfoButton({ children }: InfoButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const showInfo = hovered || pinned

  useEffect(() => {
    if (!pinned) return
    const unpin = () => void setPinned(false)
    document.addEventListener('click', unpin)
    return () => void document.removeEventListener('click', unpin)
  }, [pinned])

  return (
    <span
      className="link-modal-info-wrapper"
      onMouseEnter={() => void setHovered(true)}
      onMouseLeave={() => void setHovered(false)}
      onClick={e => {
        e.stopPropagation()
        setPinned(p => !p)
      }}
    >
      <Info
        className={`link-modal-info-btn${pinned ? ' is-pinned' : ''}`}
        size={16}
      />
      {showInfo && <span className="link-modal-info-tooltip">{children}</span>}
    </span>
  )
}
