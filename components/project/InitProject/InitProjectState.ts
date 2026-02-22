import type { InitStep } from './InitStep'
import type { ReconciliationPlan, InitResponse } from '@/gen/centy_pb'

export interface InitProjectState {
  projectPath: string
  step: InitStep
  plan: ReconciliationPlan | null
  result: InitResponse | null
  error: string | null
  selectedRestore: Set<string>
  selectedReset: Set<string>
  loading: boolean
  isTauri: boolean
}
