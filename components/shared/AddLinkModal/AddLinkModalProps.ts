import type { Link as LinkType } from '@/gen/centy_pb'

export interface AddLinkModalProps {
  entityId: string
  entityType: 'issue' | 'doc'
  existingLinks: LinkType[]
  onClose: () => void
  onLinkCreated: () => void
  editingLink?: LinkType
  editingLinkTitle?: string
  onLinkUpdated?: () => void
}
