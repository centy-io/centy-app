---
# This file is managed by Centy. Use the Centy CLI to modify it.
createdAt: 2026-04-03T14:02:21.619714+00:00
updatedAt: 2026-04-03T14:02:21.619714+00:00
---

# Delete Key: Three-Option Dialog (Archive, Soft Delete, Hard Delete)

# Delete Key: Three-Option Dialog Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When the Delete key is pressed (or the Delete button clicked) on an item in list or detail view, show a dialog with three distinct options: Archive, Soft Delete, and Hard Delete.

**Architecture:** Add `onArchive` prop to `DeleteConfirm`, add `handleArchive` to `useGenericItemDelete` and `useGenericItemsData` via a new `archiveListItem` helper, thread new prop through the component chain, and add keyboard listeners on cards (list) and the detail container.

**Tech Stack:** React, TypeScript, gRPC (`centyClient.archiveItem`), `ArchiveItemRequestSchema` from `@/gen/centy_pb`

---

## Semantics

| Action      | API call                       | Effect                                         |
| ----------- | ------------------------------ | ---------------------------------------------- |
| Archive     | `centyClient.archiveItem()`    | Moves item to archive folder (recoverable)     |
| Soft Delete | `centyClient.softDeleteItem()` | Sets `deletedAt` timestamp (recoverable trash) |
| Hard Delete | `centyClient.deleteItem()`     | Permanently removes the file                   |

---

## Files

| Action | File                                              |
| ------ | ------------------------------------------------- |
| Create | `components/generic/archiveListItem.ts`           |
| Modify | `components/shared/DeleteConfirm.tsx`             |
| Modify | `components/generic/useGenericItemDelete.ts`      |
| Modify | `components/generic/useGenericItemDetailState.ts` |
| Modify | `components/generic/GenericItemContent.tsx`       |
| Modify | `components/generic/useGenericItemsData.ts`       |
| Modify | `components/generic/GenericItemCard.tsx`          |
| Modify | `components/generic/ItemsGrid.tsx`                |
| Modify | `components/generic/GenericListContent.tsx`       |
| Modify | `components/generic/GenericItemsList.tsx`         |

---

## Task 1: Create `archiveListItem.ts`

**Files:**

- Create: `components/generic/archiveListItem.ts`

- [ ] Write the file:

```ts
import { create } from '@bufbuild/protobuf'
import { callItemApi } from '@/lib/callItemApi'
import { centyClient } from '@/lib/grpc/client'
import { ArchiveItemRequestSchema } from '@/gen/centy_pb'

export async function archiveListItem(
  projectPath: string,
  itemType: string,
  itemId: string,
  setDeleting: (v: boolean) => void,
  setError: (v: string | null) => void
): Promise<boolean> {
  const res = await callItemApi(
    () =>
      centyClient.archiveItem(
        create(ArchiveItemRequestSchema, { projectPath, itemType, itemId })
      ),
    setDeleting,
    setError
  )
  if (res && res.success) return true
  if (res) setError(res.error || 'Failed to archive item')
  return false
}
```

- [ ] Commit: `git commit -m "feat: add archiveListItem helper"`

---

## Task 2: Update `DeleteConfirm.tsx` — add Archive button

**Files:**

- Modify: `components/shared/DeleteConfirm.tsx`

Current props: `onSoftDelete?: () => void` (labelled "Archive" in UI but calls softDeleteItem).

New props:

- `onArchive?: () => void` — moves to archive
- `onSoftDelete?: () => void` — sets deletedAt (rename label from "Archive" to "Soft Delete")

Pending state expands to: `'archive' | 'soft' | 'hard' | null`

- [ ] Replace the file content:

```tsx
'use client'

import { useState, useEffect } from 'react'

interface DeleteConfirmProps {
  message: string
  confirmLabel?: string
  deleting: boolean
  onCancel: () => void
  onConfirm: () => void
  onArchive?: () => void
  onSoftDelete?: () => void
  error?: string | null
  children?: React.ReactNode
}

function getLoadingLabel(label: string): string {
  const word = label.split(' ')[0]
  const base = word.endsWith('e') ? word.slice(0, -1) : word
  return base + 'ing...'
}

export function DeleteConfirm({
  message,
  confirmLabel,
  deleting,
  onCancel,
  onConfirm,
  onArchive,
  onSoftDelete,
  error,
  children,
}: DeleteConfirmProps): React.JSX.Element {
  const label = confirmLabel !== undefined ? confirmLabel : 'Delete'
  const [pendingAction, setPendingAction] = useState<
    'archive' | 'soft' | 'hard' | null
  >(null)

  useEffect(() => {
    if (!deleting) setPendingAction(null)
  }, [deleting])

  function handleArchive() {
    setPendingAction('archive')
    onArchive!()
  }

  function handleSoftDelete() {
    setPendingAction('soft')
    onSoftDelete!()
  }

  function handleConfirm() {
    setPendingAction('hard')
    onConfirm()
  }

  const archiving = deleting && pendingAction === 'archive'
  const softDeleting = deleting && pendingAction === 'soft'
  const hardDeleting = deleting && pendingAction === 'hard'

  const showHint = onArchive || onSoftDelete

  return (
    <div className="delete-confirm">
      <p className="delete-confirm-message">{message}</p>
      {showHint && (
        <p className="delete-confirm-hint">
          Archive keeps it recoverable. Soft delete moves to trash. Delete
          removes it permanently.
        </p>
      )}
      {children}
      {error && <p className="delete-error-message">{error}</p>}
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        {onArchive && (
          <button
            onClick={handleArchive}
            disabled={deleting}
            className="archive-btn"
          >
            {archiving ? 'Archiving...' : 'Archive'}
          </button>
        )}
        {onSoftDelete && (
          <button
            onClick={handleSoftDelete}
            disabled={deleting}
            className="soft-delete-btn"
          >
            {softDeleting ? 'Deleting...' : 'Soft Delete'}
          </button>
        )}
        <button
          onClick={handleConfirm}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {hardDeleting ? getLoadingLabel(label) : label}
        </button>
      </div>
    </div>
  )
}
```

- [ ] Commit: `git commit -m "feat: add archive and soft-delete options to DeleteConfirm"`

---

## Task 3: Update `useGenericItemDelete.ts` — add `handleArchive`

**Files:**

- Modify: `components/generic/useGenericItemDelete.ts`

- [ ] Add `ArchiveItemRequestSchema` import and `handleArchive` callback. Full file:

```ts
import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { callItemApi } from '@/lib/callItemApi'
import { centyClient } from '@/lib/grpc/client'
import {
  ArchiveItemRequestSchema,
  DeleteItemRequestSchema,
  SoftDeleteItemRequestSchema,
  RestoreItemRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'

interface UseGenericItemDeleteParams {
  projectPath: string
  itemType: string
  item: GenericItem | null
  listUrl: RouteLiteral
  setError: (error: string | null) => void
  setItem?: (item: GenericItem) => void
}

export function useGenericItemDelete({
  projectPath,
  itemType,
  item,
  listUrl,
  setError,
  setItem,
}: UseGenericItemDeleteParams) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const handleArchive = useCallback(async () => {
    if (!projectPath || !item) return
    const res = await callItemApi(
      () =>
        centyClient.archiveItem(
          create(ArchiveItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(listUrl)
    else if (res) setError(res.error || 'Failed to archive')
  }, [projectPath, itemType, item, router, listUrl, setError])

  const handleDelete = useCallback(async () => {
    if (!projectPath || !item) return
    const res = await callItemApi(
      () =>
        centyClient.deleteItem(
          create(DeleteItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(listUrl)
    else if (res) setError(res.error || 'Failed to delete')
  }, [projectPath, itemType, item, router, listUrl, setError])

  const handleSoftDelete = useCallback(async () => {
    if (!projectPath || !item) return
    const res = await callItemApi(
      () =>
        centyClient.softDeleteItem(
          create(SoftDeleteItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setDeleting,
      setError
    )
    if (res && res.success) router.push(listUrl)
    else if (res) setError(res.error || 'Failed to soft delete')
  }, [projectPath, itemType, item, router, listUrl, setError])

  const handleRestore = useCallback(async () => {
    if (!projectPath || !item || !setItem) return
    const res = await callItemApi(
      () =>
        centyClient.restoreItem(
          create(RestoreItemRequestSchema, {
            projectPath,
            itemType,
            itemId: item.id,
          })
        ),
      setRestoring,
      setError
    )
    if (res && res.success && res.item) setItem(res.item)
    else if (res) setError(res.error || 'Failed to restore')
  }, [projectPath, itemType, item, setItem, setError])

  return {
    deleting,
    restoring,
    handleArchive,
    handleDelete,
    handleSoftDelete,
    handleRestore,
  }
}
```

- [ ] Commit: `git commit -m "feat: add handleArchive to useGenericItemDelete"`

---

## Task 4: Update `useGenericItemDetailState.ts` — expose `handleArchive`

**Files:**

- Modify: `components/generic/useGenericItemDetailState.ts`

- [ ] Add `handleArchive` to the interface and return value:

```ts
import { useState } from 'react'
import type { RouteLiteral } from 'nextjs-routes'
import { useGenericItemFetch } from './useGenericItemFetch'
import { useGenericItemSave } from './useGenericItemSave'
import { useGenericItemDelete } from './useGenericItemDelete'
import { useItemTypeConfig } from './useItemTypeConfig'
import type { ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'

interface UseGenericItemDetailStateResult {
  config: ItemTypeConfigProto | null
  isEditing: boolean
  setIsEditing: (v: boolean) => void
  showDeleteConfirm: boolean
  setShowDeleteConfirm: (v: boolean) => void
  listUrl: RouteLiteral
  fetch: ReturnType<typeof useGenericItemFetch>
  saving: boolean
  handleSave: () => Promise<void>
  deleting: boolean
  restoring: boolean
  handleArchive: () => Promise<void>
  handleDelete: () => Promise<void>
  handleSoftDelete: () => Promise<void>
  handleRestore: () => Promise<void>
}

export function useGenericItemDetailState(
  projectPath: string,
  itemType: string,
  itemId: string
): UseGenericItemDetailStateResult {
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
  const {
    deleting,
    restoring,
    handleArchive,
    handleDelete,
    handleSoftDelete,
    handleRestore,
  } = useGenericItemDelete({
    projectPath,
    itemType,
    item: fetch.item,
    listUrl,
    setError: fetch.setError,
    setItem: fetch.setItem,
  })
  return {
    config,
    isEditing,
    setIsEditing,
    showDeleteConfirm,
    setShowDeleteConfirm,
    listUrl,
    fetch,
    saving,
    handleSave,
    deleting,
    restoring,
    handleArchive,
    handleDelete,
    handleSoftDelete,
    handleRestore,
  }
}
```

- [ ] Commit: `git commit -m "feat: expose handleArchive in useGenericItemDetailState"`

---

## Task 5: Update `GenericItemContent.tsx` — pass `onArchive` + keyboard shortcut

**Files:**

- Modify: `components/generic/GenericItemContent.tsx`

Add:

1. `handleArchive` destructured from `state`
2. `onArchive={handleArchive}` on `DeleteConfirm`
3. `useEffect` keyboard listener: Delete key (when not editing, not in input/textarea) calls `setShowDeleteConfirm(true)`

- [ ] Replace file:

```tsx
'use client'

import { useEffect } from 'react'
import { ArchivedBanner } from './ArchivedBanner'
import { DetailBody } from './DetailBody'
import { GenericItemDetailHeader } from './GenericItemDetailHeader'
import { buildItemDisplayName } from './buildItemDisplayName'
import type { useGenericItemDetailState } from './useGenericItemDetailState'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import { CommentThread } from '@/components/comments/CommentThread'
import type { GenericItem } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { ItemContent } from '@/components/shared/ItemView'

interface ContentProps {
  state: ReturnType<typeof useGenericItemDetailState>
  item: GenericItem
  itemType: string
  projectPath: string
}

export function GenericItemContent({
  state,
  item,
  itemType,
  projectPath,
}: ContentProps): React.JSX.Element {
  const { isEditing, setIsEditing, showDeleteConfirm, setShowDeleteConfirm } =
    state
  const {
    listUrl,
    fetch,
    saving,
    handleSave,
    deleting,
    restoring,
    handleArchive,
    handleDelete,
    handleSoftDelete,
    handleRestore,
  } = state
  const isArchived = Boolean(item.metadata && item.metadata.deletedAt)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      const tag = (e.target as HTMLElement).tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable
      )
        return
      if (isEditing) return
      e.preventDefault()
      setShowDeleteConfirm(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isEditing, setShowDeleteConfirm])

  return (
    <div className="generic-item-detail">
      <GenericItemDetailHeader
        displayName={buildItemDisplayName(state.config, itemType)}
        listUrl={listUrl}
        isEditing={isEditing}
        saving={saving}
        onEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onSave={handleSave}
        onDeleteRequest={() => setShowDeleteConfirm(true)}
      />
      {fetch.error && <DaemonErrorMessage error={fetch.error} />}
      {isArchived && (
        <ArchivedBanner restoring={restoring} onRestore={handleRestore} />
      )}
      {showDeleteConfirm && (
        <DeleteConfirm
          message={`Delete "${item.title || item.id}"?`}
          deleting={deleting}
          onCancel={() => setShowDeleteConfirm(false)}
          onArchive={handleArchive}
          onSoftDelete={handleSoftDelete}
          onConfirm={handleDelete}
        />
      )}
      <ItemContent>
        <DetailBody
          item={item}
          config={state.config}
          isEditing={isEditing}
          fetch={fetch}
        />
      </ItemContent>
      {itemType !== 'comments' && (
        <CommentThread
          projectPath={projectPath}
          parentItemId={item.id}
          parentItemType={itemType}
        />
      )}
    </div>
  )
}
```

- [ ] Commit: `git commit -m "feat: add archive option and Delete key shortcut to detail view"`

---

## Task 6: Update `useGenericItemsData.ts` — add `handleArchive`

**Files:**

- Modify: `components/generic/useGenericItemsData.ts`

- [ ] Add `archiveListItem` import and `handleArchive` callback:

```ts
import { useState, useCallback, useEffect } from 'react'
import { archiveListItem } from './archiveListItem'
import { deleteListItem } from './deleteListItem'
import { fetchItemList } from './fetchItemList'
import { softDeleteListItem } from './softDeleteListItem'
import type { GenericItem } from '@/gen/centy_pb'

export function useGenericItemsData(
  projectPath: string,
  isInitialized: boolean | null,
  itemType: string
) {
  const [items, setItems] = useState<GenericItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = useCallback(async () => {
    if (!projectPath.trim() || isInitialized !== true) return
    setLoading(true)
    setError(null)
    const result = await fetchItemList(projectPath, itemType)
    setItems(result.items)
    if (result.error) setError(result.error)
    setLoading(false)
  }, [projectPath, isInitialized, itemType])

  const handleArchive = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      const ok = await archiveListItem(
        projectPath,
        itemType,
        itemId,
        setDeleting,
        setError
      )
      if (!ok) return
      setItems(prev => prev.filter(i => i.id !== itemId))
      setDeleteConfirm(null)
    },
    [projectPath, itemType]
  )

  const handleDelete = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      const ok = await deleteListItem(
        projectPath,
        itemType,
        itemId,
        setDeleting,
        setError
      )
      if (!ok) return
      setItems(prev => prev.filter(i => i.id !== itemId))
      setDeleteConfirm(null)
    },
    [projectPath, itemType]
  )

  const handleSoftDelete = useCallback(
    async (itemId: string) => {
      if (!projectPath) return
      const ok = await softDeleteListItem(
        projectPath,
        itemType,
        itemId,
        setDeleting,
        setError
      )
      if (!ok) return
      setItems(prev => prev.filter(i => i.id !== itemId))
      setDeleteConfirm(null)
    },
    [projectPath, itemType]
  )

  useEffect(() => {
    if (isInitialized !== true) return
    fetchItems()
  }, [isInitialized, fetchItems])

  return {
    items,
    loading,
    error,
    deleteConfirm,
    setDeleteConfirm,
    deleting,
    fetchItems,
    handleArchive,
    handleDelete,
    handleSoftDelete,
  }
}
```

- [ ] Commit: `git commit -m "feat: add handleArchive to useGenericItemsData"`

---

## Task 7: Update `GenericItemCard.tsx` — add `onArchiveConfirm` prop + Delete key on card

**Files:**

- Modify: `components/generic/GenericItemCard.tsx`

Add `onArchiveConfirm` prop, pass to `DeleteConfirm` as `onArchive`, and add `onKeyDown` on the card div (tabIndex=0) to trigger delete dialog on Delete key.

- [ ] Replace file:

```tsx
import { ItemCardContent } from './ItemCardContent'
import { DeleteConfirm } from '@/components/shared/DeleteConfirm'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'

interface GenericItemCardProps {
  item: GenericItem
  config: ItemTypeConfigProto | null
  itemType: string
  singularName: string
  deleteConfirm: string | null
  deleting: boolean
  onDeleteRequest: (id: string) => void
  onDeleteCancel: () => void
  onArchiveConfirm: (id: string) => void
  onSoftDeleteConfirm: (id: string) => void
  onHardDeleteConfirm: (id: string) => void
}

export function GenericItemCard({
  item,
  config,
  itemType,
  singularName,
  deleteConfirm,
  deleting,
  onDeleteRequest,
  onDeleteCancel,
  onArchiveConfirm,
  onSoftDeleteConfirm,
  onHardDeleteConfirm,
}: GenericItemCardProps): React.JSX.Element {
  const { createLink } = useAppLink()

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return
    const tag = (e.target as HTMLElement).tagName
    if (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      (e.target as HTMLElement).isContentEditable
    )
      return
    e.preventDefault()
    onDeleteRequest(item.id)
  }

  return (
    <div
      className="generic-item-card context-menu-row"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <ItemCardContent
        item={item}
        config={config}
        itemType={itemType}
        createLink={createLink}
      />
      <button
        className="generic-item-delete-btn"
        onClick={e => {
          e.preventDefault()
          onDeleteRequest(item.id)
        }}
        title={`Delete ${singularName}`}
      >
        x
      </button>
      {deleteConfirm === item.id && (
        <DeleteConfirm
          message={`Delete "${item.title || item.id}"?`}
          deleting={deleting}
          onCancel={onDeleteCancel}
          onArchive={() => onArchiveConfirm(item.id)}
          onSoftDelete={() => onSoftDeleteConfirm(item.id)}
          onConfirm={() => onHardDeleteConfirm(item.id)}
        />
      )}
    </div>
  )
}
```

- [ ] Commit: `git commit -m "feat: add archive option and Delete key shortcut to item card"`

---

## Task 8: Thread `onArchiveConfirm` through `ItemsGrid`, `GenericListContent`, `GenericItemsList`

**Files:**

- Modify: `components/generic/ItemsGrid.tsx`
- Modify: `components/generic/GenericListContent.tsx`
- Modify: `components/generic/GenericItemsList.tsx`

**`ItemsGrid.tsx`** — add `onArchiveConfirm` to interface and pass down:

```tsx
import { GenericItemCard } from './GenericItemCard'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface ItemsGridProps {
  items: GenericItem[]
  config: ItemTypeConfigProto | null
  itemType: string
  singularName: string
  error: string | null
  deleteConfirm: string | null
  deleting: boolean
  onDeleteRequest: (id: string) => void
  onDeleteCancel: () => void
  onArchiveConfirm: (id: string) => void
  onSoftDeleteConfirm: (id: string) => void
  onHardDeleteConfirm: (id: string) => void
}

export function ItemsGrid({
  items,
  config,
  itemType,
  singularName,
  error,
  deleteConfirm,
  deleting,
  onDeleteRequest,
  onDeleteCancel,
  onArchiveConfirm,
  onSoftDeleteConfirm,
  onHardDeleteConfirm,
}: ItemsGridProps): React.JSX.Element {
  return (
    <>
      {error && <DaemonErrorMessage error={error} />}
      <div className="generic-items-grid">
        {items.map(item => (
          <GenericItemCard
            key={item.id}
            item={item}
            config={config}
            itemType={itemType}
            singularName={singularName}
            deleteConfirm={deleteConfirm}
            deleting={deleting}
            onDeleteRequest={onDeleteRequest}
            onDeleteCancel={onDeleteCancel}
            onArchiveConfirm={onArchiveConfirm}
            onSoftDeleteConfirm={onSoftDeleteConfirm}
            onHardDeleteConfirm={onHardDeleteConfirm}
          />
        ))}
      </div>
    </>
  )
}
```

**`GenericListContent.tsx`** — add `onArchiveConfirm` to interface and pass to `ItemsGrid`:

```tsx
import Link from 'next/link'
import { ItemsGrid } from './ItemsGrid'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface GenericListContentProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  error: string | null
  items: GenericItem[]
  config: ItemTypeConfigProto | null
  itemType: string
  singularName: string
  displayName: string
  deleteConfirm: string | null
  deleting: boolean
  onDeleteRequest: (id: string) => void
  onDeleteCancel: () => void
  onArchiveConfirm: (id: string) => void
  onSoftDeleteConfirm: (id: string) => void
  onHardDeleteConfirm: (id: string) => void
}

export function GenericListContent({
  projectPath,
  isInitialized,
  loading,
  error,
  items,
  config,
  itemType,
  singularName,
  displayName,
  deleteConfirm,
  deleting,
  onDeleteRequest,
  onDeleteCancel,
  onArchiveConfirm,
  onSoftDeleteConfirm,
  onHardDeleteConfirm,
}: GenericListContentProps): React.JSX.Element | null {
  const { createLink } = useAppLink()
  const capSingular =
    singularName.charAt(0).toUpperCase() + singularName.slice(1)

  if (!projectPath) {
    return (
      <div className="no-project-message">
        <p className="no-project-text">
          Select a project from the header to view {displayName.toLowerCase()}
        </p>
      </div>
    )
  }
  if (isInitialized === false) {
    return (
      <div className="not-initialized-message">
        <p className="not-initialized-text">
          Centy is not initialized in this directory
        </p>
      </div>
    )
  }
  if (isInitialized !== true) return null
  if (loading && items.length === 0) {
    return <div className="loading">Loading {displayName.toLowerCase()}...</div>
  }
  if (items.length === 0) {
    return (
      <div className="empty-state">
        {error && <DaemonErrorMessage error={error} />}
        <p className="empty-state-text">No {displayName.toLowerCase()} found</p>
        <Link href={createLink(`/${itemType}/new`)}>
          Create your first {capSingular}
        </Link>
      </div>
    )
  }
  return (
    <ItemsGrid
      items={items}
      config={config}
      itemType={itemType}
      singularName={singularName}
      error={error}
      deleteConfirm={deleteConfirm}
      deleting={deleting}
      onDeleteRequest={onDeleteRequest}
      onDeleteCancel={onDeleteCancel}
      onArchiveConfirm={onArchiveConfirm}
      onSoftDeleteConfirm={onSoftDeleteConfirm}
      onHardDeleteConfirm={onHardDeleteConfirm}
    />
  )
}
```

**`GenericItemsList.tsx`** — pass `data.handleArchive` as `onArchiveConfirm`:

```tsx
'use client'

import { useGenericItemsData } from './useGenericItemsData'
import { GenericListHeader } from './GenericListHeader'
import { GenericListContent } from './GenericListContent'
import { useItemTypeConfig } from './useItemTypeConfig'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

interface GenericItemsListProps {
  itemType: string
}

export function GenericItemsList({ itemType }: GenericItemsListProps) {
  const { projectPath, isInitialized } = usePathContext()
  const { createLink } = useAppLink()
  const { config } = useItemTypeConfig(projectPath, isInitialized, itemType)
  const data = useGenericItemsData(projectPath, isInitialized, itemType)

  const displayName = config
    ? config.plural.charAt(0).toUpperCase() + config.plural.slice(1)
    : itemType.charAt(0).toUpperCase() + itemType.slice(1)

  const singularName = config ? config.name : itemType

  return (
    <div className="generic-items-list">
      <GenericListHeader
        displayName={displayName}
        singularName={singularName}
        loading={data.loading}
        createNewUrl={createLink(`/${itemType}/new`)}
        onRefresh={data.fetchItems}
      />
      <GenericListContent
        projectPath={projectPath}
        isInitialized={isInitialized}
        loading={data.loading}
        error={data.error}
        items={data.items}
        config={config}
        itemType={itemType}
        singularName={singularName}
        displayName={displayName}
        deleteConfirm={data.deleteConfirm}
        deleting={data.deleting}
        onDeleteRequest={id => data.setDeleteConfirm(id)}
        onDeleteCancel={() => data.setDeleteConfirm(null)}
        onArchiveConfirm={data.handleArchive}
        onSoftDeleteConfirm={data.handleSoftDelete}
        onHardDeleteConfirm={data.handleDelete}
      />
    </div>
  )
}
```

- [ ] Commit: `git commit -m "feat: thread archive option through list component chain"`
