export function toRecordArray(v: unknown): Record<string, unknown>[] {
  if (Array.isArray(v)) {
    return v.filter(
      item =>
        item !== null &&
        item !== undefined &&
        typeof item === 'object' &&
        !Array.isArray(item)
    )
  }
  return []
}
