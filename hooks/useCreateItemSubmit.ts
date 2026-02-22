/* eslint-disable max-lines, max-lines-per-function, ddd/require-spec-file, single-export/single-export */
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'

export type CreateItemKind = 'doc' | 'issue'

export interface CreateItemResult {
  success: boolean
  error?: string
  slug?: string
  issueNumber?: string
  id?: string
}

interface UseCreateItemSubmitParams {
  kind: CreateItemKind
  projectPath: string
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearDraft: () => void
}

export function useCreateItemSubmit({
  kind,
  projectPath,
  getProjectContext,
  setLoading,
  setError,
  clearDraft,
}: UseCreateItemSubmitParams) {
  const router = useRouter()

  const handleCancel = useCallback(async () => {
    const ctx = await getProjectContext()
    if (ctx) {
      if (kind === 'doc') {
        router.push(
          route({
            pathname: '/[organization]/[project]/docs',
            query: { organization: ctx.organization, project: ctx.project },
          })
        )
      } else {
        router.push(
          route({
            pathname: '/[organization]/[project]/issues',
            query: { organization: ctx.organization, project: ctx.project },
          })
        )
      }
    } else {
      router.push('/')
    }
  }, [kind, router, getProjectContext])

  const submitItem = useCallback(
    async (createFn: () => Promise<CreateItemResult>, e?: React.FormEvent) => {
      if (e) e.preventDefault()
      if (!projectPath.trim()) return

      setLoading(true)
      setError(null)

      try {
        const result = await createFn()
        if (result.success) {
          clearDraft()
          const ctx = await getProjectContext()
          if (ctx) {
            if (kind === 'doc') {
              router.push(
                route({
                  pathname: '/[organization]/[project]/docs/[slug]',
                  query: {
                    organization: ctx.organization,
                    project: ctx.project,
                    slug: result.slug || '',
                  },
                })
              )
            } else {
              router.push(
                route({
                  pathname: '/[organization]/[project]/issues/[issueId]',
                  query: {
                    organization: ctx.organization,
                    project: ctx.project,
                    issueId: result.issueNumber || '',
                  },
                })
              )
            }
          } else {
            router.push(route({ pathname: '/' }))
          }
        } else {
          setError(result.error || `Failed to create ${kind}`)
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
      kind,
      projectPath,
      router,
      getProjectContext,
      setLoading,
      setError,
      clearDraft,
    ]
  )

  return { submitItem, handleCancel }
}
