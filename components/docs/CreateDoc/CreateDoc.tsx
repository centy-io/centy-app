/* eslint-disable max-lines */
'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useProjectContext } from './useProjectContext'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'
import { centyClient } from '@/lib/grpc/client'
import { CreateDocRequestSchema } from '@/gen/centy_pb'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import {
  getDraftStorageKey,
  loadFormDraft,
  saveFormDraft,
  clearFormDraft,
} from '@/hooks/useFormDraft'

interface DocDraft {
  title: string
  content: string
  slug: string
}

// eslint-disable-next-line max-lines-per-function
export function CreateDoc() {
  const { projectPath, isInitialized, getProjectContext } = useProjectContext()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const draftKey = projectPath ? getDraftStorageKey('doc', projectPath) : ''

  // Load draft from localStorage when projectPath becomes available
  useEffect(() => {
    if (!draftKey || draftLoaded) return
    const draft = loadFormDraft<DocDraft>(draftKey)
    if (draft.title !== undefined) setTitle(draft.title)
    if (draft.content !== undefined) setContent(draft.content)
    if (draft.slug !== undefined) setSlug(draft.slug)
    setDraftLoaded(true)
  }, [draftKey, draftLoaded])

  // Auto-save draft on field changes
  useEffect(() => {
    if (!draftKey || !draftLoaded) return
    saveFormDraft<DocDraft>(draftKey, { title, content, slug })
  }, [draftKey, title, content, slug, draftLoaded])

  const clearDraft = useCallback(() => {
    clearFormDraft(draftKey)
  }, [draftKey])

  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'doc',
    projectPath,
    getProjectContext,
    setLoading,
    setError,
    clearDraft,
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      if (!title.trim()) return
      return submitItem(
        () =>
          centyClient.createDoc(
            create(CreateDocRequestSchema, {
              projectPath: projectPath.trim(),
              title: title.trim(),
              content: content.trim(),
              slug: slug.trim() || undefined,
            })
          ),
        e
      )
    },
    [projectPath, title, content, slug, submitItem]
  )

  if (!projectPath) {
    return (
      <div className="create-doc">
        <h2 className="create-doc-title">Create New Document</h2>
        <div className="no-project-message">
          <p className="no-project-text">
            Select a project from the header to create a document
          </p>
        </div>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="create-doc">
        <h2 className="create-doc-title">Create New Document</h2>
        <div className="not-initialized-message">
          <p className="not-initialized-text">
            Centy is not initialized in this directory
          </p>
          <Link href={route({ pathname: '/' })}>Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-doc">
      <h2 className="create-doc-title">Create New Document</h2>

      <form className="create-doc-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title:
          </label>
          <input
            className="form-input"
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Document title"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="slug">
            Slug (optional, auto-generated from title):
          </label>
          <input
            className="form-input"
            id="slug"
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="e.g., getting-started"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">
            Content (Markdown):
          </label>
          <TextEditor
            value={content}
            onChange={setContent}
            format="md"
            mode="edit"
            placeholder="Write your documentation in Markdown..."
            minHeight={300}
          />
        </div>

        {error && <DaemonErrorMessage error={error} />}

        <div className="actions">
          <button type="button" onClick={handleCancel} className="secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="primary"
          >
            {loading ? 'Creating...' : 'Create Document'}
          </button>
        </div>
      </form>
    </div>
  )
}
