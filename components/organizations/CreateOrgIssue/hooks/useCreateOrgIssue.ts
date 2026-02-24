import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { useOrgProjectPath } from './useOrgProjectPath'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'
import { useStateManager } from '@/lib/state'

function orgIssuesRoute(orgSlug: string) {
  return route({
    pathname: '/organizations/[orgSlug]/issues',
    query: { orgSlug },
  })
}

async function createOrgIssueRequest(
  orgProjectPath: string,
  title: string,
  description: string,
  priority: number,
  status: string
) {
  return centyClient.createItem(
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
}

export function useCreateOrgIssue(orgSlug: string) {
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

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!orgProjectPath || !title.trim()) return
      setLoading(true)
      setError(null)
      try {
        const res = await createOrgIssueRequest(
          orgProjectPath,
          title,
          description,
          priority,
          status
        )
        if (res.success) {
          router.push(orgIssuesRoute(orgSlug))
        } else {
          setError(res.error || 'Failed to create org issue')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [orgProjectPath, orgSlug, title, description, priority, status, router]
  )

  const handleCancel = useCallback(() => {
    router.push(orgIssuesRoute(orgSlug))
  }, [orgSlug, router])

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
