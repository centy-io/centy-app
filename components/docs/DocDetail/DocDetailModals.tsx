import type { Doc } from '@/gen/centy_pb'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'

interface DocDetailModalsProps {
  doc: Doc | null
  projectPath: string
  showMoveModal: boolean
  showDuplicateModal: boolean
  onCloseMoveModal: () => void
  onCloseDuplicateModal: () => void
  onMoved: (targetProjectPath: string) => void
  onDuplicated: (newSlug: string, targetProjectPath: string) => void
}

export function DocDetailModals({
  doc,
  projectPath,
  showMoveModal,
  showDuplicateModal,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onMoved,
  onDuplicated,
}: DocDetailModalsProps) {
  return (
    <>
      {showMoveModal && doc && (
        <MoveModal
          entityType="doc"
          entityId={doc.slug}
          entityTitle={doc.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && doc && (
        <DuplicateModal
          entityType="doc"
          entityId={doc.slug}
          entityTitle={doc.title}
          entitySlug={doc.slug}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={onDuplicated}
        />
      )}
    </>
  )
}
