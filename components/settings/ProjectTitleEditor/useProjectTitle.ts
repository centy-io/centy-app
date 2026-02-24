'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { saveTitle, clearTitle } from './titleActions'
import type { TitleActionResult } from './TitleActionResult'
import type { TitleScope } from './TitleScope'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export type { TitleScope } from './TitleScope'

interface TitleSetters {
  setProjectInfo: (p: ProjectInfo) => void
  setUserTitle: (t: string) => void
  setProjectTitle: (t: string) => void
}

function applyProjectInfo(project: ProjectInfo, setters: TitleSetters) {
  setters.setProjectInfo(project)
  setters.setUserTitle(project.userTitle || '')
  setters.setProjectTitle(project.projectTitle || '')
}

async function fetchTitleProjectInfo(
  projectPath: string,
  setters: TitleSetters
) {
  try {
    const request = create(ListProjectsRequestSchema, {})
    const response = await centyClient.listProjects(request)
    const project = response.projects.find(p => p.path === projectPath)
    if (project) applyProjectInfo(project, setters)
  } catch (err) {
    console.error('Failed to fetch project info:', err)
  }
}

async function runTitleAction(
  action: () => Promise<TitleActionResult>,
  setError: (e: string | null) => void,
  setSuccess: (s: string | null) => void,
  setSaving: (v: boolean) => void,
  applyProject: (p: ProjectInfo) => void
) {
  setError(null)
  setSuccess(null)
  setSaving(true)
  try {
    const result = await action()
    if (!result.success) {
      setError(result.error || 'Operation failed')
      return
    }
    if (result.project) applyProject(result.project)
    setSuccess(result.message || 'Done')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Operation failed')
  } finally {
    setSaving(false)
  }
}

export function useProjectTitle(projectPath: string) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [userTitle, setUserTitle] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [scope, setScope] = useState<TitleScope>('user')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const applyProject = useCallback((project: ProjectInfo) => {
    setProjectInfo(project)
    setUserTitle(project.userTitle || '')
    setProjectTitle(project.projectTitle || '')
  }, [])

  useEffect(() => {
    if (!projectPath) return
    fetchTitleProjectInfo(projectPath, {
      setProjectInfo,
      setUserTitle,
      setProjectTitle,
    })
  }, [projectPath])

  const handleSave = useCallback(
    () =>
      runTitleAction(
        () => saveTitle(projectPath, scope, userTitle, projectTitle),
        setError,
        setSuccess,
        setSaving,
        applyProject
      ),
    [scope, userTitle, projectTitle, projectPath, applyProject]
  )

  const handleClear = useCallback(
    () =>
      runTitleAction(
        () => clearTitle(projectPath, scope),
        setError,
        setSuccess,
        setSaving,
        applyProject
      ),
    [scope, projectPath, applyProject]
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
