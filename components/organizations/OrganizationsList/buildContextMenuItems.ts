import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { ContextMenuState } from './OrganizationsList.types'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'

export function buildContextMenuItems(
  contextMenu: ContextMenuState,
  router: ReturnType<typeof useRouter>,
  setShowDeleteConfirm: (slug: string | null) => void,
  setContextMenu: (state: ContextMenuState | null) => void
): ContextMenuItem[] {
  const orgRoute = route({
    pathname: '/organizations/[orgSlug]',
    query: { orgSlug: contextMenu.org.slug },
  })
  const navigate = (): void => {
    router.push(orgRoute)
    setContextMenu(null)
  }
  return [
    { label: 'View', onClick: navigate },
    { label: 'Edit', onClick: navigate },
    {
      label: 'Untrack',
      onClick: () => {
        setShowDeleteConfirm(contextMenu.org.slug)
        setContextMenu(null)
      },
      danger: true,
    },
  ]
}
