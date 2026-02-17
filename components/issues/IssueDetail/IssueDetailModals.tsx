import type { Issue } from '@/gen/centy_pb'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StatusConfigDialog } from '@/components/shared/StatusConfigDialog'

interface IssueDetailModalsProps {
  issue: Issue
  projectPath: string
  showMoveModal: boolean
  showDuplicateModal: boolean
  showStatusConfigDialog: boolean
  onCloseMoveModal: () => void
  onCloseDuplicateModal: () => void
  onCloseStatusConfigDialog: () => void
  onMoved: (targetProjectPath: string) => Promise<void>
  onDuplicated: (newIssueId: string, targetProjectPath: string) => Promise<void>
  onStatusConfigured: () => void
}

export function IssueDetailModals({
  issue,
  projectPath,
  showMoveModal,
  showDuplicateModal,
  showStatusConfigDialog,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onCloseStatusConfigDialog,
  onMoved,
  onDuplicated,
  onStatusConfigured,
}: IssueDetailModalsProps) {
  return (
    <>
      {showMoveModal && (
        <MoveModal
          entityType="issue"
          entityId={issue.id}
          entityTitle={issue.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && (
        <DuplicateModal
          entityType="issue"
          entityId={issue.id}
          entityTitle={issue.title}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={onDuplicated}
        />
      )}

      {showStatusConfigDialog && projectPath && (
        <StatusConfigDialog
          projectPath={projectPath}
          onClose={onCloseStatusConfigDialog}
          onConfigured={onStatusConfigured}
        />
      )}
    </>
  )
}
