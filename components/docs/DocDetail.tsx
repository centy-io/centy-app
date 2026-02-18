'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetDocRequestSchema,
  UpdateDocRequestSchema,
  DeleteDocRequestSchema,
  type Doc,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'
import { TextEditor } from '@/components/shared/TextEditor'
import { LinkSection } from '@/components/shared/LinkSection'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface DocDetailProps {
  slug: string
}

function useFetchDoc(projectPath: string, slug: string) {
  const [doc, setDoc] = useState<Doc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const fetchDoc = useCallback(async () => {
    if (!projectPath || !slug) {
      setError('Missing project path or document slug')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const request = create(GetDocRequestSchema, {
        projectPath,
        slug,
      })
      const response = await centyClient.getDoc(request)
      if (response.doc) {
        setDoc(response.doc)
        setEditTitle(response.doc.title)
        setEditContent(response.doc.content)
      } else {
        setError(response.error || 'Document not found')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, slug])

  useEffect(() => {
    fetchDoc()
  }, [fetchDoc])

  return {
    doc,
    setDoc,
    loading,
    error,
    setError,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
  }
}

function useSaveDoc(
  projectPath: string,
  slug: string,
  editTitle: string,
  editContent: string,
  editSlug: string,
  setDoc: (doc: Doc) => void,
  setIsEditing: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  const router = useRouter()
  const { createLink } = useAppLink()
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async () => {
    if (!projectPath || !slug) return

    setSaving(true)
    setError(null)

    try {
      const request = create(UpdateDocRequestSchema, {
        projectPath,
        slug,
        title: editTitle,
        content: editContent,
        newSlug: editSlug || undefined,
      })
      const response = await centyClient.updateDoc(request)

      if (response.success && response.doc) {
        setDoc(response.doc)
        setIsEditing(false)
        if (editSlug && editSlug !== slug) {
          router.replace(createLink(`/docs/${editSlug}`))
        }
      } else {
        setError(response.error || 'Failed to update document')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    slug,
    editTitle,
    editContent,
    editSlug,
    router,
    createLink,
    setDoc,
    setIsEditing,
    setError,
  ])

  return { saving, handleSave }
}

function useDeleteDoc(
  projectPath: string,
  slug: string,
  docsListUrl: string,
  setError: (v: string | null) => void
) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = useCallback(async () => {
    if (!projectPath || !slug) return

    setDeleting(true)
    setError(null)

    try {
      const request = create(DeleteDocRequestSchema, {
        projectPath,
        slug,
      })
      const response = await centyClient.deleteDoc(request)

      if (response.success) {
        router.push(docsListUrl)
      } else {
        setError(response.error || 'Failed to delete document')
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [projectPath, slug, router, docsListUrl, setError])

  return { deleting, showDeleteConfirm, setShowDeleteConfirm, handleDelete }
}

function useDocNavigation(projectPath: string, docsListUrl: string) {
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
        router.push(docsListUrl)
      }
    },
    [resolvePathToUrl, createProjectLink, router, docsListUrl]
  )

  const handleDuplicated = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
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
          router.push(docsListUrl)
        }
      }
    },
    [
      projectPath,
      router,
      createLink,
      resolvePathToUrl,
      createProjectLink,
      docsListUrl,
    ]
  )

  return { handleMoved, handleDuplicated }
}

function DeleteConfirmSection({
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDelete,
  deleting,
}: {
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  handleDelete: () => void
  deleting: boolean
}) {
  if (!showDeleteConfirm) return null

  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this document?</p>
      <div className="delete-confirm-actions">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}

function DocViewActions({
  setIsEditing,
  setShowMoveModal,
  setShowDuplicateModal,
  setShowDeleteConfirm,
}: {
  setIsEditing: (v: boolean) => void
  setShowMoveModal: (v: boolean) => void
  setShowDuplicateModal: (v: boolean) => void
  setShowDeleteConfirm: (v: boolean) => void
}) {
  return (
    <>
      <button onClick={() => setIsEditing(true)} className="edit-btn">
        Edit
      </button>
      <button onClick={() => setShowMoveModal(true)} className="move-btn">
        Move
      </button>
      <button
        onClick={() => setShowDuplicateModal(true)}
        className="duplicate-btn"
      >
        Duplicate
      </button>
      <button onClick={() => setShowDeleteConfirm(true)} className="delete-btn">
        Delete
      </button>
    </>
  )
}

function DocHeaderActions({
  isEditing,
  setIsEditing,
  setShowMoveModal,
  setShowDuplicateModal,
  setShowDeleteConfirm,
  handleCancelEdit,
  handleSave,
  saving,
}: {
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  setShowMoveModal: (v: boolean) => void
  setShowDuplicateModal: (v: boolean) => void
  setShowDeleteConfirm: (v: boolean) => void
  handleCancelEdit: () => void
  handleSave: () => void
  saving: boolean
}) {
  return (
    <div className="doc-actions">
      {isEditing ? (
        <>
          <button onClick={handleCancelEdit} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="save-btn">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </>
      ) : (
        <DocViewActions
          setIsEditing={setIsEditing}
          setShowMoveModal={setShowMoveModal}
          setShowDuplicateModal={setShowDuplicateModal}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
    </div>
  )
}

function DocEditForm({
  editTitle,
  setEditTitle,
  editSlug,
  setEditSlug,
  editContent,
  setEditContent,
  docSlug,
}: {
  editTitle: string
  setEditTitle: (v: string) => void
  editSlug: string
  setEditSlug: (v: string) => void
  editContent: string
  setEditContent: (v: string) => void
  docSlug: string
}) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-title">Title:</label>
        <input
          id="edit-title"
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-slug">Slug (leave empty to keep current):</label>
        <input
          id="edit-slug"
          type="text"
          value={editSlug}
          onChange={e => setEditSlug(e.target.value)}
          placeholder={docSlug}
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-content">Content (Markdown):</label>
        <TextEditor
          value={editContent}
          onChange={setEditContent}
          format="md"
          mode="edit"
          placeholder="Write your documentation in Markdown..."
          minHeight={400}
        />
      </div>
    </div>
  )
}

function DocViewContent({ doc, slug }: { doc: Doc; slug: string }) {
  const { copyToClipboard } = useCopyToClipboard()

  return (
    <>
      <button
        type="button"
        className="doc-slug-badge"
        onClick={() => slug && copyToClipboard(slug, `doc "${slug}"`)}
        title="Click to copy slug"
      >
        {doc.slug}
      </button>
      <h1 className="doc-title">{doc.title}</h1>

      <div className="doc-metadata">
        {doc.metadata && doc.metadata.createdAt && (
          <span className="doc-date">
            Created: {new Date(doc.metadata.createdAt).toLocaleString()}
          </span>
        )}
        {doc.metadata && doc.metadata.updatedAt && (
          <span className="doc-date">
            Updated: {new Date(doc.metadata.updatedAt).toLocaleString()}
          </span>
        )}
      </div>

      <div className="doc-body">
        {doc.content ? (
          <TextEditor value={doc.content} format="md" mode="display" />
        ) : (
          <p className="no-content">No content</p>
        )}
      </div>

      <LinkSection entityId={doc.slug} entityType="doc" editable={true} />
    </>
  )
}

function DocModals({
  doc,
  projectPath,
  showMoveModal,
  setShowMoveModal,
  showDuplicateModal,
  setShowDuplicateModal,
  handleMoved,
  handleDuplicated,
}: {
  doc: Doc
  projectPath: string
  showMoveModal: boolean
  setShowMoveModal: (v: boolean) => void
  showDuplicateModal: boolean
  setShowDuplicateModal: (v: boolean) => void
  handleMoved: (targetProjectPath: string) => void
  handleDuplicated: (newSlug: string, targetProjectPath: string) => void
}) {
  return (
    <>
      {showMoveModal && (
        <MoveModal
          entityType="doc"
          entityId={doc.slug}
          entityTitle={doc.title}
          currentProjectPath={projectPath}
          onClose={() => setShowMoveModal(false)}
          onMoved={handleMoved}
        />
      )}

      {showDuplicateModal && (
        <DuplicateModal
          entityType="doc"
          entityId={doc.slug}
          entityTitle={doc.title}
          entitySlug={doc.slug}
          currentProjectPath={projectPath}
          onClose={() => setShowDuplicateModal(false)}
          onDuplicated={handleDuplicated}
        />
      )}
    </>
  )
}

function useDocDetailState(projectPath: string, slug: string) {
  const { createLink } = useAppLink()
  const docsListUrl = createLink('/docs')

  const fetchState = useFetchDoc(projectPath, slug)

  const [isEditing, setIsEditing] = useState(false)
  const [editSlug, setEditSlug] = useState('')
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  const { saving, handleSave } = useSaveDoc(
    projectPath,
    slug,
    fetchState.editTitle,
    fetchState.editContent,
    editSlug,
    fetchState.setDoc,
    setIsEditing,
    fetchState.setError
  )

  const deleteState = useDeleteDoc(
    projectPath,
    slug,
    docsListUrl,
    fetchState.setError
  )

  const { handleMoved, handleDuplicated } = useDocNavigation(
    projectPath,
    docsListUrl
  )

  const handleDuplicatedAndClose = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      await handleDuplicated(newSlug, targetProjectPath)
      setShowDuplicateModal(false)
    },
    [handleDuplicated]
  )

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    if (!fetchState.doc) return
    fetchState.setEditTitle(fetchState.doc.title)
    fetchState.setEditContent(fetchState.doc.content)
    setEditSlug('')
  }, [fetchState])

  return {
    ...fetchState,
    docsListUrl,
    isEditing,
    setIsEditing,
    editSlug,
    setEditSlug,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    saving,
    handleSave,
    ...deleteState,
    handleMoved,
    handleDuplicated: handleDuplicatedAndClose,
    handleCancelEdit,
  }
}

function DocDetailLoaded({
  doc,
  slug,
  state,
  projectPath,
}: {
  doc: Doc
  slug: string
  state: ReturnType<typeof useDocDetailState>
  projectPath: string
}) {
  return (
    <div className="doc-detail">
      <div className="doc-header">
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>

        <DocHeaderActions
          isEditing={state.isEditing}
          setIsEditing={state.setIsEditing}
          setShowMoveModal={state.setShowMoveModal}
          setShowDuplicateModal={state.setShowDuplicateModal}
          setShowDeleteConfirm={state.setShowDeleteConfirm}
          handleCancelEdit={state.handleCancelEdit}
          handleSave={state.handleSave}
          saving={state.saving}
        />
      </div>

      {state.error && <DaemonErrorMessage error={state.error} />}

      <DeleteConfirmSection
        showDeleteConfirm={state.showDeleteConfirm}
        setShowDeleteConfirm={state.setShowDeleteConfirm}
        handleDelete={state.handleDelete}
        deleting={state.deleting}
      />

      <div className="doc-content">
        {state.isEditing ? (
          <DocEditForm
            editTitle={state.editTitle}
            setEditTitle={state.setEditTitle}
            editSlug={state.editSlug}
            setEditSlug={state.setEditSlug}
            editContent={state.editContent}
            setEditContent={state.setEditContent}
            docSlug={doc.slug}
          />
        ) : (
          <DocViewContent doc={doc} slug={slug} />
        )}
      </div>

      <DocModals
        doc={doc}
        projectPath={projectPath}
        showMoveModal={state.showMoveModal}
        setShowMoveModal={state.setShowMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        setShowDuplicateModal={state.setShowDuplicateModal}
        handleMoved={state.handleMoved}
        handleDuplicated={state.handleDuplicated}
      />
    </div>
  )
}

export function DocDetail({ slug }: DocDetailProps) {
  const { projectPath } = useProject()
  const state = useDocDetailState(projectPath, slug)

  if (!projectPath) {
    return (
      <div className="doc-detail">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={state.docsListUrl}>documentation list</Link> and select a
          project.
        </div>
      </div>
    )
  }

  if (state.loading) {
    return (
      <div className="doc-detail">
        <div className="loading">Loading document...</div>
      </div>
    )
  }

  if (state.error && !state.doc) {
    return (
      <div className="doc-detail">
        <DaemonErrorMessage error={state.error} />
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>
      </div>
    )
  }

  if (!state.doc) {
    return (
      <div className="doc-detail">
        <div className="error-message">Document not found</div>
        <Link href={state.docsListUrl} className="back-link">
          Back to Documentation
        </Link>
      </div>
    )
  }

  return (
    <DocDetailLoaded
      doc={state.doc}
      slug={slug}
      state={state}
      projectPath={projectPath}
    />
  )
}
