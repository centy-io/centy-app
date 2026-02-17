'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { route, type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { isDaemonUnimplemented } from '@/lib/daemon-error'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function useProjectContext(params: ReturnType<typeof useParams>) {
  return useMemo(() => {
    const org = params ? (params.organization as string | undefined) : undefined
    const project = params ? (params.project as string | undefined) : undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])
}

function useUsersListUrl(
  projectContext: { organization: string; project: string } | null
) {
  return useMemo((): RouteLiteral | '/' => {
    if (projectContext) {
      return route({
        pathname: '/[organization]/[project]/users',
        query: projectContext,
      })
    }
    return '/'
  }, [projectContext])
}

interface GitUsernamesFieldProps {
  gitUsernames: string[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, value: string) => void
}

function GitUsernamesField({
  gitUsernames,
  onAdd,
  onRemove,
  onChange,
}: GitUsernamesFieldProps) {
  return (
    <div className="form-group">
      <label>Git Usernames</label>
      <div className="git-usernames-list">
        {gitUsernames.map((username, index) => (
          <div key={index} className="git-username-item">
            <input
              type="text"
              value={username}
              onChange={e => onChange(index, e.target.value)}
              placeholder="Git username"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="remove-git-username-btn"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
        <button type="button" onClick={onAdd} className="add-git-username-btn">
          + Add Git Username
        </button>
      </div>
    </div>
  )
}

function handleDaemonError(message: string, setError: (error: string) => void) {
  if (isDaemonUnimplemented(message)) {
    setError(
      'User management is not yet available. Please update your daemon to the latest version.'
    )
  } else {
    setError(message)
  }
}

interface CreateUserFormFieldsProps {
  name: string
  setName: (v: string) => void
  userId: string
  onUserIdChange: (v: string) => void
  email: string
  setEmail: (v: string) => void
}

function CreateUserFormFields({
  name,
  setName,
  userId,
  onUserIdChange,
  email,
  setEmail,
}: CreateUserFormFieldsProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="name">
          Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Display name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={e => onUserIdChange(e.target.value)}
          placeholder="Auto-generated from name"
        />
        <span className="form-hint">
          Unique identifier (slug format). Leave empty to auto-generate.
        </span>
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address (optional)"
        />
      </div>
    </>
  )
}

function useCreateUserSubmit(
  projectPath: string,
  name: string,
  userId: string,
  email: string,
  gitUsernames: string[],
  projectContext: { organization: string; project: string } | null,
  router: ReturnType<typeof useRouter>
) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    if (!projectPath || !name.trim()) return

    setSaving(true)
    setError(null)

    try {
      const request = create(CreateUserRequestSchema, {
        projectPath,
        id: userId.trim() || undefined,
        name: name.trim(),
        email: email.trim() || undefined,
        gitUsernames: gitUsernames.filter(u => u.trim() !== ''),
      })
      const response = await centyClient.createUser(request)

      if (response.success && response.user) {
        if (projectContext) {
          router.push(
            route({
              pathname: '/[organization]/[project]/users/[userId]',
              query: { ...projectContext, userId: response.user.id },
            })
          )
        } else {
          router.push('/')
        }
      } else {
        handleDaemonError(response.error || 'Failed to create user', setError)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      handleDaemonError(message, setError)
    } finally {
      setSaving(false)
    }
  }, [projectPath, name, userId, email, gitUsernames, router, projectContext])

  return { saving, error, handleSubmit }
}

function useGitUsernames() {
  const [gitUsernames, setGitUsernames] = useState<string[]>([])

  const handleAdd = () => {
    setGitUsernames([...gitUsernames, ''])
  }
  const handleRemove = (index: number) => {
    setGitUsernames(gitUsernames.filter((_, i) => i !== index))
  }
  const handleChange = (index: number, value: string) => {
    const updated = [...gitUsernames]
    updated[index] = value
    setGitUsernames(updated)
  }

  return { gitUsernames, handleAdd, handleRemove, handleChange }
}

interface CreateUserFormProps {
  usersListUrl: RouteLiteral | '/'
  saving: boolean
  error: string | null
  name: string
  setName: (v: string) => void
  userId: string
  setUserId: (v: string) => void
  setUserIdManuallySet: (v: boolean) => void
  email: string
  setEmail: (v: string) => void
  gitUsernames: string[]
  handleAdd: () => void
  handleRemove: (index: number) => void
  handleChange: (index: number, value: string) => void
  handleSubmit: () => void
}

function CreateUserForm({
  usersListUrl,
  saving,
  error,
  name,
  setName,
  userId,
  setUserId,
  setUserIdManuallySet,
  email,
  setEmail,
  gitUsernames,
  handleAdd,
  handleRemove,
  handleChange,
  handleSubmit,
}: CreateUserFormProps) {
  return (
    <div className="create-user">
      <div className="create-user-header">
        <Link href={usersListUrl} className="back-link">
          Back to Users
        </Link>
        <h2>Create New User</h2>
      </div>
      {error && <DaemonErrorMessage error={error} />}
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSubmit()
        }}
        className="create-user-form"
      >
        <CreateUserFormFields
          name={name}
          setName={setName}
          userId={userId}
          onUserIdChange={v => {
            setUserId(v)
            setUserIdManuallySet(true)
          }}
          email={email}
          setEmail={setEmail}
        />
        <GitUsernamesField
          gitUsernames={gitUsernames}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onChange={handleChange}
        />
        <div className="form-actions">
          <Link href={usersListUrl} className="cancel-btn">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="save-btn"
          >
            {saving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  )
}

export function CreateUser() {
  const router = useRouter()
  const params = useParams()
  const { projectPath, isInitialized } = useProject()
  const projectContext = useProjectContext(params)
  const usersListUrl = useUsersListUrl(projectContext)

  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [userIdManuallySet, setUserIdManuallySet] = useState(false)
  const [email, setEmail] = useState('')
  const { gitUsernames, handleAdd, handleRemove, handleChange } =
    useGitUsernames()
  const { saving, error, handleSubmit } = useCreateUserSubmit(
    projectPath,
    name,
    userId,
    email,
    gitUsernames,
    projectContext,
    router
  )

  useEffect(() => {
    if (!userIdManuallySet && name) {
      setUserId(generateSlug(name))
    }
  }, [name, userIdManuallySet])

  useSaveShortcut({
    onSave: handleSubmit,
    enabled: !saving && !!name.trim() && !!projectPath,
  })

  if (!projectPath) {
    return (
      <div className="create-user">
        <div className="error-message">
          No project path specified. Please go to the{' '}
          <Link href={usersListUrl}>users list</Link> and select a project.
        </div>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="create-user">
        <div className="not-initialized-message">
          <p>Centy is not initialized in this directory</p>
          <Link href="/">Initialize Project</Link>
        </div>
      </div>
    )
  }

  return (
    <CreateUserForm
      usersListUrl={usersListUrl}
      saving={saving}
      error={error}
      name={name}
      setName={setName}
      userId={userId}
      setUserId={setUserId}
      setUserIdManuallySet={setUserIdManuallySet}
      email={email}
      setEmail={setEmail}
      gitUsernames={gitUsernames}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}
