import { useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { useOrgProjectPath } from './useOrgProjectPath'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'
import { useStateManager } from '@/lib/state'

function formatSubmitErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

export function useCreateOrgIssue() {
  const params = useParams()
  const orgSlugParam = params ? params.orgSlug : undefined
  const orgSlug = typeof orgSlugParam === 'string' ? orgSlugParam : ''
  const router = useRouter()
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()
  const { orgProjectPath, initLoading } = useOrgProjectPath(orgSlug)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [status, setStatus] = useState(() => stateManager.getDefaultState())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const issuesRoute = route({
    pathname: '/organizations/[orgSlug]/issues',
    query: { orgSlug },
  })

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!orgProjectPath || !title.trim()) return
      setLoading(true)
      setError(null)
      try {
        const res = await centyClient.createItem(
          create(CreateItemRequestSchema, {
            projectPath: orgProjectPath,
            itemType: 'issues',
            title: title.trim(),
            body: description.trim(),
            priority,
            status,
            customFields: { is_org_issue: 'true' },
          })
        )
        if (res.success) {
          router.push(issuesRoute)
        } else {
          setError(res.error || 'Failed to create org issue')
        }
      } catch (err) {
        setError(formatSubmitErr(err))
      } finally {
        setLoading(false)
      }
    },
    [orgProjectPath, title, description, priority, status, router, issuesRoute]
  )

  const handleCancel = useCallback(() => {
    router.push(issuesRoute)
  }, [router, issuesRoute])

  return {
    orgProjectPath,
    initLoading,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    loading,
    error,
    stateOptions,
    handleSubmit,
    handleCancel,
  }
}
