'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema } from '@/gen/centy_pb'
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

function useProjectContext() {
  const params = useParams()
  return useMemo(() => {
    const orgP = params ? params.organization : undefined
    const org = typeof orgP === 'string' ? orgP : undefined
    const projP = params ? params.project : undefined
    const proj = typeof projP === 'string' ? projP : undefined
    if (org && proj) return { organization: org, project: proj }
    return null
  }, [params])
}

function useGitUsernames() {
  const [gitUsernames, setGitUsernames] = useState<string[]>([])
  const onAddGitUsername = () => setGitUsernames(prev => [...prev, ''])
  const onRemoveGitUsername = (i: number) =>
    setGitUsernames(prev => prev.filter((_, idx) => idx !== i))
  const onGitUsernameChange = (i: number, v: string) =>
    setGitUsernames(prev => {
      const u = [...prev]
      u.splice(i, 1, v)
      return u
    })
  return {
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
  }
}

function useUserIdState(name: string) {
  const [userId, setUserId] = useState('')
  const [userIdManuallySet, setUserIdManuallySet] = useState(false)
  useEffect(() => {
    if (!userIdManuallySet && name) setUserId(generateSlug(name))
  }, [name, userIdManuallySet])
  const onUserIdChange = (v: string) => {
    setUserId(v)
    setUserIdManuallySet(true)
  }
  return { userId, onUserIdChange }
}

export function useCreateUser() {
  const router = useRouter()
  const { projectPath, isInitialized } = usePathContext()
  const projectContext = useProjectContext()
  const {
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
  } = useGitUsernames()
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

  const handleSubmit = useCallback(async () => {
    if (!projectPath || !name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const req = create(CreateUserRequestSchema, {
        projectPath,
        id: userId.trim() || undefined,
        name: name.trim(),
        email: email.trim() || undefined,
        gitUsernames: gitUsernames.filter(u => u.trim() !== ''),
      })
      const res = await centyClient.createUser(req)
      if (res.success && res.user) {
        router.push(
          projectContext
            ? route({
                pathname: '/[organization]/[project]/users/[userId]',
                query: { ...projectContext, userId: res.user.id },
              })
            : route({ pathname: '/' })
        )
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
  }, [projectPath, name, userId, email, gitUsernames, router, projectContext])

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
