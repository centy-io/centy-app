import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListItemsRequestSchema, type Issue } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'
import { usePathContext } from '@/components/providers/PathContextProvider'

export function useIssuesData() {
  const { projectPath, isInitialized } = usePathContext()
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIssues = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return

    setLoading(true)
    setError(null)

    try {
      const request = create(ListItemsRequestSchema, {
        projectPath: projectPath.trim(),
        itemType: 'issues',
      })
      const response = await centyClient.listItems(request)
      setIssues(response.items.map(genericItemToIssue))
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
  }, [isInitialized, projectPath])

  return {
    projectPath,
    isInitialized,
    issues,
    loading,
    error,
    fetchIssues,
  }
}
