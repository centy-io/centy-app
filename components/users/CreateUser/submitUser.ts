import { create } from '@bufbuild/protobuf'
import { route } from 'nextjs-routes'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema } from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface SubmitUserParams {
  projectPath: string
  name: string
  userId: string
  email: string
  gitUsernames: string[]
  projectContext: {
    organization: string
    project: string
  } | null
  router: AppRouterInstance
  setError: (e: string | null) => void
  setSaving: (v: boolean) => void
}

export async function submitUser(params: SubmitUserParams) {
  const {
    projectPath,
    name,
    userId,
    email,
    gitUsernames,
    projectContext,
    router,
    setError,
    setSaving,
  } = params
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
}
