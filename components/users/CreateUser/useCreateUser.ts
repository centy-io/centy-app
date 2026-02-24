'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { createUserAction } from './createUserAction'
import { useProjectContext } from './useProjectContext'
import { useGitUsernamesState } from './useGitUsernamesState'
import { useUserIdState } from './useUserIdState'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'

export function useCreateUser() {
  const router = useRouter()
  const { projectPath, isInitialized } = usePathContext()
  const projectContext = useProjectContext()
  const {
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
  } = useGitUsernamesState()
  const [name, setName] = useState('')
  const { userId, onUserIdChange } = useUserIdState(name)
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const usersListUrl: RouteLiteral = useMemo(() => {
    if (!projectContext) return route({ pathname: '/' })
    return route({
      pathname: '/[organization]/[project]/users',
      query: projectContext,
    })
  }, [projectContext])

  const handleSubmit = useCallback(
    () =>
      createUserAction(
        { projectPath, userId, name, email, gitUsernames, projectContext },
        router,
        setSaving,
        setError
      ),
    [projectPath, userId, name, email, gitUsernames, projectContext, router]
  )

  useSaveShortcut({
    onSave: handleSubmit,
    enabled: !saving && !!name.trim() && !!projectPath,
  })

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
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
    saving,
    error,
    handleSubmit,
  }
}
