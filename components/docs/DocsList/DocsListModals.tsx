import type { ContextMenuState } from './types'
import type { Doc } from '@/gen/centy_pb'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'

interface DocsListModalsProps {
  projectPath: string
  contextMenu: ContextMenuState | null
  contextMenuItems: ContextMenuItem[]
  onCloseContextMenu: () => void
  showMoveModal: boolean
  showDuplicateModal: boolean
  selectedDoc: Doc | null
  onCloseMoveModal: () => void
  onCloseDuplicateModal: () => void
  onMoved: (targetProjectPath: string) => void
  onDuplicated: (newSlug: string, targetProjectPath: string) => void
}

export function DocsListModals({
  projectPath,
  contextMenu,
  contextMenuItems,
  onCloseContextMenu,
  showMoveModal,
  showDuplicateModal,
  selectedDoc,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onMoved,
  onDuplicated,
}: DocsListModalsProps) {
  return (
    <>
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={onCloseContextMenu}
        />
      )}

      {showMoveModal && selectedDoc && (
        <MoveModal
          entityType="doc"
          entityId={selectedDoc.slug}
          entityTitle={selectedDoc.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && selectedDoc && (
        <DuplicateModal
          entityType="doc"
          entityId={selectedDoc.slug}
          entityTitle={selectedDoc.title}
          entitySlug={selectedDoc.slug}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={onDuplicated}
        />
      )}
    </>
  )
}
