import { WorkspaceMode } from './WorkspaceMode'

interface WorkspaceModeOption {
  mode: WorkspaceMode
  title: string
  description: string
}

export const WORKSPACE_OPTIONS: WorkspaceModeOption[] = [
  {
    mode: WorkspaceMode.CURRENT,
    title: 'Current Project',
    description: 'Open in the current project directory',
  },
  {
    mode: WorkspaceMode.TEMP,
    title: 'Temporary Workspace',
    description: 'Create an isolated git worktree for this work',
  },
]
