'use client'

import Link from 'next/link'
import { GenericItemContent } from './GenericItemContent'
import { useGenericItemDetailState } from './useGenericItemDetailState'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { usePathContext } from '@/components/providers/PathContextProvider'

interface GenericItemDetailProps {
  itemType: string
  itemId: string
}

export function GenericItemDetail({
  itemType,
  itemId,
}: GenericItemDetailProps): React.JSX.Element | null {
  const { projectPath } = usePathContext()
  const state = useGenericItemDetailState(projectPath, itemType, itemId)
  const { fetch } = state

  if (!projectPath)
    return (
      <div className="generic-item-detail">
        <p className="no-project-text">Select a project to view this item</p>
      </div>
    )
  if (fetch.loading && !fetch.item)
    return <div className="loading">Loading...</div>
  if (fetch.error && !fetch.item)
    return (
      <div className="generic-item-detail">
        <DaemonErrorMessage error={fetch.error} />
        <Link href={state.listUrl}>Back to list</Link>
      </div>
    )
  if (!fetch.item) return null

  const item = fetch.item
  return (
    <GenericItemContent
      state={state}
      item={item}
      itemType={itemType}
      projectPath={projectPath}
    />
  )
}
