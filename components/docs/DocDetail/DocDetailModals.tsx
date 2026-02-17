'use client'

import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import type { UseDocDetailReturn } from './DocDetail.types'

interface DocDetailModalsProps {
  state: UseDocDetailReturn
}

export function DocDetailModals({ state }: DocDetailModalsProps) {
  if (!state.doc) return null

  return (
    <>
      {state.showMoveModal && (
        <MoveModal
          entityType="doc"
          entityId={state.doc.slug}
          entityTitle={state.doc.title}
          currentProjectPath={state.projectPath}
          onClose={() => state.setShowMoveModal(false)}
          onMoved={state.handleMoved}
        />
      )}

      {state.showDuplicateModal && (
        <DuplicateModal
          entityType="doc"
          entityId={state.doc.slug}
          entityTitle={state.doc.title}
          entitySlug={state.doc.slug}
          currentProjectPath={state.projectPath}
          onClose={() => state.setShowDuplicateModal(false)}
          onDuplicated={state.handleDuplicated}
        />
      )}
    </>
  )
}
