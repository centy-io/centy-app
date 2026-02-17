'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  CreateIssueRequestSchema,
  IsInitializedRequestSchema,
} from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import {
  AssetUploader,
  type AssetUploaderHandle,
  type PendingAsset,
} from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { useStateManager } from '@/lib/state'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

function useProjectContext(
  params: ReturnType<typeof useParams>,
  projectPath: string,
  projectPathToUrl: ReturnType<typeof useProjectPathToUrl>
) {
  return useCallback(async () => {
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

function useCheckInitialized(setIsInitialized: (val: boolean | null) => void) {
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

interface CreateIssueFormProps {
  title: string
  description: string
  priority: number
  status: string
  loading: boolean
  error: string | null
  stateOptions: { value: string; label: string }[]
  projectPath: string
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onPriorityChange: (v: number) => void
  onStatusChange: (v: string) => void
  onPendingChange: (p: PendingAsset[]) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

function TitleAndDescriptionFields({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: Pick<
  CreateIssueFormProps,
  'title' | 'description' | 'onTitleChange' | 'onDescriptionChange'
>) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Issue title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <TextEditor
          value={description}
          onChange={onDescriptionChange}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={150}
        />
      </div>
    </>
  )
}

function CreateIssueFormFields({
  title,
  description,
  priority,
  status,
  stateOptions,
  projectPath,
  assetUploaderRef,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onPendingChange,
}: Omit<CreateIssueFormProps, 'loading' | 'error' | 'onSubmit' | 'onCancel'>) {
  return (
    <>
      <TitleAndDescriptionFields
        title={title}
        description={description}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
      />

      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={e => onPriorityChange(Number(e.target.value))}
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={e => onStatusChange(e.target.value)}
        >
          {stateOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Attachments:</label>
        <AssetUploader
          ref={assetUploaderRef}
          projectPath={projectPath}
          mode="create"
          onPendingChange={onPendingChange}
        />
      </div>
    </>
  )
}

function CreateIssueForm(props: CreateIssueFormProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <CreateIssueFormFields
        title={props.title}
        description={props.description}
        priority={props.priority}
        status={props.status}
        stateOptions={props.stateOptions}
        projectPath={props.projectPath}
        assetUploaderRef={props.assetUploaderRef}
        onTitleChange={props.onTitleChange}
        onDescriptionChange={props.onDescriptionChange}
        onPriorityChange={props.onPriorityChange}
        onStatusChange={props.onStatusChange}
        onPendingChange={props.onPendingChange}
      />

      {props.error && <DaemonErrorMessage error={props.error} />}

      <div className="actions">
        <button type="button" onClick={props.onCancel} className="secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!props.title.trim() || props.loading}
          className="primary"
        >
          {props.loading ? 'Creating...' : 'Create Issue'}
        </button>
      </div>
    </form>
  )
}

async function handleCreateSuccess(
  response: { id: string; issueNumber: string },
  pendingAssets: PendingAsset[],
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>,
  router: ReturnType<typeof useRouter>,
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>
) {
  if (pendingAssets.length > 0 && assetUploaderRef.current) {
    await assetUploaderRef.current.uploadAllPending(response.id)
  }
  const ctx = await getProjectContext()
  if (ctx) {
    router.push(
      route({
        pathname: '/[organization]/[project]/issues/[issueId]',
        query: {
          organization: ctx.organization,
          project: ctx.project,
          issueId: String(response.issueNumber),
        },
      })
    )
  } else {
    router.push('/')
  }
}

function useCreateIssueSubmit(
  projectPath: string,
  title: string,
  description: string,
  priority: number,
  status: string,
  pendingAssets: PendingAsset[],
  assetUploaderRef: React.RefObject<AssetUploaderHandle | null>,
  router: ReturnType<typeof useRouter>,
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>,
  setLoading: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  return useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!projectPath.trim() || !title.trim()) return

      setLoading(true)
      setError(null)

      try {
        const request = create(CreateIssueRequestSchema, {
          projectPath: projectPath.trim(),
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
        })
        const response = await centyClient.createIssue(request)

        if (response.success) {
          await handleCreateSuccess(
            response,
            pendingAssets,
            assetUploaderRef,
            router,
            getProjectContext
          )
        } else {
          setError(response.error || 'Failed to create issue')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [
      projectPath,
      title,
      description,
      priority,
      status,
      pendingAssets,
      router,
      getProjectContext,
      assetUploaderRef,
      setLoading,
      setError,
    ]
  )
}

function useCreateIssueCancelHandler(
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>,
  router: ReturnType<typeof useRouter>
) {
  return useCallback(async () => {
    const ctx = await getProjectContext()
    if (ctx) {
      router.push(
        route({
          pathname: '/[organization]/[project]/issues',
          query: { organization: ctx.organization, project: ctx.project },
        })
      )
    } else {
      router.push('/')
    }
  }, [getProjectContext, router])
}

function useCreateIssueState() {
  const router = useRouter()
  const params = useParams()
  const { projectPath, isInitialized, setIsInitialized } = useProject()
  const projectPathToUrl = useProjectPathToUrl()
  const stateManager = useStateManager()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [status, setStatus] = useState(() => stateManager.getDefaultState())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([])
  const assetUploaderRef = useRef<AssetUploaderHandle>(null)
  const stateOptions = stateManager.getStateOptions()

  const getProjectContext = useProjectContext(
    params,
    projectPath,
    projectPathToUrl
  )
  const checkInitialized = useCheckInitialized(setIsInitialized)

  useEffect(() => {
    if (projectPath && isInitialized === null) {
      checkInitialized(projectPath)
    }
  }, [projectPath, isInitialized, checkInitialized])

  const handleSubmit = useCreateIssueSubmit(
    projectPath,
    title,
    description,
    priority,
    status,
    pendingAssets,
    assetUploaderRef,
    router,
    getProjectContext,
    setLoading,
    setError
  )

  const handleKeyboardSave = useCallback(() => {
    if (!projectPath.trim() || !title.trim() || loading) return
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }, [projectPath, title, loading, handleSubmit])

  useSaveShortcut({
    onSave: handleKeyboardSave,
    enabled: !!projectPath.trim() && !!title.trim() && !loading,
  })

  const handleCancel = useCreateIssueCancelHandler(getProjectContext, router)

  return {
    projectPath,
    isInitialized,
    title,
    description,
    priority,
    status,
    loading,
    error,
    stateOptions,
    assetUploaderRef,
    setTitle,
    setDescription,
    setPriority,
    setStatus,
    setPendingAssets,
    handleSubmit,
    handleCancel,
  }
}

export function CreateIssue() {
  const state = useCreateIssueState()

  if (!state.projectPath) {
    return (
      <div className="create-issue">
        <h2>Create New Issue</h2>
        <div className="no-project-message">
          <p>Select a project from the header to create an issue</p>
        </div>
      </div>
    )
  }

  if (state.isInitialized === false) {
    return (
      <div className="create-issue">
        <h2>Create New Issue</h2>
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-issue">
      <h2>Create New Issue</h2>
      <CreateIssueForm
        title={state.title}
        description={state.description}
        priority={state.priority}
        status={state.status}
        loading={state.loading}
        error={state.error}
        stateOptions={state.stateOptions}
        projectPath={state.projectPath}
        assetUploaderRef={state.assetUploaderRef}
        onTitleChange={state.setTitle}
        onDescriptionChange={state.setDescription}
        onPriorityChange={state.setPriority}
        onStatusChange={state.setStatus}
        onPendingChange={state.setPendingAssets}
        onSubmit={state.handleSubmit}
        onCancel={state.handleCancel}
      />
    </div>
  )
}
