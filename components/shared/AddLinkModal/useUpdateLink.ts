import { useState, useCallback } from 'react'
import { updateLinkRequest } from '../LinkSection/updateLinkRequest'
import type { Link as LinkType } from '@/gen/centy_pb'

export function useUpdateLink(
  projectPath: string,
  editingLink: LinkType | undefined,
  selectedLinkType: string,
  onLinkUpdated: (() => void) | undefined
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpdateLink = useCallback(async () => {
    if (!projectPath || !selectedLinkType || !editingLink) return
    setLoading(true)
    setError(null)
    try {
      const result = await updateLinkRequest(
        projectPath,
        editingLink,
        selectedLinkType
      )
      if (result.success) {
        onLinkUpdated?.()
      } else {
        setError(result.error ?? 'Failed to update link')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update link')
    } finally {
      setLoading(false)
    }
  }, [projectPath, editingLink, selectedLinkType, onLinkUpdated])

  return { loading, error, handleUpdateLink }
}
