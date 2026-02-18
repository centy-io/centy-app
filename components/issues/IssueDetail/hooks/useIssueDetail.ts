import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetIssueRequestSchema,
  ListAssetsRequestSchema,
  type Issue,
  type Asset,
} from '@/gen/centy_pb'
import { useLastSeenIssues } from '@/hooks/useLastSeenIssues'

export function useIssueDetail(projectPath: string, issueNumber: string) {
  const { recordLastSeen } = useLastSeenIssues()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])

  const fetchIssue = useCallback(async () => {
    if (!projectPath || !issueNumber) {
      setError('Missing project path or issue number')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    try {
      const request = create(GetIssueRequestSchema, {
        projectPath,
        issueId: issueNumber,
      })
      const response = await centyClient.getIssue(request)
      if (response.issue) {
        setIssue(response.issue)
      } else {
        setError(response.error || 'Issue not found')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, issueNumber])

  const fetchAssets = useCallback(async () => {
    if (!projectPath || !issueNumber) return
    try {
      const request = create(ListAssetsRequestSchema, {
        projectPath,
        issueId: issueNumber,
      })
      const response = await centyClient.listAssets(request)
      setAssets(response.assets)
    } catch (err) {
      console.error('Failed to load assets:', err)
    }
  }, [projectPath, issueNumber])

  useEffect(() => {
    fetchIssue()
    fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectPath, issueNumber])

  useEffect(() => {
    if (issue && issue.id) {
      recordLastSeen(issue.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue && issue.id])

  return {
    issue,
    setIssue,
    loading,
    error,
    setError,
    assets,
    setAssets,
  }
}
