import { useState, useCallback, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UpdateItemRequestSchema } from '@/gen/centy_pb'
import type { GenericItem } from '@/gen/centy_pb'

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onClickOutside: () => void
): void {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        ref.current &&
        !(event.target instanceof Node && ref.current.contains(event.target))
      ) {
        onClickOutside()
      }
    }
    if (enabled) {
      document.addEventListener('mousedown', handleMouseDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [ref, enabled, onClickOutside])
}

export function useStatusChange(
  projectPath: string,
  issueNumber: string,
  issue: GenericItem | null,
  setIssue: (issue: GenericItem) => void,
  setError: (error: string | null) => void,
  setEditStatus: (status: string) => void
) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  const closeDropdown = useCallback(() => {
    setShowStatusDropdown(false)
  }, [])
  useClickOutside(statusDropdownRef, showStatusDropdown, closeDropdown)

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
          const updated = response.item
          setIssue(updated)
          setEditStatus((updated.metadata && updated.metadata.status) ?? 'open')
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
