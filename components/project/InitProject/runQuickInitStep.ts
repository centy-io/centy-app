import { initProjectApi } from './initProjectApi'
import type { InitStep } from './InitProject.types'
import type { InitResponse } from '@/gen/centy_pb'

const { runQuickInit } = initProjectApi

interface RunQuickInitStepParams {
  projectPath: string
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setResult: (v: InitResponse) => void
  setStep: (v: InitStep) => void
}

export async function runQuickInitStep(
  p: RunQuickInitStepParams
): Promise<void> {
  if (!p.projectPath.trim()) return
  p.setLoading(true)
  p.setError(null)
  try {
    const outcome = await runQuickInit(p.projectPath)
    if (outcome.success && outcome.result) {
      p.setResult(outcome.result)
      p.setStep('success')
    } else {
      p.setError(outcome.error ?? 'Initialization failed')
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
