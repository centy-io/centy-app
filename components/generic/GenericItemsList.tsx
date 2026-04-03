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
        onRefresh={() => {
          void data.fetchItems()
        }}
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
        onSoftDeleteConfirm={id => {
          void data.handleSoftDelete(id)
        }}
        onHardDeleteConfirm={id => {
          void data.handleDelete(id)
        }}
      />
    </div>
  )
}
