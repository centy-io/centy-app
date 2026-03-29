import type { TitleActionResult } from './TitleActionResult'
import type { ProjectInfo } from '@/gen/centy_pb'

interface RunTitleActionParams {
  action: () => Promise<TitleActionResult>
  setError: (v: string | null) => void
  setSuccess: (v: string | null) => void
  setSaving: (v: boolean) => void
  updateFromResponse: (project: ProjectInfo) => void
}

export async function runTitleAction(
  params: RunTitleActionParams
): Promise<void> {
  const { action, setError, setSuccess, setSaving, updateFromResponse } = params
  setError(null)
  setSuccess(null)
  setSaving(true)
  try {
    const result = await action()
    if (!result.success) {
      setError(result.error || 'Operation failed')
      return
    }
    if (result.project) updateFromResponse(result.project)
    setSuccess(result.message || 'Done')
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Operation failed')
  } finally {
    setSaving(false)
  }
}
