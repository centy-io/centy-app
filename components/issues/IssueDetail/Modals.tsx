'use client'

import type { ReactElement } from 'react'
import type { GenericItem } from '@/gen/centy_pb'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'

interface ModalsProps {
  projectPath: string
  issue: GenericItem | null
  showMoveModal: boolean
  showDuplicateModal: boolean
  onCloseMoveModal: () => void
  onCloseDuplicateModal: () => void
  onMoved: (targetProjectPath: string) => Promise<void>
  onDuplicated: (newIssueId: string, targetProjectPath: string) => Promise<void>
}

export function Modals({
  projectPath,
  issue,
  showMoveModal,
  showDuplicateModal,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onMoved,
  onDuplicated,
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
    </>
  )
}
