export interface InitProjectActions {
  setProjectPath: (v: string) => void
  handleSelectFolder: () => Promise<void>
  handleQuickInit: () => Promise<void>
  handleReset: () => void
}
