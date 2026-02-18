'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { type User } from '@/gen/centy_pb'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { SyncUsersModal } from '../SyncUsersModal'
import { useUsersData } from './useUsersData'
import { useUserRoutes } from './useProjectRoutes'
import { UsersListContent } from './UsersListContent'

export function UsersList() {
  const router = useRouter()
  const data = useUsersData()
  const { getUserRoute, newUserRoute } = useUserRoutes()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  )
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    user: User
  } | null>(null)

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
    ? [
        {
          label: 'View',
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
