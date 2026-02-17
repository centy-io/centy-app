import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Issue } from '@/gen/centy_pb'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'
import { usePinnedItems } from '@/hooks/usePinnedItems'
import type { ContextMenuItem } from '@/components/shared/ContextMenu'
import type { ContextMenuState } from '../IssuesList.types'

export function useIssueContextMenu(
  projectPath: string,
  fetchIssues: () => Promise<void>
) {
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()
  const { pinItem, unpinItem, isPinned } = usePinnedItems()
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const handleContextMenu = useCallback((e: React.MouseEvent, issue: Issue) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, issue })
  }, [])

  const handleMoveIssue = useCallback((issue: Issue) => {
    setSelectedIssue(issue)
    setShowMoveModal(true)
    setContextMenu(null)
  }, [])

  const handleDuplicateIssue = useCallback((issue: Issue) => {
    setSelectedIssue(issue)
    setShowDuplicateModal(true)
    setContextMenu(null)
  }, [])

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        router.push(
          createProjectLink(result.orgSlug, result.projectName, 'issues')
        )
      } else {
        router.push('/')
      }
    },
    [resolvePathToUrl, createProjectLink, router]
  )

  const handleDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
        fetchIssues()
        router.push(createLink(`/issues/${newIssueId}`))
      } else {
        const result = await resolvePathToUrl(targetProjectPath)
        if (result) {
          router.push(
            createProjectLink(
              result.orgSlug,
              result.projectName,
              `issues/${newIssueId}`
            )
          )
        } else {
          router.push('/')
        }
      }
      setShowDuplicateModal(false)
      setSelectedIssue(null)
    },
    [
      projectPath,
      router,
      fetchIssues,
      createLink,
      resolvePathToUrl,
      createProjectLink,
    ]
  )

  const getContextMenuItems = useCallback((): ContextMenuItem[] => {
    if (!contextMenu) return []
    const issue = contextMenu.issue
    return [
      {
        label: isPinned(issue.issueNumber) ? 'Unpin' : 'Pin',
        onClick: () => {
          if (isPinned(issue.issueNumber)) {
            unpinItem(issue.issueNumber)
          } else {
            pinItem({
              id: issue.issueNumber,
              type: 'issue',
              title: issue.title,
              displayNumber: issue.displayNumber,
            })
          }
          setContextMenu(null)
        },
      },
      {
        label: 'View',
        onClick: () => {
          router.push(createLink(`/issues/${issue.id}`))
          setContextMenu(null)
        },
      },
      { label: 'Move', onClick: () => handleMoveIssue(issue) },
      { label: 'Duplicate', onClick: () => handleDuplicateIssue(issue) },
    ]
  }, [
    contextMenu,
    isPinned,
    unpinItem,
    pinItem,
    router,
    createLink,
    handleMoveIssue,
    handleDuplicateIssue,
  ])

  return {
    contextMenu,
    setContextMenu,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    selectedIssue,
    setSelectedIssue,
    handleContextMenu,
    handleMoved,
    handleDuplicated,
    getContextMenuItems,
  }
}
