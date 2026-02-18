'use client'

import { useDocsData } from './useDocsData'
import { useDocsContextMenu } from './useDocsContextMenu'
import { useDocsNavigation } from './useDocsNavigation'
import { DocsListHeader } from './DocsListHeader'
import { DocsListContent } from './DocsListContent'
import { DocsListModals } from './DocsListModals'
import { useAppLink } from '@/hooks/useAppLink'
import { usePathContext } from '@/components/providers/PathContextProvider'

export function DocsList() {
  const { projectPath, isInitialized } = usePathContext()
  const { createLink } = useAppLink()

  const data = useDocsData(projectPath, isInitialized)
  const nav = useDocsNavigation(projectPath, data.fetchDocs)
  const ctx = useDocsContextMenu()

  return (
    <div className="docs-list">
      <DocsListHeader
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={data.loading}
        onRefresh={data.fetchDocs}
        createNewUrl={createLink('/docs/new')}
      />

      <DocsListContent
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={data.loading}
        error={data.error}
        docs={data.docs}
        deleteConfirm={data.deleteConfirm}
        deleting={data.deleting}
        onContextMenu={ctx.handleContextMenu}
        onDeleteRequest={slug => data.setDeleteConfirm(slug)}
        onDeleteCancel={() => data.setDeleteConfirm(null)}
        onDeleteConfirm={data.handleDelete}
      />

      <DocsListModals
        projectPath={projectPath}
        contextMenu={ctx.contextMenu}
        contextMenuItems={ctx.contextMenuItems}
        onCloseContextMenu={() => ctx.setContextMenu(null)}
        showMoveModal={ctx.showMoveModal}
        showDuplicateModal={ctx.showDuplicateModal}
        selectedDoc={ctx.selectedDoc}
        onCloseMoveModal={() => {
          ctx.setShowMoveModal(false)
          ctx.setSelectedDoc(null)
        }}
        onCloseDuplicateModal={() => {
          ctx.setShowDuplicateModal(false)
          ctx.setSelectedDoc(null)
        }}
        onMoved={nav.handleMoved}
        onDuplicated={nav.handleDuplicated}
      />
    </div>
  )
}
