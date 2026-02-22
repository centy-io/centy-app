import type { CreateItemKind } from './CreateItemKind.types'

export interface UseCreateItemSubmitParams {
  kind: CreateItemKind
  projectPath: string
  getProjectContext: () => Promise<{
    organization: string
    project: string
  } | null>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearDraft: () => void
}
