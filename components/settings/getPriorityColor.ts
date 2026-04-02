import { colors as colorTokens } from '@/styles/colors'

const DEFAULT_PRIORITY_COLORS: Record<string, string> = {
  '1': colorTokens.priority1,
  '2': colorTokens.priority2,
  '3': colorTokens.priority3,
  '4': colorTokens.priority4,
  '5': colorTokens.priority5,
}

export function getPriorityColor(
  colors: Record<string, string>,
  level: number
): string {
  return (
    colors[String(level)] ||
    DEFAULT_PRIORITY_COLORS[String(level)] ||
    colorTokens.fallback
  )
}
