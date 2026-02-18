import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import type { DuplicateModalProps } from './DuplicateModal.types'
import { useDuplicateAction } from './useDuplicateAction'

// eslint-disable-next-line max-lines-per-function
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
    loadProjects()
  }, [currentProjectPath])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        event.target instanceof Node &&
        !modalRef.current.contains(event.target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

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
