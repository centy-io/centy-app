export interface LinkSectionProps {
  entityId: string
  entityType: 'issue' | 'doc'
  /** Whether the user can add/remove links (edit mode) */
  editable?: boolean
}
