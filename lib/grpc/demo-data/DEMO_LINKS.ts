'use client'

import { type Link } from '@/gen/centy_pb'

// Demo links (relationships between entities)
export const DEMO_LINKS: Link[] = [
  {
    $typeName: 'centy.v1.Link',
    targetId: 'demo-issue-4',
    targetItemType: 'issue',
    linkType: 'blocks',
    createdAt: '2024-12-15T16:00:00Z',
  },
]
