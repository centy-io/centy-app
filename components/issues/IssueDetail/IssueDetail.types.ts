import type { Issue, Asset } from '@/gen/centy_pb'

export interface IssueDetailProps {
  issueNumber: string
}

export interface IssueDetailState {
  issue: Issue | null
  loading: boolean
  error: string | null
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
}

export interface EditState {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  editTitle: string
  setEditTitle: (title: string) => void
  editDescription: string
  setEditDescription: (description: string) => void
  editStatus: string
  setEditStatus: (status: string) => void
  editPriority: number
  setEditPriority: (priority: number) => void
  saving: boolean
  assignees: string[]
  setAssignees: (assignees: string[]) => void
}

export interface StateOption {
  value: string
  label: string
}

export interface EditFormProps {
  projectPath: string
  issueNumber: string
  editTitle: string
  setEditTitle: (title: string) => void
  editDescription: string
  setEditDescription: (description: string) => void
  editStatus: string
  setEditStatus: (status: string) => void
  editPriority: number
  setEditPriority: (priority: number) => void
  stateOptions: StateOption[]
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
}

export const getPriorityClass = (priorityLabel: string): string => {
  switch (priorityLabel.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'priority-high'
    case 'medium':
    case 'normal':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
  }
  if (priorityLabel.startsWith('P') || priorityLabel.startsWith('p')) {
    const num = parseInt(priorityLabel.slice(1))
    if (num === 1) return 'priority-high'
    if (num === 2) return 'priority-medium'
    return 'priority-low'
  }
  return ''
}
