import type { IssueStateOption } from './IssueStateOption'
import type { Asset } from '@/gen/centy_pb'

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
  stateOptions: IssueStateOption[]
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
}
