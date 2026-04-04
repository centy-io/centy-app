'use client'

import { AddLinkModal } from '../AddLinkModal/index'
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
        <AddLinkModal
          entityId={entityId}
          entityType={entityType}
          existingLinks={state.links}
          onClose={() => void state.setEditingLink(null)}
          onLinkCreated={state.handleLinkCreated}
          editingLink={state.editingLink}
          editingLinkTitle={state.linkTitles[state.editingLink.targetId]}
          onLinkUpdated={state.handleLinkUpdated}
        />
      )}
    </>
  )
}
