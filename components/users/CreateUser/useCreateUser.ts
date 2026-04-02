'use client'

import { useState, useCallback, useEffect } from 'react'
import { useProjectRouting } from './useProjectRouting'
import { useGitUsernames } from './useGitUsernames'
import { formatCreateUserError } from './formatCreateUserError'
import { sendCreateUserRequest } from './sendCreateUserRequest'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { OperationError } from '@/lib/errors'
import { generateSlug } from '@/lib/generate-slug'

function buildOnUserIdChange(
  setUserId: (v: string) => void,
  setUserIdManuallySet: (v: boolean) => void
): (v: string) => void {
  return (v: string) => {
    setUserId(v)
    setUserIdManuallySet(true)
  }
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
      const res = await sendCreateUserRequest(
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
          formatCreateUserError(
            new OperationError(res.error || 'Failed to create user')
          )
        )
      }
    } catch (err) {
      setError(formatCreateUserError(err))
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

  const onUserIdChange = buildOnUserIdChange(setUserId, setUserIdManuallySet)

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
