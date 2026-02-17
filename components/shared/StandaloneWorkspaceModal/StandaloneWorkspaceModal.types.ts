export interface StandaloneWorkspaceModalProps {
  projectPath: string
  onClose: () => void
  onCreated?: (workspacePath: string) => void
}

export const TTL_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 4, label: '4 hours' },
  { value: 12, label: '12 hours (default)' },
  { value: 24, label: '24 hours' },
  { value: 48, label: '48 hours' },
]
