/**
 * Converts a proto field name to a human-readable label.
 * e.g. 'priority_levels' → 'Priority Levels'
 * e.g. 'defaultEditor' → 'Default Editor'
 */
export function protoNameToLabel(name: string): string {
  return name
    .replace(/_([a-z])/g, (_, c: string) => ' ' + c.toUpperCase())
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
    .replace(/\s+/g, ' ')
}
