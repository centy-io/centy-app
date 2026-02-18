import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import type { MoveModalProps } from './MoveModal.types'
import { useMoveAction } from './useMoveAction'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

// eslint-disable-next-line max-lines-per-function
export function useMoveModal({
  entityType,
  entityId,
  currentProjectPath,
  onClose,
  onMoved,
}: MoveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [newSlug, setNewSlug] = useState('')
  const [loadingProjects, setLoadingProjects] = useState(true)

  const { loading, error, handleMove } = useMoveAction(
    entityType,
    entityId,
    currentProjectPath,
    selectedProject,
    newSlug,
    onMoved
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
        const otherProjects = response.projects.filter(
          p => p.path !== currentProjectPath
        )
        setProjects(otherProjects)
        if (otherProjects.length > 0) {
          setSelectedProject(otherProjects[0].path)
        }
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

  return {
    modalRef,
    projects,
    selectedProject,
    setSelectedProject,
    newSlug,
    setNewSlug,
    loading,
    loadingProjects,
    error,
    handleMove,
    selectedProjectInfo,
  }
}
