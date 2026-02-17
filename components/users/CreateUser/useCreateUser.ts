'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { generateSlug } from './CreateUser.types'
import { submitUser } from './submitUser'

export function useCreateUser() {
  const router = useRouter()
  const params = useParams()
  const { projectPath, isInitialized } = useProject()
  const projectContext = useMemo(() => {
    const org = params?.organization as string | undefined
    const project = params?.project as string | undefined
    return org && project ? { organization: org, project } : null
  }, [params])
  const usersListUrl: RouteLiteral | '/' = useMemo(() => {
    if (!projectContext) return '/'
    return route({
      pathname: '/[organization]/[project]/users',
      query: projectContext,
    })
  }, [projectContext])

  const [name, setName] = useState('')
  const [userId, setUserId] = useState('')
  const [userIdManuallySet, setUserIdManuallySet] = useState(false)
  const [email, setEmail] = useState('')
  const [gitUsernames, setGitUsernames] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userIdManuallySet && name) setUserId(generateSlug(name))
  }, [name, userIdManuallySet])

  const handleUserIdChange = (value: string) => {
    setUserId(value)
    setUserIdManuallySet(true)
  }

  const handleSubmit = useCallback(
    () =>
      submitUser({
        projectPath: projectPath || '',
        name,
        userId,
        email,
        gitUsernames,
        projectContext,
        router,
        setError,
        setSaving,
      }),
    [projectPath, name, userId, email, gitUsernames, router, projectContext]
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
    handleUserIdChange,
    email,
    setEmail,
    gitUsernames,
    setGitUsernames,
    saving,
    error,
    handleSubmit,
  }
}
