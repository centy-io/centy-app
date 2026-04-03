import type { InitStep } from './InitStep'
import type { InitResponse } from '@/gen/centy_pb'

export interface InitProjectState {
  projectPath: string
  step: InitStep
  result: InitResponse | null
  error: string | null
  loading: boolean
  isTauri: boolean
}
