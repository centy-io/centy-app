'use client'

import { useIssuesData } from './hooks/useIssuesData'
import { useIssueContextMenu } from './hooks/useIssueContextMenu'
import { useIssuesTable } from './hooks/useIssuesTable'
import { IssuesHeader } from './IssuesHeader'
import { IssuesContent } from './IssuesContent'
import { IssuesModals } from './IssuesModals'

export function IssuesList() {
  const { projectPath, isInitialized, issues, loading, error, fetchIssues } =
    useIssuesData()

  const ctx = useIssueContextMenu(projectPath, fetchIssues)
  const { table, statusOptions } = useIssuesTable(issues, ctx.createLink)

  return (
    <div className="issues-list">
      <IssuesHeader
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={loading}
        fetchIssues={fetchIssues}
        onShowStandaloneModal={() => ctx.setShowStandaloneModal(true)}
        createLink={ctx.createLink}
      />
      <IssuesContent
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={loading}
        error={error}
        issues={issues}
        table={table}
        statusOptions={statusOptions}
        createLink={ctx.createLink}
        onContextMenu={ctx.handleContextMenu}
      />
      <IssuesModals
        projectPath={projectPath}
        contextMenu={ctx.contextMenu}
        contextMenuItems={ctx.contextMenuItems}
        onCloseContextMenu={() => ctx.setContextMenu(null)}
        showMoveModal={ctx.showMoveModal}
        showDuplicateModal={ctx.showDuplicateModal}
        showStandaloneModal={ctx.showStandaloneModal}
        selectedIssue={ctx.selectedIssue}
        onCloseMoveModal={() => {
          ctx.setShowMoveModal(false)
          ctx.setSelectedIssue(null)
        }}
        onCloseDuplicateModal={() => {
          ctx.setShowDuplicateModal(false)
          ctx.setSelectedIssue(null)
        }}
        onCloseStandaloneModal={() => ctx.setShowStandaloneModal(false)}
        onMoved={ctx.handleMoved}
        onDuplicated={ctx.handleDuplicated}
      />
    </div>
  )
}
