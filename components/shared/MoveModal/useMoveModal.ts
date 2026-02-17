import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { MoveIssueRequestSchema, MoveDocRequestSchema } from '@/gen/centy_pb'
import { useModalDismiss } from '@/components/shared/useModalDismiss'
import { useLoadProjects } from '@/components/shared/useLoadProjects'
import type { MoveModalProps } from './MoveModal.types'

export function useMoveModal({
  entityType,
  entityId,
  currentProjectPath,
  onClose,
  onMoved,
}: Omit<MoveModalProps, 'entityTitle'>) {
  const modalRef = useModalDismiss(onClose)
  const {
    projects,
    selectedProject,
    setSelectedProject,
    loadingProjects,
    projectError,
  } = useLoadProjects(currentProjectPath, true)
  const [newSlug, setNewSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(projectError)

  const handleMove = useCallback(async () => {
    if (!selectedProject) return
    setLoading(true)
    setError(null)
    try {
      if (entityType === 'issue') {
        const request = create(MoveIssueRequestSchema, {
          sourceProjectPath: currentProjectPath,
          issueId: entityId,
          targetProjectPath: selectedProject,
        })
        const response = await centyClient.moveIssue(request)
        if (response.success) {
          onMoved(selectedProject, response.issue?.id)
        } else {
          setError(response.error || 'Failed to move issue')
        }
      } else {
        const request = create(MoveDocRequestSchema, {
          sourceProjectPath: currentProjectPath,
          slug: entityId,
          targetProjectPath: selectedProject,
          newSlug: newSlug || undefined,
        })
        const response = await centyClient.moveDoc(request)
        if (response.success) {
          onMoved(selectedProject, response.doc?.slug)
        } else {
          setError(response.error || 'Failed to move document')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move')
    } finally {
      setLoading(false)
    }
  }, [
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newSlug,
    onMoved,
  ])

  const selectedProjectInfo = projects.find(p => p.path === selectedProject)

  return {
    modalRef,
    projects,
    selectedProject,
    setSelectedProject,
    newSlug,
    setNewSlug,
    loading,
    loadingProjects,
    error: error || projectError,
    handleMove,
    selectedProjectInfo,
  }
}
