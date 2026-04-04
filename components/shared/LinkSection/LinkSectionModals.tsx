'use client'

import { AddLinkModal } from '../AddLinkModal/index'
import { EditLinkModal } from './EditLinkModal'
import type { useLinkSection } from './useLinkSection'

interface LinkSectionModalsProps {
  state: ReturnType<typeof useLinkSection>
  entityId: string
  entityType: 'issue' | 'doc'
}

export function LinkSectionModals({
  state,
  entityId,
  entityType,
}: LinkSectionModalsProps) {
  return (
    <>
      {state.showAddModal && (
        <AddLinkModal
          entityId={entityId}
          entityType={entityType}
          existingLinks={state.links}
          onClose={() => void state.setShowAddModal(false)}
          onLinkCreated={state.handleLinkCreated}
        />
      )}
      {state.editingLink && (
        <EditLinkModal
          link={state.editingLink}
          onClose={() => void state.setEditingLink(null)}
          onLinkUpdated={state.handleLinkUpdated}
        />
      )}
    </>
  )
}
