'use client'

import type { EntityItem } from './AddLinkModal.types'

interface LinkPreviewProps {
  entityType: 'issue' | 'doc'
  selectedLinkType: string
  selectedTarget: EntityItem
  getInverseLinkType: (linkType: string) => string
}

export function LinkPreview({
  entityType,
  selectedLinkType,
  selectedTarget,
  getInverseLinkType,
}: LinkPreviewProps) {
  const targetDisplay =
    selectedTarget.displayNumber || selectedTarget.id.slice(0, 8)

  return (
    <div className="link-modal-preview">
      <div className="link-preview-item">
        <span className="link-preview-label">This will create:</span>
        <span className="link-preview-text">
          This {entityType}{' '}
          <strong className="link-preview-strong">{selectedLinkType}</strong>{' '}
          {selectedTarget.type} #{targetDisplay}
        </span>
      </div>
      <div className="link-preview-item">
        <span className="link-preview-label">Inverse link:</span>
        <span className="link-preview-text">
          {selectedTarget.type} #{targetDisplay}{' '}
          <strong className="link-preview-strong">
            {getInverseLinkType(selectedLinkType)}
          </strong>{' '}
          this {entityType}
        </span>
      </div>
    </div>
  )
}
