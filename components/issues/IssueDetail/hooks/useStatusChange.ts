import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateIssueRequestSchema, type Issue } from '@/gen/centy_pb'

// eslint-disable-next-line max-lines-per-function
export function useStatusChange(
  projectPath: string,
  issueNumber: string,
  issue: Issue | null,
  setIssue: (issue: Issue) => void,
  setError: (error: string | null) => void,
  setEditStatus: (status: string) => void
) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !(
          event.target instanceof Node &&
          statusDropdownRef.current.contains(event.target)
        )
      ) {
        setShowStatusDropdown(false)
      }
    }

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStatusDropdown])

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      if (!projectPath || !issueNumber || !issue) return
      if (newStatus === (issue.metadata && issue.metadata.status)) {
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
          setEditStatus(
            (response.issue.metadata && response.issue.metadata.status) ||
              'open'
          )
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
    [projectPath, issueNumber, issue, setIssue, setError, setEditStatus]
  )

  return {
    showStatusDropdown,
    setShowStatusDropdown,
    updatingStatus,
    statusDropdownRef,
    handleStatusChange,
  }
}
