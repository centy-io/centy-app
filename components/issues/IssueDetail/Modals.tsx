'use client'

import type { ReactElement } from 'react'
import type { Issue } from '@/gen/centy_pb'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StatusConfigDialog } from '@/components/shared/StatusConfigDialog'

interface ModalsProps {
  projectPath: string
  issue: Issue | null
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

export function Modals({
  projectPath,
  issue,
  showMoveModal,
  showDuplicateModal,
  showStatusConfigDialog,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onCloseStatusConfigDialog,
  onMoved,
  onDuplicated,
  onStatusConfigured,
}: ModalsProps): ReactElement {
  return (
    <>
      {showMoveModal && issue && (
        <MoveModal
          entityType="issue"
          entityId={issue.id}
          entityTitle={issue.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && issue && (
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
