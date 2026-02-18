'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import { saveTitle, clearTitle, type TitleActionResult } from './titleActions'

export type TitleScope = 'user' | 'project'

// eslint-disable-next-line max-lines-per-function
export function useProjectTitle(projectPath: string) {
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
          updateFromResponse(project)
        }
      } catch (err) {
        console.error('Failed to fetch project info:', err)
      }
    }
    fetchProjectInfo()
  }, [projectPath])

  const updateFromResponse = (project: ProjectInfo) => {
    setProjectInfo(project)
    setUserTitle(project.userTitle || '')
    setProjectTitle(project.projectTitle || '')
  }

  const runAction = useCallback(
    async (action: () => Promise<TitleActionResult>) => {
      setError(null)
      setSuccess(null)
      setSaving(true)
      try {
        const result = await action()
        if (!result.success) {
          setError(result.error || 'Operation failed')
          return
        }
        if (result.project) {
          updateFromResponse(result.project)
        }
        setSuccess(result.message || 'Done')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Operation failed')
      } finally {
        setSaving(false)
      }
    },
    []
  )

  const handleSave = useCallback(
    () =>
      runAction(() => saveTitle(projectPath, scope, userTitle, projectTitle)),
    [runAction, scope, userTitle, projectTitle, projectPath]
  )

  const handleClear = useCallback(
    () => runAction(() => clearTitle(projectPath, scope)),
    [runAction, scope, projectPath]
  )

  const currentTitle = scope === 'user' ? userTitle : projectTitle
  const setCurrentTitle = scope === 'user' ? setUserTitle : setProjectTitle
  const hasChanges =
    scope === 'user'
      ? userTitle !== ((projectInfo ? projectInfo.userTitle : '') || '')
      : projectTitle !== ((projectInfo ? projectInfo.projectTitle : '') || '')

  return {
    projectInfo,
    scope,
    setScope,
    saving,
    error,
    success,
    currentTitle,
    setCurrentTitle,
    hasChanges,
    handleSave,
    handleClear,
  }
}
