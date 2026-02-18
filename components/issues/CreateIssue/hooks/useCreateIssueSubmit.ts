import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from '@bufbuild/protobuf'
import { route } from 'nextjs-routes'
import type { UseCreateIssueSubmitParams } from '../CreateIssue.types'
import { centyClient } from '@/lib/grpc/client'
import { CreateIssueRequestSchema } from '@/gen/centy_pb'

// eslint-disable-next-line max-lines-per-function
export function useCreateIssueSubmit({
  projectPath,
  title,
  description,
  priority,
  status,
  pendingAssets,
  assetUploaderRef,
  getProjectContext,
  setLoading,
  setError,
}: UseCreateIssueSubmitParams) {
  const router = useRouter()

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!projectPath.trim() || !title.trim()) return

      setLoading(true)
      setError(null)

      try {
        const request = create(CreateIssueRequestSchema, {
          projectPath: projectPath.trim(),
          title: title.trim(),
          description: description.trim(),
          priority,
          status,
        })
        const response = await centyClient.createIssue(request)

        if (response.success) {
          if (pendingAssets.length > 0 && assetUploaderRef.current) {
            await assetUploaderRef.current.uploadAllPending(response.id)
          }
          const ctx = await getProjectContext()
          if (ctx) {
            router.push(
              route({
                pathname: '/[organization]/[project]/issues/[issueId]',
                query: {
                  organization: ctx.organization,
                  project: ctx.project,
                  issueId: String(response.issueNumber),
                },
              })
            )
          } else {
            router.push('/')
          }
        } else {
          setError(response.error || 'Failed to create issue')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [
      projectPath,
      title,
      description,
      priority,
      status,
      pendingAssets,
      assetUploaderRef,
      router,
      getProjectContext,
      setLoading,
      setError,
    ]
  )

  const handleCancel = useCallback(async () => {
    const ctx = await getProjectContext()
    if (ctx) {
      router.push(
        route({
          pathname: '/[organization]/[project]/issues',
          query: {
            organization: ctx.organization,
            project: ctx.project,
          },
        })
      )
    } else {
      router.push('/')
    }
  }, [getProjectContext, router])

  return {
    handleSubmit,
    handleCancel,
  }
}
