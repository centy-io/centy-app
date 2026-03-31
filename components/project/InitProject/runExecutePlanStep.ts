import { initProjectApi } from './initProjectApi'
import type { InitStep } from './InitProject.types'
import type { InitResponse } from '@/gen/centy_pb'

const { runExecutePlan } = initProjectApi

interface RunExecutePlanStepParams {
  projectPath: string
  selectedRestore: Set<string>
  selectedReset: Set<string>
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setResult: (v: InitResponse) => void
  setStep: (v: InitStep) => void
}

export async function runExecutePlanStep(
  p: RunExecutePlanStepParams
): Promise<void> {
  if (!p.projectPath.trim()) return
  p.setLoading(true)
  p.setStep('executing')
  try {
    const outcome = await runExecutePlan(
      p.projectPath,
      p.selectedRestore,
      p.selectedReset
    )
    if (outcome.success && outcome.result) {
      p.setResult(outcome.result)
      p.setStep('success')
    } else {
      p.setError(outcome.error || 'Initialization failed')
      p.setStep('error')
    }
  } catch (err) {
    p.setError(
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    )
    p.setStep('error')
  } finally {
    p.setLoading(false)
  }
}
