import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  DuplicateIssueRequestSchema,
  DuplicateDocRequestSchema,
} from '@/gen/centy_pb'
import { useModalDismiss } from '@/components/shared/useModalDismiss'
import { useLoadProjects } from '@/components/shared/useLoadProjects'
import type { DuplicateModalProps } from './DuplicateModal.types'

export function useDuplicateModal({
  entityType,
  entityId,
  entityTitle,
  entitySlug,
  currentProjectPath,
  onClose,
  onDuplicated,
}: DuplicateModalProps) {
  const modalRef = useModalDismiss(onClose)
  const {
    projects,
    selectedProject,
    setSelectedProject,
    loadingProjects,
    projectError,
  } = useLoadProjects(currentProjectPath, false)
  const [newTitle, setNewTitle] = useState(`Copy of ${entityTitle}`)
  const [newSlug, setNewSlug] = useState(entitySlug ? `${entitySlug}-copy` : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDuplicate = useCallback(async () => {
    if (!selectedProject) return
    setLoading(true)
    setError(null)
    try {
      if (entityType === 'issue') {
        const request = create(DuplicateIssueRequestSchema, {
          sourceProjectPath: currentProjectPath,
          issueId: entityId,
          targetProjectPath: selectedProject,
          newTitle: newTitle || undefined,
        })
        const response = await centyClient.duplicateIssue(request)
        if (response.success && response.issue) {
          onDuplicated(response.issue.id, selectedProject)
        } else {
          setError(response.error || 'Failed to duplicate issue')
        }
      } else {
        const request = create(DuplicateDocRequestSchema, {
          sourceProjectPath: currentProjectPath,
          slug: entityId,
          targetProjectPath: selectedProject,
          newSlug: newSlug || undefined,
          newTitle: newTitle || undefined,
        })
        const response = await centyClient.duplicateDoc(request)
        if (response.success && response.doc) {
          onDuplicated(response.doc.slug, selectedProject)
        } else {
          setError(response.error || 'Failed to duplicate document')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate')
    } finally {
      setLoading(false)
    }
  }, [
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newTitle,
    newSlug,
    onDuplicated,
  ])

  const selectedProjectInfo = projects.find(p => p.path === selectedProject)
  const isSameProject = selectedProject === currentProjectPath

  return {
    modalRef,
    projects,
    selectedProject,
    setSelectedProject,
    newTitle,
    setNewTitle,
    newSlug,
    setNewSlug,
    loading,
    loadingProjects,
    error: error || projectError,
    handleDuplicate,
    selectedProjectInfo,
    isSameProject,
  }
}
