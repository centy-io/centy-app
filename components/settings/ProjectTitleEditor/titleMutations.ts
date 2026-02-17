import type { ProjectInfo } from '@/gen/centy_pb'
import type { TitleScope } from './ProjectTitleEditor.types'
import { saveTitle, clearTitle } from './titleActions'

interface TitleMutationSetters {
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
  setSaving: (saving: boolean) => void
  applyProjectUpdate: (project?: ProjectInfo) => void
}

interface HandleSaveParams extends TitleMutationSetters {
  scope: TitleScope
  projectPath: string
  userTitle: string
  projectTitle: string
}

export async function handleSaveTitle(params: HandleSaveParams): Promise<void> {
  const {
    setError,
    setSuccess,
    setSaving,
    scope,
    projectPath,
    userTitle,
    projectTitle,
    applyProjectUpdate,
  } = params

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
}

interface HandleClearParams extends TitleMutationSetters {
  scope: TitleScope
  projectPath: string
  setUserTitle: (title: string) => void
  setProjectTitle: (title: string) => void
}

export async function handleClearTitle(
  params: HandleClearParams
): Promise<void> {
  const {
    setError,
    setSuccess,
    setSaving,
    scope,
    projectPath,
    applyProjectUpdate,
    setUserTitle,
    setProjectTitle,
  } = params

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
}
