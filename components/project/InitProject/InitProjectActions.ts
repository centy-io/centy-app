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
