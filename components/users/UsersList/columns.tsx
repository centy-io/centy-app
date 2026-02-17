import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import type { RouteLiteral } from 'nextjs-routes'
import type { User } from '@/gen/centy_pb'

const columnHelper = createColumnHelper<User>()

export function createUsersColumns() {
  return [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => {
        const meta = info.table.options.meta as {
          getUserRoute: (userId: string) => RouteLiteral | '/'
        }
        return (
          <Link
            href={meta.getUserRoute(info.row.original.id)}
            className="user-name-link"
          >
            {info.getValue()}
          </Link>
        )
      },
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue() || '-',
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('gitUsernames', {
      header: 'Git Usernames',
      cell: info => {
        const usernames = info.getValue()
        return usernames.length > 0 ? usernames.join(', ') : '-'
      },
      enableColumnFilter: true,
      filterFn: (row, columnId, filterValue) => {
        const usernames = row.getValue(columnId) as string[]
        return usernames.some(u =>
          u.toLowerCase().includes(filterValue.toLowerCase())
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: info => {
        const date = info.getValue()
        return date ? new Date(date).toLocaleDateString() : '-'
      },
      enableColumnFilter: false,
      sortingFn: (rowA, rowB) => {
        const a = rowA.getValue('createdAt') as string
        const b = rowB.getValue('createdAt') as string
        if (!a && !b) return 0
        if (!a) return 1
        if (!b) return -1
        return new Date(a).getTime() - new Date(b).getTime()
      },
    }),
  ]
}
