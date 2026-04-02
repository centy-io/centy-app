const DEFAULT_PRIORITY_COLORS: Record<string, string> = {
  '1': 'var(--color-priority-1)',
  '2': 'var(--color-priority-2)',
  '3': 'var(--color-priority-3)',
  '4': 'var(--color-priority-4)',
  '5': 'var(--color-priority-5)',
}

export function getPriorityColor(
  colors: Record<string, string>,
  level: number
): string {
  return (
    colors[String(level)] ||
    DEFAULT_PRIORITY_COLORS[String(level)] ||
    'var(--color-fallback)'
  )
}
