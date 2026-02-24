'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { saveTitle, clearTitle } from './titleActions'
import type { TitleScope } from './TitleScope'
import { runTitleAction } from './runTitleAction'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export type { TitleScope } from './TitleScope'

async function fetchTitleProjectInfo(
  projectPath: string,
  applyProject: (p: ProjectInfo) => void
) {
  try {
    const response = await centyClient.listProjects(
      create(ListProjectsRequestSchema, {})
    )
    const project = response.projects.find(p => p.path === projectPath)
    if (project) applyProject(project)
  } catch (err) {
    console.error('Failed to fetch project info:', err)
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
    fetchTitleProjectInfo(projectPath, applyProject)
  }, [projectPath, applyProject])

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
  const storedUserTitle = (projectInfo ? projectInfo.userTitle : '') || ''
  const storedProjectTitle = (projectInfo ? projectInfo.projectTitle : '') || ''
  const hasChanges =
    scope === 'user'
      ? userTitle !== storedUserTitle
      : projectTitle !== storedProjectTitle

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
