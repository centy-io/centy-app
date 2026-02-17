import Link from 'next/link'
import { LinkTargetType, type Link as LinkType } from '@/gen/centy_pb'
import type { RouteLiteral } from 'nextjs-routes'
import { protoToTargetType, getTargetTypeIcon } from './LinkSection.types'

interface LinkItemProps {
  link: LinkType
  buildLinkRoute: (
    targetType: LinkTargetType,
    targetId: string
  ) => RouteLiteral | '/'
  editable: boolean
  isDeleting: boolean
  onDelete: (link: LinkType) => void
}

export function LinkItem({
  link,
  buildLinkRoute,
  editable,
  isDeleting,
  onDelete,
}: LinkItemProps) {
  const targetTypeName = protoToTargetType[link.targetType]

  return (
    <li className="link-item">
      <Link
        href={buildLinkRoute(link.targetType, link.targetId)}
        className="link-item-link"
      >
        <span className={`link-type-icon link-type-${targetTypeName}`}>
          {getTargetTypeIcon(link.targetType)}
        </span>
        <span className="link-target-id">{link.targetId.slice(0, 8)}...</span>
      </Link>
      {editable && (
        <button
          className="link-delete-btn"
          onClick={() => onDelete(link)}
          disabled={isDeleting}
          title="Remove link"
        >
          {isDeleting ? '...' : 'x'}
        </button>
      )}
    </li>
  )
}
