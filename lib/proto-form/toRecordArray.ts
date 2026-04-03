function isRecordObject(item: unknown): item is Record<string, unknown> {
  return (
    item !== null &&
    item !== undefined &&
    typeof item === 'object' &&
    !Array.isArray(item)
  )
}

export function toRecordArray(v: unknown): Record<string, unknown>[] {
  if (!Array.isArray(v)) return []
  const items: unknown[] = v
  return items.filter(isRecordObject)
}
