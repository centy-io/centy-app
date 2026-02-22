// eslint-disable-next-line ddd/require-spec-file
export function toStringRecord(v: unknown): Record<string, string> {
  if (
    v !== null &&
    v !== undefined &&
    typeof v === 'object' &&
    !Array.isArray(v)
  ) {
    const result: Record<string, string> = {}
    for (const [k, val] of Object.entries(v)) {
      if (typeof val === 'string') {
        // eslint-disable-next-line security/detect-object-injection
        result[k] = val
      }
    }
    return result
  }
  return {}
}
