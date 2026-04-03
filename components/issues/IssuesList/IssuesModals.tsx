'use client'

import type { ReactElement } from 'react'
import type { GenericItem } from '@/gen/centy_pb'
import { ContextMenu } from '@/components/shared/ContextMenu'
import type { ContextMenuItem } from '@/components/shared/ContextMenuItem'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StandaloneWorkspaceModal } from '@/components/shared/StandaloneWorkspaceModal'

interface IssuesModalsProps {
  projectPath: string
  contextMenu: { x: number; y: number; issue: GenericItem } | null
  contextMenuItems: ContextMenuItem[]
  onCloseContextMenu: () => void
  showMoveModal: boolean
  showDuplicateModal: boolean
  showStandaloneModal: boolean
  selectedIssue: GenericItem | null
  onCloseMoveModal: () => void
  onCloseDuplicateModal: () => void
  onCloseStandaloneModal: () => void
  onMoved: (targetProjectPath: string) => Promise<void>
  onDuplicated: (newIssueId: string, targetProjectPath: string) => Promise<void>
}

export function IssuesModals({
  projectPath,
  contextMenu,
  contextMenuItems,
  onCloseContextMenu,
  showMoveModal,
  showDuplicateModal,
  showStandaloneModal,
  selectedIssue,
  onCloseMoveModal,
  onCloseDuplicateModal,
  onCloseStandaloneModal,
  onMoved,
  onDuplicated,
}: IssuesModalsProps): ReactElement {
  return (
    <>
      {contextMenu && (
        <ContextMenu
          items={contextMenuItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={onCloseContextMenu}
        />
      )}

      {showMoveModal && selectedIssue && (
        <MoveModal
          entityType="issue"
          entityId={selectedIssue.id}
          entityTitle={selectedIssue.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={targetProjectPath => {
            void onMoved(targetProjectPath)
          }}
        />
      )}

      {showDuplicateModal && selectedIssue && (
        <DuplicateModal
          entityType="issue"
          entityId={selectedIssue.id}
          entityTitle={selectedIssue.title}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={(newIssueId, targetProjectPath) => {
            void onDuplicated(newIssueId, targetProjectPath)
          }}
        />
      )}

      {showStandaloneModal && projectPath && (
        <StandaloneWorkspaceModal
          projectPath={projectPath}
          onClose={onCloseStandaloneModal}
        />
      )}
    </>
  )
}
