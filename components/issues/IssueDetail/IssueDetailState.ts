import type { Issue, Asset } from '@/gen/centy_pb'

export interface IssueDetailState {
  issue: Issue | null
  loading: boolean
  error: string | null
  assets: Asset[]
  setAssets: (assets: Asset[]) => void
}
