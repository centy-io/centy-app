'use client'

import { type ReactNode } from 'react'
import { AddLinkModal } from '../AddLinkModal/index'
import type { LinkSectionProps } from './LinkSection.types'
import { useLinkSection } from './useLinkSection'
import { groupLinksByType } from './linkHelpers'
import { LinkGroupList } from './LinkGroupList'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function LinkSection({
  entityId,
  entityType,
  editable,
}: LinkSectionProps): ReactNode {
  const resolvedEditable = editable !== undefined ? editable : true
  const state = useLinkSection(entityId, entityType)
  const groupedLinks = groupLinksByType(state.links)

  if (state.loading) {
    return (
      <div className="link-section">
        <h3 className="link-section-title">Links</h3>
        <div className="link-section-loading">Loading links...</div>
      </div>
    )
  }

  return (
    <div className="link-section">
      <div className="link-section-header">
        <h3 className="link-section-title">Links</h3>
        {resolvedEditable && (
          <button
            className="link-add-btn"
            onClick={() => state.setShowAddModal(true)}
            title="Add link"
          >
            + Add Link
          </button>
        )}
      </div>

      {state.error && (
        <DaemonErrorMessage
          error={state.error}
          className="link-section-error"
        />
      )}

      {state.links.length === 0 ? (
        <p className="link-section-empty">No linked items</p>
      ) : (
        <LinkGroupList
          groupedLinks={groupedLinks}
          editable={resolvedEditable}
          deletingLinkId={state.deletingLinkId}
          buildLinkRoute={state.buildLinkRoute}
          onDeleteLink={state.handleDeleteLink}
        />
      )}

      {state.showAddModal && (
        <AddLinkModal
          entityId={entityId}
          entityType={entityType}
          existingLinks={state.links}
          onClose={() => state.setShowAddModal(false)}
          onLinkCreated={state.handleLinkCreated}
        />
      )}
    </div>
  )
}
