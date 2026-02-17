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
import { generateSlug } from './CreateUser.types'

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
        const errorMsg = response.error || 'Failed to create user'
        if (isDaemonUnimplemented(errorMsg)) {
          setError(
            'User management is not yet available. Please update your daemon to the latest version.'
          )
        } else {
          setError(errorMsg)
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      if (isDaemonUnimplemented(message)) {
        setError(
          'User management is not yet available. Please update your daemon to the latest version.'
        )
      } else {
        setError(message)
      }
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
