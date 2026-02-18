import type { RefObject } from 'react'
import type { Issue, Asset } from '@/gen/centy_pb'

export interface EditStateSlice {
  isEditing: boolean
  editTitle: string
  setEditTitle: (v: string) => void
  editDescription: string
  setEditDescription: (v: string) => void
  editStatus: string
  setEditStatus: (v: string) => void
  editPriority: number
  setEditPriority: (v: number) => void
  assignees: string[]
  setAssignees: (v: string[]) => void
}

export interface StatusChangeSlice {
  showStatusDropdown: boolean
  setShowStatusDropdown: (v: boolean) => void
  updatingStatus: boolean
  statusDropdownRef: RefObject<HTMLDivElement | null>
  handleStatusChange: (status: string) => void
}

export interface IssueDetailBodyProps {
  issue: Issue
  projectPath: string
  issueNumber: string
  editState: EditStateSlice
  stateManager: { getStateClass: (status: string) => string }
  stateOptions: { value: string; label: string }[]
  statusChange: StatusChangeSlice
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
  copyToClipboard: (text: string, label: string) => void
}
