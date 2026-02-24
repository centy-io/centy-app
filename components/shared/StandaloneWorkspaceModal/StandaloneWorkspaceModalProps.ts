export interface StandaloneWorkspaceModalProps {
  projectPath: string
  onClose: () => void
  onCreated?: (workspacePath: string) => void
}
