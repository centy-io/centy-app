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

type ProjectContext = { organization: string; project: string } | null

function useProjectContext() {
  const params = useParams()
  const { projectPath } = useProject()
  const projectPathToUrl = useProjectPathToUrl()

  return useCallback(async (): Promise<ProjectContext> => {
    const org = params ? (params.organization as string | undefined) : undefined
    const project = params ? (params.project as string | undefined) : undefined

    if (org && project) {
      return { organization: org, project }
    }

    if (projectPath) {
      const result = await projectPathToUrl(projectPath)
      if (result) {
        return { organization: result.orgSlug, project: result.projectName }
      }
    }

    return null
  }, [params, projectPath, projectPathToUrl])
}

function useCheckInitialized() {
  const { setIsInitialized } = useProject()

  return useCallback(
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
}

function useCreateDocSubmit(
  projectPath: string,
  title: string,
  content: string,
  slug: string,
  getProjectContext: () => Promise<ProjectContext>
) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return { loading, error, handleSubmit }
}

function NoProjectMessage() {
  return (
    <div className="create-doc">
      <h2>Create New Document</h2>
      <div className="no-project-message">
        <p>Select a project from the header to create a document</p>
      </div>
    </div>
  )
}

function NotInitializedMessage() {
  return (
    <div className="create-doc">
      <h2>Create New Document</h2>
      <div className="not-initialized-message">
        <p>Centy is not initialized in this directory</p>
        <Link href="/">Initialize Project</Link>
      </div>
    </div>
  )
}

function useCancelNavigation(getProjectContext: () => Promise<ProjectContext>) {
  const router = useRouter()

  return useCallback(async () => {
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
  }, [getProjectContext, router])
}

function CreateDocFormFields({
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
}: {
  title: string
  setTitle: (v: string) => void
  slug: string
  setSlug: (v: string) => void
  content: string
  setContent: (v: string) => void
}) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Document title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="slug">
          Slug (optional, auto-generated from title):
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="e.g., getting-started"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content (Markdown):</label>
        <TextEditor
          value={content}
          onChange={setContent}
          format="md"
          mode="edit"
          placeholder="Write your documentation in Markdown..."
          minHeight={300}
        />
      </div>
    </>
  )
}

function CreateDocForm({
  title,
  setTitle,
  slug,
  setSlug,
  content,
  setContent,
  error,
  loading,
  handleSubmit,
  getProjectContext,
}: {
  title: string
  setTitle: (v: string) => void
  slug: string
  setSlug: (v: string) => void
  content: string
  setContent: (v: string) => void
  error: string | null
  loading: boolean
  handleSubmit: (e: React.FormEvent) => void
  getProjectContext: () => Promise<ProjectContext>
}) {
  const handleCancel = useCancelNavigation(getProjectContext)

  return (
    <div className="create-doc">
      <h2>Create New Document</h2>

      <form onSubmit={handleSubmit}>
        <CreateDocFormFields
          title={title}
          setTitle={setTitle}
          slug={slug}
          setSlug={setSlug}
          content={content}
          setContent={setContent}
        />

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

export function CreateDoc() {
  const { projectPath, isInitialized } = useProject()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')

  const getProjectContext = useProjectContext()
  const checkInitialized = useCheckInitialized()

  useEffect(() => {
    if (projectPath && isInitialized === null) {
      checkInitialized(projectPath)
    }
  }, [projectPath, isInitialized, checkInitialized])

  const { loading, error, handleSubmit } = useCreateDocSubmit(
    projectPath,
    title,
    content,
    slug,
    getProjectContext
  )

  if (!projectPath) {
    return <NoProjectMessage />
  }

  if (isInitialized === false) {
    return <NotInitializedMessage />
  }

  return (
    <CreateDocForm
      title={title}
      setTitle={setTitle}
      slug={slug}
      setSlug={setSlug}
      content={content}
      setContent={setContent}
      error={error}
      loading={loading}
      handleSubmit={handleSubmit}
      getProjectContext={getProjectContext}
    />
  )
}
