/* eslint-disable max-lines */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGenericItemFetch } from './useGenericItemFetch'
import { useGenericItemSave } from './useGenericItemSave'
import { useGenericItemDelete } from './useGenericItemDelete'
import { GenericItemDetailHeader } from './GenericItemDetailHeader'
import { GenericItemDeleteConfirm } from './GenericItemDeleteConfirm'
import { GenericItemEditForm } from './GenericItemEditForm'
import { GenericItemView } from './GenericItemView'
import { useItemTypeConfig } from './useItemTypeConfig'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

interface GenericItemDetailProps {
  itemType: string
  itemId: string
}

// eslint-disable-next-line max-lines-per-function
export function GenericItemDetail({
  itemType,
  itemId,
}: GenericItemDetailProps) {
  const { projectPath } = usePathContext()
  const { createLink } = useAppLink()
  const { config } = useItemTypeConfig(projectPath, true, itemType)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const listUrl = createLink(`/${itemType}`)
  const fetch = useGenericItemFetch(projectPath, itemType, itemId)
  const { saving, handleSave } = useGenericItemSave({
    projectPath,
    itemType,
    item: fetch.item,
    editTitle: fetch.editTitle,
    editBody: fetch.editBody,
    editStatus: fetch.editStatus,
    editCustomFields: fetch.editCustomFields,
    setItem: fetch.setItem,
    setIsEditing,
    setError: fetch.setError,
  })
  const { deleting, handleDelete } = useGenericItemDelete({
    projectPath,
    itemType,
    item: fetch.item,
    listUrl,
    setError: fetch.setError,
  })
  const displayName = config
    ? config.name.charAt(0).toUpperCase() + config.name.slice(1)
    : itemType.charAt(0).toUpperCase() + itemType.slice(1)

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
        <Link href={listUrl}>Back to list</Link>
      </div>
    )

  if (!fetch.item) return null

  return (
    <div className="generic-item-detail">
      <GenericItemDetailHeader
        displayName={displayName}
        listUrl={listUrl}
        isEditing={isEditing}
        saving={saving}
        onEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onSave={handleSave}
        onDeleteRequest={() => setShowDeleteConfirm(true)}
      />
      {fetch.error && <DaemonErrorMessage error={fetch.error} />}
      {showDeleteConfirm && (
        <GenericItemDeleteConfirm
          itemLabel={fetch.item.title || fetch.item.id}
          deleting={deleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
      <div className="doc-content">
        {isEditing ? (
          <GenericItemEditForm
            config={config}
            editTitle={fetch.editTitle}
            setEditTitle={fetch.setEditTitle}
            editBody={fetch.editBody}
            setEditBody={fetch.setEditBody}
            editStatus={fetch.editStatus}
            setEditStatus={fetch.setEditStatus}
            editCustomFields={fetch.editCustomFields}
            setEditCustomFields={fetch.setEditCustomFields}
            hasBody={Boolean(fetch.item.body)}
          />
        ) : (
          <GenericItemView item={fetch.item} config={config} />
        )}
      </div>
    </div>
  )
}
