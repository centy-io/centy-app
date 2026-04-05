import { GenericItemEditForm } from './GenericItemEditForm'
import { GenericItemView } from './GenericItemView'
import type { useGenericItemFetch } from './useGenericItemFetch'
import type { GenericItem, ItemTypeConfigProto } from '@/gen/centy_pb'

interface DetailBodyProps {
  item: GenericItem
  config: ItemTypeConfigProto | null
  isEditing: boolean
  projectPath: string
  fetch: ReturnType<typeof useGenericItemFetch>
}

export function DetailBody({
  item,
  config,
  isEditing,
  projectPath,
  fetch,
}: DetailBodyProps): React.JSX.Element {
  if (isEditing) {
    return (
      <GenericItemEditForm
        config={config}
        projectPath={projectPath}
        editTitle={fetch.editTitle}
        setEditTitle={fetch.setEditTitle}
        editBody={fetch.editBody}
        setEditBody={fetch.setEditBody}
        editStatus={fetch.editStatus}
        setEditStatus={fetch.setEditStatus}
        editCustomFields={fetch.editCustomFields}
        setEditCustomFields={fetch.setEditCustomFields}
        editProjects={fetch.editProjects}
        setEditProjects={fetch.setEditProjects}
        hasBody={Boolean(item.body)}
      />
    )
  }
  return <GenericItemView item={item} config={config} />
}
