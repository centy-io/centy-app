export function toStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((item): item is string => typeof item === 'string')
    : []
}
