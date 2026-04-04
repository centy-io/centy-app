import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const icons = new Map<string, LucideIcon>()
// Add singular or plural icon names from lucide-react as item types are introduced.
// e.g. ['issue', CircleAlert] or ['issues', CircleAlert]

export function getTargetTypeIcon(targetItemType: string): ReactNode {
  const Icon = icons.get(targetItemType) ?? icons.get(`${targetItemType}s`)
  if (Icon) return <Icon size={14} />
  return targetItemType
}
