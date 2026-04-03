'use client'

import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { getLinkTypeDisplay, getTargetTypeIcon } from './linkHelpers'
import type { Link as LinkType } from '@/gen/centy_pb'

interface LinkGroupListProps {
  groupedLinks: Record<string, LinkType[]>
  editable: boolean
  deletingLinkId: string | null
  buildLinkRoute: (targetItemType: string, targetId: string) => RouteLiteral
  onDeleteLink: (link: LinkType) => void
}

export function LinkGroupList({
  groupedLinks,
  editable,
  deletingLinkId,
  buildLinkRoute,
  onDeleteLink,
}: LinkGroupListProps) {
  return (
    <div className="link-groups">
      {Object.entries(groupedLinks).map(([linkType, typeLinks]) => (
        <div key={linkType} className="link-group">
          <div className="link-group-header">
            {getLinkTypeDisplay(linkType)}
          </div>
          <ul className="link-list">
            {typeLinks.map(link => {
              const linkKey = `${link.targetId}-${link.linkType}`
              const isDeleting = deletingLinkId === linkKey
              return (
                <li key={linkKey} className="link-item">
                  <Link
                    href={buildLinkRoute(link.targetItemType, link.targetId)}
                    className="link-item-link"
                  >
                    <span
                      className={`link-type-icon link-type-${link.targetItemType}`}
                    >
                      {getTargetTypeIcon(link.targetItemType)}
                    </span>
                    <span className="link-target-id">
                      {link.targetId.slice(0, 8)}...
                    </span>
                  </Link>
                  {editable && (
                    <button
                      className="link-delete-btn"
                      onClick={() => {
                        onDeleteLink(link)
                      }}
                      disabled={isDeleting}
                      title="Remove link"
                    >
                      {isDeleting ? '...' : 'x'}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
