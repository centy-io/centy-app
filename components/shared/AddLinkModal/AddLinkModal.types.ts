import type { Link as LinkType } from '@/gen/centy_pb'

export interface AddLinkModalProps {
  entityId: string
  entityType: 'issue' | 'doc'
  existingLinks: LinkType[]
  onClose: () => void
  onLinkCreated: () => void
}

export interface EntityItem {
  id: string
  displayNumber?: number
  title: string
  type: 'issue' | 'doc'
}
