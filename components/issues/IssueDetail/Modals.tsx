'use client'

import type { ReactElement } from 'react'
import type { GenericItem } from '@/gen/centy_pb'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StatusConfigDialog } from '@/components/shared/StatusConfigDialog'

interface ModalsProps {
  projectPath: string
  issue: GenericItem | null
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
          onMoved={targetProjectPath => {
            void onMoved(targetProjectPath)
          }}
        />
      )}

      {showDuplicateModal && issue && (
        <DuplicateModal
          entityType="issue"
          entityId={issue.id}
          entityTitle={issue.title}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={(newIssueId, targetProjectPath) => {
            void onDuplicated(newIssueId, targetProjectPath)
          }}
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
