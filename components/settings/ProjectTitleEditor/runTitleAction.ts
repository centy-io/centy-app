import type { TitleActionResult } from './TitleActionResult'
import type { ProjectInfo } from '@/gen/centy_pb'

export async function runTitleAction(
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
