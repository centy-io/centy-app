'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { CreateItemKind } from './CreateItemKind.types'
import type { CreateItemResult } from './CreateItemResult.types'
import type { UseCreateItemSubmitParams } from './UseCreateItemSubmitParams.types'

interface ProjectContext {
  organization: string
  project: string
}

function buildCancelPath(kind: CreateItemKind, ctx: ProjectContext | null) {
  if (!ctx) return route({ pathname: '/' })
  const { organization, project } = ctx
  if (kind === 'doc') {
    return route({
      pathname: '/[organization]/[project]/docs',
      query: { organization, project },
    })
  }
  return route({
    pathname: '/[organization]/[project]/issues',
    query: { organization, project },
  })
}

function buildSuccessPath(
  kind: CreateItemKind,
  ctx: ProjectContext | null,
  result: CreateItemResult
) {
  if (!ctx) return route({ pathname: '/' })
  const { organization, project } = ctx
  if (kind === 'doc') {
    return route({
      pathname: '/[organization]/[project]/docs/[slug]',
      query: { organization, project, slug: result.slug || '' },
    })
  }
  return route({
    pathname: '/[organization]/[project]/issues/[issueId]',
    query: { organization, project, issueId: result.issueNumber || '' },
  })
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
    router.push(buildCancelPath(kind, ctx))
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
          router.push(buildSuccessPath(kind, ctx, result))
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
