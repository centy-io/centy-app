import type { Link as LinkType } from '@/gen/centy_pb'

export interface AddLinkModalProps {
  entityId: string
  entityType: string
  existingLinks: LinkType[]
  onClose: () => void
  onLinkCreated: () => void
  editingLink?: LinkType
  editingLinkTitle?: string
  onLinkUpdated?: () => void
}
