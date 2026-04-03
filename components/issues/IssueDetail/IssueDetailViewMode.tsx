'use client'

import type { ReactElement } from 'react'
import { ViewContent } from './ViewContent'
import { IssueSidebar } from './IssueSidebar'
import type { IssueDetailBodyProps } from './IssueDetailBody.types'
import { ItemTitleWithBadge } from '@/components/shared/ItemView'
import { DetailLayout } from '@/components/shared/DetailLayout/DetailLayout'

interface IssueDetailViewModeProps {
  issue: IssueDetailBodyProps['issue']
  projectPath: string
  issueNumber: string
  stateManager: IssueDetailBodyProps['stateManager']
  stateOptions: IssueDetailBodyProps['stateOptions']
  statusChange: IssueDetailBodyProps['statusChange']
  editState: IssueDetailBodyProps['editState']
  assets: IssueDetailBodyProps['assets']
  setAssets: IssueDetailBodyProps['setAssets']
  onToggleDropdown: () => void
  onBadgeClick: () => void
}

export function IssueDetailViewMode({
  issue,
  projectPath,
  issueNumber,
  stateManager,
  stateOptions,
  statusChange,
  editState,
  assets,
  setAssets,
  onToggleDropdown,
  onBadgeClick,
}: IssueDetailViewModeProps): ReactElement {
  return (
    <DetailLayout
      main={
        <>
          <ItemTitleWithBadge
            badge={
              <button
                type="button"
                className="issue-number-badge"
                onClick={onBadgeClick}
                title="Click to copy UUID"
              >
                #{issue.metadata ? issue.metadata.displayNumber : 0}
              </button>
            }
          >
            {issue.title}
          </ItemTitleWithBadge>
          <ViewContent
            issue={issue}
            projectPath={projectPath}
            issueNumber={issueNumber}
            assets={assets}
            setAssets={setAssets}
          />
        </>
      }
      sidebar={
        <IssueSidebar
          issue={issue}
          projectPath={projectPath}
          issueNumber={issueNumber}
          stateManager={stateManager}
          stateOptions={stateOptions}
          statusChange={statusChange}
          editState={editState}
          onToggleDropdown={onToggleDropdown}
        />
      }
    />
  )
}
