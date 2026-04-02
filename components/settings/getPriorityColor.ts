const DEFAULT_PRIORITY_COLORS: Record<string, string> = {
  '1': '#ef4444',
  '2': '#f59e0b',
  '3': '#10b981',
  '4': '#3b82f6',
  '5': '#8b5cf6',
}

export function getPriorityColor(
  colors: Record<string, string>,
  level: number
): string {
  return (
    colors[String(level)] || DEFAULT_PRIORITY_COLORS[String(level)] || '#888888'
  )
}
