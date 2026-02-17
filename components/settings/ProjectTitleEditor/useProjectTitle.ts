import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema } from '@/gen/centy_pb'
import type { ProjectInfo } from '@/gen/centy_pb'
import type {
  TitleScope,
  UseProjectTitleResult,
} from './ProjectTitleEditor.types'
import { saveTitle, clearTitle } from './titleActions'

export function useProjectTitle(projectPath: string): UseProjectTitleResult {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [userTitle, setUserTitle] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [scope, setScope] = useState<TitleScope>('user')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!projectPath) return

    const fetchProjectInfo = async () => {
      try {
        const request = create(ListProjectsRequestSchema, {})
        const response = await centyClient.listProjects(request)
        const project = response.projects.find(p => p.path === projectPath)
        if (project) {
          setProjectInfo(project)
          setUserTitle(project.userTitle || '')
          setProjectTitle(project.projectTitle || '')
        }
      } catch (err) {
        console.error('Failed to fetch project info:', err)
      }
    }

    fetchProjectInfo()
  }, [projectPath])

  const applyProjectUpdate = useCallback((project?: ProjectInfo) => {
    if (project) {
      setProjectInfo(project)
      setUserTitle(project.userTitle || '')
      setProjectTitle(project.projectTitle || '')
    }
  }, [])

  const handleSave = useCallback(async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const result = await saveTitle({
        scope,
        projectPath,
        userTitle,
        projectTitle,
      })
      if (!result.success) {
        setError(result.error || 'Failed to save title')
        return
      }
      applyProjectUpdate(result.project)
      setSuccess(result.message || 'Title saved')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save title')
    } finally {
      setSaving(false)
    }
  }, [scope, userTitle, projectTitle, projectPath, applyProjectUpdate])

  const handleClear = useCallback(async () => {
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const result = await clearTitle(scope, projectPath)
      if (!result.success) {
        setError(result.error || 'Failed to clear title')
        return
      }
      applyProjectUpdate(result.project)
      if (scope === 'user') setUserTitle('')
      else setProjectTitle('')
      setSuccess(result.message || 'Title cleared')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear title')
    } finally {
      setSaving(false)
    }
  }, [scope, projectPath, applyProjectUpdate])

  const currentTitle = scope === 'user' ? userTitle : projectTitle
  const setCurrentTitle = scope === 'user' ? setUserTitle : setProjectTitle
  const hasChanges =
    scope === 'user'
      ? userTitle !== (projectInfo?.userTitle || '')
      : projectTitle !== (projectInfo?.projectTitle || '')

  return {
    projectInfo,
    userTitle,
    projectTitle,
    scope,
    saving,
    error,
    success,
    currentTitle,
    hasChanges,
    setUserTitle,
    setProjectTitle,
    setScope,
    setCurrentTitle,
    handleSave,
    handleClear,
  }
}
