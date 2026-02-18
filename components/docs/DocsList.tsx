'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListDocsRequestSchema,
  DeleteDocRequestSchema,
  type Doc,
} from '@/gen/centy_pb'
import {
  usePathContext,
  useProjectPathToUrl,
} from '@/components/providers/PathContextProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import {
  ContextMenu,
  type ContextMenuItem,
} from '@/components/shared/ContextMenu'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

function useFetchDocs(projectPath: string, isInitialized: boolean | null) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocs = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return

    setLoading(true)
    setError(null)

    try {
      const request = create(ListDocsRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listDocs(request)
      setDocs(response.docs)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    if (isInitialized === true) {
      fetchDocs()
    }
  }, [isInitialized, fetchDocs])

  return { docs, setDocs, loading, error, setError, fetchDocs }
}

function useDeleteDocHandler(
  projectPath: string,
  setDocs: React.Dispatch<React.SetStateAction<Doc[]>>,
  setError: (v: string | null) => void
) {
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!projectPath) return

      setDeleting(true)
      setError(null)

      try {
        const request = create(DeleteDocRequestSchema, {
          projectPath,
          slug,
        })
        const response = await centyClient.deleteDoc(request)

        if (response.success) {
          setDocs(prev => prev.filter(d => d.slug !== slug))
          setDeleteConfirm(null)
        } else {
          setError(response.error || 'Failed to delete document')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setDeleting(false)
      }
    },
    [projectPath, setDocs, setError]
  )

  return { deleting, deleteConfirm, setDeleteConfirm, handleDelete }
}

function useDocsListNavigation(projectPath: string, fetchDocs: () => void) {
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        const url = createProjectLink(
          result.orgSlug,
          result.projectName,
          'docs'
        )
        router.push(url)
      } else {
        router.push('/')
      }
    },
    [resolvePathToUrl, createProjectLink, router]
  )

  const handleDuplicated = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
        fetchDocs()
        router.push(createLink(`/docs/${newSlug}`))
      } else {
        const result = await resolvePathToUrl(targetProjectPath)
        if (result) {
          const url = createProjectLink(
            result.orgSlug,
            result.projectName,
            `docs/${newSlug}`
          )
          router.push(url)
        } else {
          router.push('/')
        }
      }
    },
    [
      projectPath,
      router,
      fetchDocs,
      createLink,
      resolvePathToUrl,
      createProjectLink,
    ]
  )

  return { handleMoved, handleDuplicated }
}

function useDocContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    doc: Doc
  } | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, doc: Doc) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, doc })
  }, [])

  const handleMoveDoc = useCallback((doc: Doc) => {
    setSelectedDoc(doc)
    setShowMoveModal(true)
    setContextMenu(null)
  }, [])

  const handleDuplicateDoc = useCallback((doc: Doc) => {
    setSelectedDoc(doc)
    setShowDuplicateModal(true)
    setContextMenu(null)
  }, [])

  return {
    contextMenu,
    setContextMenu,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    selectedDoc,
    setSelectedDoc,
    handleContextMenu,
    handleMoveDoc,
    handleDuplicateDoc,
  }
}

function buildContextMenuItems(
  contextMenu: { x: number; y: number; doc: Doc } | null,
  isPinned: (id: string) => boolean,
  pinItem: (item: { id: string; type: string; title: string }) => void,
  unpinItem: (id: string) => void,
  setContextMenu: (v: null) => void,
  createLink: (path: string) => string,
  router: ReturnType<typeof useRouter>,
  handleMoveDoc: (doc: Doc) => void,
  handleDuplicateDoc: (doc: Doc) => void
): ContextMenuItem[] {
  if (!contextMenu) return []

  return [
    {
      label: isPinned(contextMenu.doc.slug) ? 'Unpin' : 'Pin',
      onClick: () => {
        if (isPinned(contextMenu.doc.slug)) {
          unpinItem(contextMenu.doc.slug)
        } else {
          pinItem({
            id: contextMenu.doc.slug,
            type: 'doc',
            title: contextMenu.doc.title,
          })
        }
        setContextMenu(null)
      },
    },
    {
      label: 'View',
      onClick: () => {
        router.push(createLink(`/docs/${contextMenu.doc.slug}`))
        setContextMenu(null)
      },
    },
    {
      label: 'Move',
      onClick: () => handleMoveDoc(contextMenu.doc),
    },
    {
      label: 'Duplicate',
      onClick: () => handleDuplicateDoc(contextMenu.doc),
    },
  ]
}

function DocCardDeleteOverlay({
  doc,
  setDeleteConfirm,
  handleDelete,
  deleting,
}: {
  doc: Doc
  setDeleteConfirm: (v: string | null) => void
  handleDelete: (slug: string) => void
  deleting: boolean
}) {
  return (
    <div className="delete-confirm-overlay">
      <p>Delete &ldquo;{doc.title}&rdquo;?</p>
      <div className="delete-confirm-actions">
        <button onClick={() => setDeleteConfirm(null)} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={() => handleDelete(doc.slug)}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

function DocCardBody({ doc }: { doc: Doc }) {
  const { copyToClipboard } = useCopyToClipboard()
  const { createLink } = useAppLink()

  return (
    <div className="doc-card-content">
      <Link href={createLink(`/docs/${doc.slug}`)} className="doc-card-link">
        <h3 className="doc-title">{doc.title}</h3>
      </Link>
      <button
        type="button"
        className="doc-slug-copy-btn"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          copyToClipboard(doc.slug, `doc "${doc.slug}"`)
        }}
        title="Click to copy slug"
      >
        {doc.slug}
      </button>
      {doc.metadata && (
        <div className="doc-meta">
          <span className="doc-date">
            Updated:{' '}
            {doc.metadata.updatedAt
              ? new Date(doc.metadata.updatedAt).toLocaleDateString()
              : '-'}
          </span>
        </div>
      )}
    </div>
  )
}

function DocCard({
  doc,
  handleContextMenu,
  deleteConfirm,
  setDeleteConfirm,
  handleDelete,
  deleting,
}: {
  doc: Doc
  handleContextMenu: (e: React.MouseEvent, doc: Doc) => void
  deleteConfirm: string | null
  setDeleteConfirm: (v: string | null) => void
  handleDelete: (slug: string) => void
  deleting: boolean
}) {
  return (
    <div
      className="doc-card context-menu-row"
      onContextMenu={e => handleContextMenu(e, doc)}
    >
      <DocCardBody doc={doc} />
      <button
        className="doc-delete-btn"
        onClick={e => {
          e.preventDefault()
          setDeleteConfirm(doc.slug)
        }}
        title="Delete document"
      >
        x
      </button>
      {deleteConfirm === doc.slug && (
        <DocCardDeleteOverlay
          doc={doc}
          setDeleteConfirm={setDeleteConfirm}
          handleDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  )
}

function DocsHeader({
  projectPath,
  isInitialized,
  loading,
  fetchDocs,
}: {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  fetchDocs: () => void
}) {
  const { createLink } = useAppLink()

  return (
    <div className="docs-header">
      <h2>Documentation</h2>
      <div className="header-actions">
        {projectPath && isInitialized === true && (
          <button
            onClick={fetchDocs}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
        <Link href={createLink('/docs/new')} className="create-btn">
          + New Doc
        </Link>
      </div>
    </div>
  )
}

function DocsContent({
  docs,
  loading,
  error,
  handleContextMenu,
  deleteConfirm,
  setDeleteConfirm,
  handleDelete,
  deleting,
}: {
  docs: Doc[]
  loading: boolean
  error: string | null
  handleContextMenu: (e: React.MouseEvent, doc: Doc) => void
  deleteConfirm: string | null
  setDeleteConfirm: (v: string | null) => void
  handleDelete: (slug: string) => void
  deleting: boolean
}) {
  const { createLink } = useAppLink()

  return (
    <>
      {error && <DaemonErrorMessage error={error} />}

      {loading && docs.length === 0 ? (
        <div className="loading">Loading documentation...</div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <p>No documentation found</p>
          <Link href={createLink('/docs/new')}>Create your first document</Link>
        </div>
      ) : (
        <div className="docs-grid">
          {docs.map(doc => (
            <DocCard
              key={doc.slug}
              doc={doc}
              handleContextMenu={handleContextMenu}
              deleteConfirm={deleteConfirm}
              setDeleteConfirm={setDeleteConfirm}
              handleDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}
    </>
  )
}

function DocsListModals({
  selectedDoc,
  projectPath,
  showMoveModal,
  setShowMoveModal,
  showDuplicateModal,
  setShowDuplicateModal,
  setSelectedDoc,
  handleMoved,
  handleDuplicated,
}: {
  selectedDoc: Doc | null
  projectPath: string
  showMoveModal: boolean
  setShowMoveModal: (v: boolean) => void
  showDuplicateModal: boolean
  setShowDuplicateModal: (v: boolean) => void
  setSelectedDoc: (v: Doc | null) => void
  handleMoved: (targetProjectPath: string) => void
  handleDuplicated: (newSlug: string, targetProjectPath: string) => void
}) {
  if (!selectedDoc) return null

  return (
    <>
      {showMoveModal && (
        <MoveModal
          entityType="doc"
          entityId={selectedDoc.slug}
          entityTitle={selectedDoc.title}
          currentProjectPath={projectPath}
          onClose={() => {
            setShowMoveModal(false)
            setSelectedDoc(null)
          }}
          onMoved={handleMoved}
        />
      )}

      {showDuplicateModal && (
        <DuplicateModal
          entityType="doc"
          entityId={selectedDoc.slug}
          entityTitle={selectedDoc.title}
          entitySlug={selectedDoc.slug}
          currentProjectPath={projectPath}
          onClose={() => {
            setShowDuplicateModal(false)
            setSelectedDoc(null)
          }}
          onDuplicated={handleDuplicated}
        />
      )}
    </>
  )
}

function useDocsListState() {
  const router = useRouter()
  const { projectPath, isInitialized } = usePathContext()
  const { createLink } = useAppLink()
  const { pinItem, unpinItem, isPinned } = usePinnedItems()

  const { docs, setDocs, loading, error, setError, fetchDocs } = useFetchDocs(
    projectPath,
    isInitialized
  )

  const { deleting, deleteConfirm, setDeleteConfirm, handleDelete } =
    useDeleteDocHandler(projectPath, setDocs, setError)

  const { handleMoved, handleDuplicated } = useDocsListNavigation(
    projectPath,
    fetchDocs
  )

  const contextMenuState = useDocContextMenu()

  const handleDuplicatedAndClose = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      await handleDuplicated(newSlug, targetProjectPath)
      contextMenuState.setShowDuplicateModal(false)
      contextMenuState.setSelectedDoc(null)
    },
    [handleDuplicated, contextMenuState]
  )

  const contextMenuItems = buildContextMenuItems(
    contextMenuState.contextMenu,
    isPinned,
    pinItem,
    unpinItem,
    contextMenuState.setContextMenu,
    createLink,
    router,
    contextMenuState.handleMoveDoc,
    contextMenuState.handleDuplicateDoc
  )

  return {
    projectPath,
    isInitialized,
    docs,
    loading,
    error,
    fetchDocs,
    deleting,
    deleteConfirm,
    setDeleteConfirm,
    handleDelete,
    handleMoved,
    handleDuplicated: handleDuplicatedAndClose,
    contextMenuItems,
    ...contextMenuState,
  }
}

export function DocsList() {
  const state = useDocsListState()

  return (
    <div className="docs-list">
      <DocsHeader
        projectPath={state.projectPath}
        isInitialized={state.isInitialized}
        loading={state.loading}
        fetchDocs={state.fetchDocs}
      />

      {!state.projectPath && (
        <div className="no-project-message">
          <p>Select a project from the header to view documentation</p>
        </div>
      )}

      {state.projectPath && state.isInitialized === false && (
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      )}

      {state.projectPath && state.isInitialized === true && (
        <DocsContent
          docs={state.docs}
          loading={state.loading}
          error={state.error}
          handleContextMenu={state.handleContextMenu}
          deleteConfirm={state.deleteConfirm}
          setDeleteConfirm={state.setDeleteConfirm}
          handleDelete={state.handleDelete}
          deleting={state.deleting}
        />
      )}

      {state.contextMenu && (
        <ContextMenu
          items={state.contextMenuItems}
          x={state.contextMenu.x}
          y={state.contextMenu.y}
          onClose={() => state.setContextMenu(null)}
        />
      )}

      <DocsListModals
        selectedDoc={state.selectedDoc}
        projectPath={state.projectPath}
        showMoveModal={state.showMoveModal}
        setShowMoveModal={state.setShowMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        setShowDuplicateModal={state.setShowDuplicateModal}
        setSelectedDoc={state.setSelectedDoc}
        handleMoved={state.handleMoved}
        handleDuplicated={state.handleDuplicated}
      />
    </div>
  )
}
