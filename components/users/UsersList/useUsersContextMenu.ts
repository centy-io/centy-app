'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { User } from '@/gen/centy_pb'
import type { RouteLiteral } from 'nextjs-routes'
import type { ContextMenuState } from './UsersList.types'

export function useUsersContextMenu(
  getUserRoute: (userId: string) => RouteLiteral | '/',
  setShowDeleteConfirm: (id: string | null) => void
) {
  const router = useRouter()
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, user: User) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, user })
  }, [])

  const closeContextMenu = useCallback(() => setContextMenu(null), [])

  const contextMenuItems: ContextMenuItem[] = contextMenu
    ? [
        {
          label: 'View',
          onClick: () => {
            router.push(getUserRoute(contextMenu.user.id))
            setContextMenu(null)
          },
        },
        {
          label: 'Edit',
          onClick: () => {
            router.push(getUserRoute(contextMenu.user.id))
            setContextMenu(null)
          },
        },
        {
          label: 'Delete',
          onClick: () => {
            setShowDeleteConfirm(contextMenu.user.id)
            setContextMenu(null)
          },
          danger: true,
        },
      ]
    : []

  return { contextMenu, contextMenuItems, handleContextMenu, closeContextMenu }
}
