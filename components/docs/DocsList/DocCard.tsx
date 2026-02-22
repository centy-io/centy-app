import Link from 'next/link'
import type { Doc } from '@/gen/centy_pb'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'

interface DocCardProps {
  doc: Doc
  deleteConfirm: string | null
  deleting: boolean
  onContextMenu: (e: React.MouseEvent, doc: Doc) => void
  onDeleteRequest: (slug: string) => void
  onDeleteCancel: () => void
  onDeleteConfirm: (slug: string) => void
}

// eslint-disable-next-line max-lines-per-function
export function DocCard({
  doc,
  deleteConfirm,
  deleting,
  onContextMenu,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm,
}: DocCardProps) {
  const { copyToClipboard } = useCopyToClipboard()
  const { createLink } = useAppLink()

  return (
    <div
      className="doc-card context-menu-row"
      onContextMenu={e => onContextMenu(e, doc)}
    >
      <div className="doc-card-content">
        <Link href={createLink(`/docs/${doc.slug}`)} className="doc-card-link">
          <h3 className="doc-title">{doc.title}</h3>
        </Link>
        <button
          type="button"
          className="doc-slug-copy-btn"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            copyToClipboard(doc.slug, `doc "${doc.slug}"`)
          }}
          title="Click to copy slug"
        >
          {doc.slug}
        </button>
        {doc.metadata && (
          <div className="doc-meta">
            <span className="doc-date">
              Updated:{' '}
              {doc.metadata.updatedAt
                ? new Date(doc.metadata.updatedAt).toLocaleDateString()
                : '-'}
            </span>
          </div>
        )}
      </div>
      <button
        className="doc-delete-btn"
        onClick={e => {
          e.preventDefault()
          onDeleteRequest(doc.slug)
        }}
        title="Delete document"
      >
        x
      </button>
      {deleteConfirm === doc.slug && (
        <div className="delete-confirm-overlay">
          <p className="delete-confirm-message">
            Delete &ldquo;{doc.title}&rdquo;?
          </p>
          <div className="delete-confirm-actions">
            <button onClick={onDeleteCancel} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={() => onDeleteConfirm(doc.slug)}
              disabled={deleting}
              className="confirm-delete-btn"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
