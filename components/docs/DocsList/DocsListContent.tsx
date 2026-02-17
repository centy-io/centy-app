'use client'

import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import type { Doc } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import { DocsListCard } from './DocsListCard'

interface DocsListContentProps {
  docs: Doc[]
  loading: boolean
  error: string | null
  deleteConfirm: string | null
  deleting: boolean
  createDocUrl: RouteLiteral
  createLink: (path: string) => RouteLiteral
  onContextMenu: (e: React.MouseEvent, doc: Doc) => void
  onCopySlug: (slug: string, label: string) => void
  onDeleteRequest: (slug: string) => void
  onDeleteCancel: () => void
  onDeleteConfirm: (slug: string) => void
}

export function DocsListContent({
  docs,
  loading,
  error,
  deleteConfirm,
  deleting,
  createDocUrl,
  createLink,
  onContextMenu,
  onCopySlug,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm,
}: DocsListContentProps) {
  return (
    <>
      {error && <DaemonErrorMessage error={error} />}
      {loading && docs.length === 0 ? (
        <div className="loading">Loading documentation...</div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <p>No documentation found</p>
          <Link href={createDocUrl}>Create your first document</Link>
        </div>
      ) : (
        <div className="docs-grid">
          {docs.map(doc => (
            <DocsListCard
              key={doc.slug}
              doc={doc}
              docUrl={createLink(`/docs/${doc.slug}`)}
              deleteConfirm={deleteConfirm}
              deleting={deleting}
              onContextMenu={onContextMenu}
              onCopySlug={onCopySlug}
              onDeleteRequest={onDeleteRequest}
              onDeleteCancel={onDeleteCancel}
              onDeleteConfirm={onDeleteConfirm}
            />
          ))}
        </div>
      )}
    </>
  )
}
