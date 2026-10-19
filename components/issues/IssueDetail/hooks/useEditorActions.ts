import { useCallback } from 'react'
import type { GenericItem } from '@/gen/centy_pb'
import { WORKTREE_OPEN_URL } from '@/lib/constants/urls'

export function useEditorActions(
  orgSlug: string | null,
  projectName: string | null,
  issue: GenericItem | null
) {
  const handleOpenInWorktree = useCallback(() => {
    if (!orgSlug || !projectName || !issue) return
    const displayNumber = issue.metadata?.displayNumber
    if (!displayNumber) return
    const params = new URLSearchParams({
      owner: orgSlug,
      repo: projectName,
      issue: String(displayNumber),
    })
    window.open(`${WORKTREE_OPEN_URL}?${params.toString()}`, '_blank')
  }, [orgSlug, projectName, issue])

  return { handleOpenInWorktree }
}
