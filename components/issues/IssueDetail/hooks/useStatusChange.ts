import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema, type Issue } from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

function useClickOutsideDropdown(
  ref: React.RefObject<HTMLDivElement | null>,
  showDropdown: boolean,
  onClose: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !(event.target instanceof Node && ref.current.contains(event.target))
      ) {
        onClose()
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, showDropdown, onClose])
}

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

  const closeDropdown = useCallback(() => setShowStatusDropdown(false), [])
  useClickOutsideDropdown(statusDropdownRef, showStatusDropdown, closeDropdown)

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
        const request = create(UpdateItemRequestSchema, {
          projectPath,
          itemType: 'issues',
          itemId: issueNumber,
          status: newStatus,
        })
        const response = await centyClient.updateItem(request)
        if (response.success && response.item) {
          const updated = genericItemToIssue(response.item)
          setIssue(updated)
          setEditStatus((updated.metadata && updated.metadata.status) || 'open')
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
