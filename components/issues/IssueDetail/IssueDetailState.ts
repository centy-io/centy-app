import type { GenericItem, Asset } from '@/gen/centy_pb'

export interface IssueDetailState {
  issue: GenericItem | null
  loading: boolean
  error: string | null
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
}
