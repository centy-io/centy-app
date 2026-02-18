'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  CreateLinkRequestSchema,
  GetAvailableLinkTypesRequestSchema,
  ListIssuesRequestSchema,
  ListDocsRequestSchema,
  LinkTargetType,
  type Link as LinkType,
  type LinkTypeInfo,
  type Issue,
  type Doc,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface AddLinkModalProps {
  entityId: string
  entityType: 'issue' | 'doc'
  existingLinks: LinkType[]
  onClose: () => void
  onLinkCreated: () => void
}

interface EntityItem {
  id: string
  displayNumber?: number
  title: string
  type: 'issue' | 'doc'
}

const targetTypeToProto: Record<string, LinkTargetType> = {
  issue: LinkTargetType.ISSUE,
  doc: LinkTargetType.DOC,
}

function useLoadLinkTypes(projectPath: string | undefined) {
  const [linkTypes, setLinkTypes] = useState<LinkTypeInfo[]>([])
  const [selectedLinkType, setSelectedLinkType] = useState('')
  const [loadingTypes, setLoadingTypes] = useState(true)

  useEffect(() => {
    async function loadLinkTypes() {
      if (!projectPath) return

      try {
        const request = create(GetAvailableLinkTypesRequestSchema, {
          projectPath,
        })
        const response = await centyClient.getAvailableLinkTypes(request)
        setLinkTypes(response.linkTypes)
        if (response.linkTypes.length > 0) {
          setSelectedLinkType(response.linkTypes[0].name)
        }
      } catch (err) {
        console.error('Failed to load link types:', err)
      } finally {
        setLoadingTypes(false)
      }
    }

    loadLinkTypes()
  }, [projectPath])

  return { linkTypes, selectedLinkType, setSelectedLinkType, loadingTypes }
}

function searchIssues(
  response: { issues: Issue[] },
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return response.issues
    .filter((i: Issue) => i.id !== entityId)
    .filter(
      (i: Issue) =>
        !existingLinks.some(
          l => l.targetId === i.id && l.linkType === selectedLinkType
        )
    )
    .filter(
      (i: Issue) =>
        !searchQuery ||
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(i.displayNumber).includes(searchQuery)
    )
    .map((i: Issue) => ({
      id: i.id,
      displayNumber: i.displayNumber,
      title: i.title,
      type: 'issue' as const,
    }))
}

function searchDocs(
  response: { docs: Doc[] },
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string,
  searchQuery: string
): EntityItem[] {
  return response.docs
    .filter((d: Doc) => d.slug !== entityId)
    .filter(
      (d: Doc) =>
        !existingLinks.some(
          l => l.targetId === d.slug && l.linkType === selectedLinkType
        )
    )
    .filter(
      (d: Doc) =>
        !searchQuery ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((d: Doc) => ({
      id: d.slug,
      title: d.title,
      type: 'doc' as const,
    }))
}

function useSearchEntities(
  projectPath: string | undefined,
  targetTypeFilter: 'issue' | 'doc',
  searchQuery: string,
  entityId: string,
  existingLinks: LinkType[],
  selectedLinkType: string
) {
  const [searchResults, setSearchResults] = useState<EntityItem[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

  const doSearch = useCallback(async () => {
    if (!projectPath) return

    setLoadingSearch(true)

    try {
      let results: EntityItem[] = []

      if (targetTypeFilter === 'issue') {
        const request = create(ListIssuesRequestSchema, { projectPath })
        const response = await centyClient.listIssues(request)
        results = searchIssues(
          response,
          entityId,
          existingLinks,
          selectedLinkType,
          searchQuery
        )
      } else if (targetTypeFilter === 'doc') {
        const request = create(ListDocsRequestSchema, { projectPath })
        const response = await centyClient.listDocs(request)
        results = searchDocs(
          response,
          entityId,
          existingLinks,
          selectedLinkType,
          searchQuery
        )
      }

      setSearchResults(results)
    } catch (err) {
      console.error('Failed to search entities:', err)
    } finally {
      setLoadingSearch(false)
    }
  }, [
    projectPath,
    targetTypeFilter,
    searchQuery,
    entityId,
    existingLinks,
    selectedLinkType,
  ])

  useEffect(() => {
    doSearch()
  }, [doSearch])

  return { searchResults, loadingSearch }
}

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, onClose])
}

function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])
}

function useCreateLink(
  projectPath: string | undefined,
  entityId: string,
  entityType: 'issue' | 'doc',
  selectedTarget: EntityItem | null,
  selectedLinkType: string,
  onLinkCreated: () => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateLink = useCallback(async () => {
    if (!projectPath || !selectedTarget || !selectedLinkType) return

    setLoading(true)
    setError(null)

    try {
      const request = create(CreateLinkRequestSchema, {
        projectPath,
        sourceId: entityId,
        sourceType: targetTypeToProto[entityType],
        targetId: selectedTarget.id,
        targetType: targetTypeToProto[selectedTarget.type],
        linkType: selectedLinkType,
      })
      const response = await centyClient.createLink(request)

      if (response.success) {
        onLinkCreated()
      } else {
        setError(response.error || 'Failed to create link')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link')
    } finally {
      setLoading(false)
    }
  }, [
    projectPath,
    entityId,
    entityType,
    selectedTarget,
    selectedLinkType,
    onLinkCreated,
  ])

  return { loading, error, handleCreateLink }
}

function getEntityLabel(item: EntityItem) {
  if (item.displayNumber) {
    return `#${item.displayNumber} - ${item.title}`
  }
  return `${item.id} - ${item.title}`
}

function LinkTypeField({
  loadingTypes,
  selectedLinkType,
  setSelectedLinkType,
  linkTypes,
}: {
  loadingTypes: boolean
  selectedLinkType: string
  setSelectedLinkType: (value: string) => void
  linkTypes: LinkTypeInfo[]
}) {
  return (
    <div className="link-modal-field">
      <label>Link Type</label>
      {loadingTypes ? (
        <div className="link-modal-loading">Loading...</div>
      ) : (
        <select
          value={selectedLinkType}
          onChange={e => setSelectedLinkType(e.target.value)}
          className="link-modal-select"
        >
          {linkTypes.map(type => (
            <option key={type.name} value={type.name}>
              {type.name} {type.description ? `- ${type.description}` : ''}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

function TargetTypeField({
  targetTypeFilter,
  setTargetTypeFilter,
}: {
  targetTypeFilter: 'issue' | 'doc'
  setTargetTypeFilter: (value: 'issue' | 'doc') => void
}) {
  return (
    <div className="link-modal-field">
      <label>Target Type</label>
      <div className="link-modal-tabs">
        <button
          className={`link-modal-tab ${targetTypeFilter === 'issue' ? 'active' : ''}`}
          onClick={() => setTargetTypeFilter('issue')}
        >
          Issues
        </button>
        <button
          className={`link-modal-tab ${targetTypeFilter === 'doc' ? 'active' : ''}`}
          onClick={() => setTargetTypeFilter('doc')}
        >
          Docs
        </button>
      </div>
    </div>
  )
}

function SearchResultsList({
  loadingSearch,
  searchResults,
  selectedTarget,
  setSelectedTarget,
}: {
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  setSelectedTarget: (item: EntityItem) => void
}) {
  return (
    <div className="link-modal-field">
      <label>Select Target</label>
      <div className="link-modal-results">
        {loadingSearch ? (
          <div className="link-modal-loading">Searching...</div>
        ) : searchResults.length === 0 ? (
          <div className="link-modal-empty">No items found</div>
        ) : (
          <ul className="link-modal-list">
            {searchResults.slice(0, 10).map(item => (
              <li
                key={item.id}
                className={`link-modal-item ${selectedTarget && selectedTarget.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedTarget(item)}
              >
                <span className={`link-type-icon link-type-${item.type}`}>
                  {item.type === 'issue' ? '!' : 'D'}
                </span>
                <span className="link-modal-item-label">
                  {getEntityLabel(item)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function LinkPreview({
  entityType,
  selectedLinkType,
  selectedTarget,
  linkTypes,
}: {
  entityType: 'issue' | 'doc'
  selectedLinkType: string
  selectedTarget: EntityItem
  linkTypes: LinkTypeInfo[]
}) {
  const getInverseLinkType = (linkType: string) => {
    const type = linkTypes.find(t => t.name === linkType)
    return (type ? type.inverse : '') || linkType
  }

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
          <strong>{getInverseLinkType(selectedLinkType)}</strong> this{' '}
          {entityType}
        </span>
      </div>
    </div>
  )
}

function SearchField({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
}) {
  return (
    <div className="link-modal-field">
      <label>Search</label>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search by title or number..."
        className="link-modal-input"
      />
    </div>
  )
}

function AddLinkModalBody({
  error,
  loadingTypes,
  selectedLinkType,
  setSelectedLinkType,
  linkTypes,
  targetTypeFilter,
  setTargetTypeFilter,
  searchQuery,
  setSearchQuery,
  loadingSearch,
  searchResults,
  selectedTarget,
  setSelectedTarget,
  entityType,
}: {
  error: string | null
  loadingTypes: boolean
  selectedLinkType: string
  setSelectedLinkType: (value: string) => void
  linkTypes: LinkTypeInfo[]
  targetTypeFilter: 'issue' | 'doc'
  setTargetTypeFilter: (value: 'issue' | 'doc') => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  loadingSearch: boolean
  searchResults: EntityItem[]
  selectedTarget: EntityItem | null
  setSelectedTarget: (item: EntityItem) => void
  entityType: 'issue' | 'doc'
}) {
  return (
    <div className="link-modal-body">
      {error && (
        <DaemonErrorMessage error={error} className="link-modal-error" />
      )}

      <LinkTypeField
        loadingTypes={loadingTypes}
        selectedLinkType={selectedLinkType}
        setSelectedLinkType={setSelectedLinkType}
        linkTypes={linkTypes}
      />

      <TargetTypeField
        targetTypeFilter={targetTypeFilter}
        setTargetTypeFilter={setTargetTypeFilter}
      />

      <SearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <SearchResultsList
        loadingSearch={loadingSearch}
        searchResults={searchResults}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
      />

      {selectedTarget && selectedLinkType && (
        <LinkPreview
          entityType={entityType}
          selectedLinkType={selectedLinkType}
          selectedTarget={selectedTarget}
          linkTypes={linkTypes}
        />
      )}
    </div>
  )
}

function AddLinkModalFooter({
  onClose,
  handleCreateLink,
  loading,
  selectedTarget,
  selectedLinkType,
}: {
  onClose: () => void
  handleCreateLink: () => void
  loading: boolean
  selectedTarget: EntityItem | null
  selectedLinkType: string
}) {
  return (
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
  )
}

function useAddLinkModalState(
  entityId: string,
  entityType: 'issue' | 'doc',
  existingLinks: LinkType[],
  onLinkCreated: () => void
) {
  const { projectPath } = useProject()
  const [selectedTarget, setSelectedTarget] = useState<EntityItem | null>(null)
  const [targetTypeFilter, setTargetTypeFilter] = useState<'issue' | 'doc'>(
    'issue'
  )
  const [searchQuery, setSearchQuery] = useState('')

  const { linkTypes, selectedLinkType, setSelectedLinkType, loadingTypes } =
    useLoadLinkTypes(projectPath)

  const { searchResults, loadingSearch } = useSearchEntities(
    projectPath,
    targetTypeFilter,
    searchQuery,
    entityId,
    existingLinks,
    selectedLinkType
  )

  const { loading, error, handleCreateLink } = useCreateLink(
    projectPath,
    entityId,
    entityType,
    selectedTarget,
    selectedLinkType,
    onLinkCreated
  )

  return {
    selectedTarget,
    setSelectedTarget,
    targetTypeFilter,
    setTargetTypeFilter,
    searchQuery,
    setSearchQuery,
    linkTypes,
    selectedLinkType,
    setSelectedLinkType,
    loadingTypes,
    searchResults,
    loadingSearch,
    loading,
    error,
    handleCreateLink,
  }
}

export function AddLinkModal({
  entityId,
  entityType,
  existingLinks,
  onClose,
  onLinkCreated,
}: AddLinkModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const state = useAddLinkModalState(
    entityId,
    entityType,
    existingLinks,
    onLinkCreated
  )

  useClickOutside(modalRef, onClose)
  useEscapeKey(onClose)

  return (
    <div className="link-modal-overlay">
      <div className="link-modal" ref={modalRef}>
        <div className="link-modal-header">
          <h3>Add Link</h3>
          <button className="link-modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <AddLinkModalBody
          error={state.error}
          loadingTypes={state.loadingTypes}
          selectedLinkType={state.selectedLinkType}
          setSelectedLinkType={state.setSelectedLinkType}
          linkTypes={state.linkTypes}
          targetTypeFilter={state.targetTypeFilter}
          setTargetTypeFilter={state.setTargetTypeFilter}
          searchQuery={state.searchQuery}
          setSearchQuery={state.setSearchQuery}
          loadingSearch={state.loadingSearch}
          searchResults={state.searchResults}
          selectedTarget={state.selectedTarget}
          setSelectedTarget={state.setSelectedTarget}
          entityType={entityType}
        />

        <AddLinkModalFooter
          onClose={onClose}
          handleCreateLink={state.handleCreateLink}
          loading={state.loading}
          selectedTarget={state.selectedTarget}
          selectedLinkType={state.selectedLinkType}
        />
      </div>
    </div>
  )
}
