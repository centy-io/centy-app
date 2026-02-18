import type { ReconciliationPlan, InitResponse, FileInfo } from '@/gen/centy_pb'

export type InitStep = 'input' | 'plan' | 'executing' | 'success' | 'error'

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

export interface InitProjectActions {
  setProjectPath: (v: string) => void
  handleSelectFolder: () => Promise<void>
  handleQuickInit: () => Promise<void>
  handleGetPlan: () => Promise<void>
  handleExecutePlan: () => Promise<void>
  toggleRestore: (path: string) => void
  toggleReset: (path: string) => void
  handleReset: () => void
}

export interface FileListProps {
  files: FileInfo[]
  title: string
}

export interface CheckboxListProps {
  files: FileInfo[]
  title: string
  selected: Set<string>
  toggle: (path: string) => void
  description: string
}
