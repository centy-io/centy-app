import { useState, useEffect, useRef } from 'react'
import { create } from '@bufbuild/protobuf'
import type { MoveModalProps } from './MoveModal.types'
import { useMoveAction } from './useMoveAction'
import { useModalDismiss } from './useModalDismiss'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

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
