'use client'

import { useState } from 'react'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useProjectContext } from './useProjectContext'
import { useDocDraft } from './useDocDraft'
import { useDocSubmit } from './useDocSubmit'
import { CreateDocForm } from './CreateDocForm'
import { useCreateItemSubmit } from '@/hooks/useCreateItemSubmit'

export function CreateDoc() {
  const { projectPath, isInitialized, getProjectContext } = useProjectContext()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { clearDraft } = useDocDraft(
    projectPath,
    setTitle,
    setContent,
    setSlug,
    title,
    content,
    slug
  )
  const { submitItem, handleCancel } = useCreateItemSubmit({
    kind: 'doc',
    projectPath,
    getProjectContext,
    setLoading,
    setError,
    clearDraft,
  })

  const handleSubmit = useDocSubmit({ title, content, projectPath, submitItem })

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
      <CreateDocForm
        title={title}
        setTitle={setTitle}
        slug={slug}
        setSlug={setSlug}
        content={content}
        setContent={setContent}
        loading={loading}
        error={error}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}
