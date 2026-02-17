'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  CreateDocRequestSchema,
  IsInitializedRequestSchema,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { TextEditor } from '@/components/shared/TextEditor'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

export function CreateDoc() {
  const router = useRouter()
  const params = useParams()
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const projectPathToUrl = useProjectPathToUrl()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the project context from params or resolve from projectPath
  const getProjectContext = useCallback(async () => {
    const org = params ? (params.organization as string | undefined) : undefined
    const project = params ? (params.project as string | undefined) : undefined

    if (org && project) {
      return { organization: org, project }
    }

    // Fall back to resolving from projectPath
    if (projectPath) {
      const result = await projectPathToUrl(projectPath)
      if (result) {
        return { organization: result.orgSlug, project: result.projectName }
      }
    }

    return null
  }, [params, projectPath, projectPathToUrl])

  const checkInitialized = useCallback(
    async (path: string) => {
      if (!path.trim()) {
        setIsInitialized(null)
        return
      }

      try {
        const request = create(IsInitializedRequestSchema, {
          projectPath: path.trim(),
        })
        const response = await centyClient.isInitialized(request)
        setIsInitialized(response.initialized)
      } catch {
        setIsInitialized(false)
      }
    },
    [setIsInitialized]
  )

  useEffect(() => {
    if (projectPath && isInitialized === null) {
      checkInitialized(projectPath)
    }
  }, [projectPath, isInitialized, checkInitialized])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!projectPath.trim() || !title.trim()) return

      setLoading(true)
      setError(null)

      try {
        const request = create(CreateDocRequestSchema, {
          projectPath: projectPath.trim(),
          title: title.trim(),
          content: content.trim(),
          slug: slug.trim() || undefined,
        })
        const response = await centyClient.createDoc(request)

        if (response.success) {
          // Navigate to the project-scoped doc detail page
          const ctx = await getProjectContext()
          if (ctx) {
            router.push(
              route({
                pathname: '/[organization]/[project]/docs/[slug]',
                query: {
                  organization: ctx.organization,
                  project: ctx.project,
                  slug: response.slug,
                },
              })
            )
          } else {
            // Fallback to home if we can't determine project base
            router.push('/')
          }
        } else {
          setError(response.error || 'Failed to create document')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [projectPath, title, content, slug, router, getProjectContext]
  )

  if (!projectPath) {
    return (
      <div className="create-doc">
        <h2 className="create-doc-heading">Create New Document</h2>
        <div className="no-project-message">
          <p className="create-doc-message">
            Select a project from the header to create a document
          </p>
        </div>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="create-doc">
        <h2 className="create-doc-heading">Create New Document</h2>
        <div className="not-initialized-message">
          <p className="create-doc-message">
            Centy is not initialized in this directory
          </p>
          <Link href="/">Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-doc">
      <h2 className="create-doc-heading">Create New Document</h2>

      <form className="create-doc-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="create-doc-label" htmlFor="title">
            Title:
          </label>
          <input
            className="create-doc-input"
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Document title"
            required
          />
        </div>

        <div className="form-group">
          <label className="create-doc-label" htmlFor="slug">
            Slug (optional, auto-generated from title):
          </label>
          <input
            className="create-doc-input"
            id="slug"
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="e.g., getting-started"
          />
        </div>

        <div className="form-group">
          <label className="create-doc-label" htmlFor="content">
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
          <button
            type="button"
            onClick={async () => {
              const ctx = await getProjectContext()
              if (ctx) {
                router.push(
                  route({
                    pathname: '/[organization]/[project]/docs',
                    query: {
                      organization: ctx.organization,
                      project: ctx.project,
                    },
                  })
                )
              } else {
                router.push('/')
              }
            }}
            className="secondary"
          >
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
