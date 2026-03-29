'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SyncUsersModal } from '../SyncUsersModal'
import { useUsersData } from './useUsersData'
import { useUserRoutes } from './useProjectRoutes'
import { UsersListContent } from './UsersListContent'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { type User } from '@/gen/centy_pb'

interface ContextMenuState {
  x: number
  y: number
  user: User
}

function buildContextMenuItems(
  menu: ContextMenuState,
  onView: () => void,
  onDelete: () => void
): ContextMenuItem[] {
  return [
    { label: 'View', onClick: onView },
    { label: 'Delete', onClick: onDelete, danger: true },
  ]
}

export function UsersList() {
  const router = useRouter()
  const data = useUsersData()
  const { getUserRoute, newUserRoute } = useUserRoutes()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, user: User) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, user })
  }, [])

  const handleSynced = useCallback(
    (createdCount: number) => {
      if (createdCount > 0) data.fetchUsers()
      setShowSyncModal(false)
    },
    [data]
  )

  const contextMenuItems: ContextMenuItem[] = contextMenu
    ? buildContextMenuItems(
        contextMenu,
        () => {
          router.push(getUserRoute(contextMenu.user.id))
          setContextMenu(null)
        },
        () => {
          setShowDeleteConfirm(contextMenu.user.id)
          setContextMenu(null)
        }
      )
    : []

  return (
    <div className="users-list">
      <UsersListContent
        {...data}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        setShowSyncModal={setShowSyncModal}
        newUserRoute={newUserRoute}
        getUserRoute={getUserRoute}
        onContextMenu={handleContextMenu}
      />
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
      {showSyncModal && (
        <SyncUsersModal
          onClose={() => setShowSyncModal(false)}
          onSynced={handleSynced}
        />
      )}
    </div>
  )
}
