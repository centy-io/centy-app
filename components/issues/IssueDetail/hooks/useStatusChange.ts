import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateIssueRequestSchema, type Issue } from '@/gen/centy_pb'

interface UseStatusChangeParams {
  projectPath: string
  issueNumber: string
  issue: Issue | null
  setIssue: (issue: Issue) => void
  setError: (error: string | null) => void
}

export function useStatusChange({
  projectPath,
  issueNumber,
  issue,
  setIssue,
  setError,
}: UseStatusChangeParams) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      if (!projectPath || !issueNumber || !issue) return
      if (newStatus === issue.metadata?.status) {
        setShowStatusDropdown(false)
        return
      }

      setUpdatingStatus(true)
      setError(null)

      try {
        const request = create(UpdateIssueRequestSchema, {
          projectPath,
          issueId: issueNumber,
          status: newStatus,
        })
        const response = await centyClient.updateIssue(request)

        if (response.success && response.issue) {
          setIssue(response.issue)
        } else {
          setError(response.error || 'Failed to update status')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setUpdatingStatus(false)
        setShowStatusDropdown(false)
      }
    },
    [projectPath, issueNumber, issue, setIssue, setError]
  )

  return {
    updatingStatus,
    showStatusDropdown,
    setShowStatusDropdown,
    handleStatusChange,
  }
}
