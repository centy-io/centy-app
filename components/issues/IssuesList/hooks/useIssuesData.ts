import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListIssuesRequestSchema, type Issue } from '@/gen/centy_pb'

export function useIssuesData(
  projectPath: string,
  isInitialized: boolean | null
) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIssues = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return

    setLoading(true)
    setError(null)

    try {
      const request = create(ListIssuesRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.listIssues(request)
      setIssues(response.issues)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, isInitialized])

  useEffect(() => {
    if (isInitialized === true) {
      fetchIssues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, projectPath])

  return { issues, loading, error, fetchIssues }
}
