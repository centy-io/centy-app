'use client'

import { useState, useCallback, useEffect } from 'react'
import { saveTitle, clearTitle } from './titleActions'
import { fetchProjectByPath } from './fetchProjectByPath'
import { buildTitleDerivedValues } from './buildTitleDerivedValues'
import { runTitleAction } from './runTitleAction'
import type { TitleScope } from './TitleScope'
import type { ProjectInfo } from '@/gen/centy_pb'

export type { TitleScope } from './TitleScope'

export function useProjectTitle(projectPath: string) {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [userTitle, setUserTitle] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [scope, setScope] = useState<TitleScope>('user')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const updateFromResponse = useCallback((project: ProjectInfo) => {
    setProjectInfo(project)
    setUserTitle(project.userTitle || '')
    setProjectTitle(project.projectTitle || '')
  }, [])

  useEffect(() => {
    if (!projectPath) return
    fetchProjectByPath(projectPath)
      .then(project => {
        if (project) updateFromResponse(project)
      })
      .catch(err => {
        console.error('Failed to fetch project info:', err)
      })
  }, [projectPath, updateFromResponse])

  const runAction = useCallback(
    (action: Parameters<typeof runTitleAction>[0]['action']) =>
      runTitleAction({
        action,
        setError,
        setSuccess,
        setSaving,
        updateFromResponse,
      }),
    [updateFromResponse]
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

  const derived = buildTitleDerivedValues(
    scope,
    userTitle,
    projectTitle,
    setUserTitle,
    setProjectTitle,
    projectInfo
  )

  return {
    projectInfo,
    scope,
    setScope,
    saving,
    error,
    success,
    ...derived,
    handleSave,
    handleClear,
  }
}
