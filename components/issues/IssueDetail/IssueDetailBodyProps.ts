import type { EditStateSlice } from './EditStateSlice'
import type { StatusChangeSlice } from './StatusChangeSlice'
import type { GenericItem, Asset } from '@/gen/centy_pb'

export interface IssueDetailBodyProps {
  issue: GenericItem
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
