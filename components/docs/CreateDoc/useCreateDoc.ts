import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { route } from 'nextjs-routes'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { CreateDocRequestSchema } from '@/gen/centy_pb'

interface UseCreateDocParams {
  projectPath: string
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>
}

// eslint-disable-next-line max-lines-per-function
export function useCreateDoc({
  projectPath,
  getProjectContext,
}: UseCreateDocParams) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!projectPath.trim() || !title.trim()) return

      setLoading(true)
      setError(null)

      try {
        const request = create(CreateDocRequestSchema, {
          projectPath: projectPath.trim(),
          title: title.trim(),
          content: content.trim(),
          slug: slug.trim() || undefined,
        })
        const response = await centyClient.createDoc(request)

        if (response.success) {
          const ctx = await getProjectContext()
          if (ctx) {
            router.push(
              route({
                pathname: '/[organization]/[project]/docs/[slug]',
                query: {
                  organization: ctx.organization,
                  project: ctx.project,
                  slug: response.slug,
                },
              })
            )
          } else {
            router.push('/')
          }
        } else {
          setError(response.error || 'Failed to create document')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [projectPath, title, content, slug, router, getProjectContext]
  )

  const handleCancel = useCallback(async () => {
    const ctx = await getProjectContext()
    if (ctx) {
      router.push(
        route({
          pathname: '/[organization]/[project]/docs',
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
    title,
    setTitle,
    content,
    setContent,
    slug,
    setSlug,
    loading,
    error,
    handleSubmit,
    handleCancel,
  }
}
