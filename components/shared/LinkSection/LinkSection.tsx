'use client'

import { type Link as LinkType } from '@/gen/centy_pb'
import { AddLinkModal } from '@/components/shared/AddLinkModal'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { LinkSectionProps } from './LinkSection.types'
import { getLinkTypeDisplay } from './LinkSection.types'
import { useLinkSection } from './useLinkSection'
import { LinkItem } from './LinkItem'

export function LinkSection({
  entityId,
  entityType,
  editable = true,
}: LinkSectionProps) {
  const {
    links,
    loading,
    error,
    showAddModal,
    setShowAddModal,
    deletingLinkId,
    buildLinkRoute,
    handleDeleteLink,
    handleLinkCreated,
  } = useLinkSection(entityId, entityType)

  const groupedLinks = links.reduce<Record<string, LinkType[]>>((acc, link) => {
    const type = link.linkType || 'related'
    if (!acc[type]) acc[type] = []
    acc[type].push(link)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="link-section">
        <h3>Links</h3>
        <div className="link-section-loading">Loading links...</div>
      </div>
    )
  }

  return (
    <div className="link-section">
      <div className="link-section-header">
        <h3>Links</h3>
        {editable && (
          <button
            className="link-add-btn"
            onClick={() => setShowAddModal(true)}
            title="Add link"
          >
            + Add Link
          </button>
        )}
      </div>

      {error && (
        <DaemonErrorMessage error={error} className="link-section-error" />
      )}

      {links.length === 0 ? (
        <p className="link-section-empty">No linked items</p>
      ) : (
        <div className="link-groups">
          {Object.entries(groupedLinks).map(([linkType, typeLinks]) => (
            <div key={linkType} className="link-group">
              <div className="link-group-header">
                {getLinkTypeDisplay(linkType)}
              </div>
              <ul className="link-list">
                {typeLinks.map(link => {
                  const linkKey = `${link.targetId}-${link.linkType}`
                  return (
                    <LinkItem
                      key={linkKey}
                      link={link}
                      buildLinkRoute={buildLinkRoute}
                      editable={editable}
                      isDeleting={deletingLinkId === linkKey}
                      onDelete={handleDeleteLink}
                    />
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddLinkModal
          entityId={entityId}
          entityType={entityType}
          existingLinks={links}
          onClose={() => setShowAddModal(false)}
          onLinkCreated={handleLinkCreated}
        />
      )}
    </div>
  )
}
