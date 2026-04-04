'use client'

import React, { useCallback, useRef, useState, type ReactNode } from 'react'

interface DetailLayoutProps {
  main: ReactNode
  sidebar: ReactNode
  defaultSidebarWidth?: number
  minSidebarWidth?: number
  maxSidebarWidth?: number
}

export function DetailLayout({
  main,
  sidebar,
  defaultSidebarWidth,
  minSidebarWidth,
  maxSidebarWidth,
}: DetailLayoutProps) {
  const resolvedDefaultSidebarWidth = defaultSidebarWidth ?? 280
  const resolvedMinSidebarWidth = minSidebarWidth ?? 200
  const resolvedMaxSidebarWidth = maxSidebarWidth ?? 600
  const [sidebarWidth, setSidebarWidth] = useState(resolvedDefaultSidebarWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const onMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return
        const containerRect = containerRef.current.getBoundingClientRect()
        const newWidth = containerRect.right - e.clientX
        setSidebarWidth(
          Math.max(
            resolvedMinSidebarWidth,
            Math.min(resolvedMaxSidebarWidth, newWidth)
          )
        )
      }

      const onMouseUp = () => {
        setIsDragging(false)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [resolvedMinSidebarWidth, resolvedMaxSidebarWidth]
  )

  const style: React.CSSProperties & Record<string, string> = {
    '--detail-layout-sidebar-width': `${sidebarWidth}px`,
  }

  return (
    <div className="detail-layout" style={style} ref={containerRef}>
      <div className="detail-layout-main">{main}</div>
      <div
        className={`detail-layout-resize-handle${isDragging ? ' is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
      />
      <aside className="detail-layout-sidebar">{sidebar}</aside>
    </div>
  )
}
