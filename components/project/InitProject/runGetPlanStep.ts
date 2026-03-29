import { initProjectApi } from './initProjectApi'
import type { InitStep } from './InitProject.types'
import type { ReconciliationPlan } from '@/gen/centy_pb'

const { runGetPlan } = initProjectApi

interface RunGetPlanStepParams {
  projectPath: string
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setPlan: (v: ReconciliationPlan) => void
  setStep: (v: InitStep) => void
  setSelectedRestore: React.Dispatch<React.SetStateAction<Set<string>>>
  setSelectedReset: React.Dispatch<React.SetStateAction<Set<string>>>
}

export async function runGetPlanStep(p: RunGetPlanStepParams): Promise<void> {
  if (!p.projectPath.trim()) return
  p.setLoading(true)
  p.setError(null)
  try {
    const { plan: fetchedPlan, restore } = await runGetPlan(p.projectPath)
    p.setPlan(fetchedPlan)
    p.setStep('plan')
    p.setSelectedRestore(new Set(restore))
    p.setSelectedReset(new Set())
  } catch (err) {
    p.setError(
      err instanceof Error ? err.message : 'Failed to connect to daemon'
    )
    p.setStep('error')
  } finally {
    p.setLoading(false)
  }
}
