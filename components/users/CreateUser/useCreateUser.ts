'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useProjectRouting } from './useProjectRouting'
import { useGitUsernames } from './useGitUsernames'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema, type User } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { OperationError } from '@/lib/errors'
import { generateSlug } from '@/lib/generate-slug'

function formatError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User management is not yet available. Please update your daemon to the latest version.'
    : msg
}

async function createUserRequest(
  projectPath: string,
  name: string,
  userId: string,
  email: string,
  gitUsernames: string[]
): Promise<{ success: boolean; user?: User; error?: string }> {
  const req = create(CreateUserRequestSchema, {
    projectPath,
    id: userId.trim() || undefined,
    name: name.trim(),
    email: email.trim() || undefined,
    gitUsernames: gitUsernames.filter(u => u.trim() !== ''),
  })
  const res = await centyClient.createUser(req)
  return { success: res.success, user: res.user, error: res.error }
}

export function useCreateUser() {
  const { projectPath, isInitialized } = usePathContext()
  const { usersListUrl, navigateAfterCreate } = useProjectRouting()
  const gitState = useGitUsernames()

  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [userIdManuallySet, setUserIdManuallySet] = useState(false)
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userIdManuallySet && name) setUserId(generateSlug(name))
  }, [name, userIdManuallySet])

  const handleSubmit = useCallback(async () => {
    if (!projectPath || !name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await createUserRequest(
        projectPath,
        name,
        userId,
        email,
        gitState.gitUsernames
      )
      if (res.success && res.user) {
        navigateAfterCreate(res.user)
      } else {
        setError(
          formatError(new OperationError(res.error || 'Failed to create user'))
        )
      }
    } catch (err) {
      setError(formatError(err))
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    name,
    userId,
    email,
    gitState.gitUsernames,
    navigateAfterCreate,
  ])

  useSaveShortcut({
    onSave: handleSubmit,
    enabled: !saving && !!name.trim() && !!projectPath,
  })

  const onUserIdChange = (v: string) => {
    setUserId(v)
    setUserIdManuallySet(true)
  }

  return {
    projectPath,
    isInitialized,
    usersListUrl,
    name,
    setName,
    userId,
    onUserIdChange,
    email,
    setEmail,
    ...gitState,
    saving,
    error,
    handleSubmit,
  }
}
