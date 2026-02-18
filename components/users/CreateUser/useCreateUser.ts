/* eslint-disable max-lines */
'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { route, type RouteLiteral } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema } from '@/gen/centy_pb'
import { useProject } from '@/components/providers/ProjectProvider'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { generateSlug } from '@/lib/generate-slug'

function formatError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User management is not yet available. Please update your daemon to the latest version.'
    : msg
}

// eslint-disable-next-line max-lines-per-function
export function useCreateUser() {
  const router = useRouter()
  const params = useParams()
  const { projectPath, isInitialized } = useProject()

  const projectContext = useMemo(() => {
    const orgP = params ? params.organization : undefined
    const org = typeof orgP === 'string' ? orgP : undefined
    const projP = params ? params.project : undefined
    const proj = typeof projP === 'string' ? projP : undefined
    if (org && proj) return { organization: org, project: proj }
    return null
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
        if (projectContext) {
          router.push(
            route({
              pathname: '/[organization]/[project]/users/[userId]',
              query: { ...projectContext, userId: res.user.id },
            })
          )
        } else {
          router.push('/')
        }
      } else {
        setError(formatError(new Error(res.error || 'Failed to create user')))
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

  const onUserIdChange = (v: string) => {
    setUserId(v)
    setUserIdManuallySet(true)
  }
  const onAddGitUsername = () => setGitUsernames([...gitUsernames, ''])
  const onRemoveGitUsername = (i: number) =>
    setGitUsernames(gitUsernames.filter((_, idx) => idx !== i))
  const onGitUsernameChange = (i: number, v: string) => {
    const u = [...gitUsernames]
    // eslint-disable-next-line security/detect-object-injection
    u[i] = v
    setGitUsernames(u)
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
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
    saving,
    error,
    handleSubmit,
  }
}
