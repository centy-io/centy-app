import Link from 'next/link'
import { DocCard } from './DocCard'
import type { Doc } from '@/gen/centy_pb'
import { useAppLink } from '@/hooks/useAppLink'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface DocsListContentProps {
  projectPath: string
  isInitialized: boolean | null
  loading: boolean
  error: string | null
  docs: Doc[]
  deleteConfirm: string | null
  deleting: boolean
  onContextMenu: (e: React.MouseEvent, doc: Doc) => void
  onDeleteRequest: (slug: string) => void
  onDeleteCancel: () => void
  onDeleteConfirm: (slug: string) => void
}

export function DocsListContent({
  projectPath,
  isInitialized,
  loading,
  error,
  docs,
  deleteConfirm,
  deleting,
  onContextMenu,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm,
}: DocsListContentProps) {
  const { createLink } = useAppLink()

  if (!projectPath) {
    return (
      <div className="no-project-message">
        <p className="no-project-text">Select a project from the header to view documentation</p>
      </div>
    )
  }

  if (isInitialized === false) {
    return (
      <div className="not-initialized-message">
        <p className="not-initialized-text">Centy is not initialized in this directory</p>
        <Link href="/">Initialize Project</Link>
      </div>
    )
  }

  if (isInitialized !== true) return null

  return (
    <>
      {error && <DaemonErrorMessage error={error} />}

      {loading && docs.length === 0 ? (
        <div className="loading">Loading documentation...</div>
      ) : docs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No documentation found</p>
          <Link href={createLink('/docs/new')}>Create your first document</Link>
        </div>
      ) : (
        <div className="docs-grid">
          {docs.map(doc => (
            <DocCard
              key={doc.slug}
              doc={doc}
              deleteConfirm={deleteConfirm}
              deleting={deleting}
              onContextMenu={onContextMenu}
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
