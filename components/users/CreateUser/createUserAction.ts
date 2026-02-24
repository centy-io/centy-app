import { create } from '@bufbuild/protobuf'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { centyClient } from '@/lib/grpc/client'
import { CreateUserRequestSchema } from '@/gen/centy_pb'
import { isDaemonUnimplemented } from '@/lib/daemon-error'
import { OperationError } from '@/lib/errors'

function formatError(err: unknown): string {
  const msg = err instanceof Error ? err.message : 'Failed to connect to daemon'
  return isDaemonUnimplemented(msg)
    ? 'User management is not yet available. Please update your daemon to the latest version.'
    : msg
}

interface CreateUserParams {
  projectPath: string
  userId: string
  name: string
  email: string
  gitUsernames: string[]
  projectContext: { organization: string; project: string } | null
}

export async function createUserAction(
  params: CreateUserParams,
  router: ReturnType<typeof useRouter>,
  setSaving: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  if (!params.projectPath || !params.name.trim()) return
  setSaving(true)
  setError(null)
  try {
    const req = create(CreateUserRequestSchema, {
      projectPath: params.projectPath,
      id: params.userId.trim() || undefined,
      name: params.name.trim(),
      email: params.email.trim() || undefined,
      gitUsernames: params.gitUsernames.filter(u => u.trim() !== ''),
    })
    const res = await centyClient.createUser(req)
    if (res.success && res.user) {
      router.push(
        params.projectContext
          ? route({
              pathname: '/[organization]/[project]/users/[userId]',
              query: { ...params.projectContext, userId: res.user.id },
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
}
