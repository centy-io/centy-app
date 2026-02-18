import type { Doc } from '@/gen/centy_pb'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { TextEditor } from '@/components/shared/TextEditor'
import { LinkSection } from '@/components/shared/LinkSection'

interface DocDetailViewProps {
  doc: Doc
  slug: string
}

export function DocDetailView({ doc, slug }: DocDetailViewProps) {
  const { copyToClipboard } = useCopyToClipboard()

  return (
    <>
      <button
        type="button"
        className="doc-slug-badge"
        onClick={() => slug && copyToClipboard(slug, `doc "${slug}"`)}
        title="Click to copy slug"
      >
        {doc.slug}
      </button>
      <h1 className="doc-title">{doc.title}</h1>

      <div className="doc-metadata">
        {doc.metadata && doc.metadata.createdAt && (
          <span className="doc-date">
            Created: {new Date(doc.metadata.createdAt).toLocaleString()}
          </span>
        )}
        {doc.metadata && doc.metadata.updatedAt && (
          <span className="doc-date">
            Updated: {new Date(doc.metadata.updatedAt).toLocaleString()}
          </span>
        )}
      </div>

      <div className="doc-body">
        {doc.content ? (
          <TextEditor value={doc.content} format="md" mode="display" />
        ) : (
          <p className="no-content">No content</p>
        )}
      </div>

      <LinkSection entityId={doc.slug} entityType="doc" editable={true} />
    </>
  )
}
