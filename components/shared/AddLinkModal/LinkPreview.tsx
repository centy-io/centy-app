import type { LinkTypeInfo } from '@/gen/centy_pb'
import type { EntityItem } from './AddLinkModal.types'
import { getInverseLinkType } from './AddLinkModal.types'

interface LinkPreviewProps {
  entityType: 'issue' | 'doc'
  selectedTarget: EntityItem
  selectedLinkType: string
  linkTypes: LinkTypeInfo[]
}

export function LinkPreview({
  entityType,
  selectedTarget,
  selectedLinkType,
  linkTypes,
}: LinkPreviewProps) {
  const targetLabel =
    selectedTarget.displayNumber || selectedTarget.id.slice(0, 8)

  return (
    <div className="link-modal-preview">
      <div className="link-preview-item">
        <span className="link-preview-label">This will create:</span>
        <span className="link-preview-text">
          This {entityType} <strong>{selectedLinkType}</strong>{' '}
          {selectedTarget.type} #{targetLabel}
        </span>
      </div>
      <div className="link-preview-item">
        <span className="link-preview-label">Inverse link:</span>
        <span className="link-preview-text">
          {selectedTarget.type} #{targetLabel}{' '}
          <strong>{getInverseLinkType(linkTypes, selectedLinkType)}</strong>{' '}
          this {entityType}
        </span>
      </div>
    </div>
  )
}
