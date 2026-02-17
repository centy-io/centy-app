'use client'

import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { AddLinkModalProps } from './AddLinkModal.types'
import { useAddLink } from './useAddLink'
import { useSearchEntities } from './useSearchEntities'
import { LinkPreview } from './LinkPreview'
import { SearchResults } from './SearchResults'
import { LinkTypeSelector } from './LinkTypeSelector'

export function AddLinkModal({
  entityId,
  entityType,
  existingLinks,
  onClose,
  onLinkCreated,
}: AddLinkModalProps) {
  const {
    modalRef,
    projectPath,
    linkTypes,
    selectedLinkType,
    setSelectedLinkType,
    selectedTarget,
    setSelectedTarget,
    targetTypeFilter,
    setTargetTypeFilter,
    searchQuery,
    setSearchQuery,
    loading,
    loadingTypes,
    error,
    handleCreateLink,
  } = useAddLink({ entityId, entityType, onClose, onLinkCreated })

  const { searchResults, loadingSearch } = useSearchEntities(
    projectPath,
    targetTypeFilter,
    searchQuery,
    entityId,
    existingLinks,
    selectedLinkType
  )

  return (
    <div className="link-modal-overlay">
      <div className="link-modal" ref={modalRef}>
        <div className="link-modal-header">
          <h3>Add Link</h3>
          <button className="link-modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="link-modal-body">
          {error && (
            <DaemonErrorMessage error={error} className="link-modal-error" />
          )}

          <LinkTypeSelector
            linkTypes={linkTypes}
            selectedLinkType={selectedLinkType}
            onLinkTypeChange={setSelectedLinkType}
            loadingTypes={loadingTypes}
            targetTypeFilter={targetTypeFilter}
            onTargetTypeChange={setTargetTypeFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <SearchResults
            loadingSearch={loadingSearch}
            searchResults={searchResults}
            selectedTarget={selectedTarget}
            onSelect={setSelectedTarget}
          />

          {selectedTarget && selectedLinkType && (
            <LinkPreview
              entityType={entityType}
              selectedTarget={selectedTarget}
              selectedLinkType={selectedLinkType}
              linkTypes={linkTypes}
            />
          )}
        </div>

        <div className="link-modal-footer">
          <button className="link-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="link-modal-submit"
            onClick={handleCreateLink}
            disabled={loading || !selectedTarget || !selectedLinkType}
          >
            {loading ? 'Creating...' : 'Create Link'}
          </button>
        </div>
      </div>
    </div>
  )
}
