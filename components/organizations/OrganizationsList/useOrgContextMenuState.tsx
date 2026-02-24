'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { ContextMenuState } from './OrganizationsList.types'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { Organization } from '@/gen/centy_pb'

function buildOrgContextMenuItems(
  contextMenu: ContextMenuState | null,
  router: ReturnType<typeof useRouter>,
  setContextMenu: (v: ContextMenuState | null) => void,
  setShowDeleteConfirm: (v: string | null) => void
): ContextMenuItem[] {
  if (!contextMenu) return []
  const orgRoute = route({
    pathname: '/organizations/[orgSlug]',
    query: { orgSlug: contextMenu.org.slug },
  })
  return [
    {
      label: 'View',
      onClick: () => {
        router.push(orgRoute)
        setContextMenu(null)
      },
    },
    {
      label: 'Edit',
      onClick: () => {
        router.push(orgRoute)
        setContextMenu(null)
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        setShowDeleteConfirm(contextMenu.org.slug)
        setContextMenu(null)
      },
      danger: true,
    },
  ]
}

export function useOrgContextMenuState(
  setShowDeleteConfirm: (v: string | null) => void
) {
  const router = useRouter()
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, org: Organization) => {
      e.preventDefault()
      setContextMenu({ x: e.clientX, y: e.clientY, org })
    },
    []
  )

  const contextMenuItems = buildOrgContextMenuItems(
    contextMenu,
    router,
    setContextMenu,
    setShowDeleteConfirm
  )

  return { contextMenu, setContextMenu, handleContextMenu, contextMenuItems }
}
