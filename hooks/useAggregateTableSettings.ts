'use client'

import { useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { route } from 'nextjs-routes'
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table'
import { parseFilterParam } from './parseFilterParam'
import { serializeFilterParam } from './serializeFilterParam'
import { parseSortParam } from './parseSortParam'
import { serializeSortParam } from './serializeSortParam'

export function useAggregateTableSettings() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const columnFilters = parseFilterParam(searchParams.get('filter'))
  const sorting = parseSortParam(searchParams.get('sort'))

  const setSorting = useCallback(
    (value: SortingState | ((prev: SortingState) => SortingState)) => {
      const next =
        typeof value === 'function'
          ? value(parseSortParam(searchParams.get('sort')))
          : value
      const newSort = serializeSortParam(next)
      const currentFilter = searchParams.get('filter')
      const pathSegments = pathname.split('/').filter(Boolean)
      const extra: { filter?: string; sort?: string } = {}
      if (currentFilter !== null) extra.filter = currentFilter
      if (newSort !== null) extra.sort = newSort
      router.replace(
        route({
          pathname: '/[...path]',
          query: { path: pathSegments, ...extra },
        })
      )
    },
    [searchParams, router, pathname]
  )

  const setColumnFilters = useCallback(
    (
      value:
        | ColumnFiltersState
        | ((prev: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      const next =
        typeof value === 'function'
          ? value(parseFilterParam(searchParams.get('filter')))
          : value
      const newFilter = serializeFilterParam(next)
      const currentSort = searchParams.get('sort')
      const pathSegments = pathname.split('/').filter(Boolean)
      const extra: { filter?: string; sort?: string } = {}
      if (newFilter !== null) extra.filter = newFilter
      if (currentSort !== null) extra.sort = currentSort
      router.replace(
        route({
          pathname: '/[...path]',
          query: { path: pathSegments, ...extra },
        })
      )
    },
    [searchParams, router, pathname]
  )

  return { sorting, setSorting, columnFilters, setColumnFilters }
}
