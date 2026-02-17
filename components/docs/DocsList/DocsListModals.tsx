'use client'

import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import type { UseDocsContextMenuReturn } from './DocsList.types'

interface DocsListModalsProps {
  menu: UseDocsContextMenuReturn
  contextMenuItems: ContextMenuItem[]
  projectPath: string
}

export function DocsListModals({
  menu,
  contextMenuItems,
  projectPath,
}: DocsListModalsProps) {
  return (
    <>
      {menu.contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={menu.contextMenu.x}
          y={menu.contextMenu.y}
          onClose={() => menu.setContextMenu(null)}
        />
      )}

      {menu.showMoveModal && menu.selectedDoc && (
        <MoveModal
          entityType="doc"
          entityId={menu.selectedDoc.slug}
          entityTitle={menu.selectedDoc.title}
          currentProjectPath={projectPath}
          onClose={menu.closeMoveModal}
          onMoved={menu.handleMoved}
        />
      )}

      {menu.showDuplicateModal && menu.selectedDoc && (
        <DuplicateModal
          entityType="doc"
          entityId={menu.selectedDoc.slug}
          entityTitle={menu.selectedDoc.title}
          entitySlug={menu.selectedDoc.slug}
          currentProjectPath={projectPath}
          onClose={menu.closeDuplicateModal}
          onDuplicated={menu.handleDuplicated}
        />
      )}
    </>
  )
}
