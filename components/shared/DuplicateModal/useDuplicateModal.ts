import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import type { DuplicateModalProps } from './DuplicateModal.types'
import { useDuplicateAction } from './useDuplicateAction'
import { useModalDismiss } from './useModalDismiss'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export function useDuplicateModal({
  entityType,
  entityId,
  entityTitle,
  entitySlug,
  currentProjectPath,
  onClose,
  onDuplicated,
}: DuplicateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [selectedProject, setSelectedProject] =
    useState<string>(currentProjectPath)
  const [newTitle, setNewTitle] = useState(`Copy of ${entityTitle}`)
  const [newSlug, setNewSlug] = useState(entitySlug ? `${entitySlug}-copy` : '')
  const [loadingProjects, setLoadingProjects] = useState(true)

  const { loading, error, handleDuplicate } = useDuplicateAction(
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newTitle,
    newSlug,
    onDuplicated
  )

  useModalDismiss(modalRef, onClose)

  useEffect(() => {
    async function loadProjects() {
      try {
        const request = create(ListProjectsRequestSchema, {
          includeStale: false,
          includeUninitialized: false,
          includeArchived: false,
        })
        const response = await centyClient.listProjects(request)
        setProjects(response.projects)
        setSelectedProject(currentProjectPath)
      } catch (err) {
        console.error('Failed to load projects:', err)
      } finally {
        setLoadingProjects(false)
      }
    }
    void loadProjects()
  }, [currentProjectPath])

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
    error,
    handleDuplicate,
    selectedProjectInfo,
    isSameProject,
  }
}
