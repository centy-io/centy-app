import {
  MultiSelect,
  type MultiSelectOption,
} from '@/components/shared/MultiSelect'
import { PRIORITY_OPTIONS } from './utils'

interface ColumnFilterProps {
  header: {
    column: {
      id: string
      getFilterValue: () => unknown
      setFilterValue: (v: unknown) => void
    }
  }
  statusOptions: MultiSelectOption[]
}

export function AggregateColumnFilter({
  header,
  statusOptions,
}: ColumnFilterProps) {
  if (header.column.id === 'status' || header.column.id === 'priority') {
    const options =
      header.column.id === 'status' ? statusOptions : PRIORITY_OPTIONS
    return (
      <MultiSelect
        options={options}
        value={(header.column.getFilterValue() as string[]) ?? []}
        onChange={values =>
          header.column.setFilterValue(values.length > 0 ? values : undefined)
        }
        placeholder="All"
        className="column-filter-multi"
      />
    )
  }
  return (
    <input
      type="text"
      className="column-filter"
      placeholder="Filter..."
      value={(header.column.getFilterValue() as string) ?? ''}
      onChange={e => header.column.setFilterValue(e.target.value)}
    />
  )
}
