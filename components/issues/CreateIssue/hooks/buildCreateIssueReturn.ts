import type { useCreateIssueState } from './useCreateIssueState'
import type { useIssueDraft } from './useIssueDraft'

interface BuildCreateIssueReturnParams {
  projectPath: string
  isInitialized: boolean | null
  draft: Pick<
    ReturnType<typeof useIssueDraft>,
    | 'title'
    | 'setTitle'
    | 'description'
    | 'setDescription'
    | 'priority'
    | 'setPriority'
  >
  s: ReturnType<typeof useCreateIssueState>
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  handleCancel: () => void
}

export function buildCreateIssueReturn(p: BuildCreateIssueReturnParams) {
  return {
    projectPath: p.projectPath,
    isInitialized: p.isInitialized,
    title: p.draft.title,
    setTitle: p.draft.setTitle,
    description: p.draft.description,
    setDescription: p.draft.setDescription,
    priority: p.draft.priority,
    setPriority: p.draft.setPriority,
    status: p.s.status,
    setStatus: p.s.setStatus,
    loading: p.s.loading,
    error: p.s.error,
    pendingAssets: p.s.pendingAssets,
    setPendingAssets: p.s.setPendingAssets,
    assetUploaderRef: p.s.assetUploaderRef,
    stateOptions: p.s.stateOptions,
    handleSubmit: p.handleSubmit,
    handleCancel: p.handleCancel,
  }
}
