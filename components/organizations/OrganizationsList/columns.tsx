import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import { route } from 'nextjs-routes'
import type { Organization } from '@/gen/centy_pb'

const columnHelper = createColumnHelper<Organization>()

export function createOrgColumns() {
  return [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <Link
          href={route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: info.row.original.slug },
          })}
          className="org-name-link"
        >
          {info.getValue()}
        </Link>
      ),
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: info => <code className="org-slug-badge">{info.getValue()}</code>,
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: info => {
        const desc = info.getValue()
        if (!desc) return <span className="text-muted">-</span>
        return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
      },
      enableColumnFilter: true,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('projectCount', {
      header: 'Projects',
      cell: info => (
        <span className="org-project-count">{info.getValue()}</span>
      ),
      enableColumnFilter: false,
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
