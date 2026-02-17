'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import { useDocsData } from './hooks/useDocsData'
import { useDocsContextMenu } from './hooks/useDocsContextMenu'
import { DocsListHeader } from './DocsListHeader'
import { DocsListContent } from './DocsListContent'
import { DocsListModals } from './DocsListModals'

export function DocsList() {
  const router = useRouter()
  const { projectPath, isInitialized } = usePathContext()
  const { copyToClipboard } = useCopyToClipboard()
  const { createLink } = useAppLink()
  const { pinItem, unpinItem, isPinned } = usePinnedItems()

  const data = useDocsData(projectPath, isInitialized)
  const menu = useDocsContextMenu(projectPath, data.fetchDocs)

  const contextMenuItems: ContextMenuItem[] = menu.contextMenu
    ? [
        {
          label: isPinned(menu.contextMenu.doc.slug) ? 'Unpin' : 'Pin',
          onClick: () => {
            if (isPinned(menu.contextMenu!.doc.slug)) {
              unpinItem(menu.contextMenu!.doc.slug)
            } else {
              pinItem({
                id: menu.contextMenu!.doc.slug,
                type: 'doc',
                title: menu.contextMenu!.doc.title,
              })
            }
            menu.setContextMenu(null)
          },
        },
        {
          label: 'View',
          onClick: () => {
            router.push(createLink(`/docs/${menu.contextMenu!.doc.slug}`))
            menu.setContextMenu(null)
          },
        },
        {
          label: 'Move',
          onClick: () => menu.handleMoveDoc(menu.contextMenu!.doc),
        },
        {
          label: 'Duplicate',
          onClick: () => menu.handleDuplicateDoc(menu.contextMenu!.doc),
        },
      ]
    : []

  return (
    <div className="docs-list">
      <DocsListHeader
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={data.loading}
        onRefresh={data.fetchDocs}
        newDocUrl={createLink('/docs/new')}
      />
      {!projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view documentation</p>
        </div>
      )}
      {projectPath && isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}
      {projectPath && isInitialized === true && (
        <DocsListContent
          docs={data.docs}
          loading={data.loading}
          error={data.error}
          deleteConfirm={data.deleteConfirm}
          deleting={data.deleting}
          createDocUrl={createLink('/docs/new')}
          createLink={createLink}
          onContextMenu={menu.handleContextMenu}
          onCopySlug={copyToClipboard}
          onDeleteRequest={data.setDeleteConfirm}
          onDeleteCancel={() => data.setDeleteConfirm(null)}
          onDeleteConfirm={data.handleDelete}
        />
      )}
      <DocsListModals
        menu={menu}
        contextMenuItems={contextMenuItems}
        projectPath={projectPath}
      />
    </div>
  )
}
