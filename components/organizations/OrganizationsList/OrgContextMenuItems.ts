import { route } from 'nextjs-routes'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { OrgContextMenuState } from './OrganizationsList.types'

export function buildOrgContextMenuItems(
  contextMenu: OrgContextMenuState | null,
  router: AppRouterInstance,
  setContextMenu: (v: OrgContextMenuState | null) => void,
  setShowDeleteConfirm: (v: string | null) => void
): ContextMenuItem[] {
  if (!contextMenu) return []
  return [
    {
      label: 'View',
      onClick: () => {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: contextMenu.org.slug },
          })
        )
        setContextMenu(null)
      },
    },
    {
      label: 'Edit',
      onClick: () => {
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: contextMenu.org.slug },
          })
        )
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
